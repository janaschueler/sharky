/**
 * The `Sharky` class represents a shark character in a game, inheriting from `MovableObjects`.
 * It manages the shark's animations, movements, attacks, sleep state, and interactions with the game world.
 *
 * @class Sharky
 * @extends MovableObjects
 *
 * @property {number} width - The width of the shark character.
 * @property {number} height - The height of the shark character.
 * @property {number} y - The vertical position of the shark character.
 * @property {number} speed - The movement speed of the shark character.
 * @property {Object} offset - The collision offset for the shark character.
 * @property {Object} world - The game world object the shark interacts with.
 * @property {Object} audioStates - Stores the states of various audio elements.
 * @property {number} lastActionTime - Timestamp of the last action performed by the shark.
 * @property {boolean} isSleeping - Indicates whether the shark is currently sleeping.
 * @property {boolean} isDead - Indicates whether the shark is dead.
 * @property {number} lastFinSlapTime - Timestamp of the last fin slap attack.
 * @property {number} finSlapCooldown - Cooldown time for the fin slap attack in milliseconds.
 * @property {number} lastAttackTime - Timestamp of the last attack performed.
 * @property {number} attackCooldown - Cooldown time for attacks in milliseconds.
 * @property {boolean} sleeping - Indicates whether the shark is in a sleeping state.
 * @property {boolean} isAttackingAnimation - Indicates whether an attack animation is currently playing.
 * @property {string[]} IMAGES_HOVER - Array of image paths for the hover animation.
 * @property {string[]} IMAGES_FALLING_A_SLEEP - Array of image paths for the falling asleep animation.
 * @property {string[]} IMAGES_SLEEP - Array of image paths for the sleeping animation.
 * @property {string[]} IMAGES_SWIM - Array of image paths for the swimming animation.
 * @property {string[]} IMAGES_ATTACK_BUBBLE - Array of image paths for the bubble attack animation.
 * @property {string[]} IMAGES_ATTACK_FIN - Array of image paths for the fin slap attack animation.
 * @property {string[]} IMAGES_ATTACK_BUBBLE_POISON - Array of image paths for the poison bubble attack animation.
 * @property {string[]} IMAGES_HURT_POISON - Array of image paths for the hurt (poisoned) animation.
 * @property {string[]} IMAGES_HURT_ELECTRIC - Array of image paths for the hurt (electric shock) animation.
 * @property {string[]} IMAGES_DEAD - Array of image paths for the death (poisoned) animation.
 * @property {string[]} IMAGES_DEAD_ELECTROSHOCK - Array of image paths for the death (electroshock) animation.
 * @property {Audio} AUDIO_NO_POISON - Audio element for the "no poison" sound.
 * @property {Audio} AUDIO_FIN_SLAP - Audio element for the fin slap sound.
 * @property {Audio} AUDIO_BUBBLE - Audio element for the bubble attack sound.
 * @property {Audio} AUDIO_SLEEP - Audio element for the sleeping sound.
 *
 * @constructor
 * @param {Object} world - The game world object that the Sharky instance interacts with.
 *
 * @description
 * - Loads images for animations and initializes audio elements.
 * - Sets up the shark's properties, including dimensions, speed, and offsets.
 * - Starts the animation process and sets audio volumes.
 *
 * @example
 * const sharky = new Sharky(world);
 * sharky.animate();
 */
