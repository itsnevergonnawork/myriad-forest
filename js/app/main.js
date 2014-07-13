define([
    'domReady',
    'app/navigation',
    'app/gallery'
], function(domReady, navigation) {
    domReady(function() {
        navigation.init();
    });
});
