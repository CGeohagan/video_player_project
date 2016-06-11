var videoContainer = document.getElementById('video-wrapper');
var video = document.getElementById('video-styles');
var videoControls = document.getElementById('video-controls');
var playpause = document.getElementById('playpause');
var stop = document.getElementById('stop');
var mute = document.getElementById('mute');
var volinc = document.getElementById('volinc');
var voldec = document.getElementById('voldec');
var progress = document.getElementById('progress');
var progressBar = document.getElementById('progress-bar');
var fullscreen = document.getElementById('fs');

//Check if browser supports video
var supportsVideo = !!document.createElement('video').canPlayType;
if (supportsVideo) {
    
}

//** Remember to put inside function and put in if(supportsVideo)
	// Hide the default controls
	video.controls = false;

	// Display the user defined video controls ***Do these need to be hidden?
	videoControls.style.display = 'block';

// Display the user defined video controls
videoControls.setAttribute('data-state', 'visible');

//Use the javascript or css to hide and show the video player button on mouse hover states (only the progress bar should remain)

//1. Implement the play and pause buttons

//Make function to change data state of buttons of dual-functionality buttons
var changeButtonState = function(type) {
   // Play/Pause button
   if (type == 'playpause') {
      if (video.paused || video.ended) {
         playpause.setAttribute('data-state', 'play');
      }
      else {
         playpause.setAttribute('data-state', 'pause');
      }
   }
   // Mute button
   else if (type == 'mute') {
      mute.setAttribute('data-state', video.muted ? 'unmute' : 'mute');
   }
}

//Add event handlers for play/pause/stop/mute buttons
video.addEventListener('play', function() {
   changeButtonState('playpause');
}, false);

video.addEventListener('pause', function() {
   changeButtonState('playpause');
}, false);

stop.addEventListener('click', function(e) {
   video.pause();
   video.currentTime = 0;
   progress.value = 0;
   // Update the play/pause button's 'data-state' which allows the correct button image to be set via CSS
   changeButtonState('playpause');
});

mute.addEventListener('click', function(e) {
   video.muted = !video.muted;
   changeButtonState('mute');
});

//A new click handler needs to be defined for the play/pause button so that it raises the play and pause events
playpause.addEventListener('click', function(e) {
   if (video.paused || video.ended) video.play();
   else video.pause();
});





//2. Add volume button that lets you mute the sound or turn it on
//Mute button
mute.addEventListener('click', function(e) {
   video.muted = !video.muted;
});

//Volume 
volinc.addEventListener('click', function(e) {
   alterVolume('+');
});
voldec.addEventListener('click', function(e) {
   alterVolume('-');
});

var checkVolume = function(dir) {
   if (dir) {
      var currentVolume = Math.floor(video.volume * 10) / 10;
      if (dir === '+') {
         if (currentVolume < 1) video.volume += 0.1;
      }
      else if (dir === '-') {
         if (currentVolume > 0) video.volume -= 0.1;
      }
      // If the volume has been turned off, also set it as muted
      // Note: can only do this with the custom control set as when the 'volumechange' event is raised, there is no way to know if it was via a volume or a mute change
      if (currentVolume <= 0) video.muted = true;
      else video.muted = false;
   }
   changeButtonState('mute');
}
var alterVolume = function(dir) {
   checkVolume(dir);
}

video.addEventListener('volumechange', function() {
   checkVolume();
}, false);


//3. Implement the playback progress control
	//A user should be able to click anywhere on the playback bar to jump to that part of the video
	//As the video plays the playback bar should fill in
	//As the video plays the current time should be displayed and updated e.g. 0:10/11:34

//Setting max to duration - may not work on all browsers
video.addEventListener('loadedmetadata', function() {
   progress.setAttribute('max', video.duration);
});

//Set progress bar value to current time
video.addEventListener('timeupdate', function() {
   progress.value = video.currentTime;
   progressBar.style.width = Math.floor((video.currentTime / video.duration) * 100) + '%';
});

//If setting max to duration did not work, this will set the max
video.addEventListener('timeupdate', function() {
   if (!progress.getAttribute('max')) progress.setAttribute('max', video.duration);
   progress.value = video.currentTime;
   progressBar.style.width = Math.floor((video.currentTime / video.duration) * 100) + '%';
});

//Skip ahead allows user to click on different locations on progress bar to skip to different point
progress.addEventListener('click', function(e) {
   var pos = (e.pageX  - (this.offsetLeft + this.offsetParent.offsetLeft)) / this.offsetWidth;
   video.currentTime = pos * video.duration;
});

//Set up "fake" progress bar
var supportsProgress = (document.createElement('progress').max !== undefined);
if (!supportsProgress) progress.setAttribute('data-state', 'fake');


//4. Implement the fullscreen button
//Detect if browser supports Fullscreen
var fullScreenEnabled = !!(document.fullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled || document.webkitSupportsFullscreen || document.webkitFullscreenEnabled || document.createElement('video').webkitRequestFullScreen);

//Visibility of fullscreen button depends on whether it is supported
if (!fullScreenEnabled) {
   fullscreen.style.display = 'none';
}

//When user clicks fullscreen button
fs.addEventListener('click', function(e) {
   handleFullscreen();
});

//If currently on full screen, exit full screen. Otherwise, bring up full screen.
var handleFullscreen = function() {
   if (isFullScreen()) {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
      else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
      setFullscreenData(false);
   }
   else {
      if (videoContainer.requestFullscreen) videoContainer.requestFullscreen();
      else if (videoContainer.mozRequestFullScreen) videoContainer.mozRequestFullScreen();
      else if (videoContainer.webkitRequestFullScreen) videoContainer.webkitRequestFullScreen();
      else if (videoContainer.msRequestFullscreen) videoContainer.msRequestFullscreen();
      setFullscreenData(true);
   }
}

//Function to check if browser is in full screen
var isFullScreen = function() {
   return !!(document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
}

//Set the value of a data-fullscreen by using data-states (don't quite understand this)
var setFullscreenData = function(state) {
   videoContainer.setAttribute('data-fullscreen', !!state);
}

document.addEventListener('fullscreenchange', function(e) {
   setFullscreenData(!!(document.fullScreen || document.fullscreenElement));
});
document.addEventListener('webkitfullscreenchange', function() {
   setFullscreenData(!!document.webkitIsFullScreen);
});
document.addEventListener('mozfullscreenchange', function() {
   setFullscreenData(!!document.mozFullScreen);
});
document.addEventListener('msfullscreenchange', function() {
   setFullscreenData(!!document.msFullscreenElement);
});





//As the media playback time changes, sentences in the transcript should highlight
	//Use javascript to listen for those changes and apply a highlight to the appropriate sentence
	//You can use the captions.vtt file tos ee the times at which the words are spekn in the video


//For exceeds expectations
//Embed the .vtt file as a closed captioning track and add a button to video controls to toggle captions on and off
//A creative and thoughtful responsive design
//Playback speed control or other helpful controls
//Volume control so viewer can adjust the volume level, not just mute or on
//Playback controls include buffering progress of the downloaded video
//When the user clicks on any sentence in the transcript the video player jumps to the appropriate time in the video