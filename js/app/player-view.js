/** @jsx React.DOM */
define([
    'jquery',
    'react',
    'app/player'
], function($, React, player) {
    var Player = React.createClass({displayName: 'Player',
        getInitialState: function() {
            return { title: 'dummy' };
        },
        render: function() {
            return (
                React.DOM.span(null,  this.state.title )
            );
        }
    });

    var init = function init() {
        $('.player').each(function() {
            React.renderComponent(Player(null ), this);
        });
    };

    return {
        init: init
    };
});
