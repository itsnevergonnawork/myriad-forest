define([
    'app/gallery',
    'app/player-view'
], function(gallery, playerView) {
    var setupTracks = function setupTracks() {
        $('#tray .track-player').each(function() {
            var link = $(this).find('a');

            playerView.renderTrack(this, {
                href: link.attr('href'),
                title: link.text()
            });
        });
    };

    var setupPage = function setupPage() {
        setupTracks();
        gallery.init();
    };

    return {
        setupPage: setupPage
    };
});
