/** @jsx React.DOM */
define([
    'jquery',
    'react',
    'app/player'
], function($, React, player) {
    var stringPad = '\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0',
        winLen = 12;

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
            return { title: 'dummy', position: 0, playAction: '' };
        },
        handlePlayerStateChange: function(data) {
            if (data.playState && 'playing' == data.playState) {
                data.playAction = 'pause';
            }
            if (data.playState && 'paused' == data.playState) {
                data.playAction = 'play';
            }
            if (data.playState && 'stopped' == data.playState) {
                data.playAction = '';
            }
            delete data.playState;
            this.setState(data);
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

            return (
                <span>
                    <a className={ this.state.playAction } onClick={ this.handleClick }></a>
                    { winText }, { secondsToMinSec(this.state.position) }
                </span>
            );
        }
    });

    var init = function init() {
        $('.player').each(function() {
            React.renderComponent(<Player />, this);
        });
    };

    return {
        init: init
    };
});
