var Banner = Banner || {};
Banner.overlay = {
  init: function(){
    if(Banner.overlay.video.apiReady){
      Banner.overlay.video.init();
      console.log("Start the party");
    } else {
      setTimeout(Banner.overlay.init, 500);
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
      player = new YT.Player(Banner.overlay.video.element, {
        width: '970',
        height: '250',
        videoId: Banner.overlay.video.id,
        events: {
          'onReady': Banner.overlay.video.onPlayerReady,
          'onStateChange': Banner.overlay.video.onPlayerStateChange
        }
      });
    },
    onPlayerReady: function(e){
      e.target.playVideo();
      var video = Banner.overlay.video;
      video.duration = (typeof e.target.getDuration === "function") ? e.target.getDuration() : player.B.duration;
      video.currentTime = (typeof e.target.getCurrentTime === "function") ? e.target.getCurrentTime() : player.B.currentTime;
    },
    onPlayerStateChange: function(e){
      var video = Banner.overlay.video;
      if (e.data == YT.PlayerState.PLAYING && !video.percent100) {
        Banner.overlay.video.checkVideoInterval = setInterval(Banner.overlay.video.checkVideoPercent, 1000);
        EB.userActionCounter("Video_Play");
        console.log("Video_Play");
      } else if (e.data == YT.PlayerState.PAUSED) {
        EB.userActionCounter("Video_Paused");
        console.log("Video_Paused");
        clearInterval(Banner.overlay.video.checkVideoInterval);
      } else if (e.data == YT.PlayerState.BUFFERING) {
        EB.userActionCounter("Video_Buffering");
        console.log("Video_Buffering");
      } else if (e.data == YT.PlayerState.ENDED){
        EB.userActionCounter("Video_Stopped");
        console.log("Video_Stopped");
        clearInterval(Banner.overlay.video.checkVideoInterval);
      }
    },
    stopVideo: function(){
      player.stopVideo();
    },
    checkVideoPercent: function(target){
      var video = Banner.overlay.video;
      var a = video.duration;
      var b = (typeof player.getCurrentTime === "function") ? player.getCurrentTime() : player.B.currentTime;
      var c = ((a - b) / a)*100;
      console.log("Current Time: "+b +", Duration: "+a);
      if(c<=76 && !video.percent25){
        console.log("25% Playback");
        EB.userActionCounter("25%_Playback");
        video.percent25 = true;
      } else if(c<=51 && !video.percent50){
        console.log("50% Playback");
        EB.userActionCounter("50%_Playback");
        video.percent50 = true;
      } else if(c<=26 && !video.percent75){
        console.log("75% Playback");
        EB.userActionCounter("75%_Playback");
        video.percent75 = true;
      } else if (c==0 && !video.percent100){
        console.log("100% Playback");
        EB.userActionCounter("100%_Playback");
        video.percent100 = true;
        clearInterval(Banner.overlay.video.checkVideoInterval);
      }
    }
  }
}