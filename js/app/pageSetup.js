define([
    'app/gallery',
    'app/player'
], function(gallery, player) {
    var setupTrackLinks = function setupTrackLinks() {
        $('.sc-track').click(function() {
            player.playTrack($(this).attr('href'));
            return false;
        });
    };

    var setupPage = function setupPage() {
        setupTrackLinks();
        gallery.init();
    };

    return {
        setupPage: setupPage
    };
});
