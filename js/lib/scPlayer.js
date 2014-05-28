define(function() {
    var featureCheck = (function() {
      var animation = (function() {
        var elm = document.createElement("p");
        var animationEnd = {
          "": "animationend",
          "-moz-": "animationend",
          "-khtml-": "animationend",
          "-webkit-": "webkitAnimationEnd",
          "-o-": "animationend",
          "-ms-": "animationend"
        };

        var animation = false,
            animationstring = 'animation',
            keyframeprefix = '',
            domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),
            pfx  = '';

        if (elm.style.animationName !== undefined)
          animation = true;

        if (animation === false) {
          for (var i = 0; i < domPrefixes.length; i++) {
            if (elm.style[domPrefixes[i] + 'AnimationName'] !== undefined) {
              pfx = domPrefixes[i];
              animationstring = pfx + 'Animation';
              keyframeprefix = '-' + pfx.toLowerCase() + '-';
              animation = true;
              break;
            }
          }
        }

        return {
          available: animation,
          propName: animationstring,
          prefix: keyframeprefix,
          animationEnd: animationEnd[keyframeprefix]
        };
      })();

      return {
        animation: animation.available,
        animationPropName: animation.propName,
        animationPrefix: animation.prefix,
        animationEnd: animation.animationEnd
      };
    })();

    var domNodes = {
      trackBar: $("span.progress"),
      trackTimeDisp: $("span.trackTime"),
      playPauseBtn: $("button#playPause")
    };

    var cssAnimate = function() {
      var trackProgAnimStr = "retract-progbar 0.5s forwards";

      (function setUpPostRetractAnimationCleanup() {
        domNodes.trackBar.get(0).addEventListener(
            featureCheck.animationEnd, function(event) {
          if (event.animationName && "retract-progbar" == event.animationName) {
            domNodes.trackBar.css("width", "0");
            domNodes.trackBar.get(0).style[featureCheck.animationPropName] = "";
          }
        }, false);
      })();

      (function setUpKeyframes() {
        var len;
        var progBarFrames = "@" + featureCheck.animationPrefix + "keyframes" +
            " retract-progbar { to { width: 0%; } }";
        if (document.styleSheets && (len = document.styleSheets.length)) {
          document.styleSheets[len - 1].insertRule(progBarFrames, 0);
        }
      })();

      var trackStopped = function() {
        domNodes.trackBar.get(0).style[featureCheck.animationPropName] =
            trackProgAnimStr;
      };

      return {
        trackStopped: trackStopped
      };
    };

    var fallbackAnimate = function() {
      var trackStopped = function() {
        domNodes.trackBar.css("width", "0");
      };

      return {
        trackStopped: trackStopped
      };
    };

    var animate;
    if (featureCheck.animation) {
      animate = cssAnimate();
    } else {
      animate = fallbackAnimate();
    }

    var psylusPlayer = (function() {
      var trackPosition = -1001;

      var trackProgress = function(position, duration) {
        var totalSecs = Math.floor(position / 1000);
        var minutes = "" + Math.floor(totalSecs / 60);
        var seconds = "" + (totalSecs % 60);
        var percentage = 100.0 * position / duration;
        if (seconds.length < 2)
          seconds = "0" + seconds;
        if (minutes.length < 2)
          minutes = "0" + minutes;
        domNodes.trackTimeDisp.text(minutes + ":" + seconds);
        domNodes.trackTimeDisp.css("left", percentage + "%");
        domNodes.trackBar.css("width", percentage + "%");
      };

      var onPlay = function() {
        domNodes.playPauseBtn.text("pause");
      };

      var onPlayProgress = function(position, duration) {
        if (position > trackPosition + 1000) {
          trackProgress(position, duration);
          trackPosition = position - position % 1000;
        }
      };

      var onPause = function() {
        domNodes.playPauseBtn.text("play");
      };

      var onStop = function() {
        trackPosition = -1001;
        domNodes.trackTimeDisp.text("");
        domNodes.trackTimeDisp.css("left", "0");
        animate.trackStopped();
        domNodes.playPauseBtn.text("play");
      };

      /* UI event handling */
      domNodes.playPauseBtn.click(function() {
        soundProxy.onPlayButton();
      });

      return {
        onPlay: onPlay,
        onPlayProgress: onPlayProgress,
        onPause: onPause,
        onStop: onStop
      };
    })();

    var soundProxy = (function() {
      var sound = null;

      var updateSound = function(newSound) {
        sound = newSound;
      };

      var play = function() {
        if (null === sound)
          return;
        sound.play({
          onplay: psylusPlayer.onPlay,
          whileplaying: function() {
            psylusPlayer.onPlayProgress(this.position, this.duration);
          },
          onpause: psylusPlayer.onPause,
          onresume: psylusPlayer.onPlay,
          onstop: psylusPlayer.onStop,
          onfinish: psylusPlayer.onStop,
          onload: function(success) {
            console.log("audio load success: " + success);
          },
          onsuspend: function() {
            console.log("audio download suspended");
          },
          whileloading: function() {
            console.log(this.bytesLoaded + " bytes received");
          }
        });
      };

      var onPlayButton = function() {
        if (null === sound)
          return;
        if (sound.playState || sound.paused) {
          sound.togglePause();
        } else {
          play();
        }
      };

      return {
        updateSound: updateSound,
        play: play,
        onPlayButton: onPlayButton
      };
    })();

    soundManager.setup({
      url: "swf",
      preferFlash: false,
      onready: function() {
        console.log("sm2 is ready to play");
        scStream();
      },
      ontimeout: function(status) {
        console.log("sm2 timeout, success: " + status.success + ", error type: " + status.error.type);
      }
    });

    function scStream() {
      var track_url =
          "https://soundcloud.com/psylus/psylus-into-the-unkown-london";

      SC.initialize({ client_id: "f5f3525fd7239e5789573333803acdc8" });

      SC.get('/resolve', { url: track_url }, function(track) {
        SC.stream("/tracks/" + track.id, function(sound) {
          soundProxy.updateSound(sound);
          soundProxy.play();
        });
      });
    }
});
