/** @jsx React.DOM */
define([
    'jquery',
    'react',
    'app/player',
    'app/util'
], function($, React, player, util) {
    var stringPad = '\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0',
        winLen = 12,
        trackPlayerNodes = [];

    var padString = function padString(str) {
        var pad = stringPad.substring(0, Math.max(0, winLen - str.length));

        return str + pad;
    };

    var secondsToMinSec = function secondsToMinSec(totalSecs) {
        var minutes = "" + Math.floor(totalSecs / 60);
        var seconds = "" + (totalSecs % 60);

        if (seconds.length < 2)
            seconds = "0" + seconds;
        if (minutes.length < 2)
            minutes = "0" + minutes;

        return minutes + ":" + seconds;
    };

    var Player = React.createClass({
        getInitialState: function() {
            return { title: '', position: 0, playAction: 'noaction' };
        },
        handlePlayerStateChange: function(data) {
            var newState = {};

            if (data.playState && 'playing' == data.playState) {
                newState.playAction = 'pause';
            }
            if (data.playState && 'paused' == data.playState) {
                newState.playAction = 'play';
            }
            if (data.playState && 'stopped' == data.playState) {
                newState.playAction = 'noaction';
                newState.title = '';
            }
            if (data.title) {
                newState.title = data.title;
            }
            if (data.position) {
                newState.position = data.position;
            }

            this.setState(newState);
        },
        handleClick: function() {
            if ('pause' == this.state.playAction) {
                player.pause();
            }
            if ('play' == this.state.playAction) {
                player.play();
            }

            return false;
        },
        componentWillMount: function() {
            player.addListener(this.handlePlayerStateChange);
        },
        render: function() {
            /* TODO Pad the title to no shorter that winLen */
            var title = padString(this.state.title.substring(0, 8)),
                titleLen = title.length,
                phase = this.state.position % (titleLen + winLen - 1),
                titleBack = title.substring(phase, phase + winLen),
                titleFront = title.substring(
                    0, Math.max(0, phase - titleLen + 1)),
                padLen = Math.max(0, Math.min(
                    phase - titleLen + winLen, titleLen + winLen - phase - 1)),
                winText = titleBack +
                          stringPad.substring(0, padLen) +
                          titleFront;

            var time = "";
            if ('pause' == this.state.playAction || 'play' == this.state.playAction) {
                time = secondsToMinSec(this.state.position);
            }

            return (
                <div className="main-player-body">
                    <a className={ this.state.playAction } onClick={ this.handleClick }></a>
                    <span className="main-player-title">{ this.state.title }</span>
                    <div className="main-player-time">{ time }</div>
                </div>
            );
        }
    });

    var TrackPlayer = React.createClass({
        getInitialState: function() {
            return {
                active: false,
                state: 'stopped'
            }
        },
        componentWillMount: function() {
            player.addListener(this.handlePlayerStateChange);
        },
        componentWillUnmount: function() {
            console.log('player gone!');
            player.removeListener(this.handlePlayerStateChange);
        },
        handlePlayerStateChange: function(data) {
            var newState = {};

            if (data.permalinkUrl) {
                if (util.urlPath(data.permalinkUrl) == util.urlPath(this.props.href)) {
                    newState.active = true;
                } else {
                    newState.active = false;
                    newState.state = 'stopped';
                }
                this.setState(newState);
            }

            if (!this.state.active)
                return;

            if (data.playState) {
                newState.state = data.playState;
                this.setState(newState);
            }
        },
        handleClick: function() {
            if ('stopped' == this.state.state) {
                player.playTrack(this.props.href);
            }
            if ('playing' == this.state.state) {
                player.pause();
            }
            if ('paused' == this.state.state) {
                player.play();
            }

            return false;
        },
        render: function() {
            var className = 'sc-track';

            if ('playing' == this.state.state) {
                className += ' pause';
            }
            return (
                <a className={ className } href={ this.props.href } onClick={ this.handleClick }>
                    {this.props.title}
                </a>
            );
        }
    });

    var renderTrack = function renderTrack(node, props) {
        React.renderComponent(<TrackPlayer href={props.href} title={props.title} />, node);
        trackPlayerNodes.push(node);
    }

    var unmountAllTracks = function unmountAllTracks() {
        var i, l, node;

        for (i = 0, l = trackPlayerNodes.length; i < l; i++) {
            node = trackPlayerNodes[i];
            React.unmountComponentAtNode(node);
        }
        trackPlayerNodes.splice(i, l);
    };

    var updateTrackViews = function updateTrackViews() {
        player.broadcastState();
    };

    var init = function init() {
        $('.player').each(function() {
            React.renderComponent(<Player />, this);
        });
    };

    return {
        init: init,
        renderTrack: renderTrack,
        updateTrackViews: updateTrackViews,
        unmountAllTracks: unmountAllTracks
    };
});
