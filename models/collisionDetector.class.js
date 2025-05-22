/**
 * The CollisionDetector class handles all collision detection in the game world.
 * It is responsible for managing interactions between bubbles, enemies, the boss,
 * and collectable items. The class provides modular, reusable functions for different
 * types of collisions, separated by object types.
 */
class CollisionDetector {
  /**
   * Initializes a new instance of the CollisionDetector.
   *
   * @param {Object} world - The game world instance.
   */
  constructor(world) {
    this.world = world;
  }

  /**
   * Checks for collisions between the character and all enemies in the current level.
   * If the character has collected at least 2 coins, the boss enemy is included in the collision check.
   * When a collision is detected, the character takes damage, the enemy's hurt sound is played (if available),
   * and the status bar is updated to reflect the character's remaining energy.
   */
  checkEnemyCollisions() {
    if (this.world.character.isDead) return;
    const allEnemies = [...this.world.level.enemies];
    if (this.world.coins >= 2) {
      allEnemies.push(this.world.boss);
    }
    allEnemies.forEach((enemy) => {
      if (this.world.character.isColliding(enemy)) {
        this.world.character.lastHurtBy = enemy;
        this.world.character.hit();
        if (enemy.playSoundHurt) {
          enemy.playSoundHurt();
        }
        this.world.statusBar.setPercentage(this.world.character.energy);
      }
    });
  }

  /**
   * Checks for collisions between the character and collectable items in the level.
   * If a collision is detected, it handles the collision by invoking the appropriate method.
   */
  checkCollectableCollisions() {
    this.world.level.collectables.forEach((collectable, index) => {
      if (this.world.character.isColliding(collectable)) {
        this.handleCollectableCollision(collectable, index);
      }
    });
  }

  /**
   * Handles the collision between the player and a collectable item.
   * Depending on the type of collectable (Coin or Poison), it updates the player's
   * inventory and status bar, plays a sound, and removes the collectable from the level.
   *
   * @param {Object} collectable - The collectable item that the player collides with.
   * @param {number} index - The index of the collectable in the level's collectables array.
   * @returns {void}
   */
  handleCollectableCollision(collectable, index) {
    if (collectable instanceof Coin && this.world.coins < 6) {
      collectable.playSound();
      this.world.coins++;
      this.world.statusBarCoins.setWallet(this.world.coins);
    } else if (collectable instanceof Poison && this.world.poison < 6) {
      collectable.playSound();
      this.world.poison++;
      this.world.statusBarPoison.storePoison(this.world.poison);
    } else {
      return;
    }
    this.world.level.collectables.splice(index, 1);
  }

  /**
   * Checks for collisions between bubbles and enemies (including boss),
   * and handles the collision logic. Bubbles are removed upon collision.
   *
   * @param {Array<Object>} bubbles - The array of bubble objects to check for collisions.
   * @param {Array<Object>} enemies - The array of enemy objects (e.g., Jellyfish).
   * @param {Object|null} boss - The boss enemy object, or null if no boss is present.
   */
  checkBubbleCollisions(bubbles, enemies, boss) {
    const allEnemies = [...enemies];
    if (boss) allEnemies.push(boss);
    const bubblesToRemove = [];
    bubbles.forEach((bubble, index) => {
      allEnemies.forEach((enemy) => {
        if (enemy instanceof Jellyfish) {
          this.handleJellyfishCollision(enemy, bubble, index, bubblesToRemove);
        }
        if (enemy === boss) {
          this.handleBossCollision(enemy, bubble, index, bubblesToRemove);
        }
      });
    });
    this.removeBubbles(bubbles, bubblesToRemove);
  }

  /**
   * Handles the collision between a jellyfish and a bubble.
   * If a collision is detected, triggers the jellyfish's reaction,
   * clears the bubble's movement, and marks the bubble for removal.
   *
   * @param {Object} jellyfish - The jellyfish object involved in the collision.
   * @param {Object} bubble - The bubble object involved in the collision.
   * @param {number} index - The index of the bubble in the bubbles array.
   * @param {number[]} bubblesToRemove - Array to store indices of bubbles to be removed.
   */
  handleJellyfishCollision(jellyfish, bubble, index, bubblesToRemove) {
    if (jellyfish.isColliding(bubble)) {
      jellyfish.reactToHit();
      bubble.clearExistingMovement();
      bubblesToRemove.push(index);
    }
  }

  /**
   * Checks if the character performs a "fin attack" on any Puffers enemies when the SPACE key is pressed.
   * Iterates through all enemies in the current level, and for each enemy that is an instance of Puffers,
   * verifies if the character is in front of and colliding with the enemy. If so, triggers the enemy's
   * reaction to being hit and plays the hurt sound if available.
   *
   * @returns {void}
   */
  checkFinAttackOnPuffers() {
    if (!this.world.keyboard.SPACE) return;
    this.world.level.enemies.forEach((enemy) => {
      if (enemy instanceof Puffers && this.world.character.isInFront(enemy) && this.world.character.isColliding(enemy)) {
        enemy.reactToHit();
        if (enemy.playSoundHurt) {
          enemy.playSoundHurt();
        }
      }
    });
  }

  /**
   * Handles the collision between the boss and a bubble.
   * If the bubble is poisonous and collides with the boss, the boss reacts to the hit,
   * the bubble's movement is cleared, and the bubble's index is added to the removal list.
   *
   * @param {Object} boss - The boss entity that may collide with the bubble.
   * @param {Object} bubble - The bubble entity to check for collision and poison status.
   * @param {number} index - The index of the bubble in the bubbles array.
   * @param {number[]} bubblesToRemove - Array to which the index of the bubble will be pushed if it should be removed.
   */
  handleBossCollision(boss, bubble, index, bubblesToRemove) {
    if (bubble.isPoison && boss.isColliding(bubble)) {
      boss.reactToHit();
      bubble.clearExistingMovement();
      bubblesToRemove.push(index);
    }
  }

  /**
   * Removes bubbles from the given array at the specified indices.
   *
   * @param {Array} bubbles - The array of bubbles to remove from.
   * @param {number[]} bubblesToRemove - An array of indices indicating which bubbles to remove.
   */
  removeBubbles(bubbles, bubblesToRemove) {
    bubblesToRemove.reverse().forEach((index) => {
      bubbles.splice(index, 1);
    });
  }
}
