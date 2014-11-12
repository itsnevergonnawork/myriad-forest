define([
    'require',
    'velocity'
],
function(require) {
    var ytPlayers = [];

    var initPlayer = function initPlayer(element) {
        var vidBox = element.find('.youtube-vid'),
            cover = element.find('.youtube-cover'),
            busyBox = element.find('.youtube-busy');

        busyBox.velocity({ opacity: 0.85 }, {
            duration: 1000,
            easing: 'easeOutCirc',
            display: 'block'
        });

        /* require the player here to avoid a circular dependency */
        require([
            'app/player',
            'async!//www.youtube.com/iframe_api!undefined:onYouTubeIframeAPIReady'
            ],
            function(player) {
                var ytPlayer = new YT.Player(
                    vidBox.get(0),
                    {
                        height: '360',
                        width: '640',
                        videoId: vidBox.data('youtubeId'),
                        events: {
                            'onReady': function(event) {
                                busyBox.velocity('stop');
                                cover.velocity({ opacity: 0 }, {
                                    duration: 1000,
                                    easing: 'easeOutCubic',
                                    display: 'none'
                                });
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
        $('.youtube-box').each(function() {
            var box = $(this);

            box.find('.youtube-cover').click(function() {
                initPlayer(box);
            });
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
