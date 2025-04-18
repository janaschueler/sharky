class World {
  character;
  level = level1;

  canvas;
  ctx; // canvas context
  keyboard;
  camera_x = 0;
  coins = 0;
  poison = 0;
  statusBar = new StatusBarLife();
  statusBarCoins = new StatusBarCoins();
  statusBarPoison = new StatusBarPoison();

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
    this.keyboard = keyboard;
    this.character = new Sharky(this);
    this.boss = new Boss(this);
    this.boss.animate();
    this.setWorld();
    this.draw();
    this.checkCollisions();
    this.checkProximity();
    this.checkEnemyState();
  }

  /**
   * Assigns the current world instance to the character's `world` property,
   * allowing the character to access the world's properties and methods.
   */
  setWorld() {
    this.character.world = this;
  }

  checkCollisions() {
    setInterval(() => {
      this.checkEnemyCollisions();
      this.checkCollectableCollisions();
    }, 200);
  }

  checkEnemyCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        this.character.hit();
        enemy.playSoundHurt();
        this.statusBar.setPercentage(this.character.energy);
      }
    });
  }

  checkCollectableCollisions() {
    this.level.collectables.forEach((collectable, index) => {
      if (this.character.isColliding(collectable)) {
        this.handleCollectableCollision(collectable, index);
      }
    });
  }

  handleCollectableCollision(collectable, index) {
    if (collectable instanceof Coin && this.coins < 6) {
      collectable.playSound();
      this.coins++;
      this.statusBarCoins.setWallet(this.coins);
    } else if (collectable instanceof Poison && this.poison < 6) {
      collectable.playSound();
      this.poison++;
      this.statusBarPoison.storePoison(this.poison);
    } else {
      return;
    }
    this.level.collectables.splice(index, 1);
  }

  checkProximity() {
    setInterval(() => {
      const allEnemies = [...this.level.enemies, this.boss];
      allEnemies.forEach((enemy) => {
        let isClose;
        if (enemy === this.boss) {
          isClose = this.character.bossIsClose(enemy);
        } else {
          isClose = this.character.isClose(enemy);
        }

        if (isClose) {
          enemy.closeBy();
        } else {
          enemy.farAway();
        }
      });
    }, 200);
  }

  checkEnemyState() {
    setInterval(() => {
      this.level.enemies = this.level.enemies.filter((enemy) => !enemy.markedForRemoval);
    }, 200);
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
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // clear the canvas, clearRect is a method of the canvas context
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObject);

    this.ctx.translate(-this.camera_x, 0);
    // ----- Space for fixed objects ---
    this.addToMap(this.statusBar);
    this.addToMap(this.statusBarCoins);
    this.addToMap(this.statusBarPoison);
    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.light);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.collectables);
    this.addToMap(this.character);
    this.addToMap(this.boss);
    this.ctx.translate(-this.camera_x, 0);
    requestAnimationFrame(() => {
      this.draw();
    });
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
    if (!mo.swimUp && !mo.swimDown) {
      if (mo.otherDirection) {
        this.flipImage(mo);
      }
      mo.draw(this.ctx);
      mo.drawFrame(this.ctx);
      if (mo.otherDirection) {
        this.flipImageBack(mo);
      }
    }
    if (mo.swimUp || mo.swimDown) {
      if (mo.otherDirection) {
        const angle = mo.swimUp ? -25 : 25;
        this.rotateImageFlipped(mo, angle);
      }
      const angle = mo.swimUp ? -25 : 25;
      this.rotateImage(mo, angle);
    }
    this.ctx.restore();
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

  rotateImage(mo, angle) {
    this.ctx.translate(mo.x + mo.width / 2, mo.y + mo.height / 2);
    this.ctx.rotate((angle * Math.PI) / 180);
    this.ctx.drawImage(mo.img, -mo.width / 2, -mo.height / 2, mo.width, mo.height);
  }

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
}
