/** @jsx React.DOM */
define([
    'jquery',
    'react',
    'app/player'
], function($, React, player) {
    var Player = React.createClass({
        getInitialState: function() {
            return { title: 'dummy' };
        },
        render: function() {
            return (
                <span>{ this.state.title }</span>
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
