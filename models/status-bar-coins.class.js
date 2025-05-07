/**
 * Represents a status bar for displaying the number of coins collected.
 * Extends the DrawableObject class to handle rendering and image management.
 * Array of image paths representing different coin collection states.
 * @type {string[]}
 * The current amount of coins in the wallet.
 * @type {number}
 * Initializes a new instance of the StatusBarCoins class.
 * Sets up the images, initial wallet state, and position/dimensions of the status bar.
 * Updates the wallet amount and changes the displayed image based on the amount.
 * If the amount exceeds 5, the maximum image is displayed.
 *
 * @param {number} amount - The amount of coins to set in the wallet.
 */
class StatusBarCoins extends DrawableObject {
  IMAGES_COINS = ["img/4. Marcadores/green/Coin/0_copia4.png", "img/4. Marcadores/green/Coin/20_copia2.png", "img/4. Marcadores/green/Coin/40_copia4.png", "img/4. Marcadores/green/Coin/60_copia4.png", "img/4. Marcadores/green/Coin/80_copia4.png", "img/4. Marcadores/green/Coin/100_copia4.png"];
  wallet = 0;

  /**
   * Creates an instance of the status bar for coins.
   * Initializes the status bar with default properties such as position, dimensions,
   * and the initial wallet value. Also loads the images for the coin status bar.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES_COINS);
    this.setWallet(0);
    this.x = 20;
    this.y = 50;
    this.width = 180;
    this.height = 50;
  }

  /**
   * Updates the wallet amount and sets the corresponding coin image based on the amount.
   *
   * @param {number} amount - The amount of coins to set in the wallet.
   *                          If the amount is greater than 5, the highest coin image is used.
   *                          Otherwise, the amount determines the specific coin image.
   *
   * @property {string[]} IMAGES_COINS - An array of image paths representing different coin states.
   * @property {Object} imageCache - A cache object mapping image paths to preloaded image objects.
   */
  setWallet(amount) {
    let imagePath;
    if (amount > 5) {
      imagePath = this.IMAGES_COINS[5];
    } else {
      this.wallet = amount;
      let index = Math.round(amount);
      imagePath = this.IMAGES_COINS[index];
    }
    this.img = this.imageCache[imagePath];
  }
}
