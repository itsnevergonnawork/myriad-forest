define([
    'domReady',
    'app/navigation',
    'app/pageSetup',
    'app/player',
    'app/player-view'
], function(domReady, navigation, pageSetup, player, playerView) {
    domReady(function() {
        navigation.init();
        pageSetup.setupPage();
        playerView.init();
    });
});
