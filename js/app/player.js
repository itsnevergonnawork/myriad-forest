define([
    'soundcloud'
], function() {
    var listeners = [],
        stream,
        state = {
            title: '',
            permalinkUrl: '',
            playState: 'stopped',
            position: 0
        };

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

        state.title = track.title;
        state.permalinkUrl = track.permalink_url;
        state.position = 0;
        // TODO could we always broadcast the (in)complete state?
        notifyListeners({
            title: state.title,
            permalinkUrl: state.permalinkUrl,
            position: state.position
        });

        SC.stream("/tracks/" + track.id, function(sound) {
            if (stream) {
                stream.destruct();
            }

            stream = sound;

            sound.play({
                onplay: function() {
                    state.playState = 'playing';
                    // TODO could we always broadcast the (in)complete state?
                    notifyListeners({ playState: state.playState });
                },
                onpause: function() {
                    state.playState = 'paused';
                    notifyListeners({ playState: state.playState });
                },
                onstop: function() {
                    state.title = '';
                    state.permalinkUrl = '';
                    state.playState = 'stopped';
                    state.position = 0;
                    notifyListeners({
                        playState: state.playState,
                        position: state.position
                    });
                },
                onfinish: function() {
                    state.title = '';
                    state.permalinkUrl = '';
                    state.playState = 'stopped';
                    state.position = 0;
                    notifyListeners({
                        playState: state.playState,
                        position: state.position
                    });
                },
                whileplaying: function() {
                    var pos = this.position;

                    if (pos > millis + 1000) {
                        millis = pos - pos % 1000;
                    }
                    state.position = millis / 1000;
                    notifyListeners({ position: state.position });
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

    var removeListener = function removeListener(callback) {
        var i, l;

        for (i = 0, l = listeners.length; i < l; i++) {
            if (listeners[i] == callback) {
                listeners.splice(i, 1);
                console.log('removed player event listener');
            }
        }
        console.log(listeners.length + ' listeners left');
    };

    var notifyListeners = function notifyListeners(data) {
        var i, l;

        for (i = 0, l = listeners.length; i < l; i++) {
            listeners[i](data);
        }
    };

    var broadcastState = function broadcastState() {
        notifyListeners(state);
    };

    SC.initialize({
        client_id: '246540dc6bc2ef862045657eadd46d76'
    });

    return {
        addListener: addListener,
        removeListener: removeListener,
        broadcastState: broadcastState,
        playTrack: playTrack,
        pause: pause,
        play: play
    };
});
