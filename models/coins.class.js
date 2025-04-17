class Coin extends MovableObjects {
  width = 40;
  height = 40;
  IMAGES_FLOAT = ["img/4. Marcadores/1. Coins/1.png", "img/4. Marcadores/1. Coins/2.png", "img/4. Marcadores/1. Coins/3.png", "img/4. Marcadores/1. Coins/4.png"];
  AUDIO_COLLECT = new Audio("audio/CollectCoin.mp3");
  offset = { top: 0, left: 0, right: 0, bottom: 0 };

  constructor() {
    super();
    this.loadImage(this.IMAGES_FLOAT[0]);
    this.loadImages(this.IMAGES_FLOAT);
    this.x = -700 + Math.random() * 2200;
    this.y = 0 + Math.random() * 400;
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES_FLOAT);
    }, 300);
  }

  playSound() {
    this.AUDIO_COLLECT.currentTime = 0;
    this.AUDIO_COLLECT.play().catch(() => {});
  }
}
