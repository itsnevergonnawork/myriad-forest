define([
    'jquery',
    'jquery.pjax',
    'app/pageSetup',
    'jquery.velocity'
], function($, pjax, pageSetup) {
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
                oldPage = tray.children('.content'),
                moveRight = false,
                propertyMap = {};

            var completeTrans = function() {
                // set the tray position using left/right and cancel the transform
                tray.css('transform', '').addClass('flip');

                oldPage.remove();

                // contract tray, new page stays in view
                tray.removeClass('expanded left flip');

                // revealing the new page done
                newPage.removeClass('new');

                pageSetup.setupPage();
            };

            if ($(event.relatedTarget).hasClass('prevLink'))
                moveRight = true;

            newPage.addClass('new');
            tray.addClass('expanded' + (moveRight ? ' left' : ''));
            tray.append(newPage);

            if (moveRight) {
                propertyMap.translateX = ['50%', 0];
            } else {
                propertyMap.translateX = ['-50%', 0];
            }
            tray.velocity(propertyMap, {
                duration: 500,
                complete: completeTrans
            });
        });
        if ($.support.pjax) {
            $(document).on('click', 'a', function(event) {
                if (this.host == window.location.host) {
                    $.pjax.click(event, {
                        container: '.incoming',
                        fragment: '#tray'
                    });
                    return false;
                }
            });
        }
    };

    return {
        init: init
    };
});
