class SharkyAttack {
  constructor(sharky) {
    this.sharky = sharky;
    this.world = sharky.world; // Welt von Sharky übernehmen
  }
  /**
   * Handles the attack animation logic for the character.
   * Ensures that attacks are triggered only if the cooldown period has passed
   * and manages the animation state during attacks. It checks for different
   * types of attacks (fin, bubble, and poison) against enemies and the boss.
   * If no attack is triggered, it stops the bubble sound and resets the animation state.
   *
   * @returns {void}
   */
  handleAttackAnimation() {
    const now = Date.now();
    if (now - this.lastAttackTime < this.attackCooldown || this.isAttackingAnimation) return;
    this.lastAttackTime = now;
    this.isAttackingAnimation = true;
    let attackTriggered = false;
    this.world.level.enemies.forEach((enemy) => {
      if (this.handleFinAttack(enemy, now)) attackTriggered = true;
      else if (this.handleBubbleAttack(enemy)) attackTriggered = true;
    });
    if (this.handlePoisonAttack(this.world.boss)) attackTriggered = true;
    if (!attackTriggered) {
      this.sharky.stopSound("bubble", this.AUDIO_BUBBLE);
      this.isAttackingAnimation = false;
    }
  }

  /**
   * Handles the fin attack action of the shark character.
   *
   * This method initiates a fin attack on the specified enemy, plays the attack animation,
   * triggers the attack sound effect if the cooldown has passed, and checks for collisions
   * to apply damage to the enemy.
   *
   * @param {Object} enemy - The enemy object that the shark is attacking.
   * @param {number} now - The current timestamp, used to manage cooldowns and timing.
   * @returns {boolean} - Returns `true` if the attack was successfully initiated, otherwise `false`.
   */
  handleFinAttack(enemy, now) {
    if (!this.startFinAttack(enemy)) return false;
    this.sharky.playAnimationOnce(this.sharky.IMAGES_ATTACK_FIN, () => {
      this.isAttackingAnimation = false;
    });
    if (now - this.lastFinSlapTime > this.finSlapCooldown) {
      this.sharky.playSound(this.AUDIO_FIN_SLAP);
      this.lastFinSlapTime = now;
    }
    if (this.sharky.isColliding(enemy)) {
      enemy.reactToHit()
    }
    return true;
  }

  /**
   * Handles the bubble attack action against an enemy.
   * This method initiates the bubble attack animation, plays the associated sound,
   * and checks for collision with the enemy to trigger their reaction.
   *
   * @param {Object} enemy - The enemy object to attack. It is expected to have a `reactToHit` method.
   * @returns {boolean} - Returns `true` if the bubble attack was successfully initiated, otherwise `false`.
   */
  handleBubbleAttack(enemy) {
    if (!this.startBubbleAttack(enemy)) return false;
    this.sharky.playAnimationOnce(this.sharky.IMAGES_ATTACK_BUBBLE, () => {
      this.isAttackingAnimation = false;
    });
    this.sharky.world.checkThrowableObjects();
    this.sharky.playLoopedSound("bubble", this.AUDIO_BUBBLE);
    this.sharky.world.throwableObjects.forEach((bubble, index) => {
      if (bubble.isColliding(enemy)) {
        if (typeof enemy.reactToHit === "function") {
          enemy.reactToHit();
        } 
        bubble.clearExistingMovement();
        const idx = this.sharky.world.throwableObjects.indexOf(bubble);
        if (idx > -1) {
          this.sharky.world.throwableObjects.splice(idx, 1);
        }
      } 
    });
  
    return true;
  }
  

  /**
   * Handles the poison attack logic for the character.
   *
   * This method checks if the poison attack can be initiated and performs the attack
   * if there is sufficient poison available. It plays the appropriate animations and sounds,
   * reduces the poison count, and updates the poison status bar. If the attack collides with
   * the boss, it triggers the boss's reaction to the hit. If there is no poison left, it plays
   * a sound indicating the lack of poison.
   *
   * @param {Object} boss - The boss object that the poison attack is targeting.
   * @returns {boolean} - Returns `true` if the poison attack was successfully executed, otherwise `false`.
   */
  handlePoisonAttack(boss) {
    if (!this.startPoisonAttack(boss)) return false;
    if (this.world.poison > 0) {
      this.playPoisonAttackAnimation(() => {
        this.isAttackingAnimation = false;
      });
      this.handlePoisonCollision(boss);
      return true;
    } else {
      this.sharky.playSound(this.AUDIO_NO_POISON);
      this.isAttackingAnimation = false;
    }
    return false;
  }

  /**
   * Plays the poison attack animation and triggers a callback upon completion.
   * Additionally, plays a looped bubble sound effect during the animation.
   *
   * @param {Function} callback - A function to be executed after the animation finishes.
   */
  playPoisonAttackAnimation(callback) {
    this.sharky.playAnimationOnce(this.sharky.IMAGES_ATTACK_BUBBLE_POISON, callback);
    this.sharky.playLoopedSound("bubble", this.AUDIO_BUBBLE);
  }

  /**
   * Handles the collision between the current object and a boss entity when poison is involved.
   * If a collision is detected, it triggers the boss's reaction to being hit,
   * decreases the poison count in the world, and updates the poison status bar.
   *
   * @param {Object} boss - The boss entity to check for collision and apply effects.
   */
  handlePoisonCollision(boss) {
    if (this.sharky.isColliding(boss)) {
      boss.reactToHit();
      this.world.poison--;
      this.world.statusBarPoison.storePoison(this.world.poison);
    }
  }

  startFinAttack() {
    return this.sharky.world.keyboard.SPACE;
  }

  startBubbleAttack() {
    return this.sharky.world.keyboard.D;
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
    return this.sharky.world.keyboard.D;
  }
}

window.SharkyAttack = SharkyAttack;
