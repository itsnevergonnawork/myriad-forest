define([
    'jquery'
], function($) {
    var init = function init() {
        var content = $('.content');
        var gallery = $('.gallery');
        var img = gallery.find('img');
        var photos = gallery.find('a');
        var count = photos.length;
        var idx = 0;

        if (!img.length)
            return;

        content.css('background-image', "url('" + img.attr('src') + "')");

        gallery.click(function() {
            var imgSrc;

            idx = (idx + 1) % count;
            imgSrc = photos.eq(idx).attr('href');
            img.attr('src', imgSrc);
            content.css('background-image', "url('" + imgSrc + "')");
        });
    };

    return {
        init: init
    };
});
