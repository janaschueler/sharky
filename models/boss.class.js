/**
 * Represents the Boss enemy in the game.
 * Inherits from MovableObjects and introduces complex state management for
 * animation, attacking, damage handling, and death sequences.
 *
 * Key Features:
 * - Multi-phase animations (intro, hover, attack, hurt, dead)
 * - Interaction with the player and world context
 * - State flags for behavior control (first contact, returning, hurt, dead)
 * - Preloads all necessary image and audio assets on construction
 *
 * @param {Object} world - Reference to the game world instance
 */

class Boss extends MovableObjects {
  width = 350;
  height = this.width;
  y = -50;
  offset = {
    top: 120,
    left: 30,
    right: 50,
    bottom: 50,
  };
  world;
  firstContact = false;
  energy = 60;
  speed = 2;
  returning = false;
  hurtAnimationPlaying = false;
  isDead = false;
  lastHit = 0;

  IMAGES_INTRO = ["img/2.Enemy/3 Final Enemy/1.Introduce/1.png", "img/2.Enemy/3 Final Enemy/1.Introduce/2.png", "img/2.Enemy/3 Final Enemy/1.Introduce/3.png", "img/2.Enemy/3 Final Enemy/1.Introduce/4.png", "img/2.Enemy/3 Final Enemy/1.Introduce/5.png", "img/2.Enemy/3 Final Enemy/1.Introduce/6.png", "img/2.Enemy/3 Final Enemy/1.Introduce/7.png", "img/2.Enemy/3 Final Enemy/1.Introduce/8.png", "img/2.Enemy/3 Final Enemy/1.Introduce/9.png", "img/2.Enemy/3 Final Enemy/1.Introduce/10.png"];
  IMAGES_HOVER = ["img/2.Enemy/3 Final Enemy/2.floating/1.png", "img/2.Enemy/3 Final Enemy/2.floating/2.png", "img/2.Enemy/3 Final Enemy/2.floating/3.png", "img/2.Enemy/3 Final Enemy/2.floating/4.png", "img/2.Enemy/3 Final Enemy/2.floating/5.png", "img/2.Enemy/3 Final Enemy/2.floating/6.png", "img/2.Enemy/3 Final Enemy/2.floating/7.png", "img/2.Enemy/3 Final Enemy/2.floating/8.png", "img/2.Enemy/3 Final Enemy/2.floating/9.png", "img/2.Enemy/3 Final Enemy/2.floating/10.png", "img/2.Enemy/3 Final Enemy/2.floating/11.png", "img/2.Enemy/3 Final Enemy/2.floating/12.png", "img/2.Enemy/3 Final Enemy/2.floating/13.png"];
  IMAGES_TRANSITION = ["img/2.Enemy/3 Final Enemy/Attack/1.png", "img/2.Enemy/3 Final Enemy/Attack/2.png", "img/2.Enemy/3 Final Enemy/Attack/3.png", "img/2.Enemy/3 Final Enemy/Attack/4.png", "img/2.Enemy/3 Final Enemy/Attack/5.png", "img/2.Enemy/3 Final Enemy/Attack/6.png"];
  IMAGES_ATTACKING = this.IMAGES_TRANSITION;
  IMAGES_HURT = ["img/2.Enemy/3 Final Enemy/Hurt/1.png", "img/2.Enemy/3 Final Enemy/Hurt/2.png", "img/2.Enemy/3 Final Enemy/Hurt/3.png", "img/2.Enemy/3 Final Enemy/Hurt/4.png"];
  IMAGES_DEAD = ["img/2.Enemy/3 Final Enemy/Dead/2.png", "img/2.Enemy/3 Final Enemy/Dead/6.png", "img/2.Enemy/3 Final Enemy/Dead/7.png", "img/2.Enemy/3 Final Enemy/Dead/8.png", "img/2.Enemy/3 Final Enemy/Dead/9.png", "img/2.Enemy/3 Final Enemy/Dead/10.png"];
  AUDIO_ATTACK = new Audio("audio/wale_attack.mp3");