class Sharky extends MovableObjects {
  width = 200;
  height = 200;
  y = 100;
  speed = 10;
  offset = {
    top: 90,
    left: +40,
    right: 30,
    bottom: +50,
  };
  world;
  audioStates = {};
  lastActionTime = Date.now();
  isSleeping = false;
  isDead = false;
  lastFinSlapTime = 0;
  finSlapCooldown = 500;
  lastAttackTime = 0;
  attackCooldown = 1000; // 1 Sekunde Cooldown
  sleeping = false;
  isAttackingAnimation = false;
  IMAGES_HOVER = ["img/1.Sharkie/1.IDLE/1.png", "img/1.Sharkie/1.IDLE/2.png", "img/1.Sharkie/1.IDLE/3.png", "img/1.Sharkie/1.IDLE/4.png", "img/1.Sharkie/1.IDLE/5.png", "img/1.Sharkie/1.IDLE/6.png", "img/1.Sharkie/1.IDLE/7.png", "img/1.Sharkie/1.IDLE/8.png", "img/1.Sharkie/1.IDLE/9.png", "img/1.Sharkie/1.IDLE/10.png", "img/1.Sharkie/1.IDLE/11.png", "img/1.Sharkie/1.IDLE/12.png", "img/1.Sharkie/1.IDLE/13.png", "img/1.Sharkie/1.IDLE/14.png", "img/1.Sharkie/1.IDLE/15.png", "img/1.Sharkie/1.IDLE/16.png", "img/1.Sharkie/1.IDLE/17.png", "img/1.Sharkie/1.IDLE/18.png"];
  IMAGES_FALLING_A_SLEEP = ["img/1.Sharkie/2.Long_IDLE/i1.png", "img/1.Sharkie/2.Long_IDLE/I2.png", "img/1.Sharkie/2.Long_IDLE/I3.png", "img/1.Sharkie/2.Long_IDLE/I4.png", "img/1.Sharkie/2.Long_IDLE/I5.png", "img/1.Sharkie/2.Long_IDLE/I6.png", "img/1.Sharkie/2.Long_IDLE/I7.png"];
  IMAGES_SLEEP = ["img/1.Sharkie/2.Long_IDLE/I8.png", "img/1.Sharkie/2.Long_IDLE/I9.png", "img/1.Sharkie/2.Long_IDLE/I10.png", "img/1.Sharkie/2.Long_IDLE/I11.png", "img/1.Sharkie/2.Long_IDLE/I12.png", "img/1.Sharkie/2.Long_IDLE/I13.png", "img/1.Sharkie/2.Long_IDLE/I14.png"];
  IMAGES_SWIM = ["img/1.Sharkie/3.Swim/1.png", "img/1.Sharkie/3.Swim/2.png", "img/1.Sharkie/3.Swim/3.png", "img/1.Sharkie/3.Swim/4.png", "img/1.Sharkie/3.Swim/5.png", "img/1.Sharkie/3.Swim/6.png"];
  IMAGES_ATTACK_BUBBLE = ["img/1.Sharkie/4.Attack/Bubble trap/op1/1.png", "img/1.Sharkie/4.Attack/Bubble trap/op1/2.png", "img/1.Sharkie/4.Attack/Bubble trap/op1/3.png", "img/1.Sharkie/4.Attack/Bubble trap/op1/4.png", "img/1.Sharkie/4.Attack/Bubble trap/op1/5.png", "img/1.Sharkie/4.Attack/Bubble trap/op1/6.png", "img/1.Sharkie/4.Attack/Bubble trap/op1/7.png", "img/1.Sharkie/4.Attack/Bubble trap/op1/8.png"];
  IMAGES_ATTACK_FIN = ["img/1.Sharkie/4.Attack/Fin slap/1.png", "img/1.Sharkie/4.Attack/Fin slap/2.png", "img/1.Sharkie/4.Attack/Fin slap/3.png", "img/1.Sharkie/4.Attack/Fin slap/4.png", "img/1.Sharkie/4.Attack/Fin slap/5.png", "img/1.Sharkie/4.Attack/Fin slap/6.png", "img/1.Sharkie/4.Attack/Fin slap/7.png", "img/1.Sharkie/4.Attack/Fin slap/8.png"];
  IMAGES_ATTACK_BUBBLE_POISON = ["img/1.Sharkie/4.Attack/Bubble trap/For Whale/1.png", "img/1.Sharkie/4.Attack/Bubble trap/For Whale/2.png", "img/1.Sharkie/4.Attack/Bubble trap/For Whale/3.png", "img/1.Sharkie/4.Attack/Bubble trap/For Whale/4.png", "img/1.Sharkie/4.Attack/Bubble trap/For Whale/5.png", "img/1.Sharkie/4.Attack/Bubble trap/For Whale/6.png", "img/1.Sharkie/4.Attack/Bubble trap/For Whale/7.png", "img/1.Sharkie/4.Attack/Bubble trap/For Whale/8.png"];
  IMAGES_HURT_POISON = ["img/1.Sharkie/5.Hurt/1.Poisoned/1.png", "img/1.Sharkie/5.Hurt/1.Poisoned/2.png", "img/1.Sharkie/5.Hurt/1.Poisoned/3.png", "img/1.Sharkie/5.Hurt/1.Poisoned/4.png", "img/1.Sharkie/5.Hurt/1.Poisoned/5.png"];
  IMAGES_HURT_ELECTRIC = ["img/1.Sharkie/5.Hurt/2.Electric shock/o1.png", "img/1.Sharkie/5.Hurt/2.Electric shock/o2.png", "img/1.Sharkie/5.Hurt/2.Electric shock/1.png", "img/1.Sharkie/5.Hurt/2.Electric shock/2.png", "img/1.Sharkie/5.Hurt/2.Electric shock/3.png"];
  IMAGES_DEAD = ["img/1.Sharkie/6.dead/1.Poisoned/1.png", "img/1.Sharkie/6.dead/1.Poisoned/2.png", "img/1.Sharkie/6.dead/1.Poisoned/3.png", "img/1.Sharkie/6.dead/1.Poisoned/4.png", "img/1.Sharkie/6.dead/1.Poisoned/5.png", "img/1.Sharkie/6.dead/1.Poisoned/6.png", "img/1.Sharkie/6.dead/1.Poisoned/7.png", "img/1.Sharkie/6.dead/1.Poisoned/8.png", "img/1.Sharkie/6.dead/1.Poisoned/9.png", "img/1.Sharkie/6.dead/1.Poisoned/10.png", "img/1.Sharkie/6.dead/1.Poisoned/11.png", "img/1.Sharkie/6.dead/1.Poisoned/12.png"];
  IMAGES_DEAD_ELECTROSHOCK = ["img/1.Sharkie/6.dead/2.Electro_shock/1.png", "img/1.Sharkie/6.dead/2.Electro_shock/2.png", "img/1.Sharkie/6.dead/2.Electro_shock/3.png", "img/1.Sharkie/6.dead/2.Electro_shock/4.png", "img/1.Sharkie/6.dead/2.Electro_shock/5.png", "img/1.Sharkie/6.dead/2.Electro_shock/6.png", "img/1.Sharkie/6.dead/2.Electro_shock/7.png", "img/1.Sharkie/6.dead/2.Electro_shock/8.png", "img/1.Sharkie/6.dead/2.Electro_shock/9.png", "img/1.Sharkie/6.dead/2.Electro_shock/10.png", "img/1.Sharkie/6.dead/2.Electro_shock/10.png", "img/1.Sharkie/6.dead/2.Electro_shock/10.png"];
  AUDIO_NO_POISON = new Audio("audio/no_poison.mp3");
  AUDIO_FIN_SLAP = new Audio("audio/fin-slap.mp3");
  AUDIO_BUBBLE = new Audio("audio/blow-Attack.mp3");
  AUDIO_SLEEP = new Audio("audio/sleep.mp3");

