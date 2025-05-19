/**
 * The `Sharky` class represents a shark character in a game, inheriting from `MovableObjects`.
 * It manages the shark's animations, movements, attacks, sleep state, and interactions with the game world.
 *
 * @class Sharky
 * @extends MovableObjects
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
  isAttackingBubble = false;
  stopReactionInterval = false;
  preventIdle = false;
  preventSwim = false;
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
   */
  // animate() {
  //   let intervalSharkyKey = setInterval(() => {
  //     clearInterval(intervalSharkyReaction);
  //     this.keyPressAnimation();
  //     this.stopReactionInterval = false;
  //   }, 1000 / 60);
  //   let intervalSharkyReaction = setInterval(() => {
  //     clearInterval(intervalSharkyKey);
  //     if (this.stopReactionInterval) return;
  //     this.checkSleepingState();
  //     if (this.energy <= 0) return this.playDeathAnimation();
  //     if (this.isHurt()) return this.startHurtAnimation();
  //     if (this.isSleeping && !this.isDead && !this.isHurt()) {
  //       this.startSleeping();
  //     } else if (this.isIdle()) {
  //       this.startIdle();
  //     } else {
  //       this.attackHandler.interruptSleep();
  //       this.handleSwim();
  //     }
  //   }, 200);
  // }

  animate() {
    let intervalSharkyKey = setInterval(() => {
      // clearInterval(intervalSharkyReaction);
      this.keyPressAnimation();
      this.stopReactionInterval = false;
    }, 1000 / 60);
    let intervalSharkyReaction = setInterval(() => {
      if (this.stopReactionInterval) return;
      this.checkSleepingState();
      if (this.energy <= 0) return this.playDeathAnimation();
      if (this.isHurt()) return this.startHurtAnimation();
      if (this.isSleeping && !this.isDead && !this.isHurt()) {
        this.startSleeping();
      } else if (this.isIdle()) {
        this.startIdle();
      } else {
        this.attackHandler.interruptSleep();
        this.handleSwim();
      }
    }, 200);
  }

  /**
   * Handles the key press animations and interactions for the shark character.
   *
   * - Checks the direction of movement based on keyboard input.
   * - Triggers attack animations and sound effects when the SPACE or D key is pressed.
   * - Stops the bubble sound effect when the SPACE key is released.
   * - Updates the camera position relative to the shark's position.
   *
   * @returns {void} This method does not return a value.
   */
  keyPressAnimation() {
    this.stopReactionInterval = true;
    const k = this.world.keyboard;
    if (this.energy <= 0) return;
    this.checkDirection(k);
    if (k.SPACE || k.D) {
      this.attackHandler.interruptSleep();
      this.attackHandler.handleAttackAnimation();
      this.stopAnimation();
    }
    this.isAttacking = k.SPACE;
    if (!k.SPACE) {
      this.stopSound("bubble", this.AUDIO_BUBBLE);
    }
    this.world.camera_x = -this.x + 60;
  }

  /**
   * Checks the direction of movement based on the provided key inputs and updates the object's position and animation accordingly.
   *
   * @param {Object} k - An object representing the key inputs.
   * @param {boolean} k.LEFT - Indicates if the left key is pressed.
   * @param {boolean} k.RIGHT - Indicates if the right key is pressed.
   * @param {boolean} k.UP - Indicates if the up key is pressed.
   * @param {boolean} k.DOWN - Indicates if the down key is pressed.
   * @param {boolean} k.SPACE - Indicates if the space key is pressed.
   *
   * @description
   * - Resets the animation if any of the specified keys are pressed.
   * - Moves the object to the right if the right key is pressed and within the level boundaries.
   * - Moves the object to the left if the left key is pressed and within the allowed range.
   * - Moves the object vertically upwards if the up key is pressed, within the specified x and y boundaries.
   * - Moves the object vertically downwards if the down key is pressed, within the specified x and y boundaries.
   */
  checkDirection(k) {
    if (k.LEFT || k.RIGHT || k.UP || k.DOWN || k.SPACE || k.D) {
      // || k.SPACE || k.D
      this.attackHandler.resetAnimation();
    }
    if (k.RIGHT && this.x < this.world.level.level_end_x) {
      this.swimRight();
    }
    if (k.LEFT && this.x > -1300) {
      this.swimLeft();
    }
    if (k.UP && this.x > -1300 && this.x < Math.min(this.world.level.level_end_x, 2000) && this.y > -80) {
      this.moveVertically("up", this.otherDirection);
    }
    if (k.DOWN && this.x > -1300 && this.x < Math.min(this.world.level.level_end_x, 2000) && this.y < 300) {
      this.moveVertically("down", this.otherDirection);
    }
  }

  /**
   * Moves the object to the left by decreasing its `x` position
   * based on the current speed. Also sets the `otherDirection`
   * property to `true` to indicate the object is facing left.
   */
  swimLeft() {
    this.x -= this.speed;
    this.otherDirection = true;
  }

  /**
   * Moves the shark to the right by increasing its x-coordinate by its speed.
   * Sets the direction flags to indicate the shark is swimming to the right.
   */
  swimRight() {
    this.x += this.speed;
    this.otherDirection = false;
    this.swimUp = false;
    this.swimDown = false;
  }

  /**
   * Moves the object vertically in the specified direction, with an optional modifier
   * for reversing the horizontal movement.
   *
   * @param {string} direction - The direction to move vertically, either "up" or "down".
   * @param {boolean} isOtherDirection - If true, reverses the horizontal movement direction.
   */
  moveVertically(direction, isOtherDirection) {
    const modifier = isOtherDirection ? -1 : 1;
    if (direction === "up") {
      this.x += (this.speed / 3) * modifier;
      this.y -= this.speed / 1.2;
      this.swimUp = true;
      this.swimDown = false;
    } else if (direction === "down") {
      this.x += (this.speed / 3) * modifier;
      this.y += this.speed / 1.2;
      this.swimDown = true;
      this.swimUp = false;
    }
  }

  /**
   * Checks and updates the sleeping state of the object.
   * Determines if the object should be marked as sleeping based on the time elapsed
   * since the last action and whether the object is not dead.
   *
   * @returns {void}
   */
  checkSleepingState() {
    const now = Date.now();
    this.isSleeping = now - this.lastActionTime > 15000 && !this.isDead;
  }

  /**
   * Initiates the sleeping process for the object.
   * If the falling asleep process has not started yet, it triggers the `fallingAsleep` method.
   */
  startSleeping() {
    if (!this.fallingAsleepStarted) {
      this.stopIdle();
      this.fallingAsleep();
    }
  }

  /**
   * Initiates the idle state for the object unless it is marked as dead.
   * If the object is sleeping, it interrupts the sleep state before handling the idle behavior.
   *
   * @returns {void}
   */
  startIdle() {
    if (this.isDead || this.preventIdle) return;
    this.attackHandler.interruptSleep();
    this.handleIdle();
  }

  stopIdle() {
    this.preventIdle = true;
  }

  allowIdle() {
    this.preventIdle = false;
  }

  /**
   * Triggers the hurt animation for the object, determining the appropriate
   * animation sequence based on the type of object that caused the damage.
   * If the object was hurt by a jellyfish, it plays the electric hurt animation;
   * otherwise, it plays the poison hurt animation. This method also ensures
   * that the object is not in a sleeping state during the animation.
   *
   * @returns {void}
   */
  startHurtAnimation() {
    this.attackHandler.interruptSleep();
    const hurtImages = this.lastHurtBy instanceof Jellyfish ? this.IMAGES_HURT_ELECTRIC : this.IMAGES_HURT_POISON;
    this.startAnimation(hurtImages);
    this.sleeping = false;
    return;
  }

  /**
   * Checks if the sharky character is currently hurt.
   * The method checks if the last entity that hurt the character is not null.
   *
   * @returns {boolean} Returns `true` if the sharky character is hurt, otherwise `false`.
   */

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
    this.attackHandler.interruptSleep();
    if (!this.hasPlayedDeathAnimation) {
      this.hasPlayedDeathAnimation = true;
      this.isDead = true;
      this.sleeping = false;
      this.startAnimation(deathImages, () => {
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
      this.startAnimation(this.IMAGES_FALLING_A_SLEEP, () => {
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
    return !k.LEFT && !k.RIGHT && !k.UP && !k.DOWN && !k.SPACE && !k.D;
  }

  /**
   * Handles the idle state of the sharky object.
   * Plays the hover animation and resets swimming directions.
   *
   * @method handleIdle
   */
  handleIdle() {
    this.startAnimation(this.IMAGES_HOVER);
    this.swimUp = false;
    this.swimDown = false;
  }

  /**
   * Handles the swimming animation for the sharky object.
   * This method triggers the startAnimation function with the swimming images.
   */
  handleSwim() {
    this.startAnimation(this.IMAGES_SWIM);
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
}
