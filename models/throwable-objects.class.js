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
  IMAGES_BUBBLE_POISON = ["img/1.Sharkie/4.Attack/Bubble trap/Poisoned Bubble (for whale).png"];

  constructor(x, y, world, isPoison = false, direction = "right") {
    super();
    if (direction === "left") {
      this.x = x - 0; 
    } else {
      this.x = x + 140; 
    }
    this.y = y + 100;
    this.world = world;
    this.isPoison = isPoison;
    this.direction = direction;
    this.initBubble();
  }

  initBubble() {
    if (this.isPoison) {
      this.loadImage(this.IMAGES_BUBBLE_POISON[0]);
      this.loadImages(this.IMAGES_BUBBLE_POISON);
      this.playAnimation(this.IMAGES_BUBBLE_POISON);
      this.reducePoisonLevel();
    } else {
      this.loadImage(this.IMAGES_BUBBLE[0]);
      this.loadImages(this.IMAGES_BUBBLE);
      this.playAnimation(this.IMAGES_BUBBLE);
    }
    if (this.direction === "left") {
      this.throwLeft();
    } else {
      this.throwRight();
    }
    this.world.throwableObjects.push(this);
  }

  throwRight() {
    if (this.moveInterval) clearInterval(this.moveInterval);
    this.applyGravity(1);
  }

  throwLeft() {
    if (this.moveInterval) clearInterval(this.moveInterval);
    this.applyGravity(-1);
  }

  clearExistingMovement() {
    if (this.moveInterval) clearInterval(this.moveInterval);
    this.moveInterval = null;
  }

  reducePoisonLevel() {
    const poisonBar = this.world.statusBarPoison;

    if (poisonBar.poison > 0) {
      poisonBar.poison--;
      poisonBar.update();
    }
  }
}
