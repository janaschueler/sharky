class BackgroundObject extends MovableObjects {
  width = 1440;
  height = 480;

  constructor(imagePath, x) {
    super();
    this.x = x;
    this.y = 480 - this.height;
    this.loadImage(imagePath);
  }
}
