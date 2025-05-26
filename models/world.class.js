/**
 * The `World` class represents the game world and manages the game state,
 * including the character, enemies, collectables, background, and user interactions.
 * It handles rendering, collision detection, proximity checks, and game state transitions
 * such as win or game over screens.
 */

class World {
  character;
  level = createLevel1();
  canvas;
  ctx; // canvas context
  keyboard;
  camera_x = 0;
  coins = 0;
  poison = 0;
  winScreenShown = false;
  endScreenShown = false;
  statusBar = new StatusBarLife();
  statusBarCoins = new StatusBarCoins();
  statusBarPoison = new StatusBarPoison();
  backgroundMusic = new Audio("audio/wave_sounds.mp3");
  throwableObjects = [];
  IMAGES_GAME_OVER = ["img/6.Botones/Tittles/Game Over/Recurso 9.png", "img/6.Botones/Tittles/Game Over/Recurso 10.png", "img/6.Botones/Tittles/Game Over/Recurso 11.png", "img/6.Botones/Tittles/Game Over/Recurso 12.png", "img/6.Botones/Tittles/Game Over/Recurso 13.png"];
  IMAGES_TRAY_AGAIN = ["img/6.Botones/Try again/Recurso 15.png", "img/6.Botones/Try again/Recurso 16.png", "img/6.Botones/Try again/Recurso 17.png", "img/6.Botones/Try again/Recurso 18.png"];
  IMAGES_WIN = ["img/6.Botones/Tittles/You win/Mesa de trabajo 1.png"];
  IMAGES_WIN_ANIMATION = ["img/6.Botones/Tittles/You win/Recurso 19.png", "img/6.Botones/Tittles/You win/Recurso 20.png", "img/6.Botones/Tittles/You win/Recurso 21.png", "img/6.Botones/Tittles/You win/Recurso 22.png"];
  IMAGES_START_INSTRUCTION = ["img/6.Botones/Instructions 2.png"];
  IMAGES_START_BUTTON = ["img/6.Botones/Start/1.png", "img/6.Botones/Start/2.png", "img/6.Botones/Start/3.png", "img/6.Botones/Start/4.png"];
  lostMusic = new Audio("audio/lost.mp3");
  winMusic = new Audio("audio/win.mp3");
  bubbleCoolDown = false;

