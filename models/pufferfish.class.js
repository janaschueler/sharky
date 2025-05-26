/**
 * Represents a pufferfish enemy in the game.
 * Inherits from MovableObjects and includes states for energy, death,
 * floating behavior after death, and removal handling.
 *
 * Features:
 * - Custom hitbox offsets for accurate collision
 * - Limited energy (health) value
 * - Flags for death animation and floating behavior
 * - Marking system for removal from the game world after death
 */
class Puffers extends MovableObjects {
  width = 60;
  height = this.width;
  offset = {
    top: 5,
    left: 10,
    right: 1,
    bottom: 5,
  };
  energy = 20;
  dead = false;
  hasStartedFloating = false;
  hasPlayedDeathAnimation = false;
  markedForRemoval = false;
  IMAGES_SWIM = ["img/2.Enemy/1.Pufferfish/1.Swim/3.swim1.png", "img/2.Enemy/1.Pufferfish/1.Swim/3.swim2.png", "img/2.Enemy/1.Pufferfish/1.Swim/3.swim3.png", "img/2.Enemy/1.Pufferfish/1.Swim/3.swim4.png", "img/2.Enemy/1.Pufferfish/1.Swim/3.swim5.png"];
  IMAGES_TRANSITION = ["img/2.Enemy/1.Pufferfish/2.transition/3.transition1.png", "img/2.Enemy/1.Pufferfish/2.transition/3.transition2.png", "img/2.Enemy/1.Pufferfish/2.transition/3.transition3.png", "img/2.Enemy/1.Pufferfish/2.transition/3.transition4.png", "img/2.Enemy/1.Pufferfish/2.transition/3.transition5.png"];
  IMAGES_ATTACKING = ["img/2.Enemy/1.Pufferfish/3.Bubbleeswim/3.bubbleswim1.png", "img/2.Enemy/1.Pufferfish/3.Bubbleeswim/3.bubbleswim2.png", "img/2.Enemy/1.Pufferfish/3.Bubbleeswim/3.bubbleswim3.png", "img/2.Enemy/1.Pufferfish/3.Bubbleeswim/3.bubbleswim4.png", "img/2.Enemy/1.Pufferfish/3.Bubbleeswim/3.bubbleswim5.png"];
  IMAGES_DEAD = ["img/2.Enemy/1.Pufferfish/4.DIE/3.png", "img/2.Enemy/1.Pufferfish/4.DIE/3.2.png", "img/2.Enemy/1.Pufferfish/4.DIE/3.3.png"];
  AUDIO_HURT = new Audio("audio/hurtPuffer.mp3");

  /**
   * Constructs a new Pufferfish object and initializes its properties and behavior.
   *
   * - Loads the initial image and sets up animations for swimming, transitioning, attacking, and dying.
   * - Randomly positions the pufferfish on the x-axis and y-axis within specified ranges.
   * - Starts the movement and animation of the pufferfish.
   *
   * @class
   * @constructor
   */
  constructor() {
    super();
    this.loadImage(this.IMAGES_SWIM[0]);
    this.loadImages(this.IMAGES_SWIM);
    this.loadImages(this.IMAGES_TRANSITION);
    this.loadImages(this.IMAGES_ATTACKING);
    this.loadImages(this.IMAGES_DEAD);
    this.moveLeft();
    this.x = 700 + Math.random() * 900;
    this.y = 0 + Math.random() * 400;
    this.animate();
  }

  /**
   * Triggers the animation behavior of the pufferfish.
   * This includes starting the behavior loop and initiating
   * the floating animation after the pufferfish's death.
   */
  animate() {
    this.startBehaviorLoop();
    this.startFloatingAfterDeath();
  }

  /**
   * Starts the behavior loop for the pufferfish instance.
   * This loop runs at a fixed interval and handles the following:
   * - If the pufferfish is dead, it triggers the death animation and stops further behavior.
   * - If the pufferfish is in proximity to a target and not already transitioning or attacking,
   *   it initiates a transition.
   * - If none of the above conditions are met, it plays the swimming animation.
   *
   * The loop executes every 200 milliseconds.
   */
  startBehaviorLoop() {
    setInterval(() => {
      if (this.dead) {
        this.handleDeathAnimation();
        return;
      }
      if (this.isInProximity()) {
        if (!this.isTransitioning && !this.isAttacking) this.startTransition();
      } else this.playAnimation(this.IMAGES_SWIM);
    }, 200);
  }

  /**
   * Handles the death animation for the pufferfish.
   * Ensures the death animation is played only once and updates the image
   * to the final frame of the death animation. After a short delay, it sets
   * a flag indicating that the floating animation has started.
   *
   * @returns {void}
   */
  handleDeathAnimation() {
    if (this.hasPlayedDeathAnimation) return;
    this.hasPlayedDeathAnimation = true;
    this.playAnimationOnce(this.IMAGES_DEAD, () => {
      this.img = this.imageCache[this.IMAGES_DEAD.at(-1)];
      setTimeout(() => {
        this.hasStartedFloating = true;
      }, 200);
    });
  }

  /**
   * Initiates the floating behavior of the pufferfish after its death.
   * The pufferfish will float upwards and to the left at a speed determined
   * by its current state. The floating speed slows down after a short delay.
   * Once the pufferfish is completely out of view, it is marked for removal.
   *
   * @method
   * @memberof Pufferfish
   * @returns {void}
   */
  startFloatingAfterDeath() {
    setInterval(() => {
      if (!this.hasStartedFloating) return;
      const floatSpeed = this.hasSlowedDown ? this.speed * 10 : this.speed * 20;
      this.y -= floatSpeed;
      this.x -= floatSpeed;
      if (!this.hasSlowedDown) {
        setTimeout(() => (this.hasSlowedDown = true), 400);
      }
      if (this.y + this.height < 0) this.markedForRemoval = true;
    }, 1000 / 60);
  }

  /**
   * Handles the reaction of the pufferfish when it is hit.
   * If the pufferfish is already dead, the method exits early.
   * Otherwise, it marks the pufferfish as dead and resets the current image index.
   */
  reactToHit() {
    if (this.dead) {
      return;
    } else {
      this.dead = true;
      this.currentImage = 0;
    }
  }

  /**
   * Plays the hurt sound effect for the pufferfish.
   * Ensures the sound is not played more than once per second.
   * Resets and pauses the sound after 1.3 seconds to prevent overlapping.
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
