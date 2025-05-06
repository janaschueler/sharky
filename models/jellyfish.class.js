/**
 * Represents a Jellyfish enemy in the game.
 * Inherits from MovableObjects and includes different animation states 
 * for swimming, transforming, attacking, and dying.
 *
 * Features:
 * - Animated appearance using image sequences for each behavior state
 * - Audio feedback when hurt
 * - Collision offsets for fine-tuned hitbox detection
 * - State flags for death and cleanup logic
 */
class Jellyfish extends MovableObjects {
  width = 80;
  height = this.width;

  offset = {
    top: 10,
    left: 20,
    right: 10,
    bottom: 20,
  };
  dead = false;
  markedForRemoval = false;

  IMAGES_SWIM = ["img/2.Enemy/2 Jelly fish/Regular damage/Yellow 1.png", "img/2.Enemy/2 Jelly fish/Regular damage/Yellow 2.png", "img/2.Enemy/2 Jelly fish/Regular damage/Yellow 3.png", "img/2.Enemy/2 Jelly fish/Regular damage/Yellow 4.png"];
  IMAGES_TRANSITION = ["img/2.Enemy/2 Jelly fish/S｣per dangerous/Pink1.png", "img/2.Enemy/2 Jelly fish/S｣per dangerous/Pink2.png", "img/2.Enemy/2 Jelly fish/S｣per dangerous/Pink3.png", "img/2.Enemy/2 Jelly fish/S｣per dangerous/Pink4.png"];
  IMAGES_ATTACKING = ["img/2.Enemy/2 Jelly fish/S｣per dangerous/Pink1.png", "img/2.Enemy/2 Jelly fish/S｣per dangerous/Pink2.png", "img/2.Enemy/2 Jelly fish/S｣per dangerous/Pink3.png", "img/2.Enemy/2 Jelly fish/S｣per dangerous/Pink4.png"];
  IMAGES_DEAD = ["img/2.Enemy/2 Jelly fish/Dead/Yellow/y1.png", "img/2.Enemy/2 Jelly fish/Dead/Yellow/y2.png", "img/2.Enemy/2 Jelly fish/Dead/Yellow/y3.png", "img/2.Enemy/2 Jelly fish/Dead/Yellow/y4.png"];
  AUDIO_HURT = new Audio("audio/hurtElectricShock.mp3");

  /**
   * Represents a Jellyfish entity in the game.
   * Initializes the Jellyfish with random position, loads images for different states,
   * and starts its movement and animation.
   * 
   * @constructor
   * @extends SomeParentClass
   */
  constructor() {
    super();
    this.loadImage(this.IMAGES_SWIM[0]);
    this.loadImages(this.IMAGES_SWIM);
    this.loadImages(this.IMAGES_ATTACKING);
    this.loadImages(this.IMAGES_DEAD);
    this.moveLeft();
    this.x = 900 + Math.random() * 1200;
    this.y = 20 + Math.random() * 360;
    this.animate();
  }

/**
 * Starts the animation loop and floating behavior of the jellyfish.
 */
animate() {
  this.startBehaviorLoop();
  this.startFloatingOnDeath();
}

/**
 * Handles the animation state based on proximity and life status.
 */
startBehaviorLoop() {
  setInterval(() => {
    if (this.dead) {
      this.playAnimation(this.IMAGES_DEAD);
    } else if (this.isInProximity()) {
      if (!this.isTransitioning && !this.isAttacking) {
        this.startTransition();
      }
    } else {
      this.playAnimation(this.IMAGES_SWIM);
    }
  }, 200);
}

/**
 * Moves the jellyfish upward after death until it leaves the screen.
 * Marks it for removal when it's no longer visible.
 */
startFloatingOnDeath() {
  setInterval(() => {
    if (this.dead && !this.hasStartedFloating) {
      this.hasStartedFloating = true;
    } else if (this.hasStartedFloating) {
      this.y -= this.speed * 2;
      if (this.y + this.height < 0) {
        this.markedForRemoval = true;
      }
    }
  }, 1000 / 60);
}


  /**
   * Handles the reaction of the jellyfish when it is hit.
   * If the jellyfish is already marked as dead, the method exits early.
   * Otherwise, it marks the jellyfish as dead, stops its floating behavior,
   * and resets the current image index.
   *
   * @returns {void}
   */
  reactToHit() {
    if (this.dead) return;
    this.dead = true;
    this.hasStartedFloating = false;
    this.currentImage = 0;
  }

  /**
   * Plays the hurt sound effect for the jellyfish character.
   * Ensures the sound is not played more than once per second.
   * The sound is automatically paused and reset after 1.3 seconds.
   */
  playSoundHurt() {
    const now = Date.now();
    if (!this.lastSoundTime || now - this.lastSoundTime >= 1000) {
      this.lastSoundTime = now;
      this.AUDIO_HURT.currentTime = 0;
      this.AUDIO_HURT.play();
    }
    setTimeout(() => {
      this.AUDIO_HURT.pause();
      this.AUDIO_HURT.currentTime = 0;
    }, 1300);
  }
}
