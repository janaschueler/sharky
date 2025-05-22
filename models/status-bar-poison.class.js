/**
 * Represents the poison status bar of the player.
 * Displays different images based on the current amount of poison collected.
 */
class StatusBarPoison extends DrawableObject {
  IMAGES_POISON = ["img/4. Marcadores/green/poisoned bubbles/0_copia2.png", "img/4. Marcadores/green/poisoned bubbles/20_copia3.png", "img/4. Marcadores/green/poisoned bubbles/40_copia2.png", "img/4. Marcadores/green/poisoned bubbles/60_copia2.png", "img/4. Marcadores/green/poisoned bubbles/80_copia2.png", "img/4. Marcadores/green/poisoned bubbles/100_copia3.png"];
  unitsPoison = 0;

  /**
   * Creates an instance of the status bar for poison.
   * Initializes the poison status bar with default properties, including position, size,
   * and loading the poison images. Also sets the initial poison value to 0.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES_POISON);
    this.storePoison(0);
    this.x = 20;
    this.y = 90;
    this.width = 180;
    this.height = 50;
  }

  /**
   * Updates the poison status bar by storing the given amount of poison.
   * Determines the appropriate image to display based on the poison amount.
   *
   * @param {number} amount - The amount of poison to store. Should be a number between 0 and 5.
   */
  storePoison(amount) {
    amount = Math.max(0, Math.min(5, Math.round(amount)));
    this.unitsPoison = amount;
    this.img = this.imageCache[this.IMAGES_POISON[amount]];
  }
}
