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
                oldPage = tray.children('.content');

            var completeTrans = function() {
                tray.removeClass('anim');
                // set the tray position using left/right and cancel the transform
                tray.addClass('flip').removeClass('slide');

                oldPage.remove();

                // contract tray, new page stays in view
                tray.removeClass('expanded');

                // revealing the new page done
                newPage.removeClass('new');
            };

            newPage.addClass('new');
            //prevRight.remove();
            tray.addClass('expanded');
            tray.append(newPage);

            tray.on('transitionend', completeTrans);
            tray.addClass('anim');
            tray.addClass('slide');
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
