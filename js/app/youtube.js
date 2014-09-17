define(function() {
    var initPlayer = function initPlayer(element) {
        require(
            ['async!//www.youtube.com/iframe_api!undefined:onYouTubeIframeAPIReady'],
            function() {
                var player = new YT.Player(
                    element.get(0),
                    {
                        height: '360',
                        width: '640',
                        videoId: element.data('youtubeId'),
                        events: {
                            'onReady': function(event) {
                                event.target.playVideo();
                            }
                        }
                    }
                );
            }
        );
    };

    var initAllPlayers = function initAllPlayers() {
        $('.youtube-vid').click(function() {
            initPlayer($(this));
        });
    };

    return {
        initAllPlayers: initAllPlayers
    };
});
