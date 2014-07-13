define([
    'domReady',
    'app/navigation',
    'app/pageSetup'
], function(domReady, navigation, pageSetup) {
    domReady(function() {
        navigation.init();
        pageSetup.setupPage();
    });
});
