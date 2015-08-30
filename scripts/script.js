var Banner = Banner || {};
Banner.overlay = {
  init: function(){
    if(Banner.overlay.video.apiReady==true){
      Banner.overlay.video.init();
      console.log("Start the party");
    } else {
      setTimeout(Banner.overlay.init, 500);
      //console.log("Wait, lets try again in 500ms");
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
      EB.userActionCounter("Video_Play");
      console.log("Video_Play");
      player.getCurrentTime();
      player.getDuration();
    },
    onPlayerStateChange: function(e){
      if (e.data == YT.PlayerState.PLAYING) {
        Banner.overlay.video.checkVideoInterval = setInterval(Banner.overlay.video.checkVideoPercent, 1000);
      }
    },
    stopVideo: function(){
      player.stopVideo();
    },
    checkVideoPercent: function(){
      var a = player.getDuration();
      var b = player.getCurrentTime();
      var c = ((a - b) / a)*100;
      var video = Banner.overlay.video;
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