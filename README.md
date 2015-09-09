# sizmek-yt-video-tracking

I was asked if we could get Sizmek tracking metrics from a YouTube Video.

So using the [YouTube iFrame API](https://developers.google.com/youtube/iframe_api_reference) I created a mastehead banner that loads up a YouTube video.

The iFrame API is polite loaded into the banner with the main script to run the banner. This polite loader can be found in the index.html file.

## Metrics ##
I am able to track 25, 50, 75 & 100% playback metrics, as well as play, pause and stop. I'm not quite sure if the restart is tracking correctly.
I was unable to add tracking metrics for mute and unmute because there isn't native events for this.

Play and pause are the only interactions that are tracked with Sizmek's `EB.userActionCounter();` method, all others are tracked using `EB.automaticEventCounter();`

