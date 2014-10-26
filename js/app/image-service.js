define([
    'imagesloaded.pkgd'
], function(imagesloaded) {
    var galleries = [];

    var getGalleryData = function getGalleryData(galleryId) {
        if (!galleries[galleryId]) {
            galleries[galleryId] = JSON.parse($('#gallery-data-' + galleryId).text());
        }

        return galleries[galleryId];
    };

    var requestImage = function getImagePath(galleryId, imgIdx, callback) {
        var imgNode = document.createElement('img'),
            path = getGalleryData(galleryId)[imgIdx].path,
            imgLoad;

        imgNode.src = path;
        imgLoad = imagesloaded(imgNode);
        imgLoad.on('done', function() {
            callback(path);
        });
    };

    var getNextIndex = function getNextIndex(galleryId, index) {
        var length = getGalleryData(galleryId).length;

        return (index + 1) % length;
    };

    return {
        requestImage: requestImage,
        getNextIndex: getNextIndex
    };
});
