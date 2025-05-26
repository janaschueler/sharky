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
    if (direction === "left") this.x = x - 0;
    else this.x = x + 140;
    this.y = y + 100;
    this.world = world;
    this.isPoison = isPoison;
    this.direction = direction;
    this.initBubble();
  }

  /**
   * Initializes the bubble object with the appropriate images, animation, and behavior
   * based on whether it is a poison bubble or a regular bubble. Sets the initial image,
   * loads the animation frames, starts the animation, and applies any special effects
   * (such as reducing poison level). Determines the throw direction and adds the bubble
   * to the world's list of throwable objects.
   *
   * @method
   * @returns {void}
   */
  initBubble() {
    if (this.isPoison) this.statPoisonBubble();
    else this.startBubble();
    if (this.direction === "left") this.throwLeft();
    else this.throwRight();
    this.world.throwableObjects.push(this);
  }

  /**
   * Initiates the bubble animation sequence.
   * Loads the initial bubble image and then preloads all images for the
   * bubble animation. Finally, it starts the continuous playback of the
   * bubble animation.
   *
   * @method
   * @returns {void}
   */
  startBubble() {
    this.loadImage(this.IMAGES_BUBBLE[0]);
    this.loadImages(this.IMAGES_BUBBLE);
    this.playAnimation(this.IMAGES_BUBBLE);
  }

  /**
   * Initiates the poison bubble animation sequence and reduces the poison level.
   * Loads the initial poison bubble image, preloads all images for the poison
   * bubble animation, and starts its continuous playback. Additionally, it
   * calls the `reducePoisonLevel` method to decrease the character's poison level.
   *
   * @method
   * @returns {void}
   */
  statPoisonBubble() {
    this.loadImage(this.IMAGES_BUBBLE_POISON[0]);
    this.loadImages(this.IMAGES_BUBBLE_POISON);
    this.playAnimation(this.IMAGES_BUBBLE_POISON);
    this.reducePoisonLevel();
  }

  /**
   * Throws the object to the right by clearing any existing movement interval
   * and applying gravity with a rightward force.
   *
   * @method
   * @returns {void}
   */
  throwRight() {
    if (this.moveInterval) clearInterval(this.moveInterval);
    this.speedX = 6;
    this.applyGravity(1);
  }

  /**
   * Throws the object to the left by clearing any existing movement interval
   * and applying gravity in the leftward direction.
   */
  throwLeft() {
    if (this.moveInterval) clearInterval(this.moveInterval);
    this.speedX = 6;
    this.applyGravity(-1);
  }

  /**
   * Clears any existing movement interval for the object.
   * If a movement interval is currently active, it will be stopped and set to null.
   */
  clearExistingMovement() {
    if (this.moveInterval) clearInterval(this.moveInterval);
    this.moveInterval = null;
  }

  /**
   * Reduces the poison level in the world's poison status bar by one unit if it is above zero,
   * and updates the status bar accordingly.
   *
   * @method
   * @returns {void}
   */
  reducePoisonLevel() {
    const poisonBar = this.world.statusBarPoison;
    if (poisonBar.poison > 0) {
      poisonBar.poison--;
      poisonBar.update();
    }
  }
}
