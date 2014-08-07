define([
    'domReady',
    'jquery'
], function(domReady, $) {
    domReady(function() {
        var menu = $('#menu'),
            menuBtn = $('#show-menu'),
            menuCloseBtn = $('#hide-menu');

        menuBtn.click(function() {
            menu.addClass('expanded');
        });

        menuCloseBtn.click(function() {
            menu.removeClass('expanded');
        });
    });
});
