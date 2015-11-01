var Banner = Banner || {};
Banner = {

  init: function(){
    var _this = this;
    if(!EB.isInitialized()) {
      EB.addEventListener(EBG.EventName.EB_INITIALIZED, _this.politeInit);
    } else {
      _this.politeInit();
    }
  },

  politeInit: function() {
    // lazyload script
    // ref: http://www.nczonline.net/blog/2009/07/28/the-best-way-to-load-external-javascript/
    function loadScript(url, callback){
        var script = document.createElement("script");
        script.type = "text/javascript";
        if (script.readyState){  //IE
            script.onreadystatechange = function(){
                if (script.readyState == "loaded" || script.readyState == "complete"){
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else {  //Others
            script.onload = function(){
                callback();
            };
        }
        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    }

    function politeLoad(urls, onComplete) {
      var l = urls.length,
        loaded = 0,
        checkProgress = function() {
          if (++loaded === l && onComplete) {
            onComplete();
          }
        }, i;
      for (i = 0; i < l; i++) {
          //Using the lazy loadScript to load the javascript
          loadScript(urls[i], checkProgress);
      }
    }

    var _this = this;
    politeLoad(['https://www.youtube.com/iframe_api'],
      function() {
        _this.video.apiReady = true;
        _this.video.init();
      });
  },

  video: {
    apiReady: false,
    id: 'MmJ_eIWVuM0',
    element: 'yt-video',
    done: false,
    percent25: false,
    percent50: false,
    percent75: false,
    percent100: false,
    duration: 0,
    currentTime: 0,
    player: null,

    init: function(){
      if(typeof YT.Player === 'function'){
        this.player = new YT.Player(this.element, {
          width: '970',
          height: '250',
          videoId: this.id,
          events: {
            'onReady': this.onPlayerReady.bind(this),
            'onStateChange': this.onPlayerStateChange.bind(this)
          }
        });
        console.log("YouTube Video Initialised");
        //getIframe seems to help with the issue of missing functions
        this.player.getIframe();
      }

    },


    onPlayerReady: function(e){
      e.target.playVideo();
      this.duration = (typeof e.target.getDuration === "function") ? e.target.getDuration() : this.player.B.duration;
      this.currentTime = (typeof e.target.getCurrentTime === "function") ? e.target.getCurrentTime() : this.player.B.currentTime;
      this.currentVideoId = (typeof e.target.getVideoUrl === "function") ? e.target.getVideoUrl().slice(-11) : this.player.h.h.videoId;
      console.log("VIDEO_onPlayerReady");
    },


    onPlayerStateChange: function(e){
      //Update these if the video has been changed.
      this.duration = (typeof e.target.getDuration === "function") ? e.target.getDuration() : this.player.B.duration;
      this.currentVideoId = (typeof e.target.getVideoUrl === "function") ? e.target.getVideoUrl().slice(-11) : this.player.h.h.videoId;

      if (e.data === YT.PlayerState.PLAYING && !this.percent100) {

        this.checkVideoInterval = setInterval(this.checkVideoPercent.bind(this), 1000);
        EB.userActionCounter("Video_Play");
        console.log("Video_Play");

      } else if (e.data === YT.PlayerState.PLAYING && this.percent100){

        this.percent25 = this.percent50 = this.percent75 = this.percent100 = false;
        this.checkVideoInterval = setInterval(this.checkVideoPercent.bind(this), 1000);
        EB.userActionCounter("Video_Restart");
        console.log("Video_Restart");

      } else if (e.data === YT.PlayerState.PAUSED) {

        EB.userActionCounter("Video_Paused");
        console.log("Video_Paused");
        clearInterval(this.checkVideoInterval);

      } else if (e.data === YT.PlayerState.BUFFERING) {

        EB.automaticEventCounter("Video_Buffering");
        console.log("Video_Buffering");

      } else if (e.data === YT.PlayerState.ENDED){

        EB.automaticEventCounter("Video_Stopped");
        EB.automaticEventCounter("100%_Playback");
        console.log("Video_Stopped");
        console.log("100%_Playback");
        this.percent100 = true;
        clearInterval(this.checkVideoInterval);

      }
    },

    stopVideo: function(){
      this.player.stopVideo();
      clearInterval(this.checkVideoInterval);
    },

    checkVideoPercent: function(target){
      var a = this.duration;
      var b = (typeof this.player.getCurrentTime === "function") ? this.player.getCurrentTime() : this.player.B.currentTime;
      var c = ((a - b) / a)*100;

      console.log("Current Time: "+b +", Duration: "+a);

      if(c<=76 && !this.percent25){

        console.log("25% Playback");
        EB.automaticEventCounter("25%_Playback");
        this.percent25 = true;

      } else if(c<=51 && !this.percent50){

        console.log("50% Playback");
        EB.automaticEventCounter("50%_Playback");
        this.percent50 = true;

      } else if(c<=26 && !this.percent75){

        console.log("75% Playback");
        EB.automaticEventCounter("75%_Playback");
        this.percent75 = true;

      } else if (c===0 && !this.percent100){

        console.log("100% Playback");
        EB.automaticEventCounter("100%_Playback");
        this.percent100 = true;
        clearInterval(this.checkVideoInterval);

      }
    }
  }
};