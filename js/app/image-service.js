define([
    'imagesloaded.pkgd',
    'enquire'
], function(imagesloaded, enquire) {
    var galleries = [],
        basePaths = [
            'assets/images-640/',
            'assets/images/'
        ],
        basePath = basePaths[0];

    var getGalleryData = function getGalleryData(galleryId) {
        if (!galleries[galleryId]) {
            galleries[galleryId] = JSON.parse($('#gallery-data-' + galleryId).text());
        }

        return galleries[galleryId];
    };

    var requestImage = function getImagePath(galleryId, imgIdx, callback) {
        // TODO try reusing a single image object for each new image file
        var imgNode = document.createElement('img'),
            path = basePath + getGalleryData(galleryId)[imgIdx].path,
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

    var getPrevIndex = function getPrevIndex(galleryId, index) {
        var length = getGalleryData(galleryId).length;

        return (length + index - 1) % length;
    }

    var setupMediaQueries = function setupMediaQueries() {
        enquire.register('screen and (max-width: 767px)', function() {
            basePath = basePaths[0];
        });
        enquire.register('screen and (min-width: 768px)', function() {
            basePath = basePaths[1];
        });
    }

    setupMediaQueries();

    return {
        requestImage: requestImage,
        getNextIndex: getNextIndex,
        getPrevIndex: getPrevIndex
    };
});
