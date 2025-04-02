class Poison extends MovableObjects {
  width = 60;
  height = 80;
  IMAGES_GROUND = ["img/4. Marcadores/Posiขn/Dark - Left.png"];

  constructor() {
    super();
    this.loadImage(this.IMAGES_GROUND[0]);
    this.loadImages(this.IMAGES_GROUND);
    this.x = 360;
    this.y = 350;
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES_GROUND);
    }, 300);
  }
}
