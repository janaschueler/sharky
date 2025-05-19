/**
 * Represents a collectible coin in the game world.
 * Inherits from MovableObjects and includes animation and audio behavior when collected.
 *
 * Features:
 * - Displays a floating animation using a series of images
 * - Plays a sound effect when collected
 * - Spawns at a random position within a defined area
 */

class Coin extends MovableObjects {
  width = 40;
  height = 40;
  IMAGES_FLOAT = ["img/4. Marcadores/1. Coins/1.png", "img/4. Marcadores/1. Coins/2.png", "img/4. Marcadores/1. Coins/3.png", "img/4. Marcadores/1. Coins/4.png"];
  AUDIO_COLLECT = new Audio("audio/CollectCoin.mp3");
  offset = { top: 0, left: 0, right: 0, bottom: 0 };

  /**
   * Constructs a new instance of the class, initializing its properties and starting the animation.
   * 
   * - Loads the initial image and a set of floating images.
   * - Randomly sets the `x` position within a range of -700 to 1500.
   * - Randomly sets the `y` position within a range of 0 to 400.
   * - Starts the animation process.
   */
  constructor() {
    super();
    this.loadImage(this.IMAGES_FLOAT[0]);
    this.loadImages(this.IMAGES_FLOAT);
    this.x = -700 + Math.random() * 2200;
    this.y = 0 + Math.random() * 400;
    this.animate();
  }

  /**
   * Animates the object by periodically playing a floating animation.
   * The animation is executed by cycling through the images in `this.IMAGES_FLOAT`.
   * 
   * @method
   * @example
   * const coin = new Coin();
   * coin.animate(); // Starts the floating animation
   */
  animate() {
    setInterval(() => {
      this.startAnimation(this.IMAGES_FLOAT);
    }, 300);
  }

  /**
   * Plays the coin collection sound effect.
   * Resets the audio playback to the beginning and attempts to play the sound.
   * If the playback fails (e.g., due to user interaction restrictions), the error is caught and ignored.
   */
  playSound() {
    this.AUDIO_COLLECT.currentTime = 0;
    this.AUDIO_COLLECT.play().catch(() => {});
  }
}
