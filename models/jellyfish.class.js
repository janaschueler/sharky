class Jellyfish extends MovableObjects {
  width = 80;
  height = this.width;
  IMAGES_SWIM = ["img/2.Enemy/2 Jelly fish/Regular damage/Yellow 1.png", "img/2.Enemy/2 Jelly fish/Regular damage/Yellow 2.png", "img/2.Enemy/2 Jelly fish/Regular damage/Yellow 3.png", "img/2.Enemy/2 Jelly fish/Regular damage/Yellow 4.png"];

  constructor() {
    super();
    this.loadImage(this.IMAGES_SWIM[0]);
    this.loadImages(this.IMAGES_SWIM);

    this.x = 400 + Math.random() * 300;
    this.y = 20 + Math.random() * 360;
    this.animate();
  }

  animate() {
    this.moveLeft();
  }
}
