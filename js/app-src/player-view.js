/** @jsx React.DOM */
define([
    'jquery',
    'react',
    'app/player'
], function($, React, player) {
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
            return (
                <span>
                    <a onClick={ this.handleClick }>
                        { this.state.playAction + ' ' }
                    </a>
                    { this.state.title }, { secondsToMinSec(this.state.position) }
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
