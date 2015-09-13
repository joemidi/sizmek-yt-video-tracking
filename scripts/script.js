var Banner = Banner || {};
Banner = {
  init: function(){
    if(Banner.video.apiReady){
      Banner.video.init();
      console.log("Banner Initialised");
    } else {
      setTimeout(Banner.init, 500);
    }
  },
  video: {
    id: 'MmJ_eIWVuM0',
    element: 'yt-video',
    done: false,
    percent25: false,
    percent50: false,
    percent75: false,
    percent100: false,
    duration: 0,
    currentTime: 0,
    init: function(){
      player = new YT.Player(Banner.video.element, {
        width: '970',
        height: '250',
        videoId: Banner.video.id,
        events: {
          'onReady': Banner.video.onPlayerReady,
          'onStateChange': Banner.video.onPlayerStateChange
        }
      });
      console.log("YouTube Video Initialised");
      //getIframe seems to help with the issue of missing functions
      player.getIframe();
    },
    onPlayerReady: function(e){
      e.target.playVideo();
      var video = Banner.video;
      video.duration = (typeof e.target.getDuration === "function") ? e.target.getDuration() : player.B.duration;
      video.currentTime = (typeof e.target.getCurrentTime === "function") ? e.target.getCurrentTime() : player.B.currentTime;
      video.currentVideoId = (typeof e.target.getVideoUrl === "function") ? e.target.getVideoUrl().slice(-11) : player.h.h.videoId;
      console.log("VIDEO_onPlayerReady");
    },
    onPlayerStateChange: function(e){
      var video = Banner.video;
      //Update these if the video has been changed.
      video.duration = (typeof e.target.getDuration === "function") ? e.target.getDuration() : player.B.duration;
      video.currentVideoId = (typeof e.target.getVideoUrl === "function") ? e.target.getVideoUrl().slice(-11) : player.h.h.videoId;
      if (e.data === YT.PlayerState.PLAYING && !video.percent100) {
        video.checkVideoInterval = setInterval(video.checkVideoPercent, 1000);
        EB.userActionCounter("Video_Play");
        console.log("Video_Play");
      } else if (e.data === YT.PlayerState.PLAYING && video.percent100){
        video.percent25 = video.percent50 = video.percent75 = video.percent100 = false;
        video.checkVideoInterval = setInterval(video.checkVideoPercent, 1000);
        EB.userActionCounter("Video_Restart");
        console.log("Video_Restart");
      } else if (e.data === YT.PlayerState.PAUSED) {
        EB.userActionCounter("Video_Paused");
        console.log("Video_Paused");
        clearInterval(video.checkVideoInterval);
      } else if (e.data === YT.PlayerState.BUFFERING) {
        EB.automaticEventCounter("Video_Buffering");
        console.log("Video_Buffering");
      } else if (e.data === YT.PlayerState.ENDED){
        EB.automaticEventCounter("Video_Stopped");
        console.log("Video_Stopped");
        EB.automaticEventCounter("100%_Playback");
        console.log("100%_Playback");
        video.percent100 = true;
        clearInterval(video.checkVideoInterval);
      }
    },
    stopVideo: function(){
      player.stopVideo();
      clearInterval(Banner.video.checkVideoInterval);
    },
    checkVideoPercent: function(target){
      var video = Banner.video;
      var a = video.duration;
      var b = (typeof player.getCurrentTime === "function") ? player.getCurrentTime() : player.B.currentTime;
      var c = ((a - b) / a)*100;
      console.log("Current Time: "+b +", Duration: "+a);
      if(c<=76 && !video.percent25){
        console.log("25% Playback");
        EB.automaticEventCounter("25%_Playback");
        video.percent25 = true;
      } else if(c<=51 && !video.percent50){
        console.log("50% Playback");
        EB.automaticEventCounter("50%_Playback");
        video.percent50 = true;
      } else if(c<=26 && !video.percent75){
        console.log("75% Playback");
        EB.automaticEventCounter("75%_Playback");
        video.percent75 = true;
      } else if (c===0 && !video.percent100){
        console.log("100% Playback");
        EB.automaticEventCounter("100%_Playback");
        video.percent100 = true;
        clearInterval(video.checkVideoInterval);
      }
    }
  }
};