class ThrowableObject extends MovableObjects {
  width = 60;
  height = 60;
  speedX = 2;
  speedY = 1;
  offset = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  IMAGES_BUBBLE = ["img/1.Sharkie/4.Attack/Bubble trap/Bubble.png"];
  // IMAGES_BUBBLE_POISON = ["img/1.Sharkie/4.Attack/Bubble trap/Poisoned Bubble (for whale).png"];

  constructor(x, y, world) {
    super();
    this.loadImage(this.IMAGES_BUBBLE[0]);
    this.loadImages(this.IMAGES_BUBBLE);
    this.x = x + 140;
    this.y = y + 100;
    this.world = world;
    this.world.throwableObjects.push(this);
    this.throwRight();
  }

  throwRight() {
    if (this.moveInterval) clearInterval(this.moveInterval);
    const maxDistance = 80;
    const startPosition = this.x;
    this.applyGravity();
  }

  clearExistingMovement() {
    if (this.moveInterval) clearInterval(this.moveInterval);
  }
}
