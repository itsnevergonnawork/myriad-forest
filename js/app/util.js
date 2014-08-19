define(function() {
    var a = document.createElement('a');

    var urlPath = function urlPath(url) {
        a.href = url;
        return a.pathname;
    };

    return {
        urlPath: urlPath
    };
});
