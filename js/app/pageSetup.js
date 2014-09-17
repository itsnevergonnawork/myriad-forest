define([
    'app/gallery',
    'app/player-view',
    'app/youtube'
], function(gallery, playerView, youtube) {
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
        youtube.initAllPlayers();
    };

    var tearPageDown = function tearPageDown() {
        tearTracksDown();
    };

    return {
        setupPage: setupPage,
        tearPageDown: tearPageDown
    };
});
