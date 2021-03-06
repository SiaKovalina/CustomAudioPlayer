// In production I would use Webpack4, Sass insted of plain CSS, maybe ogg format for old forefox users. Transpile code with Babel if needed. 
window.addEventListener('DOMContentLoaded', initPlayer);

function initPlayer() {

  let audio = new Audio();
  const playBtn = document.getElementById('btn-playpause');
  const prevBtn = document.getElementById('btn-prev');
  const nextBtn = document.getElementById('btn-next');
  const muteBtn = document.getElementById('mutebtn');
  const progressBarFill = document.getElementById('progressbar-fill');
  const progressBar = document.getElementById('progressbar')
  const volumeSlider = document.getElementById('volumeslider');
  const playlist = document.getElementById('playlist');
  const playback = document.getElementById('playback'); 
  const duration = document.getElementById('duration');

  getSongs();

  loadEventListeners();

  async function getSongs() {
    let response = await fetch('db.json');
    let songsArr = await response.json();
    songsArr.map(song => {
      let {title, src, id} = song;
      let li = document.createElement('li');
      li.innerHTML = title;
      li.audioSrc = src;
      li.dataTrackId = id;
      playlist.appendChild(li);
    });

    //Set first track to be the first one playing by default
    audio.src = songsArr[0].src;
    audio.preload;
    playlist.children[0].classList += 'active';
    playback.innerHTML = '00 : 00';
  }

  function loadEventListeners() {
    audio.addEventListener('timeupdate', updatePlayback);
    playBtn.addEventListener('click', togglePlay);
    muteBtn.addEventListener('click', mute);
    progressBar.addEventListener('click', seek);
    volumeSlider.addEventListener('mousemove', changeVolume);
    playlist.addEventListener('click', changeTrack);
    prevBtn.addEventListener('click', previousTrack);
    nextBtn.addEventListener('click', nextTrack);
    audio.addEventListener('loadedmetadata', () => { displayTime(audio.duration, duration) });
  }

  //Display playback and duration time
  function displayTime (time, element) {
    let sec = Math.floor(time % 60);
    let min = Math.floor(time / 60);
    sec = sec < 10 ? '0' + sec : sec;
    min = min < 10 ? '0' + min : min;
    element.innerHTML = `${min} : ${sec}`;
  }
  
  //Autoupdate progress bar position
  function updatePlayback() {
    progressBarFill.style.width = (audio.currentTime / audio.duration * 100) + '%';
    displayTime(audio.currentTime, playback);
    if (audio.ended) {
      nextTrack();
    }
  }
  
  //Seek progress bar position 
  function seek(event) {
    if (event.target == progressBar) {
      audio.currentTime = event.offsetX / event.target.offsetWidth * audio.duration;
    } else if (event.target == progressBarFill) {
      audio.currentTime = event.offsetX / event.target.parentElement.offsetWidth * audio.duration;
    }
    updatePlayback();
  }
  
  //Play/Pause button
  function togglePlay() {
    if (audio.paused) {
      audio.play();
      playBtn.firstElementChild.className = 'icon ion-md-pause';
    } else {
      audio.pause();
      playBtn.firstElementChild.className = 'icon ion-md-play';
    }
  }
  
  //Mute button
  function mute() {
    if (!audio.muted) {
      audio.muted = true;
      muteBtn.firstElementChild.className = 'icon ion-md-volume-off';
    } else {
      audio.muted = false;
      muteBtn.firstElementChild.className = 'icon ion-md-volume-high';
    }
  }
  
  //Change track in playlist on user click
  function changeTrack(event) {
    if (playBtn.firstElementChild.className = 'icon ion-md-play') {
      playBtn.firstElementChild.className = 'icon ion-md-pause';
    }
    audio.pause();
    audio.src = event.target.audioSrc;
    audio.preload = 'metadata';
    audio.play();
    document.querySelector('.active').classList.remove('active');
    event.target.classList.add('active');
  }
  
  //Volume slider
  function changeVolume() {
    audio.volume = volumeSlider.value;
  }
  
  //Previous button
  function previousTrack(event) {
    let songs = Array.from(document.querySelectorAll('#playlist li'));
      let id;
      if (playBtn.firstElementChild.className = 'icon ion-md-play') {
        playBtn.firstElementChild.className = 'icon ion-md-pause';
      }
      audio.pause();
      audio.src = document.querySelector('.active').previousElementSibling.audioSrc;
      id = document.querySelector('.active').previousElementSibling.dataTrackId;
      document.querySelector('.active').classList.remove('active');
      audio.preload = 'metadata';
      audio.play();
      songs.forEach(song => {
        if (song.dataTrackId == id) {
          song.classList.add('active');
        }
      })
    }
    
    //Next button
    function nextTrack(event) {
      const songs = Array.from(document.querySelectorAll('#playlist li'));
      let id;
      if (playBtn.firstElementChild.className = 'icon ion-md-play') {
        playBtn.firstElementChild.className = 'icon ion-md-pause';
      }
      audio.pause();
      audio.src = document.querySelector('.active').nextElementSibling.audioSrc;
      id = document.querySelector('.active').nextElementSibling.dataTrackId;
      document.querySelector('.active').classList.remove('active');
      audio.preload = 'metadata';
      audio.play();
      songs.forEach(song => {
        if (song.dataTrackId == id) {
          song.classList.add('active');
        }
      })
    }
    
  }