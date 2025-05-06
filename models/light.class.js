/**
 * Represents a moving light overlay in the background layer of the game.
 * Inherits from MovableObjects and scrolls horizontally to create visual depth.
 *
 * Features:
 * - Loads a static light image
 * - Moves continuously from right to left
 * - Randomized initial horizontal position for variety
 */
class Light extends MovableObjects {
  y = 0;
  width = 1140;
  height = 480;

  constructor() {
    super();
    this.loadImage("img/3. Background/Layers/1. Light/COMPLETO.png");
    this.x = Math.random() * 500;
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.x -= this.speed;
    }, 1000 / 60);
  }
}
