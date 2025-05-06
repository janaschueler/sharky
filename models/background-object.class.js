/**
 * Represents a background object in the game.
 * Extends the `MovableObjects` class to inherit movement-related functionality.
 * The width of the background object.
 * @type {number}
 * The height of the background object.
 * @type {number}
 * Creates an instance of BackgroundObject.
 * @param {string} imagePath - The path to the image representing the background object.
 * @param {number} x - The x-coordinate position of the background object.
 */

class BackgroundObject extends MovableObjects {
  width = 1440;
  height = 480;

  constructor(imagePath, x) {
    super();
    this.x = x;
    this.y = 480 - this.height;
    this.loadImage(imagePath);
  }
}
