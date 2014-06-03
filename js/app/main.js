define([
    'domReady',
    'app/navigation'
], function(domReady, navigation) {
    domReady(function() {
        navigation.init();
    });
});
