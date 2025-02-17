"use strict";

// To use this include it with
// <script src="audio.js"></script>
//
// Then give it a list of sounds like this
//
//     var audioMgr = new AudioManager({
//       fire:      { filename: "assets/fire.ogg",      samples: 8, },
//       explosion: { filename: "assets/explosion.ogg", samples: 6, },
//       hitshield: { filename: "assets/hitshield.ogg", samples: 6, },
//       launch:    { filename: "assets/launch.ogg",    samples: 2, },
//       gameover:  { filename: "assets/gameover.ogg",  samples: 1, },
//       play:      { filename: "assets/play.ogg",      samples: 1, },
//     });
//
// After that you can play sounds with
//
//      audioMgr.playSound('explosion');
//      audioMgr.playSound('fire');
//
// `samples` is how may of that sound you want to be able to play at
// the same time. THIS IS NOT NEEDED for any browser that supports the
// Web Audio API. In other words it's only needed for IE.
//
// Also note Firefox doesn't support MP3s as far as I know so you'll need
// to supply .ogg files for it. Conversely, Safari doesn't support .ogg.
// The library handles loading .mp3 or .ogg files regardless of what you specify
// when you init the library. In other words if you put `filename: "foo.mp3"`
// the library will try to load `foo.mp3` or `foo.ogg` depending on if the
// browser supports one or the other.

