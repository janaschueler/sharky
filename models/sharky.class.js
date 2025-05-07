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
  }

  animate() {
    setInterval(() => {
      const k = this.world.keyboard;
      if (this.energy <= 0) return;
      if (k.LEFT || k.RIGHT || k.UP || k.DOWN || k.SPACE) {
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
      this.isAttacking = k.SPACE;
      if (!k.SPACE) {
        this.stopSound("bubble", this.AUDIO_BUBBLE);
      }
      this.world.camera_x = -this.x + 60;
    }, 1000 / 60);

    setInterval(() => {
      const now = Date.now();
      if (this.energy <= 0) {
        const deathImages = this.lastHurtBy instanceof Jellyfish ? this.IMAGES_DEAD_ELECTROSHOCK : this.IMAGES_DEAD;
        this.interruptSleep();

        if (!this.hasPlayedDeathAnimation) {
          this.hasPlayedDeathAnimation = true;
          this.isDead = true;
          this.sleeping = false;
          this.playAnimationOnce(deathImages, () => {
            this.img = this.imageCache[deathImages[deathImages.length - 1]];
            if (!this.world.gameOverShown) {
              this.world.gameOverShown = true;
              this.world.triggerGameOverScreen();
            }
          });
        } else {
          this.img = this.imageCache[deathImages[deathImages.length - 1]];
          if (this.y < 280) this.y += 5;
        }
        return;
      }
      this.isSleeping = now - this.lastActionTime > 15000 && !this.isDead;
      if (this.isHurt()) {
        this.interruptSleep();
        const hurtImages = this.lastHurtBy instanceof Jellyfish ? this.IMAGES_HURT_ELECTRIC : this.IMAGES_HURT_POISON;
        this.playAnimation(hurtImages);
        this.sleeping = false;
        return;
      }
      if (this.world.keyboard.SPACE) {
        this.handleAttackAnimation();
      } else if (this.isSleeping && !this.isDead && !this.isHurt()) {
        if (!this.fallingAsleepStarted) {
          this.fallingAsleepStarted = true;
          this.sleeping = true;
          if (this.sleeping) {
            this.playAnimationOnce(this.IMAGES_FALLING_A_SLEEP, () => {
              this.playPingPongAnimation(this.IMAGES_SLEEP);
              this.playLoopedSound("sleep", this.AUDIO_SLEEP);
            });
          }
        }
      } else if (this.isIdle()) {
        this.interruptSleep();
        this.handleIdle();
      } else {
        this.interruptSleep();
        this.handleSwim();
      }
    }, 200);
  }

  handleAttackAnimation() {
    const now = Date.now();
    if (now - this.lastAttackTime < this.attackCooldown || this.isAttackingAnimation) return;
    this.lastAttackTime = now;
    this.isAttackingAnimation = true;

    let attackTriggered = false;

    this.world.level.enemies.forEach((enemy) => {
      if (this.startFinAttack(enemy)) {
        this.playAnimationOnce(this.IMAGES_ATTACK_FIN, () => {
          this.isAttackingAnimation = false;
        });
        if (now - this.lastFinSlapTime > this.finSlapCooldown) {
          this.playSound(this.AUDIO_FIN_SLAP);
          this.lastFinSlapTime = now;
        }
        if (this.isColliding(enemy)) {
          setTimeout(() => enemy.reactToHit(), 200);
        }
        attackTriggered = true;
      } else if (this.startBubbleAttack(enemy)) {
        this.playAnimationOnce(this.IMAGES_ATTACK_BUBBLE, () => {
          this.isAttackingAnimation = false;
        });
        this.playLoopedSound("bubble", this.AUDIO_BUBBLE);
        if (this.isColliding(enemy)) enemy.reactToHit();
        attackTriggered = true;
      }
    });

    const boss = this.world.boss;
    if (this.startPoisonAttack(boss)) {
      if (this.world.poison > 0) {
        this.playAnimationOnce(this.IMAGES_ATTACK_BUBBLE_POISON, () => {
          this.isAttackingAnimation = false;
        });
        this.playLoopedSound("bubble", this.AUDIO_BUBBLE);
        if (this.isColliding(boss)) {
          boss.reactToHit();
          this.world.poison--;
          this.world.statusBarPoison.storePoison(this.world.poison);
        }
        attackTriggered = true;
      } else {
        this.playSound(this.AUDIO_NO_POISON);
        this.isAttackingAnimation = false;
      }
    }

    if (!attackTriggered) {
      this.stopSound("bubble", this.AUDIO_BUBBLE);
      this.isAttackingAnimation = false;
    }
  }

  /**
   * Initiates a fin attack on the specified enemy.
   * The attack is triggered if the enemy is an instance of the Puffers class
   * and is either close to this object or colliding with it.
   *
   * @param {Object} enemy - The enemy object to attack.
   * @returns {boolean} - Returns true if the attack is initiated, otherwise false.
   */
  startFinAttack(enemy) {
    return enemy instanceof Puffers && (this.isClose(enemy) || this.isColliding(enemy));
  }

  /**
   * Initiates a bubble attack on the specified enemy.
   * The attack is triggered if the enemy is an instance of Jellyfish
   * and is either close to or colliding with the current object.
   *
   * @param {Object} enemy - The enemy object to attack.
   * @returns {boolean} - Returns true if the bubble attack is initiated, otherwise false.
   */
  startBubbleAttack(enemy) {
    return enemy instanceof Jellyfish && (this.isClose(enemy) || this.isColliding(enemy));
  }

  /**
   * Initiates a poison attack on the specified enemy if the conditions are met.
   * The attack is triggered only if the enemy is an instance of the Boss class
   * and is either close to or colliding with the attacker.
   *
   * @param {Object} enemy - The enemy object to target for the poison attack.
   * @returns {boolean} - Returns true if the poison attack can be initiated, otherwise false.
   */
  startPoisonAttack(enemy) {
    return enemy instanceof Boss && (this.isClose(enemy) || this.isColliding(enemy));
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
    this.playAnimation(this.IMAGES_HOVER);
    this.swimUp = false;
    this.swimDown = false;
  }

  /**
   * Handles the swimming animation for the sharky object.
   * This method triggers the playAnimation function with the swimming images.
   */
  handleSwim() {
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
