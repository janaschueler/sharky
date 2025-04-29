class World {
  character;
  level = level1;

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
  IMAGES_GAME_OVER = ["img/6.Botones/Tittles/Game Over/Recurso 9.png", "img/6.Botones/Tittles/Game Over/Recurso 10.png", "img/6.Botones/Tittles/Game Over/Recurso 11.png", "img/6.Botones/Tittles/Game Over/Recurso 12.png", "img/6.Botones/Tittles/Game Over/Recurso 13.png"];
  IMAGES_TRAY_AGAIN = ["img/6.Botones/Try again/Recurso 15.png", "img/6.Botones/Try again/Recurso 16.png", "img/6.Botones/Try again/Recurso 17.png", "img/6.Botones/Try again/Recurso 18.png"];
  IMAGES_WIN = ["img/6.Botones/Tittles/You win/Mesa de trabajo 1.png"];
  IMAGES_WIN_ANIMATION = ["img/6.Botones/Tittles/You win/Recurso 19.png", "img/6.Botones/Tittles/You win/Recurso 20.png", "img/6.Botones/Tittles/You win/Recurso 21.png", "img/6.Botones/Tittles/You win/Recurso 22.png"];
  IMAGES_START_INSTRUCTION = ["img/6.Botones/Instructions 2.png"];
  IMAGES_START_BUTTON = ["img/6.Botones/Start/1.png", "img/6.Botones/Start/2.png", "img/6.Botones/Start/3.png", "img/6.Botones/Start/4.png"];
  
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
    this.initBackgroundMusic();
    this.gameOverLoader = new DrawableObject();
    this.gameOverLoader.loadImages(this.IMAGES_GAME_OVER);
    this.gameOverLoader.loadImages(this.IMAGES_TRAY_AGAIN);
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
    const allEnemies = [...this.level.enemies];

    if (this.coins >= 2) {
      allEnemies.push(this.boss);
    }

    allEnemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        this.character.lastHurtBy = enemy;
        this.character.hit();
        if (enemy.playSoundHurt) {
          enemy.playSoundHurt();
        }
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

      if (this.boss.energy <= 0 && !this.winScreenShown) {
        this.winScreenShown = true;
        this.triggerWinScreen();
      }
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
      // mo.drawFrame(this.ctx);
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

  triggerGameOverScreen() {
    if (this.endScreenShown) return;
    this.endScreenShown = true;

    let frame = 0;
    const gameOverImg = document.createElement("img");
    gameOverImg.style = `
      position: absolute;
      top: 20%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 400px;
      z-index: 1000;
    `;
    document.body.appendChild(gameOverImg);

    setInterval(() => {
      gameOverImg.src = this.IMAGES_GAME_OVER[frame];
      frame++;
      if (frame >= this.IMAGES_GAME_OVER.length) frame = 0;
    }, 150);

    const tryAgainBtn = document.createElement("img");
    tryAgainBtn.src = this.IMAGES_TRAY_AGAIN[0];
    tryAgainBtn.style = `
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 200px;
      cursor: pointer;
      z-index: 1001;
    `;
    document.body.appendChild(tryAgainBtn);

    tryAgainBtn.addEventListener("click", () => location.reload());
  }

  triggerWinScreen() {
    if (this.endScreenShown) return;
    this.endScreenShown = true;

    let frame = 0;
    const winImg = document.createElement("img");
    winImg.style = `
      position: absolute;
      top: 20%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 400px;
      z-index: 1000;
    `;
    document.body.appendChild(winImg);

    setInterval(() => {
      winImg.src = this.IMAGES_WIN_ANIMATION[frame];
      frame++;
      if (frame >= this.IMAGES_WIN_ANIMATION.length) frame = 0;
    }, 150);

    const tryAgainBtn = document.createElement("img");
    tryAgainBtn.src = this.IMAGES_TRAY_AGAIN[0];
    tryAgainBtn.style = `
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 200px;
      cursor: pointer;
      z-index: 1001;
    `;
    document.body.appendChild(tryAgainBtn);

    tryAgainBtn.addEventListener("click", () => location.reload());
  }

  initBackgroundMusic() {
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.2;

    const playMusic = () => {
      this.backgroundMusic.play().catch((e) => {
        console.warn("🎵 Hintergrundmusik konnte nicht gestartet werden:", e);
      });
      // Damit es nur 1x ausgeführt wird:
      window.removeEventListener("click", playMusic);
      window.removeEventListener("keydown", playMusic);
    };

    // Nur nach Nutzer-Interaktion erlaubt (Browser-Sicherheitsrichtlinie)
    window.addEventListener("click", playMusic);
    window.addEventListener("keydown", playMusic);
  }
}
