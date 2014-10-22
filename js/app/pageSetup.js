define([
    'jquery',
    'app/gallery',
    'app/player-view',
    'app/youtube'
], function($, gallery, playerView, youtube) {
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

    var setupGalleries = function setupGalleries() {
        $('.gallery').each(function() {
            gallery.render(this, $(this).data('galleryId'));
        });
    }

    var setupPage = function setupPage() {
        setupTracks();
        setupGalleries();
        youtube.initAllPlayers();
    };

    var tearPageDown = function tearPageDown() {
        tearTracksDown();
        youtube.dropAllPlayers();
    };

    return {
        setupPage: setupPage,
        tearPageDown: tearPageDown
    };
});
