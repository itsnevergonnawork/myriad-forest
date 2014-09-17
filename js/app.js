requirejs.config({
    baseUrl: 'js/lib',
    paths: {
        async: 'require/async',
        app: '../app',
        soundcloud: 'http://connect.soundcloud.com/sdk'
    }
});

requirejs(['app/main']);
