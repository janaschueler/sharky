class SharkyAttack {
  constructor(sharky) {
    this.sharky = sharky;
    this.world = sharky.world; // Welt von Sharky übernehmen
    this.audio = {
      sleep: sharky.AUDIO_SLEEP,
      bubble: sharky.AUDIO_BUBBLE,
      finSlap: sharky.AUDIO_FIN_SLAP,
      noPoison: sharky.AUDIO_NO_POISON,
    };
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
    if (now - this.lastAttackTime < this.sharky.attackCooldown || this.isAttackingAnimation) return;
    this.lastAttackTime = now;
    this.isAttackingAnimation = true;
    let attackTriggered = false;
    const resetAnimationState = () => {
      this.isAttackingAnimation = false;
      attackTriggered = false;
    };
    this.world.level.enemies.forEach((enemy) => {
      if (this.handleFinAttack(enemy, now, resetAnimationState)) {
        attackTriggered = true;
        return;
      } else if (this.handleBubbleAttack(enemy, resetAnimationState)) {
        attackTriggered = true;
        return;
      }
    });
    if (!attackTriggered) {
      this.sharky.stopSound("bubble", this.AUDIO_BUBBLE);
      resetAnimationState();
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
    if (!this.startFinAttack(enemy) || this.sharky.isAttackingAnimation) return false;
    this.sharky.isAttackingAnimation = true;
    this.sharky.startAnimation(this.sharky.IMAGES_ATTACK_FIN, () => {
      this.sharky.isAttackingAnimation = false;
      // this.sharky.stopAnimation();
    });
    this.isAttackingAnimation = false;
    if (now - this.lastFinSlapTime > this.sharky.finSlapCooldown) {
      this.sharky.playSound(this.AUDIO_FIN_SLAP, () => {
        this.sharky.isAttackingAnimation = false;
      });
      this.lastFinSlapTime = now;
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
  // handleBubbleAttack(enemy) {
  //   if (!this.startBubbleAttack(enemy)) return false;
  //   if (this.sharky.bossIsClose(this.sharky.world.boss)) {
  //     this.handlePoisonAttack(this.sharky.world.boss);
  //     return;
  //   }
  //   // this.sharky.startAnimation(this.sharky.IMAGES_ATTACK_BUBBLE, () => {
  //   //   this.isAttackingAnimation = false;
  //   // });
  //   this.sharky.startAnimation(this.sharky.IMAGES_ATTACK_BUBBLE);
  //   this.isAttackingAnimation = false;

  //   this.sharky.world.createBubble();
  //   this.sharky.playLoopedSound("bubble", this.AUDIO_BUBBLE);
  //   return true;
  // }

  handleBubbleAttack(enemy) {
    if (!this.startBubbleAttack(enemy)) return false;
    if (this.sharky.bossIsClose(this.sharky.world.boss)) {
      this.handlePoisonAttack(this.sharky.world.boss);
      return;
    } else {
      this.startBubbleAttackInterval(enemy);
      this.sharky.isAttackingBubble = true;
      return true;
    }
  }

  startBubbleAttackInterval(enemy) {
    // this.sharky.startAnimation(this.sharky.IMAGES_ATTACK_BUBBLE, () => {
    //   this.isAttackingAnimation = false;
    // });
    this.sharky.startAnimation(this.sharky.IMAGES_ATTACK_BUBBLE);
    this.isAttackingAnimation = false;

    this.sharky.world.createBubble();
    this.sharky.playLoopedSound("bubble", this.AUDIO_BUBBLE);
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
    if (this.world.poison > 0) {
      this.playPoisonAttackAnimation(() => {
        this.isAttackingAnimation = false;
      });
      this.sharky.world.createBubble(true);
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
    this.sharky.startAnimation(this.sharky.IMAGES_ATTACK_BUBBLE_POISON, callback);
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

  /**
   * Resets all animations and related states for the object.
   * This includes resetting sleep, swim, and sound states.
   */
  resetAnimation() {
    this.resetSleep();
    this.resetSwim();
    this.resetSounds();
    this.resetBubbleAttackState(); // Optional: Wenn Sie spezifische Bubble-Attack-Zustände haben
    this.resetPoisonAttackState(); // Optional: Wenn Sie spezifische Poison-Attack-Zustände haben  // Optional: Für alle anderen Zustände, die zurückgesetzt werden müssen
  }

  resetBubbleAttackState() {
    this.sharky.isAttackingBubble = false;
    clearInterval(this.bubbleAttackInterval); // Wenn Sie ein Intervall für den Bubble-Angriff haben
  }

  /**
   * Setzt spezifische Zustände zurück, die mit dem Gift-Angriff zusammenhängen.
   */
  resetPoisonAttackState() {
    this.sharky.isAttackingPoison = false;
    clearInterval(this.poisonAttackInterval); // Wenn Sie ein Intervall für den Gift-Angriff haben
  }

  /**
   * Resets the sleep state of the object.
   * - Updates the last action time to the current timestamp.
   * - Stops the falling asleep process.
   * - Clears the interval associated with the ping-pong mechanism.
   */
  resetSleep() {
    this.sharky.lastActionTime = Date.now();
    this.sharky.fallingAsleepStarted = false;
    this.sharky.stopSound("sleep", this.audio.sleep);
    clearInterval(this.sharky.pingPongInterval);
  }

  /**
   * Resets the swimming state of the shark.
   * Disables both upward and downward swimming flags
   * and clears the interval controlling the swim animation.
   */
  resetSwim() {
    this.sharky.swimUp = false;
    this.sharky.swimDown = false;
    clearInterval(this.sharky.swimAnimationInterval);
  }

  /**
   * Resets the attack state of the shark by stopping all attack-related animations,
   * clearing attack intervals, stopping associated sounds, and transitioning the shark
   * back to its idle state.
   *
   * @method resetAttack
   */
  resetAttack() {
    this.sharky.isAttacking = false;
    this.sharky.attackHandler.isAttackingAnimation = false;
    clearInterval(this.sharky.attackHandler.finSlapInterval);
    clearInterval(this.sharky.attackHandler.bubbleAttackInterval);
    clearInterval(this.sharky.attackHandler.poisonAttackInterval);
    this.sharky.stopSound("bubble", this.audio.bubble);
    this.sharky.stopSound("fin-slap", this.audio.finSlap);
    this.sharky.stopSound("no_poison", this.audio.noPoison);
    this.sharky.handleIdle();
  }

  /**
   * Resets all sound effects by stopping the playback of specific audio tracks.
   * This method stops the following sounds:
   * - "sleep" sound associated with `AUDIO_SLEEP`
   * - "bubble" sound associated with `AUDIO_BUBBLE`
   * - "fin-slap" sound associated with `AUDIO_FIN_SLAP`
   * - "no_poison" sound associated with `AUDIO_NO_POISON`
   */
  resetSounds() {
    this.sharky.stopSound("sleep", this.audio.sleep);
    this.sharky.stopSound("bubble", this.audio.bubble);
    this.sharky.stopSound("fin-slap", this.audio.finSlap);
    this.sharky.stopSound("no_poison", this.audio.noPoison);
  }

  /**
   * Resets the hurt animation state of the object.
   * This method stops any ongoing animations, clears the hurt state,
   * resets the sleeping state, clears the reference to the last entity
   * that caused harm, and loads the default hover image.
   */
  resetHurtAnimation() {
    this.sharky.stopAnimation();
    this.sharky.isHurt = false;
    this.sharky.sleeping = false;
    this.sharky.lastHurtBy = null;
    this.sharky.loadImage(this.sharky.IMAGES_HOVER[0]);
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
    if (this.sharky.sleeping) {
      this.sharky.sleeping = false;
      this.sharky.fallingAsleepStarted = false;
      clearInterval(this.sharky.pingPongInterval);
      this.sharky.stopSound("sleep", this.audio.sleep);
      this.resetSleep();
      this.sharky.allowIdle();
    }
  }
}

window.SharkyAttack = SharkyAttack;
