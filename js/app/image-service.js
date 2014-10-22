define([], function(React) {
    var galleries = [];

    var getGalleryData = function getGalleryData(galleryId) {
        if (!galleries[galleryId]) {
            galleries[galleryId] = JSON.parse($('#gallery-data-' + galleryId).text());
        }

        return galleries[galleryId];
    };

    var getImagePath = function getImagePath(galleryId, imgIdx) {
        return getGalleryData(galleryId)[imgIdx].path;
    };

    return {
        getImagePath: getImagePath
    };
});
