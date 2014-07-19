define([
    'soundcloud'
], function() {
    var listeners = [],
        stream;

    var playTrack = function playTrack(src) {
        if (isNaN(parseInt(src, 10))) {
            SC.get('/resolve', { url: src }, function(track) {
                playTrackResource(track);
            });
        } else {
            SC.get("/tracks/" + src, function(track) {
                playTrackResource(track);
            });
        }
    };

    var playTrackResource = function playTrackResource(track) {
        var millis = 0;

        notifyListeners({ title: track.title });

        SC.stream("/tracks/" + track.id, function(sound) {
            stream = sound;

            sound.play({
                onplay: function() {
                    notifyListeners({ playState: 'playing' });
                },
                onpause: function() {
                    notifyListeners({ playState: 'paused' });
                },
                onstop: function() {
                    notifyListeners({ playState: 'stopped' });
                },
                onfinish: function() {
                    notifyListeners({ playState: 'stopped' });
                },
                whileplaying: function() {
                    var pos = this.position;

                    if (pos > millis + 1000) {
                        millis = pos - pos % 1000;
                    }
                    notifyListeners({ position: millis / 1000 });
                }
            });
        });
    };

    var pause = function pause() {
        if (!stream)
            return;

        stream.pause();
    };

    var play = function play() {
        if (!stream)
            return;

        stream.play();
    };

    var addListener = function addListener(callback) {
        listeners.push(callback);
    };

    var notifyListeners = function notifyListeners(data) {
        var i, l;

        for (i = 0, l = listeners.length; i < l; i++) {
            listeners[i](data);
        }
    };

    SC.initialize({
        client_id: '246540dc6bc2ef862045657eadd46d76'
    });

    return {
        addListener: addListener,
        playTrack: playTrack,
        pause: pause,
        play: play
    };
});
