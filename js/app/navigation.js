define([
    'jquery',
    'jquery.pjax'
], function($, pjax) {
    var tray, incoming;

    var initDom = function initDom() {
        tray = $('#tray');
        incoming = $('.content').clone();
        incoming.attr('class', 'incoming');
        tray.append(incoming);
    };

    var init = function init() {
        initDom();

        $('.incoming').on('pjax:end', function(event) {
            var incoming = $(this),
                newPage = incoming.clone(),
                prevRight = $('.content.right');

            newPage.removeClass('incoming');
            newPage.addClass('content');
            newPage.addClass('right');
            prevRight.remove();
            tray.append(newPage);
            tray.on('transitionend', function() {
                tray.find('.content').not('.left, .right').remove();
                tray.removeClass('anim');
                tray.removeClass('left');
                newPage.removeClass('right');
            })
            tray.addClass('anim');
            tray.addClass('left');
        });
        if ($.support.pjax) {
            $(document).on('click', 'a', function(event) {
                $.pjax.click(event, {
                    container: '.incoming',
                    fragment: '.content'
                });
            });
        }
    };

    return {
        init: init
    };
});
