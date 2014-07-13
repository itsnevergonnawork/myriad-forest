define([
    'app/gallery'
], function(gallery) {
    var setupPage = function setupPage() {
        gallery.init();
    };

    return {
        setupPage: setupPage
    };
});
