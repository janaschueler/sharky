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
  isAttackingAnimation = false;
  hasWon = false;
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
    this.keyPressAnimation();
    this.startBehaviorLoop();
    this.attackHandler = new SharkyAttack(this);
    this.movementHandler = new SharkyMovements(this);
  }

  /**
   * Starts a high-frequency loop that checks for keyboard input
   * and triggers corresponding movement or attack methods.
   *
   * @function
   * @memberof Sharky
   * @description
   * - Runs 60 times per second (approx. every 16.67ms).
   * - Processes user input to update Sharky's position, direction, and actions.
   * - Uses `SharkyMovements` to handle movement and animation logic.
   * - Stops processing if Sharky's energy is depleted.
   * - Updates the camera position to follow Sharky horizontally.
   * - Stops the bubble sound when the attack key (SPACE) is released.
   *
   * @example
   * sharky.keyPressAnimation(); // Starts movement handling loop
   */

  keyPressAnimation() {
    setInterval(() => {
      const k = this.world.keyboard;
      if (this.energy <= 0 || this.hasWon) return;
      if (this.movementHandler.anyKeyPress(k)) this.movementHandler.anyKeyPressMethod();
      if (this.movementHandler.swimRight(k)) this.movementHandler.swimRightMethod();
      if (this.movementHandler.swimLeft(k)) this.movementHandler.swimLeftMethod();
      if (this.movementHandler.swimUpRight(k)) this.movementHandler.swimUpRightMethod();
      if (this.movementHandler.swimUpLeft(k)) this.movementHandler.swimUpLeftMethod();
      if (this.movementHandler.swimDownRight(k)) this.movementHandler.swimDownRightMethod();
      if (this.movementHandler.swimDownLeft(k)) this.movementHandler.swimDownLeftMethod();
      if (this.movementHandler.attack(k)) this.movementHandler.attackMethod();
      if (!k.SPACE) this.stopSound("bubble", this.AUDIO_BUBBLE);
      this.world.camera_x = -this.x + 60;
    }, 1000 / 60);
  }

  /**
   * Starts a periodic behavior check loop that handles Sharky's current state,
   * including sleep, idle, hurt, swimming, or death animations.
   *
   * @function
   * @memberof Sharky
   * @description
   * - Runs every 200ms (5 times per second).
   * - Determines Sharky's current behavioral state based on activity and health.
   * - Handles transitions between different states:
   *   - Sleeping if idle for over 15 seconds.
   *   - Playing death animation if energy reaches 0.
   *   - Reacting to hurt state.
   *   - Idling or swimming if active.
   * - Delegates animation logic to helper methods or movement handler.
   */
  startBehaviorLoop() {
    setInterval(() => {
      const now = Date.now();
      const shouldSleep = now - this.lastActionTime > 15000 && !this.isDead && !this.isSleeping && !this.fallingAsleepStarted;
      if (shouldSleep) this.fallingAsleep();
      if (this.energy <= 0 && !this.hasPlayedDeathAnimation) return this.deathAnimationMethod();
      if (this.isDead || this.hasWon) return;
      if (!this.isDead && this.isHurt()) return this.commenceHurtAnimation();
      if (this.isSleeping && !this.isDead && !this.isHurt()) this.fallingAsleep();
      else if (this.isIdle() && !this.isDead && !this.isHurt()) this.handleIdle();
      else this.commenceSwim();
    }, 200);
  }

  /**
   * Initiates the death animation for the sharky character.
   * This method triggers the playback of the character's death animation
   * and immediately returns, indicating the start of the death sequence.
   *
   * @returns {void}
   */
  deathAnimationMethod() {
    this.playDeathAnimation();
    return;
  }

  /**
   * Initiates the hurt animation for the sharky character.
   * Determines the appropriate hurt animation based on the source of damage (Jellyfish or poison),
   * interrupts any ongoing sleep state, and plays the corresponding animation.
   * Also ensures the character is not marked as isSleeping.
   *
   * @returns {void}
   */
  commenceHurtAnimation() {
    this.interruptSleep();
    const hurtImages = this.lastHurtBy instanceof Jellyfish ? this.IMAGES_HURT_ELECTRIC : this.IMAGES_HURT_POISON;
    this.playAnimation(hurtImages);
    this.isSleeping = false;
    return;
  }

  /**
   * Interrupts sleep and triggers the swimming animation.
   */
  commenceSwim() {
    this.interruptSleep();
    this.handleSwim();
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
    this.interruptSleep();
    this.stopAllAnimations();
    if (this.hasPlayedDeathAnimation) return;
    const deathImages = this.lastHurtBy instanceof Jellyfish ? this.IMAGES_DEAD_ELECTROSHOCK : this.IMAGES_DEAD;
    this.hasPlayedDeathAnimation = true;
    this.isDead = true;
    this.isSleeping = false;
    this.playAnimationOnce(deathImages, () => {
      this.startFloatingAfterDeath();
      this.triggerGameOver(deathImages);
    });
  }

  /**
   * Stops all ongoing animations for the Sharky instance.
   * Clears any active animation intervals and resets the animation state.
   *
   * - Stops the ping-pong animation interval if active.
   * - Stops the main animation interval if active.
   * - Resets the world's `currentlyPlayingOnce` flag to false.
   */
  stopAllAnimations() {
    clearInterval(this.pingPongInterval);
    clearInterval(this.animationInterval);
    this.world.currentlyPlayingOnce = false;
  }

  /**
   * Initiates a floating animation for the object after its death.
   * The object will move downward by incrementing its `y` position until it reaches a specified limit (y < 280).
   * The movement occurs at approximately 60 frames per second.
   * Once the object reaches the limit, the floating animation stops automatically.
   */
  startFloatingAfterDeath() {
    this.floatInterval = setInterval(() => {
      if (this.y < 280) this.y += 1.5;
      else clearInterval(this.floatInterval);
    }, 1000 / 60);
  }

  /**
   * Triggers the game over sequence by updating the shark's image to the last frame
   * in the death animation and displaying the game over screen if it hasn't been shown yet.
   *
   * @param {string[]} deathImages - An array of image paths representing the death animation frames.
   */
  triggerGameOver(deathImages) {
    this.img = this.imageCache[deathImages[deathImages.length - 1]];
    if (!this.world.endGame.gameOverShown) this.world.endGame.triggerGameOverScreen();
  }

  /**
   * Initiates the process of the shark falling asleep.
   * Sets the `fallingAsleepStarted` and `isSleeping` flags to `true`.
   * Plays the falling asleep animation once, and upon completion,
   * starts a ping-pong animation for isSleeping and loops a sleeping sound.
   */
  fallingAsleep() {
    if (this.isDead || this.hasWon || this.fallingAsleepStarted) return;
    this.fallingAsleepStarted = true;
    this.playAnimationOnce(this.IMAGES_FALLING_A_SLEEP, () => {
      if (this.isDead) return;
      this.isSleeping = true;
      this.playPingPongAnimation(this.IMAGES_SLEEP);
      this.playLoopedSound("sleep", this.AUDIO_SLEEP);
    });
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
    this.AUDIO_BUBBLE.volume = 0.05;
    this.AUDIO_FIN_SLAP.volume = 0.3;
    this.AUDIO_SLEEP.volume = 0.2;
    this.AUDIO_NO_POISON.volume = 1;
  }

  /**
   * Interrupts the sleep state of the object.
   * If the object is currently sleeping, this method will:
   * - Set the `isSleeping` state to `false`.
   * - Reset the `fallingAsleepStarted` flag.
   * - Clear the interval associated with the `pingPongInterval`.
   * - Stop the "sleep" sound using the provided audio reference.
   * - Reset the sleep-related properties of the object.
   */
  interruptSleep() {
    this.resetSleep();

    if (this.isSleeping || this.fallingAsleepStarted) {
      this.isSleeping = false;
      this.fallingAsleepStarted = false;
      clearInterval(this.pingPongInterval);
      this.stopSound("sleep", this.AUDIO_SLEEP);
      this.stopAllAnimations();
    }
  }

  /**
   * Stops all ongoing loops and sounds related to the game state.
   * Sets the win condition, interrupts any sleep timers, and stops all active sound effects.
   *
   * @method
   */
  stopAllLoops() {
    this.hasWon = true;
    this.interruptSleep();
    this.stopSound("bubble", this.AUDIO_BUBBLE);
    this.stopSound("fin-slap", this.AUDIO_FIN_SLAP);
    this.stopSound("sleep", this.AUDIO_SLEEP);
  }

  /**
   * Plays the provided audio element from the beginning.
   * If the audio is already playing, it will be paused and reset before playing again.
   *
   * @param {HTMLAudioElement} audio - The audio element to play. If falsy, the function does nothing.
   */
  playSound(audio) {
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    audio.play();
  }
}
