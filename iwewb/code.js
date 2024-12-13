let loaded = false;
let delay = 1000;
let menuHidden = false;
let isIntro = true;
let song = "./assets/moosic/EtherField.mp3";
let songStart = 0;
let songName = "Ether Field by Wisp X";
let muted = false;
let skipIntro = false;

var audioFiles = [
  "./assets/moosic/AcrossTheEventHorizon.mp3",
  "./assets/moosic/LaQryma.mp3",
  "./assets/moosic/LiftOff.mp3",
  "./assets/moosic/Grimheart.mp3",
  "./assets/moosic/LiveFastDieYoung.mp3",
  "./assets/moosic/SaintOrSinner.mp3",
];

var x = document.getElementById("myAudio");

function preloadAudio(url) {
  var audio = new Audio();
  audio.addEventListener("canplaythrough", loadedAudio, false);
  audio.src = url;
}

var loadedAudios = 0;
function loadedAudio() {
  loadedAudios++;
  document.getElementById("loading-text").innerHTML = `Loading Audios [${
    loadedAudios + "/" + audioFiles.length
  }]`;
  if (loadedAudios === audioFiles.length) {
    endLoad();
  }
}

for (var i in audioFiles) {
  preloadAudio(audioFiles[i]);
}

function newSong() {
  switch (randomNum(1, 6)) {
    case 6:
      song = "./assets/moosic/LiveFastDieYoung.mp3";
      songName = "Live Fast Die Young by anubasu-anubasu";
      songStart = 128;
      break;
    case 5:
      song = "./assets/moosic/SaintOrSinner.mp3";
      songName = "Saint or Sinner by crayvxn";
      songStart = 105;
      break;
    case 4:
      song = "./assets/moosic/LiftOff.mp3";
      songName = "LiftOff by MAYA AKAI";
      songStart = 20;
      break;
    case 3:
      song = "./assets/moosic/EtherField.mp3";
      songName = "Ether Field by Wisp X";
      break;
    case 2:
      song = "./assets/moosic/Grimheart.mp3";
      songName = "Grimheart by puru";
      songStart = 227;
      break;
    case 1:
      song = "./assets/moosic/AcrossTheEventHorizon.mp3";
      songName = "Across the Event Horizon by Fether";
      songStart = 12.5;
      break;
  }
  x.src = song;
  document.getElementById("songTitle").innerHTML = songName;

  if (isIntro === true) {
    x.currentTime = songStart.toString();
    x.play();
    isIntro = false;
  } else {
    x.play();
  }
}

function FadeIn() {
  var myAudio = document.getElementById("myAudio");
  if (myAudio.volume < 0.5 && muted === false) {
    myAudio.volume += 0.0025;
    timer = setTimeout(FadeIn, 10);
  }
}

x.volume = 0;

document.getElementById("songTitle").innerHTML = songName;

function playAudio() {
  FadeIn();
  x.play();
}

if (skipIntro === true) {
  loaded = true;
  delay = 0;
  document.getElementById("loading-container").style.transition = "0s";
  closeLoader();
}

