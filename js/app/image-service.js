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

    var getNextIndex = function getNextIndex(galleryId, index) {
        var length = getGalleryData(galleryId).length;

        return (index + 1) % length;
    };

    return {
        getImagePath: getImagePath,
        getNextIndex: getNextIndex
    };
});