  /**
   * Creates an instance of the World class.
   * Initializes the canvas rendering context, keyboard input, and sets up the world.
   * Also starts the drawing process.
   *
   * @param {HTMLCanvasElement} canvas - The canvas element used for rendering the world.
   * @param {Object} keyboard - An object representing the keyboard input state.
   */
  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d"); // with .getContext("2d") we get the 2d rendering context
    this.canvas = canvas;
    this.statusBarBoss = new StatusBarBossLife();
    this.keyboard = keyboard || new Keyboard();
    this.character = new Sharky(this);
    this.boss = new Boss(this);
    this.boss.animate();
    this.setWorld();
    this.draw();
    this.engage();
    this.checkProximity();
    this.collisionDetector = new CollisionDetector(this);
    this.checkEnemyState();
    this.initBackgroundMusic();
    this.gameOverLoader = new DrawableObject();
    this.gameOverLoader.loadImages(this.IMAGES_GAME_OVER);
    this.gameOverLoader.loadImages(this.IMAGES_TRAY_AGAIN);
    this.endGame = new EndGame(this);
  }

  /**
   * Assigns the current world instance to the character's `world` property,
   * allowing the character to access the world's properties and methods.
   */
  setWorld() {
    this.character.world = this;
  }

  /**
   * Starts the animation loop to update the character state every 200ms.
   *
   * - Sets sleep mode after 15s of inactivity (if not dead).
   * - Plays death animation when energy is 0.
   * - Plays hurt animation and interrupts sleep when damaged.
   * - Triggers attack animation on SPACE or D key press.
   */
  animate() {
    setInterval(() => {
      const now = Date.now();
      this.character.isSleeping = now - this.lastActionTime > 15000 && !this.isDead;
      if (this.character.energy <= 0) {
        this.character.playDeathAnimation();
        return;
      }
      if (this.character.isHurt()) return this.startHurtAnimation();
      if (this.keyboard.SPACE || this.keyboard.D) this.character.attackHandler.handleAttackAnimation();
    }, 200);
  }

  /**
   * Triggers the hurt animation for the character based on the source of damage.
   * If the character was last hurt by a Jellyfish, plays the electric hurt animation;
   * otherwise, plays the poison hurt animation. Also interrupts the character's sleep state.
   *
   * @returns {void}
   */
  startHurtAnimation() {
    this.character.interruptSleep();
    const hurtImages = this.lastHurtBy instanceof Jellyfish ? this.IMAGES_HURT_ELECTRIC : this.IMAGES_HURT_POISON;
    this.playAnimation(hurtImages);
    this.character.sleeping = false;
    return;
  }

  /**
   * Periodically checks for collisions in the game world.
   * This method sets up an interval that repeatedly checks for two types of collisions:
   * - Enemy collisions: Detects if the player has collided with any enemies.
   * - Collectable collisions: Detects if the player has collected any items.
   *
   * The checks are performed every 200 milliseconds.
   */
  engage() {
    setInterval(() => {
      this.collisionDetector.checkEnemyCollisions();
      this.collisionDetector.checkCollectableCollisions();
      this.collisionDetector.checkBubbleCollisions(this.throwableObjects, this.level.enemies, this.boss);
      this.collisionDetector.checkFinAttackOnPuffers();
    }, 200);
  }

  /**
   * Periodically checks the proximity of all enemies (including the boss) to the character.
   * If an enemy is close, it triggers the `closeBy` method on the enemy.
   * If an enemy is far away, it triggers the `farAway` method on the enemy.
   *
   * The proximity check is performed every 200 milliseconds.
   */
  checkProximity() {
    setInterval(() => {
      const allEnemies = [...this.level.enemies, this.boss];
      allEnemies.forEach((enemy) => {
        let isClose;
        if (enemy === this.boss) isClose = this.character.bossIsClose(enemy);
        else isClose = this.character.isClose(enemy);
        if (isClose) enemy.closeBy();
        else enemy.farAway();
      });
    }, 1000 / 60);
  }

  /**
   * Periodically checks the state of enemies and the boss in the game.
   * - Removes enemies marked for removal from the level's enemies array.
   * - Triggers the win screen if the boss's energy is depleted and the win screen has not already been shown.
   *
   * This method runs every 200 milliseconds using `setInterval`.
   */
  checkEnemyState() {
    setInterval(() => {
      this.level.enemies = this.level.enemies.filter((enemy) => !enemy.markedForRemoval);
      let percentage = this.boss.energy;
      this.statusBarBoss.setPercentage(percentage);
      if (this.boss.energy <= 0 && !this.winScreenShown) {
        this.winScreenShown = true;
        this.endGame.triggerWinScreen();
      }
    }, 1000 / 60);
  }

  /**
   * Draws the game world onto the canvas.
   * This method clears the canvas, applies camera transformations,
   * and renders all game objects including background objects, lights,
   * enemies, collectables, and the main character.
   * It uses `requestAnimationFrame` to continuously update the canvas.
   *
   * @method
   */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObject);
    this.ctx.translate(-this.camera_x, 0);
    this.addToMapStatusBar();
    this.ctx.translate(this.camera_x, 0);
    this.addToMapObjectInteraction();
    this.throwableObjects.forEach((obj) => this.addToMap(obj));
    this.addToMap(this.character);
    this.addToMap(this.boss);
    this.ctx.translate(-this.camera_x, 0);
    requestAnimationFrame(() => this.draw());
  }

  /**
   * Adds various interactive objects from the current level to the map.
   * Specifically, it adds light sources, enemies, and collectable items
   * by invoking `addObjectsToMap` for each respective group.
   *
   * @returns {void}
   */
  addToMapObjectInteraction() {
    this.addObjectsToMap(this.level.light);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.collectables);
  }

  /**
   * Adds all status bar elements (main status bar, coins, poison, and boss indicators)
   * to the map display. This method ensures that all relevant status bar components
   * are rendered on the map for the user interface.
   */
  addToMapStatusBar() {
    this.addToMap(this.statusBar);
    this.addToMap(this.statusBarCoins);
    this.addToMap(this.statusBarPoison);
    this.addToMap(this.statusBarBoss);
  }

  /**
   * Adds multiple objects to the map by iterating through the provided array
   * and adding each object individually.
   *
   * @param {Array} objects - An array of objects to be added to the map.
   */
  addObjectsToMap(objects) {
    objects.forEach((object) => {
      this.addToMap(object);
    });
  }

  /**
   * Adds a movable object (mo) to the map by drawing it on the canvas context.
   * If the object has the `otherDirection` property set to true, the image is flipped
   * before drawing and flipped back afterward.
   *
   * @param {Object} mo - The movable object to be added to the map.
   * @param {boolean} [mo.otherDirection] - Indicates whether the image should be flipped horizontally.
   * @param {Function} mo.draw - A method to draw the object on the canvas context.
   * @param {Function} mo.drawFrame - A method to draw the object's frame on the canvas context.
   */
  addToMap(mo) {
    this.ctx.save();
    if (!mo.swimUp && !mo.swimDown) this.addToMapSwimVertical(mo);
    else this.swimLeftMethod(mo);
    this.ctx.restore();
  }

  /**
   * Rotates the given object to simulate swimming left, adjusting the angle based on its direction and swim state.
   *
   * @param {Object} mo - The movable object to rotate.
   * @param {boolean} mo.otherDirection - Indicates if the object is facing the opposite direction (flipped).
   * @param {boolean} mo.swimUp - Indicates if the object is swimming upwards.
   */
  swimLeftMethod(mo) {
    if (mo.otherDirection) {
      const angle = mo.swimUp ? -25 : 25;
      this.rotateImageFlipped(mo, angle);
    } else {
      const angle = mo.swimUp ? -25 : 25;
      this.rotateImage(mo, angle);
    }
  }

  /**
   * Adds a movable object to the map with vertical swimming behavior.
   * If the object is facing the opposite direction (`otherDirection`), its image is flipped before drawing.
   * After drawing, if the object was flipped, its x-coordinate is inverted.
   *
   * @param {Object} mo - The movable object to be drawn on the map.
   * @param {boolean} mo.otherDirection - Indicates if the object is facing the opposite direction.
   * @param {function} mo.draw - Function to draw the object on the provided context.
   * @param {number} mo.x - The x-coordinate of the object, which may be inverted if flipped.
   */
  addToMapSwimVertical(mo) {
    if (mo.otherDirection) this.flipImage(mo);
    mo.draw(this.ctx);
    if (mo.otherDirection) mo.x = mo.x * -1;
  }

  /**
   * Flips the given image horizontally by saving the current canvas state,
   * translating the canvas context, and scaling it negatively along the x-axis.
   * Updates the x-coordinate of the image to reflect the flip.
   *
   * @param {Object} mo - The image object to be flipped.
   * @param {number} mo.width - The width of the image.
   * @param {number} mo.x - The x-coordinate of the image, which will be updated after the flip.
   */
  flipImage(mo) {
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Rotates and draws an image on the canvas context.
   *
   * @param {Object} mo - The image object to be rotated and drawn.
   * @param {number} mo.x - The x-coordinate of the image's top-left corner.
   * @param {number} mo.y - The y-coordinate of the image's top-left corner.
   * @param {number} mo.width - The width of the image.
   * @param {number} mo.height - The height of the image.
   * @param {HTMLImageElement} mo.img - The image to be drawn.
   * @param {number} angle - The angle of rotation in degrees.
   */
  rotateImage(mo, angle) {
    this.ctx.translate(mo.x + mo.width / 2, mo.y + mo.height / 2);
    this.ctx.rotate((angle * Math.PI) / 180);
    this.ctx.drawImage(mo.img, -mo.width / 2, -mo.height / 2, mo.width, mo.height);
  }

  /**
   * Rotates and flips an image horizontally before drawing it on the canvas.
   *
   * @param {Object} mo - The object containing the image and its properties.
   * @param {HTMLImageElement} mo.img - The image to be drawn.
   * @param {number} mo.x - The x-coordinate of the image's position.
   * @param {number} mo.y - The y-coordinate of the image's position.
   * @param {number} mo.width - The width of the image.
   * @param {number} mo.height - The height of the image.
   * @param {number} angle - The angle in degrees to rotate the image.
   */
  rotateImageFlipped(mo, angle) {
    this.ctx.translate(mo.x + mo.width / 2, mo.y + mo.height / 2);
    this.ctx.scale(-1, 1);
    this.ctx.rotate((angle * Math.PI) / 180);
    this.ctx.drawImage(mo.img, -mo.width / 2, -mo.height / 2, mo.width, mo.height);
  }

  /**
   * Flips the image of the given object horizontally by inverting its x-coordinate
   * and restores the canvas context to its previous state.
   *
   * @param {Object} mo - The object whose image is to be flipped.
   *                      It is expected to have an `x` property representing its x-coordinate.
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
  }

  /**
   * Creates a bubble when the 'D' key is pressed, with an optional poison effect.
   * Ensures a cooldown period of 1 second between bubble creations.
   *
   * @param {boolean} [isPoison=false] - Determines if the bubble is poisonous. Defaults to `false`.
   */
  createBubble(isPoison = false) {
    if (this.keyboard.D && !this.bubbleCoolDown) {
      this.bubbleCoolDown = true;
      const direction = this.character.otherDirection ? "left" : "right";
      setTimeout(() => {
        new ThrowableObject(this.character.x, this.character.y, this, isPoison, direction);
        this.bubbleCoolDown = false;
      }, 800);
    }
    if (!this.keyboard.D) this.bubbleCoolDown = false;
  }

  /**
   * Initializes the background music for the game.
   * - The music is set to loop continuously.
   * - Volume is reduced to 20% for better game ambiance.
   * - Playback starts on the first user interaction (click or keydown),
   *   to comply with browser autoplay policies.
   * - Event listeners are removed after the music starts to prevent multiple triggers.
   */
  initBackgroundMusic() {
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.1;
    const playMusic = () => {
      this.backgroundMusic.play().catch(() => {});
      window.removeEventListener("click", playMusic);
      window.removeEventListener("keydown", playMusic);
    };
    window.addEventListener("click", playMusic);
    window.addEventListener("keydown", playMusic);
  }
}