function randomNum(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function endLoad() {
  setTimeout(() => {
    document.getElementById("loading-spinner").style.display = "none";
    document.getElementById("loading-text").innerHTML =
      "Click anywhere to continue <br> (SOUND WARNING)";
    loaded = true;
  }, 10);
}

function closeLoader() {
  if (loaded === true) {
    document.getElementById("loading-container").style.backgroundColor =
      "#FFFFFF";
    setTimeout(() => {
      document.getElementById("loading-container").style.opacity = "0";
      document.getElementById("loading-text").display = "none";
      document.getElementById("grass-container").style.opacity = "1";
      setTimeout(() => {
        document.getElementById("loading-container").style.display = "none";
      }, delay);
      beginIntro();
    }, delay);
    x.onload = playAudio();
  } else {
  }
}

function option1() {
  document.getElementById("selecter").style.top = "1.5rem";
}

function option2() {
  document.getElementById("selecter").style.top = "4.5rem";
}

function option3() {
  document.getElementById("selecter").style.top = "7.5rem";
}

function h1Fade() {
  document.getElementById("greeter").style.opacity = "0";
  setTimeout(() => {
    document.getElementById("greeter").style.opacity = "1";
  }, 1000);
}

function beginIntro() {
  setTimeout(() => {
    updateDialogue("Where do you want to go?");
    setTimeout(() => {
      document.getElementById("choices").style.opacity = "1";
      document.getElementById("a1").style.opacity = "1";
    }, 2000);
    setTimeout(() => {
      document.getElementById("a2").style.opacity = "0.5";
    }, 2250);
    setTimeout(() => {
      document.getElementById("a3").style.opacity = "1";
    }, 2500);
  }, 2000);
}

function updateDialogue(str) {
  h1Fade();
  setTimeout(() => {
    document.getElementById("greeter").innerHTML = str;
  }, 1000);
}

function hideMenu() {
  if (menuHidden === false) {
    menuHidden = true;
    document.getElementById("choices").style.opacity = "0";
    updateDialogue("Alrighty");
    setTimeout(() => {
      updateDialogue("Refresh the page to see this dialogue again.");
      setTimeout(() => {
        updateDialogue("See you in a bit!");
        setTimeout(() => {
          updateMenu();
        }, 4000);
      }, 4000);
    }, 2000);
  }
}

function updateMenu() {
  if (menuHidden === true) {
    document.getElementById("menu").style.opacity = "0";
    setTimeout(() => {
      document.getElementById("menu").style.display = "none";
    }, 1000);
  } else {
    document.getElementById("menu").style.display = "flex";
    document.getElementById("menu").style.opacity = "1";
  }
}

function grassToggle() {
  if (document.getElementById("grassToggle").checked === true) {
    document.getElementById("grass-container").style.display = "none";
  } else {
    document.getElementById("grass-container").style.display = "inline";
  }
}

function fpsMeter() {
  let prevTime = Date.now(),
    frames = 0;

  requestAnimationFrame(function loop() {
    const time = Date.now();
    frames++;
    if (time > prevTime + 250) {
      let fpsC = Math.round((frames * 1000) / (time - prevTime));
      prevTime = time;
      frames = 0;

      document.getElementById("fps").innerHTML = `fps: ${fpsC}`;
    }

    requestAnimationFrame(loop);
  });
}

fpsMeter();

function traveler(place) {
  document.getElementById("main-container").style.background =
    "linear-gradient( 180deg, rgba(17, 20, 37, 1) 99%, rgb(40, 63, 112) 100%);";
  document.getElementById("grass-container").style.transition = "3s";
  document.getElementById("grass-container").style.transform =
    "translateY(120%)";
  document.getElementById("dust").style.transition = "10s";
  document.getElementById("dust").style.transform = "translateY(100%)";
  document.getElementById("seed").style.transition = "8s";
  document.getElementById("seed").style.transform = "translateY(100%)";
  try {
    document.getElementById("holder").firstChild.style.transition = "2s";
    document.getElementById("holder").firstChild.style.opacity = "0";
  } catch (error) {}

  setTimeout(() => {
    document.getElementById("traveler").style.opacity = "1";
    document.getElementById(
      "travelerTitle"
    ).innerHTML = `Traveling to ${place}`;
    setTimeout(() => {
      document.getElementById("travelerTitle").style.opacity = "1";
    }, 1500);
  }, 2000);
}

function toSpace() {
  traveler("Ishikaze's space");
  updateDialogue("And.. we're off!");
  document.getElementById("choices").style.opacity = "0";
  Fade();
  setTimeout(() => {
    window.location.href = "./space";
  }, 7000);
}

function Fade() {
  var myAudio = document.getElementById("myAudio");
  if (myAudio.volume > 0) {
    myAudio.volume -= 0.0005;
    timer = setTimeout(Fade, 10);
  }
}
