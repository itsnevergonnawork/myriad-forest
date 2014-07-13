define([
    'jquery'
], function($) {
    var gallery = $('.gallery');
    var img = gallery.find('img');
    var photos = gallery.find('a');
    var count = photos.length;
    var idx = 0;

    gallery.click(function() {
        var imgSrc;

        idx = (idx + 1) % count;
        imgSrc = photos.eq(idx).attr('href');
        img.attr('src', imgSrc);
    });
});
