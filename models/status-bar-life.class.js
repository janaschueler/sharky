/**
 * Represents the life status bar of the player.
 * Displays different images based on the current life percentage.
 */
class StatusBarLife extends DrawableObject {
  IMAGES_LIFE = ["img/4. Marcadores/green/Life/0_ copia3.png", "img/4. Marcadores/green/Life/20_ copia4.png", "img/4. Marcadores/green/Life/40_ copia3.png", "img/4. Marcadores/green/Life/60_copia3.png", "img/4. Marcadores/green/Life/80_ copia3.png", "img/4. Marcadores/green/Life/100_ copia2.png"];
  percentageLife = 100;

  /**
   * Initializes the life status bar with default values and loads images.
   * Sets the initial position, size, and life percentage display.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES_LIFE);
    this.setPercentage(100);
    this.x = 20;
    this.y = 10;
    this.width = 180;
    this.height = 50;
  }

  /**
   * Updates the displayed life status image based on the given percentage.
   * @param {number} percentage - The new life percentage (0 to 100).
   */
  setPercentage(percentage) {
    this.percentageLife = percentage;
    let index = Math.round(percentage / 20);
    let imagePath = this.IMAGES_LIFE[index];
    this.img = this.imageCache[imagePath];
  }
}

/**
 * Represents the life status bar of the boss.
 * Displays different images based on the current life percentage.
 */
class StatusBarBossLife extends DrawableObject {
  percentageLife = 100;

  constructor() {
    super();
    this.IMAGES_LIFE = ["img/4. Marcadores/Purple/life/0.png", "img/4. Marcadores/Purple/life/20.png", "img/4. Marcadores/Purple/life/60.png", "img/4. Marcadores/Purple/life/100.png"];
    this.loadImages(this.IMAGES_LIFE);
    this.setPercentage(100);
    this.x = 515;
    this.y = 50;
    this.energy = 100;
    this.width = 180;
    this.height = 50;
  }

  /**
   * Updates the life image based on percentage.
   */
  setPercentage(percentage) {
    this.percentageLife = percentage;

    let index = 0;
    if (percentage >= 100) index = 3;
    else if (percentage >= 60) index = 2;
    else if (percentage >= 20) index = 1;
    else index = 0;
    let imagePath = this.IMAGES_LIFE[index];
    this.img = this.imageCache[imagePath];
  }
}
