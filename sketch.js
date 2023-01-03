const jsmediatags = window.jsmediatags;

let canvas;

// interactive elements 
let volSlider;
let playButton;
let nextButton;
let prevButton;

let img;
let currentTrack;

let track;
let playlist;
let queue = [];
let images = [];
let metadata = [];

let gap;
let ypad;

let i = -1;

function preload() {
  img = loadImage("placeholder-album-art.jpg");
  soundFormats('mp3', 'ogg');
  nature = loadSound("beat-of-nature.mp3");
  summer = loadSound("summer-nights.mp3");
  goodVibes = loadSound("good-vibes.mp3");

  queue.push(nature);
  queue.push(summer);
  queue.push(goodVibes);
}

function setup() {
  gap = 100;
  ypad = (windowHeight - 498 - gap) / 2;

  volSlider = createSlider(0, 1, 0.5, 0.01);
  volSlider.addClass("volume");

  prevButton = createButton("⏮");
  playButton = createButton("⏯");
  nextButton = createButton("⏭");

  progressSlider = createSlider(0, 1, 0, 0.01);
  progressSlider.addClass("progress");

  console.log(queue);

  addImages();

  playlist = new Playlist(queue);

  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("myDiv");
  noLoop();
}

function draw() {
  let text = document.getElementById("data");
  //text.style.right = windowWidth / 2 - 80 + "px";
  text.style.top = ypad + "px";
  image(img, windowWidth / 2 - 200, ypad + 70, 400, 400);
  progressSlider.position(windowWidth / 2 - 200, ypad + 500);
  prevButton.position(windowWidth / 2 - 62, ypad + 435 + gap);
  prevButton.mousePressed(goBack);
  playButton.position(windowWidth / 2 - 14, ypad + 435 + gap);
  playButton.mousePressed(playCurrentTrack);
  nextButton.position(windowWidth / 2 + 34, ypad + 435 + gap);
  nextButton.mousePressed(goNext);
  volSlider.position(windowWidth / 2 - 64, ypad + 483 + gap);
  volSlider.input(adjustVolume);

  // SET POSITIONS OF TEXT IN JS TO WORK IN MULTIPLE RESOLUTIONS

  sliderLoop();
}

function playCurrentTrack() {
  playlist.playTrack(0);
  adjustVolume();
  image(metadata[playlist.index].image, windowWidth / 2 - 200, ypad + 70, 400, 400);
  document.getElementById("data").innerText = metadata[playlist.index].title + " - " + metadata[playlist.index].artist;
  console.log(metadata);
}

function goNext() {
  playlist.next();
  adjustVolume();
  image(metadata[playlist.index].image, windowWidth / 2 - 200, ypad + 70, 400, 400);
  document.getElementById("data").innerText = metadata[playlist.index].title + " - " + metadata[playlist.index].artist;
}

function goBack() {
  playlist.back();
  adjustVolume();
  image(metadata[playlist.index].image, windowWidth / 2 - 200, ypad + 70, 400, 400);
  document.getElementById("data").innerText = metadata[playlist.index].title + " - " + metadata[playlist.index].artist;
}

function adjustVolume() {
  playlist.setTrackVolume = volSlider.value();
}

function sliderLoop() {
  let timestamp = playlist.getCurrentTrack.currentTime() / playlist.getCurrentTrack.duration();
  progressSlider.value(timestamp);
  console.log("current time: " + playlist.getCurrentTrack.currentTime() + ", duration: " + playlist.getCurrentTrack.duration());
  setTimeout(sliderLoop, 500);
}

function addImages() {
  i += 1;
  if (i >= queue.length) {
    return;
  }

  let url = window.location.href + queue[i].file;
  let tags = {};
  jsmediatags.read(url, {
    onSuccess: function(tag) {
      tags = tag;
      let title = tags.tags.title;
      let artist = tags.tags.artist;
      let picture = tags.tags.picture;
      let base64String = "";
      for (let j = 0; j < picture.data.length; j++) {
        base64String += String.fromCharCode(picture.data[j]);
      }
      let imageUri = "data:" + picture.format + ";base64," + window.btoa(base64String);
      metadata.push(new Metadata(title, artist, createImg(imageUri, "Album Art", "", addImages)));
    },
    onError: function(error) {
      console.log(error);
    }
  });
}