  /**
   * Creates an instance of the Boss class.
   *
   * @class
   * @extends SomeParentClass
   * @param {Object} world - The game world object that the boss interacts with.
   *
   * @property {Object} world - Reference to the game world.
   * @property {Object} audioStates - Stores the audio states for the boss.
   * @property {Object} imageCache - Cache for loaded images.
   * @property {string[]} IMAGES_INTRO - Array of image paths for the intro animation.
   * @property {string[]} IMAGES_HOVER - Array of image paths for the hover animation.
   * @property {string[]} IMAGES_TRANSITION - Array of image paths for the transition animation.
   * @property {string[]} IMAGES_ATTACKING - Array of image paths for the attacking animation.
   * @property {string[]} IMAGES_HURT - Array of image paths for the hurt animation.
   * @property {string[]} IMAGES_DEAD - Array of image paths for the dead animation.
   * @property {string} img - The current image being displayed.
   * @property {number} x - The x-coordinate position of the boss in the game world.
   *
   * @method loadImages - Loads an array of images into the image cache.
   * @method loadImage - Loads a single image into the image cache.
   */
  constructor(world) {
    super();
    this.world = world;
    this.audioStates = {};
    this.loadImages(this.IMAGES_INTRO);
    this.loadImages(this.IMAGES_HOVER);
    this.loadImages(this.IMAGES_TRANSITION);
    this.loadImages(this.IMAGES_ATTACKING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImage(this.IMAGES_INTRO[0]);
    this.img = this.imageCache[this.IMAGES_INTRO[0]];
    this.x = 2100;
  }

  /**
   * Starts the Boss's animation and behavior loop.
   * This method periodically updates the Boss's state based on energy, proximity, and world conditions.
   */
  animate() {
    let introIndex = 0;
    let reached1500 = false;
    setInterval(() => {
      if (this.world.character?.x >= 1500 && !reached1500) {
        reached1500 = true;
      }
      if (this.world.coins >= 2 && reached1500) {
        if (this.energy <= 0) {
          this.handleDeath();
        } else if (this.shouldReactToHit()) {
          this.handleHurt();
        } else if (this.shouldAttackWithoutCollision()) {
          this.handleAttackMovement();
        } else if (this.shouldAttackOnCollision()) {
          this.handleAttackContact();
        } else if (this.shouldPlayIntro(introIndex)) {
          this.playAnimation(this.IMAGES_INTRO);
          introIndex++;
          this.stopSound("attack", this.AUDIO_ATTACK);
        } else {
          this.playAnimation(this.IMAGES_HOVER);
          this.stopSound("attack", this.AUDIO_ATTACK);
        }
      }
    }, 200);
  }

  /**
   * Handles the death behavior of the boss character.
   * Sets the `isDead` property to `true` and ensures the death animation
   * is played only once. After the animation is complete, updates the image
   * to the last frame of the death animation and stops the attack sound.
   * If the death animation has already been played, the boss character
   * gradually moves downward until it reaches a specified position.
   */
  handleDeath() {
    this.isDead = true;
    if (!this.deadAnimationPlayed) {
      this.deadAnimationPlayed = true;
      this.playAnimationOnce(this.IMAGES_DEAD, () => {
        this.img = this.imageCache[this.IMAGES_DEAD.at(-1)];
        this.stopSound("attack", this.AUDIO_ATTACK);
      });
    } else {
      this.img = this.imageCache[this.IMAGES_DEAD.at(-1)];
      if (this.y < 250) this.y += 4;
    }
  }

  /**
   * Determines whether the boss should react to being hit.
   *
   * @returns {boolean} True if the boss should react to a hit, false otherwise.
   * The boss reacts to a hit if:
   * - It is currently in a "hurt" state.
   * - The world has at least 2 coins.
   * - The hurt animation is not already playing.
   */
  shouldReactToHit() {
    return this.isHurt() && this.world.coins >= 2 && !this.hurtAnimationPlaying;
  }

  /**
   * Handles the "hurt" state of the boss character.
   * This method triggers the hurt animation, plays it once, and then reverts
   * to the hover animation. It also stops the attack sound effect when the
   * hurt animation is completed.
   *
   * @method
   * @returns {void}
   */
  handleHurt() {
    this.hurtAnimationPlaying = true;
    this.playAnimationOnce(this.IMAGES_HURT, () => {
      this.hurtAnimationPlaying = false;
      this.playAnimation(this.IMAGES_HOVER);
      this.stopSound("attack", this.AUDIO_ATTACK);
    });
  }

  /**
   * Determines whether the boss should attack without collision.
   *
   * This method checks if the boss is in proximity to the target or is returning,
   * ensures that the world has at least 2 coins, and verifies that the boss is
   * not colliding with the character.
   *
   * @returns {boolean} Returns `true` if the boss should attack without collision, otherwise `false`.
   */
  shouldAttackWithoutCollision() {
    return (this.isInProximity() || this.returning) && this.world.coins >= 2 && !this.isColliding(this.world.character);
  }

  /**
   * Handles the attack movement of the boss character.
   * This method triggers the movement associated with an attack,
   * plays the attacking animation, and loops the attack sound effect.
   *
   * @method
   * @memberof Boss
   */
  handleAttackMovement() {
    this.movingAttack();
    this.playAnimation(this.IMAGES_ATTACKING);
    this.playLoopedSound("attack", this.AUDIO_ATTACK);
  }

  /**
   * Determines whether the boss should attack upon colliding with the character.
   *
   * @returns {boolean} Returns `true` if the boss is colliding with the character
   * and the world has at least 2 coins, otherwise `false`.
   */
  shouldAttackOnCollision() {
    return this.isColliding(this.world.character) && this.world.coins >= 2;
  }

  /**
   * Handles the contact during an attack.
   * Plays the attack animation and loops the attack sound effect.
   *
   * @method
   */
  handleAttackContact() {
    this.playAnimation(this.IMAGES_ATTACKING);
    this.playLoopedSound("attack", this.AUDIO_ATTACK);
  }

  /**
   * Determines whether the intro animation should play based on the character's position,
   * the current index of the intro images, and the number of coins collected.
   *
   * @param {number} i - The current index of the intro images.
   * @returns {boolean} - Returns `true` if the intro should play, otherwise `false`.
   */
  shouldPlayIntro(i) {
    return this.world.character?.x >= 1500 && i < this.IMAGES_INTRO.length && this.world.coins >= 2;
  }

  /**
   * Handles the movement logic for an attack sequence.
   * The object moves forward at a speed proportional to its `speed` property,
   * and then returns back once a certain position is reached.
   *
   * - Moves forward until `this.x` is less than or equal to 900, then switches to returning mode.
   * - Moves back until `this.x` is greater than or equal to 2100, then switches back to forward mode.
   *
   * Updates the `returning` and `otherDirection` flags to indicate the current movement state.
   */
  movingAttack() {
    const forwardSpeed = this.speed * 15;
    const returnSpeed = this.speed * 25;
    if (!this.returning) {
      this.x -= forwardSpeed;
      if (this.x <= 900) {
        this.returning = true;
        this.otherDirection = true;
      }
    } else {
      this.x += returnSpeed;
      if (this.x >= 2100) {
        this.returning = false;
        this.otherDirection = false;
      }
    }
  }

  /**
   * Handles the reaction of the boss character when it is hit.
   * Reduces the boss's energy by 20 if enough time has passed since the last hit.
   * If the energy drops to 0 or below, marks the boss as dead and resets the current image index.
   *
   * @returns {void} Does not return a value.
   */
  reactToHit() {
    const now = Date.now();
    if (this.isDead) return;
    if (now - this.lastHit < 1000) return;
    this.lastHit = now;
    this.energy -= 20;
    if (this.energy <= 0) {
      this.isDead = true;
      this.currentImage = 0;
    }
  }
}