(function(global) {
  var webAudioAPI = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;

  // options:
  //   startedOnTouchCallback: on iOS no sounds can be played unless at least one is first initiated during
  //       a use gesture. If a function is attached here it will be called when that user gesture has happened.
  //       This is useful for situtations where sounds 'should' start right from the beginning
  //       even if the player as not touched the screen. In that case we put up a message, "touch the screen"
  //       and remove that message when we get this callback
  //
  //   callback: called when all the sounds have loaded.
  var AudioManager = function(sounds, options) {
    options = options || {};
    var g_context;
    var g_audioMgr;
    var g_soundBank = {};
    var g_canPlay = false;
    var g_canPlayOgg;
    var g_canPlayMp3;
    var g_canPlayWav;
    var g_canPlayAif;
    var g_createFromFileFn;

    var changeExt = function(filename, ext) {
      return filename.substring(0, filename.length - 3) + ext;
    };

    this.needUserGesture = function() {
      return true;
    };

    var WebAudioBuffer = function() {
    };

    WebAudioBuffer.prototype.play = function(opt_when, opt_loop, opt_volume) {
      if (!this.buffer) {
        console.log(this.name, " not loaded");
        return;
      }
      var src = g_context.createBufferSource();
      src.buffer = this.buffer;
      src.loop = opt_loop || false;
      //src.connect(g_context.destination);
	  var gainNode = g_context.createGain();
	  let volume = parseFloat(opt_volume);
	  gainNode.gain.value = opt_volume; // here you set the volume
	  src.connect(gainNode);
	  gainNode.connect(g_context.destination);	  
      
	  if( src.loopStart )
	  {
		src.loopStart = opt_when;
	  }
	  
	  if (src.start) {
        src.start(opt_when);
      } else {
        src.noteOn(opt_when);
      }
      return src;
    };

    function WebAudioSound(name, filename, samples, opt_callback) {
      this.name = name;
      var that = this;
      var req = new XMLHttpRequest();
      req.open("GET", filename, true);
      req.responseType = "arraybuffer";
      req.onload = function() {
        g_context.decodeAudioData(req.response, function onSuccess(decodedBuffer) {
          // Decoding was successful, do something useful with the audio buffer
          that.buffer = decodedBuffer;
          if (opt_callback) {
            opt_callback(false);
          }
        }, function onFailure() {
           console.error("failed to decoding audio buffer: " + filename);
           if (opt_callback) {
             opt_callback(true);
           }
        });
      }
      req.addEventListener("error", function(e) {
        console.error("failed to load:", filename, " : ", e.target.status);
      }, false);
      req.send();
    }

    WebAudioSound.prototype = new WebAudioBuffer();

    function AudioTagSound(name, filename, samples, opt_callback) {
      this.waiting_on_load = samples;
      this.samples = samples || 1;
      this.name = name;
      this.play_idx = 0;
      this.audio = {};
      for (var i = 0; i < samples; i++) {
        var audio = new Audio();
        var that = this;
        var checkCallback = function(err) {
          that.waiting_on_load--;
          if (opt_callback) {
            opt_callback(err);
          }
        };
        audio.addEventListener("canplaythrough", function() {
          checkCallback(false);
        }, false);
        audio.src = filename;
        audio.onerror = function() {
          checkCallback(true);
        };
        audio.load();
        this.audio[i] = audio;
      }
    };

    AudioTagSound.prototype.play = function(opt_when, opt_loop) {
      if (this.waiting_on_load > 0) {
        console.log(this.name, " not loaded");
        return;
      }
      this.play_idx = (this.play_idx + 1) % this.samples;
      var a = this.audio[this.play_idx];
      // console.log(this.name, ":", this.play_idx, ":", a.src);
      var b = new Audio();
      b.src = a.src;
      // TODO: use when
      b.addEventListener("canplaythrough", function() {
        b.play();
        }, false);
      b.load();
    };

    var handleError = function(filename, audio) {
      return function(e) {
        console.error("can't load ", filename);
      }
    };

	this.stopSound = function(name) {
		var sound = g_soundBank[name];

		if (!sound) {
		  console.error("audio: '" + name + "' not known.");
		  return;
		}

		if (!sound.src) return;
		console.log( sound.src );
	    if (!sound.src.stop){
	        sound.src.stop = sound.src.noteOff;
	    }

		try
		{
			sound.src.stop(0);	
		}
		catch( e ) {}

	}

    this.playSound = function(name, opt_when, opt_loop, opt_volume) {
      if (!g_canPlay)
        return;
      var sound = g_soundBank[name];
      if (!sound) {
        console.error("audio: '" + name + "' not known.");
        return;
      }

	  g_soundBank[name].src = sound.play(opt_when, opt_loop, opt_volume);
      return g_soundBank[name].src;
    }.bind(this);

    this.getTime = function() {
      return g_context ? g_context.currentTime : Date.now() * 0.001;
    }.bind(this);

    // on iOS and possibly other devices you can't play any
    // sounds in the browser unless you first play a sound
    // in response to a user gesture. So, make something
    // to respond to a user gesture.
    var setupGesture = function() {
      if (this.needUserGesture()) {
        var elem = window;
        var that = this;
        var eventNames = ['touchstart', 'mousedown'];
        var playSoundToStartAudio = function() {
          g_context.resume().then(() => {
            // just playing any sound does not seem to work.
            var source = g_context.createOscillator();
            var gain = g_context.createGain();
            source.frequency.value = 1;
            source.connect(gain);
            gain.gain.value = 0;
            gain.connect(g_context.destination);
            if (source.start) {
              source.start(0);
            } else {
              source.noteOn(0);
            }
            setTimeout(function() {
              source.disconnect();
            }, 100);
            for (var ii = 0; ii < eventNames.length; ++ii) {
              elem.removeEventListener(eventNames[ii], playSoundToStartAudio, false);
            }
            if (options.startedOnTouchCallback) {
              options.startedOnTouchCallback();
            }
          });
        }
        for (var ii = 0; ii < eventNames.length; ++ii) {
          elem.addEventListener(eventNames[ii], playSoundToStartAudio, false);
        }
      }
    }.bind(this);

    this.loadSound = function(soundName, filename, samples, opt_callback) {
      var ext = filename.substring(filename.length - 3);
      if (ext == 'ogg' && !g_canPlayOgg) {
        filename = changeExt(filename, "mp3");
      } else if (ext == 'mp3' && !g_canPlayMp3) {
        filename = changeExt(filename, "ogg");
      }
      var s = new g_createFromFileFn(soundName, filename, samples );
      g_soundBank[ soundName ] = s;
	  
	  if( opt_callback )
	  {
		opt_callback.call( this, g_soundBank[ soundName ] );
	  }
	  else
	  {
		return s;
	  }
    }.bind(this);

    this.init = function(sounds) {
      var a = new Audio()
      g_canPlayOgg = a.canPlayType("audio/ogg");
      g_canPlayMp3 = a.canPlayType("audio/mp3");
      g_canPlayWav = a.canPlayType("audio/wav");
      g_canPlayAif = a.canPlayType("audio/aif") || a.canPlayType("audio/aiff");
      g_canPlay = g_canPlayOgg || g_canPlayMp3;
      if (!g_canPlay)
        return;

      if (webAudioAPI) {
        g_context = new webAudioAPI();

        if (!g_context.createGain) { g_context.createGain = g_context.createGainNode.bind(g_context); }

        g_createFromFileFn = WebAudioSound;
      } else {
        console.log("Using Audio Tag");
        g_createFromFileFn = AudioTagSound;
      }

      var soundsPending = 1;
      var soundsLoaded = function() {
        --soundsPending;
        if (soundsPending == 0 && options.callback) {
          options.callback();
        }
      };

      if (sounds) {
        Object.keys(sounds).forEach(function(sound) {
          var data = sounds[sound];
          ++soundsPending;
          this.loadSound(sound, data.filename, data.samples, soundsLoaded);
        }.bind(this));
      }

      // so that we generate a callback even if there are no sounds.
      // That way users don't have to restructure their code if they have no sounds or if they
      // disable sounds by passing none in.
      setTimeout(soundsLoaded, 0);

      if (webAudioAPI) {
        setupGesture();
      }
    }.bind(this);
    this.init(sounds);

    this.getSoundIds = function() {
      return Object.keys(g_soundBank);
    };
  };

  AudioManager.hasWebAudio = function() {
    return webAudioAPI !== undefined;
  };

  global.AudioManager = AudioManager;
}(this));
