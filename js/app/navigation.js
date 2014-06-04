define([
    'jquery',
    'jquery.pjax'
], function($, pjax) {
    var tray, incoming;

    var initDom = function initDom() {
        tray = $('#tray');
        incoming = $('<div class="incoming"></div>');
        incoming.append($('.content').clone());
        tray.append(incoming);
    };

    var init = function init() {
        initDom();

        $('.incoming').on('pjax:end', function(event) {
            var incoming = $(this),
                newPage = incoming.find('.content').clone(),
                prevRight = $('.content.right');

            newPage.addClass('right');
            prevRight.remove();
            tray.append(newPage);
            tray.on('transitionend', function() {
                tray.children('.content').not('.left, .right').remove();
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
                    fragment: '#tray'
                });
            });
        }
    };

    return {
        init: init
    };
});
