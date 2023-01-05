class Playlist {
  constructor(queue) {
    this.queue = queue;
    this.index = 0;
  }

  get getCurrentTrack() {
    return this.queue[this.index];
  }

  set setTrackVolume(value) {
    this.queue[this.index].setVolume(value);
  }

  playTrack() {
    this.queue[this.index].playMode('sustain'); // bug in p5js
    if (!this.queue[this.index].isPlaying()) {
      this.queue[this.index].play();
    } else {
      this.queue[this.index].pause();
    }
  }

  // NOT IMPLEMENTED YET - due to potential design issues
  shuffle() { // durstenfeld shuffle algorithm
    for (let i = this.queue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i +1));
      [this.queue[i], this.queue[j]] = [this.queue[j], this.queue[i]];
    }
  }

  next() {
    this.queue[this.index].pause();
    if (this.index < this.queue.length - 1) {
      this.index += 1;
    } else {
      this.index = 0;
    }
    this.playTrack()
  }

  back() {
    this.queue[this.index].pause();
    if (this.index > 0) {
      this.index -= 1;
    } else {
      this.index = this.queue.length - 1;
    }
    this.playTrack();
  }
}