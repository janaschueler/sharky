class CollisionDetector {
  checkEnemyCollisions(character, enemies, boss, statusBar, coins) {
    const allEnemies = [...enemies];
    if (coins >= 2) {
      allEnemies.push(boss);
      console.log("Boss added to collision detection:", allEnemies);
    }
    allEnemies.forEach((enemy) => {
      if (character.isColliding(enemy)) {
        character.lastHurtBy = enemy;
        character.hit();
        if (enemy.playSoundHurt) {
          enemy.playSoundHurt();
        }
        statusBar.setPercentage(character.energy);
      }
    });
  }

  checkCollectableCollisions(character, collectables, handleCollectableCollision) {
    collectables.forEach((collectable, index) => {
      if (character.isColliding(collectable)) {
        handleCollectableCollision(collectable, index);
      }
    });
  }

  checkBubbleCollisions(bubbles, enemies) {
    const bubblesToRemove = [];
    bubbles.forEach((bubble, index) => {
      enemies.forEach((enemy) => {
        if (enemy.isColliding(bubble)) {
          enemy.reactToHit();
          bubble.clearExistingMovement();
          bubblesToRemove.push(index);
        }
      });
    });
    bubblesToRemove.reverse().forEach((index) => {
      bubbles.splice(index, 1);
    });
  }
}
