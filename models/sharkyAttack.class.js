class SharkyAttack {
  lastPoisonAttackTime = 0;
  poisonAttackCoolDown = 1500; // 1,5 Sekunden Cooldown z.B.

  constructor(sharky) {
    this.sharky = sharky;
    this.world = sharky.world; // Welt von Sharky übernehmen
  }

  /**
   * Handles the attack animation logic for the sharky character.
   * Prevents multiple attacks during the cooldown period, interrupts sleep state,
   * attempts all possible attacks, and manages attack state and sound effects.
   *
   * @returns {void}
   */
  handleAttackAnimation() {
    const now = Date.now();
    if (this.isAttackingAnimation || now - this.lastAttackTime < this.attackCooldown) return;
    this.sharky.interruptSleep();
    const attackTriggered = this.tryAllAttacks(now);

    if (attackTriggered) {
      this.lastAttackTime = now;
      this.isAttackingAnimation = true;
    } else {
      this.sharky.stopSound("bubble", this.AUDIO_BUBBLE);
    }
  }

  /**
   * Attempts to perform all available attacks based on the current keyboard input.
   *
   * Checks if the SPACE key is pressed to attempt a fin attack, or if the D key is pressed
   * to attempt a bubble or poison attack. Returns true if any attack is successfully performed.
   *
   * @param {number} now - The current timestamp or game tick used for attack timing.
   * @returns {boolean} True if an attack was performed, otherwise false.
   */
  tryAllAttacks(now) {
    const space = this.sharky.world.keyboard.SPACE;
    const d = this.sharky.world.keyboard.D;
    if (space && this.tryFinAttack(now)) return true;
    if (d && this.tryBubbleOrPoisonAttack()) return true;
    return false;
  }

  /**
   * Attempts to perform a fin attack on each enemy in the current level.
   * Iterates through all enemies and calls `handleFinAttack` for each.
   * If an attack is successful on any enemy, returns `true` immediately.
   * Otherwise, returns `false` after checking all enemies.
   *
   * @param {number} now - The current timestamp or game tick.
   * @returns {boolean} `true` if a fin attack was successful on any enemy, otherwise `false`.
   */
  tryFinAttack(now) {
    for (const enemy of this.world.level.enemies) {
      if (this.handleFinAttack(enemy, now)) return true;
    }
    return false;
  }

  /**
   * Attempts to perform a bubble attack on each enemy in the current level.
   * If a bubble attack is successful on any enemy, returns true immediately.
   * If no bubble attack succeeds, attempts a poison attack on the boss enemy.
   *
   * @returns {boolean} True if either a bubble attack on any enemy or a poison attack on the boss is successful, otherwise false.
   */
  tryBubbleOrPoisonAttack() {
    for (const enemy of this.world.level.enemies) {
      if (this.handleBubbleAttack(enemy)) return true;
    }
    return this.handlePoisonAttack(this.world.boss);
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
    if (now - this.lastFinSlapTime < this.sharky.finSlapCooldown) return false;
    this.isAttackingAnimation = true;
    this.sharky.lastFinSlapTime = now;
    this.sharky.playAnimationOnce(this.sharky.IMAGES_ATTACK_FIN, () => {
      this.isAttackingAnimation = false;
    });
    this.sharky.playSound(this.sharky.AUDIO_FIN_SLAP);
    if (this.sharky.isColliding(enemy)) {
      enemy.reactToHit();
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
    if (this.sharky.bossIsClose(this.sharky.world.boss)) {
      this.handlePoisonAttack(this.sharky.world.boss);
      return;
    } else {
      this.startBubbleAttackInterval(enemy);
      this.sharky.isAttackingBubble = true;
      return true;
    }
  }

  /**
   * Initiates the bubble attack sequence for the enemy.
   * Plays the bubble attack animation once, creates a bubble in the game world,
   * and starts playing the bubble sound effect in a loop.
   *
   * @param {Object} enemy - The enemy object that will perform the bubble attack.
   * @returns {boolean} Returns true when the bubble attack interval is started.
   */
  startBubbleAttackInterval(enemy) {
    this.sharky.playAnimationOnce(this.sharky.IMAGES_ATTACK_BUBBLE, () => {
      this.isAttackingAnimation = false;
    });
    this.sharky.world.createBubble();
    const audio = this.sharky.AUDIO_BUBBLE;
    setTimeout(() => {
      audio.currentTime = 0;
      audio.play();
      setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
      }, 500);
    }, 500);

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
    const now = Date.now();
    if (now - this.lastPoisonAttackTime < this.poisonAttackCoolDown) {
      return false;
    }
    if (this.world.poison <= 0) {
      this.sharky.playSound(this.sharky.AUDIO_NO_POISON);
      this.isAttackingAnimation = false;
      return false;
    }
    return this.statPoisonAttack(now);
  }

  /**
   * Executes Sharky's poison attack action.
   *
   * Updates the last poison attack time, decreases the world's poison level,
   * updates the poison status bar, plays the poison attack animation and sound,
   * and creates a poison bubble in the world.
   *
   * @param {number} now - The current timestamp or frame time when the attack is triggered.
   * @returns {boolean} Returns true when the poison attack is executed.
   */
  statPoisonAttack(now) {
    this.lastPoisonAttackTime = now;
    this.world.poison = Math.max(0, this.world.poison - 1);
    this.world.statusBarPoison.storePoison(this.world.poison);
    this.sharky.playAnimationOnce(this.sharky.IMAGES_ATTACK_BUBBLE_POISON, () => {
      this.isAttackingAnimation = false;
    });
    this.sharky.playSound(this.sharky.AUDIO_BUBBLE);
    this.sharky.world.createBubble(true);
    return true;
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

window.SharkyAttack = SharkyAttack;
