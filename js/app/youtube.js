define([
    'require'
],
function(require) {
    var ytPlayers = [];

    var initPlayer = function initPlayer(element) {
        /* require the player here to avoid a circular dependency */
        require([
            'app/player',
            'async!//www.youtube.com/iframe_api!undefined:onYouTubeIframeAPIReady'
            ],
            function(player) {
                var ytPlayer = new YT.Player(
                    element.get(0),
                    {
                        height: '360',
                        width: '640',
                        videoId: element.data('youtubeId'),
                        events: {
                            'onReady': function(event) {
                                event.target.playVideo();
                            },
                            'onStateChange': function(event) {
                                if (YT.PlayerState.PLAYING == event.data) {
                                    // pause the main music player
                                    player.pause();
                                }
                            }
                        }
                    }
                );
                ytPlayers.push(ytPlayer);
            }
        );
    };

    var initAllPlayers = function initAllPlayers() {
        $('.youtube-vid').click(function() {
            initPlayer($(this));
        });
    };

    var dropAllPlayers = function dropAllPlayers() {
        ytPlayers.splice(0, ytPlayers.length);
    };

    var pausePlayers = function pausePlayers() {
        var i, l, ytPlayer;

        for (i = 0, l = ytPlayers.length; i < l; i++) {
            ytPlayer = ytPlayers[i];
            if (YT.PlayerState.PLAYING == ytPlayer.getPlayerState()) {
                ytPlayer.pauseVideo();
            }
        }
    };

    return {
        initAllPlayers: initAllPlayers,
        dropAllPlayers: dropAllPlayers,
        pausePlayers: pausePlayers
    };
});
