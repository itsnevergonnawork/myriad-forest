define([
    'jquery',
    'jquery.pjax',
    'app/pageSetup',
    'velocity'
], function($, pjax, pageSetup) {
    var tray, incoming,
        prevLink, nextLink;

    var initDom = function initDom() {
        tray = $('#tray');
        incoming = $('<div class="incoming"></div>');
        prevLink = $('.prevLink');
        nextLink = $('.nextLink');
        incoming.append($('.prev-next-page').clone());
        incoming.append($('.content').clone());
        $('body').append(incoming);
    };

    var updatePrevNextLinks = function updatePrevNextLinks(linkData) {
        var both = prevLink.add(nextLink);

        both.removeAttr('href');
        both.velocity({ opacity: 0 }, {
            duration: 250,
            complete: function() {
                prevLink.text(linkData.prevPage.title);
                nextLink.text(linkData.nextPage.title);
            }
        }).velocity({ opacity: 1 }, {
            duration: 250,
            complete: function() {
                prevLink.attr('href', linkData.prevPage.path);
                nextLink.attr('href', linkData.nextPage.path);
            }
        });
    };

    var init = function init() {
        initDom();

        $('.incoming').on('pjax:end', function(event) {
            var incoming = $(this),
                newPage = incoming.find('.content').clone(),
                oldPage = tray.children('.content'),
                prevNextBefore = tray.children('.prev-next-page'),
                prevNextNow = incoming.find('.prev-next-page'),
                prevNextBeforeObj,
                prevNextNowObj,
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

            pageSetup.tearPageDown();

            try {
                prevNextBeforeObj = JSON.parse(prevNextBefore.text());
                prevNextNowObj = JSON.parse(prevNextNow.text());
                if (prevNextBeforeObj.nextPage.path == prevNextNowObj.prevPage.path) {
                    moveRight = true;
                }
            } catch (e) {
                console.log('prev/next page data parse error');
            }
            prevNextBefore.text(prevNextNow.text());

            /*if ($(event.relatedTarget).hasClass('prevLink'))
                moveRight = true;*/

            newPage.addClass('new');
            tray.addClass('expanded' + (moveRight ? ' left' : ''));
            tray.append(newPage);

            if (prevNextNowObj.prevPage) {
                updatePrevNextLinks(prevNextNowObj);
            }

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
