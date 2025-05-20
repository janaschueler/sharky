class SharkyMovements {
  /**
   * Creates an instance of the SharkyMovements class.
   * @param {Object} sharky - The sharky instance to associate with this movement handler.
   * @property {Object} sharky - Reference to the sharky instance.
   * @property {Object} world - Reference to the world object from the sharky instance.
   */
  constructor(sharky) {
    this.sharky = sharky;
    this.world = sharky.world;
  }

  /**
   * Interrupts sleep and triggers the swimming animation.
   */
  commenceSwim() {
    this.sharky.interruptSleep();
    this.sharky.handleSwim();
  }

  /**
   * Checks if an attack key (SPACE or D) is currently pressed.
   * @param {Object} k - The keyboard input state.
   * @returns {boolean} True if an attack key is pressed.
   */
  attack(k) {
    return k.SPACE || k.D;
  }

  /**
   * Interrupts sleep and initiates the sharky's attack animation.
   */
  attackMethod() {
    this.sharky.interruptSleep();
    this.sharky.attackHandler.handleAttackAnimation();
  }

  /**
   * Stops the sleep sound and resets the sleep timer.
   */
  anyKeyPressMethod() {
    this.sharky.stopSound("sleep", this.sharky.AUDIO_SLEEP);
    this.sharky.resetSleep();
  }

  /**
   * Moves the sharky down and to the left, simulating a diagonal swim motion.
   */
  swimDownLeftMethod() {
    this.sharky.x -= this.sharky.speed / 3;
    this.sharky.y += this.sharky.speed / 1.2;
    this.sharky.swimDown = true;
    this.sharky.swimUp = false;
  }

  /**
   * Moves the sharky down and to the right, simulating a diagonal swim motion.
   */
  swimDownRightMethod() {
    this.sharky.x += this.sharky.speed / 3;
    this.sharky.y += this.sharky.speed / 1.2;
    this.sharky.swimDown = true;
    this.sharky.swimUp = false;
  }

  /**
   * Moves the sharky up and to the left, simulating a diagonal swim motion.
   */
  swimUpLeftMethod() {
    this.sharky.x -= this.sharky.speed / 3;
    this.sharky.y -= this.sharky.speed / 1.2;
    this.sharky.swimUp = true;
    this.sharky.swimDown = false;
  }

  /**
   * Moves the sharky up and to the right, simulating a diagonal swim motion.
   */
  swimUpRightMethod() {
    this.sharky.x += this.sharky.speed / 3;
    this.sharky.y -= this.sharky.speed / 1.2;
    this.sharky.swimUp = true;
    this.sharky.swimDown = false;
  }

  /**
   * Moves the sharky directly to the left and sets direction state.
   */
  swimLeftMethod() {
    this.sharky.x -= this.sharky.speed;
    this.sharky.otherDirection = true;
  }

  /**
   * Moves the sharky directly to the right and resets vertical movement flags.
   */
  swimRightMethod() {
    this.sharky.x += this.sharky.speed;
    this.sharky.otherDirection = false;
    this.sharky.swimUp = false;
    this.sharky.swimDown = false;
  }

  /**
   * Checks if any movement or attack key is currently pressed.
   * @param {Object} k - The keyboard input state.
   * @returns {boolean} True if any relevant key is pressed.
   */
  anyKeyPress(k) {
    return k.LEFT || k.RIGHT || k.UP || k.DOWN || k.SPACE || k.D;
  }

  /**
   * Checks if moving right is allowed based on boundaries and input.
   * @param {Object} k - The keyboard input state.
   * @returns {boolean} True if movement to the right is possible.
   */
  swimRight(k) {
    return k.RIGHT && this.sharky.x < this.world.level.level_end_x;
  }

  /**
   * Checks if moving left is allowed based on boundaries and input.
   * @param {Object} k - The keyboard input state.
   * @returns {boolean} True if movement to the left is possible.
   */
  simLeft(k) {
    return k.LEFT && this.sharky.x > -1300;
  }

  /**
   * Checks if upward-right movement is valid (within bounds and correct direction).
   * @param {Object} k - The keyboard input state.
   * @returns {boolean} True if movement up-right is possible.
   */
  swimUpRight(k) {
    return (
      k.UP &&
      this.sharky.otherDirection === false &&
      this.sharky.x > -1300 &&
      this.sharky.x < this.world.level.level_end_x &&
      this.sharky.y > -80
    );
  }

  /**
   * Checks if upward-left movement is valid (within bounds and correct direction).
   * @param {Object} k - The keyboard input state.
   * @returns {boolean} True if movement up-left is possible.
   */
  swimUpLeft(k) {
    return (
      k.UP &&
      this.sharky.otherDirection === true &&
      this.sharky.x > -1300 &&
      this.sharky.x < 2000 &&
      this.sharky.y > -80
    );
  }

  /**
   * Checks if downward-right movement is valid (within bounds and correct direction).
   * @param {Object} k - The keyboard input state.
   * @returns {boolean} True if movement down-right is possible.
   */
  swimDownRight(k) {
    return (
      k.DOWN &&
      this.sharky.otherDirection === false &&
      this.sharky.x > -1300 &&
      this.sharky.x < this.world.level.level_end_x &&
      this.sharky.y < 300
    );
  }

  /**
   * Checks if downward-left movement is valid (within bounds and correct direction).
   * @param {Object} k - The keyboard input state.
   * @returns {boolean} True if movement down-left is possible.
   */
  swimDownLeft(k) {
    return (
      k.DOWN &&
      this.sharky.otherDirection === true &&
      this.sharky.x > -1300 &&
      this.sharky.x < 2000 &&
      this.sharky.y < 300
    );
  }
}
