define([
    'jquery',
    'jquery.velocity'
], function($) {
    var init = function init() {
        var content = $('#tray > .content');
        var gallery = content.find('.gallery');
        var galLeft = gallery.offset().left;
        var galHalfWidth = gallery.width() / 2;
        var side;
        var img = gallery.find('img');
        var photos = gallery.find('a');
        var count = photos.length;
        var idx = 0;
        var prevArrow = gallery.find('.prev-image-arrow');
        var nextArrow = gallery.find('.next-image-arrow');

        var onResize = function onResize() {
            galHalfWidth = gallery.width() / 2;
        };

        if (!img.length)
            return;

        content.css('background-image', "url('" + img.attr('src') + "')");

        gallery.click(function(event) {
            var imgSrc;

            if (side) {
                idx++;
            } else {
                idx = idx + count - 1;
            }
            idx = idx % count;
            imgSrc = photos.eq(idx).attr('href');
            img.attr('src', imgSrc);
            content.css('background-image', "url('" + imgSrc + "')");
        });

        gallery.mousemove(function(event) {
            var left = event.pageX - galLeft;

            if (left < galHalfWidth && (undefined == side || 1 == side)) {
                side = 0;
                nextArrow
                    .velocity('stop')
                    .velocity({ opacity: 0 }, { display: 'none' });
                prevArrow
                    .velocity('stop')
                    .velocity({ opacity: 1 }, { duration: 50, display: 'block' });
            }
            if (left >= galHalfWidth && (undefined == side || 0 == side)) {
                side = 1;
                prevArrow
                    .velocity('stop')
                    .velocity({ opacity: 0 }, { display: 'none' });
                nextArrow
                    .velocity('stop')
                    .velocity({ opacity: 1 }, { duration: 50, display: 'block' });
            }
        });

        $(window).off('resize', onResize);
        $(window).on('resize', onResize);
    };

    return {
        init: function() {
            if ($('.gallery').length) {
                init();
            }
        }
    };
});
