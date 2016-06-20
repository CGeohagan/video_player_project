var videoContainer = document.getElementById('video-wrapper');
var video = document.getElementById('video-styles');
var videoControls = document.getElementById('video-controls');
var buttonContainer = document.getElementById('button-container');
var playpause = document.getElementById('playpause');
var stop = document.getElementById('stop');
var mute = document.getElementById('mute');
var volinc = document.getElementById('volinc');
var voldec = document.getElementById('voldec');
var progress = document.getElementById('progress');
var progressBar = document.getElementById('progress-bar');
var buffer = document.querySelector('.buffer');
var fullscreen = document.getElementById('fs');
var curtime = document.getElementById("current");
var durtime = document.getElementById("duration");

 

//Check if browser supports video
var supportsVideo = !!document.createElement('video').canPlayType;
if (supportsVideo) {
    


//** Remember to put inside function and put in if(supportsVideo)
// Hide the default controls
video.controls = false;

// Display the user defined video controls 
videoControls.style.display = 'flex';
videoControls.style.display = '-webkit-flex';
videoControls.setAttribute('data-state', 'visible');

// Use mouseenter and mouseleave for hiding and showing the video player controls
/*videoControls.addEventListener("mouseenter", function() {
   buttonContainer.style.display = 'flex';
   buttonContainer.style.display = '-webkit-flex';
},false);

videoControls.addEventListener("mouseleave", function() {
   buttonContainer.style.display = 'none';
},false);*/



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
//2. Add volume button that lets you mute the sound or turn it on
   //Mute button
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

//Volume control so viewer can adjust the volume level, not just mute or on
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

	

//Setting max to duration - may not work on all browsers
video.addEventListener('loadedmetadata', function() {
   progress.setAttribute('max', video.duration);
});

//A user should be able to click anywhere on the playback bar to jump to that part of the video
//As the video plays the playback bar should fill in
//Set progress bar value to current time
video.addEventListener('timeupdate', function() {
   progress.value = video.currentTime;
   progressBar.style.width = Math.floor((video.currentTime / video.duration) * 100) + '%';


//As the video plays the current time should be displayed and updated e.g. 0:10/11:34
//get HTML5 video time duration
   var curmins = Math.floor(video.currentTime / 60);
   var cursecs = Math.floor(video.currentTime - curmins * 60);
   var durmins = Math.floor(video.duration / 60);
   var dursecs = Math.floor(video.duration - durmins * 60);
   if(cursecs < 10){ cursecs = "0"+cursecs; }
   if(dursecs < 10){ dursecs = "0"+dursecs; }
   if(curmins < 10){ curmins = "0"+curmins; }
   if(durmins < 10){ durmins = "0"+durmins; }
   curtime.innerHTML = curmins+":"+cursecs;
   durtime.innerHTML = durmins+":"+dursecs;
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


//Playback controls include buffering progress of the downloaded video
video.addEventListener('progress', function() {
   var bufferedEnd = video.buffered.end(video.buffered.length - 1);
   var duration =  video.duration;
   if (duration > 0) {
        document.getElementById('buffered-amount').style.width = ((bufferedEnd / duration)*100) + "%";
   }
});

//4. As the media playback time changes, sentences in the transcript should highlight
   //Use javascript to listen for those changes and apply a highlight to the appropriate sentence
video.addEventListener("timeupdate", function() {
   var captionHighlight = document.querySelectorAll('.captionText span');
   var cueTime = video.currentTime;
   if(cueTime > 0 && cueTime < 4.13) {
      captionHighlight[0].classList.add('highlight');
   } else {
      captionHighlight[0].classList.remove('highlight');
   }
   if(cueTime > 4.13 && cueTime < 7.535) {
      captionHighlight[1].classList.add('highlight');
   } else {
      captionHighlight[1].classList.remove('highlight');
   }
   if(cueTime > 7.535 && cueTime < 11.27) {
      captionHighlight[2].classList.add('highlight');
   } else {
      captionHighlight[2].classList.remove('highlight');
   }
   if(cueTime > 11.27 && cueTime < 13.960) {
      captionHighlight[3].classList.add('highlight');
   } else {
      captionHighlight[3].classList.remove('highlight');
   }
   if(cueTime > 13.96 && cueTime < 17.94) {
      captionHighlight[4].classList.add('highlight');
   } else {
      captionHighlight[4].classList.remove('highlight');
   }
   if(cueTime > 17.94 && cueTime < 22.37) {
      captionHighlight[5].classList.add('highlight');
   } else {
      captionHighlight[5].classList.remove('highlight');
   }
   if(cueTime > 22.37 && cueTime < 26.88) {
      captionHighlight[6].classList.add('highlight');
   } else {
      captionHighlight[6].classList.remove('highlight');
   }
   if(cueTime > 26.88 && cueTime < 30.92) {
      captionHighlight[7].classList.add('highlight');
   } else {
      captionHighlight[7].classList.remove('highlight');
   }
   if(cueTime > 32.1 && cueTime < 34.73) {
      captionHighlight[8].classList.add('highlight');
   } else {
      captionHighlight[8].classList.remove('highlight');
   }
   if(cueTime > 34.73 && cueTime < 39.43) {
      captionHighlight[9].classList.add('highlight');
   } else {
      captionHighlight[9].classList.remove('highlight');
   }
   if(cueTime > 39.43 && cueTime < 41.19) {
      captionHighlight[10].classList.add('highlight');
   } else {
      captionHighlight[10].classList.remove('highlight');
   }
   if(cueTime > 42.35 && cueTime < 46.3) {
      captionHighlight[11].classList.add('highlight');
   } else {
      captionHighlight[11].classList.remove('highlight');
   }
   if(cueTime > 46.3 && cueTime < 49.27) {
      captionHighlight[12].classList.add('highlight');
   } else {
      captionHighlight[12].classList.remove('highlight');
   }
   if(cueTime > 49.27 && cueTime < 53.76) {
      captionHighlight[13].classList.add('highlight');
   } else {
      captionHighlight[13].classList.remove('highlight');
   }
   if(cueTime > 53.76 && cueTime < 57.78) {
      captionHighlight[14].classList.add('highlight');
   } else {
      captionHighlight[14].classList.remove('highlight');
   }
   if(cueTime > 57.78) {
      captionHighlight[15].classList.add('highlight');
   } else {
      captionHighlight[15].classList.remove('highlight');
   }

});



//5. Implement the fullscreen button
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


//6. //Embed the .vtt file as a closed captioning track and add a button to video controls to toggle captions on and off

var subtitles = document.getElementById('subtitles');
//Initially turn off all subtitles in case browser turns them on
for (var i = 0; i < video.textTracks.length; i++) {
   video.textTracks[i].mode = 'hidden';
}

var subtitlesMenu;
if (video.textTracks) {
   var df = document.createDocumentFragment();
   var subtitlesMenu = df.appendChild(document.createElement('ul'));
   subtitlesMenu.className = 'subtitles-menu';
   subtitlesMenu.appendChild(createMenuItem('subtitles-off', '', 'Off'));
   for (var i = 0; i < video.textTracks.length; i++) {
      subtitlesMenu.appendChild(createMenuItem('subtitles-' + video.textTracks[i].language, video.textTracks[i].language, video.textTracks[i].label));
   }
   videoContainer.appendChild(subtitlesMenu);
}

var captionMenuButtons = [];
var createMenuItem = function(id, lang, label) {
   var listItem = document.createElement('li');
   var button = listItem.appendChild(document.createElement('button'));
   button.setAttribute('id', id);
   button.className = 'subtitles-button';
   if (lang.length > 0) button.setAttribute('lang', lang);
   button.value = label;
   button.setAttribute('data-state', 'inactive');
   button.appendChild(document.createTextNode(label));
   button.addEventListener('click', function(e) {
      // Set all buttons to inactive
      subtitleMenuButtons.map(function(v, i, a) {
         subtitleMenuButtons[i].setAttribute('data-state', 'inactive');
      });
      // Find the language to activate
      var lang = this.getAttribute('lang');
      for (var i = 0; i < video.textTracks.length; i++) {
         // For the 'subtitles-off' button, the first condition will never match so all will subtitles be turned off
         if (video.textTracks[i].language == lang) {
            video.textTracks[i].mode = 'showing';
            this.setAttribute('data-state', 'active');
         }
         else {
            video.textTracks[i].mode = 'hidden';
         }
      }
      subtitlesMenu.style.display = 'none';
   });
   subtitleMenuButtons.push(button);
   return listItem;
}

subtitles.addEventListener('click', function(e) {
   if (subtitlesMenu) {
      subtitlesMenu.style.display = (subtitlesMenu.style.display == 'block' ? 'none' : 'block');
   }
});




//For exceeds expectations
//Embed the .vtt file as a closed captioning track and add a button to video controls to toggle captions on and off
//A creative and thoughtful responsive design
//Playback speed control or other helpful controls


//When the user clicks on any sentence in the transcript the video player jumps to the appropriate time in the video