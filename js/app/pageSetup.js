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
        playerView.updateTrackViews();
    };

    var tearTracksDown = function tearTracksDown() {
        playerView.unmountAllTracks();
    };

    var setupPage = function setupPage() {
        setupTracks();
        gallery.init();
    };

    var tearPageDown = function tearPageDown() {
        tearTracksDown();
    };

    return {
        setupPage: setupPage,
        tearPageDown: tearPageDown
    };
});