  /**
   * Creates an instance of the Sharky class.
   * Initializes the world, loads various image sets for animations,
   * sets audio volumes, and starts the animation process.
   *
   * @param {Object} world - The game world object that the Sharky instance interacts with.
   */
  constructor(world) {
    super();
    this.world = world;
    this.loadImage(this.IMAGES_HOVER[0]);
    this.loadImages(this.IMAGES_HOVER);
    this.loadImages(this.IMAGES_FALLING_A_SLEEP);
    this.loadImages(this.IMAGES_SLEEP);
    this.loadImages(this.IMAGES_SWIM);
    this.loadImages(this.IMAGES_ATTACK_BUBBLE);
    this.loadImages(this.IMAGES_ATTACK_BUBBLE_POISON);
    this.loadImages(this.IMAGES_ATTACK_FIN);
    this.loadImages(this.IMAGES_HURT_POISON);
    this.loadImages(this.IMAGES_HURT_ELECTRIC);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_DEAD_ELECTROSHOCK);
    this.setAudioVolumes();
    this.animate();
    this.attackHandler = new SharkyAttack(this);
  }

  /**
   * Animates the shark character by handling movement, actions, and animations.
   * This function uses two intervals:
   * - One for updating the character's position and state based on keyboard input.
   * - Another for handling animations, sleep state, and other behaviors.
   *
   * @function
   * @memberof Sharky
   * @description
   * - Handles movement in all directions (left, right, up, down) based on keyboard input.
   * - Updates the camera position relative to the character's position.
   * - Manages attack state when the spacebar is pressed.
   * - Plays animations for swimming, idle, sleeping, and being hurt.
   * - Handles sleep state when the character is idle for a certain period.
   * - Plays death animation when energy is depleted.
   * - Stops or plays appropriate sounds based on the character's actions.
   */
  animate() {
    setInterval(() => {
      const k = this.world.keyboard;
      if (this.energy <= 0) return;
      if (k.LEFT || k.RIGHT || k.UP || k.DOWN || k.SPACE || k.D) {
        this.stopSound("sleep", this.AUDIO_SLEEP);
        this.resetSleep();
      }
      if (k.RIGHT && this.x < this.world.level.level_end_x) {
        this.x += this.speed;
        this.otherDirection = false;
        this.swimUp = false;
        this.swimDown = false;
      }
      if (k.LEFT && this.x > -1300) {
        this.x -= this.speed;
        this.otherDirection = true;
      }
      if (k.UP && this.otherDirection === false && this.x > -1300 && this.x < this.world.level.level_end_x && this.y > -80) {
        this.x += this.speed / 3;
        this.y -= this.speed / 1.2;
        this.swimUp = true;
        this.swimDown = false;
      }
      if (k.UP && this.otherDirection === true && this.x > -1300 && this.x < 2000 && this.y > -80) {
        this.x -= this.speed / 3;
        this.y -= this.speed / 1.2;
        this.swimUp = true;
        this.swimDown = false;
      }
      if (k.DOWN && this.otherDirection === false && this.x > -1300 && this.x < this.world.level.level_end_x && this.y < 300) {
        this.x += this.speed / 3;
        this.y += this.speed / 1.2;
        this.swimDown = true;
        this.swimUp = false;
      }
      if (k.DOWN && this.otherDirection === true && this.x > -1300 && this.x < 2000 && this.y < 300) {
        this.x -= this.speed / 3;
        this.y += this.speed / 1.2;
        this.swimDown = true;
        this.swimUp = false;
      }
      if (k.SPACE || k.D) {
        this.interruptSleep();
        this.attackHandler.handleAttackAnimation();
      }
      this.isAttacking = k.SPACE;
      if (!k.SPACE) {
        this.stopSound("bubble", this.AUDIO_BUBBLE);
      }
      this.world.camera_x = -this.x + 60;
    }, 1000 / 60);

    setInterval(() => {
      const now = Date.now();
      this.isSleeping = now - this.lastActionTime > 15000 && !this.isDead;
      if (this.energy <= 0) {
        this.playDeathAnimation();
        return;
      }
      if (this.isHurt()) {
        this.interruptSleep();
        const hurtImages = this.lastHurtBy instanceof Jellyfish ? this.IMAGES_HURT_ELECTRIC : this.IMAGES_HURT_POISON;
        this.playAnimation(hurtImages);
        this.sleeping = false;
        return;
      }
      if (this.isSleeping && !this.isDead && !this.isHurt()) {
        if (!this.fallingAsleepStarted) {
          this.fallingAsleep();
        }
      } else if (this.isIdle()) {
        if (this.isDead) return;
        this.interruptSleep();
        this.handleIdle();
      } else {
        this.interruptSleep();
        this.handleSwim();
      }
    }, 200);
  }

  /**
   * Plays the death animation for the sharky character.
   * Determines the appropriate death animation based on the last entity that hurt the character.
   * Interrupts any ongoing sleep state and ensures the animation is played only once.
   * If the animation has already been played, updates the character's image and position.
   *
   * @method playDeathAnimation
   * @memberof Sharky
   */
  playDeathAnimation() {
    const deathImages = this.lastHurtBy instanceof Jellyfish ? this.IMAGES_DEAD_ELECTROSHOCK : this.IMAGES_DEAD;
    this.interruptSleep();
    if (!this.hasPlayedDeathAnimation) {
      this.hasPlayedDeathAnimation = true;
      this.isDead = true;
      this.sleeping = false;
      this.playAnimationOnce(deathImages, () => {
        this.triggerGameOver(deathImages);
      });
    } else {
      this.img = this.imageCache[deathImages[deathImages.length - 1]];
      if (this.y < 280) this.y += 5;
    }
  }

  /**
   * Triggers the game over sequence by updating the shark's image to the last frame
   * in the death animation and displaying the game over screen if it hasn't been shown yet.
   *
   * @param {string[]} deathImages - An array of image paths representing the death animation frames.
   */
  triggerGameOver(deathImages) {
    this.img = this.imageCache[deathImages[deathImages.length - 1]];
    if (!this.world.gameOverShown) {
      this.world.gameOverShown = true;
      this.world.triggerGameOverScreen();
    }
  }

  /**
   * Initiates the process of the shark falling asleep.
   * Sets the `fallingAsleepStarted` and `sleeping` flags to `true`.
   * Plays the falling asleep animation once, and upon completion,
   * starts a ping-pong animation for sleeping and loops a sleeping sound.
   */
  fallingAsleep() {
    if (this.isDead) return;
    this.fallingAsleepStarted = true;
    this.sleeping = true;
    if (this.sleeping) {
      this.playAnimationOnce(this.IMAGES_FALLING_A_SLEEP, () => {
        this.playPingPongAnimation(this.IMAGES_SLEEP);
        this.playLoopedSound("sleep", this.AUDIO_SLEEP);
      });
    }
  }

  /**
   * Checks if the object is idle by verifying that no directional keys are being pressed.
   *
   * @returns {boolean} Returns `true` if none of the directional keys (LEFT, RIGHT, UP, DOWN) are pressed, otherwise `false`.
   */
  isIdle() {
    const k = this.world.keyboard;
    return !k.LEFT && !k.RIGHT && !k.UP && !k.DOWN;
  }

  /**
   * Handles the idle state of the sharky object.
   * Plays the hover animation and resets swimming directions.
   *
   * @method handleIdle
   */
  handleIdle() {
    if (this.world.currentlyPlayingOnce) return;
    this.playAnimation(this.IMAGES_HOVER);
    this.swimUp = false;
    this.swimDown = false;
  }

  /**
   * Handles the swimming animation for the sharky object.
   * This method triggers the playAnimation function with the swimming images.
   */
  handleSwim() {
    if (this.world.currentlyPlayingOnce) return;
    this.playAnimation(this.IMAGES_SWIM);
  }

  /**
   * Resets the sleep state of the object.
   * - Updates the last action time to the current timestamp.
   * - Stops the falling asleep process.
   * - Clears the interval associated with the ping-pong mechanism.
   */
  resetSleep() {
    this.lastActionTime = Date.now();
    this.fallingAsleepStarted = false;
    clearInterval(this.pingPongInterval);
  }

  /**
   * Sets the volume levels for various audio elements associated with the sharky object.
   * Adjusts the volume for bubble sounds, fin slap sounds, sleep sounds, and no poison sounds.
   *
   * @method
   */
  setAudioVolumes() {
    this.AUDIO_BUBBLE.volume = 0.1;
    this.AUDIO_FIN_SLAP.volume = 0.5;
    this.AUDIO_SLEEP.volume = 0.2;
    this.AUDIO_NO_POISON.volume = 1;
  }

  /**
   * Interrupts the sleep state of the object.
   * If the object is currently sleeping, this method will:
   * - Set the `sleeping` state to `false`.
   * - Reset the `fallingAsleepStarted` flag.
   * - Clear the interval associated with the `pingPongInterval`.
   * - Stop the "sleep" sound using the provided audio reference.
   * - Reset the sleep-related properties of the object.
   */
  interruptSleep() {
    if (this.sleeping) {
      this.sleeping = false;
      this.fallingAsleepStarted = false;
      clearInterval(this.pingPongInterval);
      this.stopSound("sleep", this.AUDIO_SLEEP);
      this.resetSleep();
    }
  }
}
