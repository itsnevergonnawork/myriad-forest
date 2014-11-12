requirejs.config({
    baseUrl: 'js/lib',
    paths: {
        async: 'require/async',
        app: '../app',
        soundcloud: 'http://connect.soundcloud.com/sdk'
    },
    shim: {
        'velocity': {
            deps: ['jquery']
        }
    }
});

requirejs(['app/main']);
