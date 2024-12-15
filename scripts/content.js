// Load settings from storage
chrome.storage.sync.get(['extensionEnabled', 'preset', 'videoPercentage',], (data) => {
  const extensionEnabled = data.extensionEnabled !== undefined ? data.extensionEnabled : true; // default to true
  const preset = data.preset !== undefined ? data.preset : "standard"; // default to standard
  const videoPercentage = data.videoPercentage !== undefined ? data.videoPercentage : 100; // default to 100%

  if (extensionEnabled && videoPercentage >= (Math.random()*100)) {
    console.log('Lobotomy Enabled');
    initialization(preset);
  } else {}
});

// Listen for changes to storage
/*
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.extensionEnabled) {
    const extensionEnabled = changes.extensionEnabled.newValue;
  }
});
*/

let eventFrequency, tier1Odds, tier2Odds, tier3Odds, jesusOdds;

let lobotomyImages = [];
let heavenImages = [];
let unsettlingImages = [];
let jesusImage;

let lobotomySound, heavenSound, unsettlingSound, jesusSound;

let video;

function initialization(preset) {
  if (preset === "casual") {
    eventFrequency = 60; // ~60 seconds
    tier1Odds = 0.80;
    tier2Odds = 0.15;
    tier3Odds = 0.05;
    jesusOdds = 0.777; // 77.7%
  } else if (preset === "standard") {
    eventFrequency = 30; // ~30 seconds
    tier1Odds = 0.65;
    tier2Odds = 0.25;
    tier3Odds = 0.10;
    jesusOdds = 0.50; // 50%
  } else if (preset === "insane") {
    eventFrequency = 15; // ~15 seconds
    tier1Odds = 0.40;
    tier2Odds = 0.30;
    tier3Odds = 0.30;
    jesusOdds = 0.333; // 33.3%
  } else if (preset === "insane+") {
    eventFrequency = 7; // ~7 seconds
    tier1Odds = 0.10;
    tier2Odds = 0.30;
    tier3Odds = 0.60;
    jesusOdds = 0.0777; // 7.77%
  }

  console.log("Settings Loaded");

  fetch(chrome.runtime.getURL("resources.json"))
  .then(response => {return response.json();})
  .then(data => {
    lobotomyImages = data.images.lobotomy.map(fileName => chrome.runtime.getURL(fileName));
    heavenImages = data.images.heaven.map(fileName => chrome.runtime.getURL(fileName));
    unsettlingImages = data.images.unsettling.map(fileName => chrome.runtime.getURL(fileName));
    jesusImage = chrome.runtime.getURL(data.images.jesus);

    lobotomySound = chrome.runtime.getURL(data.sounds.lobotomy);
    heavenSound = chrome.runtime.getURL(data.sounds.heaven);
    unsettlingSound = chrome.runtime.getURL(data.sounds.unsettling);
    jesusSound = chrome.runtime.getURL(data.sounds.jesus);

    console.log("Resources Loaded");

    video = document.querySelector('.video-stream.html5-main-video'); // gets the video from YouTube
    if (!video) return;

    lobotomyClock(); // starts the extension once everything is initialized
  })
  .catch(error => console.error(error));
}

function lobotomyClock() {
  let variance = 0.333; // multiplier for min and max wait
  let wait = ((Math.random() * ((eventFrequency*(1.00+variance)) - (eventFrequency*(1.00-variance)))) + (eventFrequency*(1.00-variance))) * 1000;
  console.log("Next lobotomy in:", wait / (1000), "seconds");

  setTimeout(() => {
    lobotomyEventHandler(); // call lobotomyEventHandler on timeout
  }, wait);
}

function lobotomyEventHandler() {
  if (video.paused) { // if the video is paused, cancel the event and restart the clock
    lobotomyClock();
    return;
  }

  let i = Math.random();
  if (i <= tier1Odds) {
    console.log("Tier 1 Event")
    tier1Event();
  } else if (i <= (tier1Odds + tier2Odds)) {
    console.log("Tier 2 Event")
    tier1Event(); //tier2Event();
  } else {
    console.log("Tier 3 Event")
    tier1Event(); //tier3Event();
  }
}

function tier1Event() {
  videoVolume = document.querySelector('.ytp-volume-panel').ariaValueNow; // gets the volume from YouTube (0-100)
  let soundEffect;

  let i = Math.random();
  if (i <= 0.75) {
    displayImage(lobotomyImages[Math.floor(Math.random()*lobotomyImages.length)]);
    soundEffect = new Audio(lobotomySound);
  } else if (i <= 0.99) {
    displayImage(heavenImages[Math.floor(Math.random()*heavenImages.length)]);
    soundEffect = new Audio(heavenSound);
  } else {
    displayImage(unsettlingImages[Math.floor(Math.random()*unsettlingImages.length)]);
    soundEffect = new Audio(unsettlingSound);
  }

  soundEffect.volume = videoVolume/100;
  console.log(soundEffect.volume);
  soundEffect.play();

  lobotomyClock();
}

function displayImage(imageSource) {
  let videoRect = video.getBoundingClientRect(); // get video styling
  
  let image = document.createElement('img'); // create img element
  image.src = imageSource;

  image.style.position = 'absolute';
  image.style.top = videoRect.top + 'px'; 
  image.style.left = videoRect.left + 'px';
  image.style.width = videoRect.width + 'px';
  image.style.height = videoRect.height + 'px';
  image.style.zIndex = '1000';
  image.style.opacity = '1.0';
  image.style.transition = 'opacity 0.05s ease-in-out';

  document.body.appendChild(image); // display img element

  // fade out img
  let opacity = 1;
  const interval = setInterval(() => {
    opacity -= 0.01;
    if (opacity <= 0) {
      opacity = 0;
      image.remove(); // remove img element
      clearInterval(interval);
    }
    if (image) {image.style.opacity = opacity;}
  }, 50); // every 50ms
}