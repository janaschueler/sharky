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
   * Interrupts the sharky's sleep state.
   */
  interruptAndSetVertical(swimUp, swimDown) {
    this.sharky.interruptSleep();
    this.sharky.swimUp = swimUp;
    this.sharky.swimDown = swimDown;
  }

  /**
   * Moves the sharky horizontally.
   * @param {number} direction - -1 for left, 1 for right.
   * @param {number} speedFactor - Multiplier for the sharky's speed.
   */
  moveHorizontal(direction, speedFactor = 1) {
    this.sharky.interruptSleep();
    this.sharky.x += this.sharky.speed * direction * speedFactor;
  }

  /**
   * Moves the sharky vertically.
   * @param {number} direction - -1 for up, 1 for down.
   * @param {number} speedFactor - Multiplier for the sharky's vertical speed.
   */
  moveVertical(direction, speedFactor = 1.2) {
    this.sharky.interruptSleep();
    this.sharky.y += this.sharky.speed * direction * speedFactor;
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
    this.sharky.interruptSleep();
  }

  /**
   * Moves the sharky down and to the left, simulating a diagonal swim motion.
   */
  swimDownLeftMethod() {
    this.interruptAndSetVertical(false, true);
    this.moveHorizontal(-1, 1 / 3);
    this.moveVertical(1);
  }

  /**
   * Moves the sharky down and to the right, simulating a diagonal swim motion.
   */
  swimDownRightMethod() {
    this.interruptAndSetVertical(false, true);
    this.moveHorizontal(1, 1 / 3);
    this.moveVertical(1);
  }

  /**
   * Moves the sharky up and to the left, simulating a diagonal swim motion.
   */
  swimUpLeftMethod() {
    this.interruptAndSetVertical(true, false);
    this.moveHorizontal(-1, 1 / 3);
    this.moveVertical(-1);
  }

  /**
   * Moves the sharky up and to the right, simulating a diagonal swim motion.
   */
  swimUpRightMethod() {
    this.interruptAndSetVertical(true, false);
    this.moveHorizontal(1, 1 / 3);
    this.moveVertical(-1);
  }

  /**
   * Moves the sharky directly to the left and sets direction state.
   */
  swimLeftMethod() {
    this.interruptAndSetVertical(false, false); // Reset vertical flags for pure horizontal movement
    this.moveHorizontal(-1);
    this.sharky.otherDirection = true;
  }

  /**
   * Moves the sharky directly to the right and resets vertical movement flags.
   */
  swimRightMethod() {
    this.interruptAndSetVertical(false, false); // Reset vertical flags for pure horizontal movement
    this.moveHorizontal(1);
    this.sharky.otherDirection = false;
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
  swimLeft(k) {
    return k.LEFT && this.sharky.x > -1300;
  }

  /**
   * Checks if upward-right movement is valid (within bounds and correct direction).
   * @param {Object} k - The keyboard input state.
   * @returns {boolean} True if movement up-right is possible.
   */
  swimUpRight(k) {
    return k.UP && this.sharky.otherDirection === false && this.sharky.x > -1300 && this.sharky.x < this.world.level.level_end_x && this.sharky.y > -80;
  }

  /**
   * Checks if upward-left movement is valid (within bounds and correct direction).
   * @param {Object} k - The keyboard input state.
   * @returns {boolean} True if movement up-left is possible.
   */
  swimUpLeft(k) {
    return k.UP && this.sharky.otherDirection === true && this.sharky.x > -1300 && this.sharky.x < 2000 && this.sharky.y > -80;
  }

  /**
   * Checks if downward-right movement is valid (within bounds and correct direction).
   * @param {Object} k - The keyboard input state.
   * @returns {boolean} True if movement down-right is possible.
   */
  swimDownRight(k) {
    return k.DOWN && this.sharky.otherDirection === false && this.sharky.x > -1300 && this.sharky.x < this.world.level.level_end_x && this.sharky.y < 300;
  }

  /**
   * Checks if downward-left movement is valid (within bounds and correct direction).
   * @param {Object} k - The keyboard input state.
   * @returns {boolean} True if movement down-left is possible.
   */
  swimDownLeft(k) {
    return k.DOWN && this.sharky.otherDirection === true && this.sharky.x > -1300 && this.sharky.x < 2000 && this.sharky.y < 300;
  }
}