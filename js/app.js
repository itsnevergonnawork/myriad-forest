requirejs.config({
    baseUrl: 'js/lib',
    paths: {
        app: '../app',
        soundcloud: 'http://connect.soundcloud.com/sdk'
    }
});

requirejs(['app/main']);
