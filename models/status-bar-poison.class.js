class StatusBarPoison extends DrawableObject {
  IMAGES_POISON = ["img/4. Marcadores/green/poisoned bubbles/0_copia2.png", "img/4. Marcadores/green/poisoned bubbles/20_copia3.png", "img/4. Marcadores/green/poisoned bubbles/40_copia2.png", "img/4. Marcadores/green/poisoned bubbles/60_copia2.png", "img/4. Marcadores/green/poisoned bubbles/80_copia2.png", "img/4. Marcadores/green/poisoned bubbles/100_copia3.png"];
  unitsPoison = 0;

  constructor() {
    super();
    this.loadImages(this.IMAGES_POISON);
    this.storePoison(0);
    this.x = 20;
    this.y = 90;

    this.width = 180;
    this.height = 50;
  }

  storePoison(amount) {
    let imagePath;
    if (amount > 5) {
      imagePath = this.IMAGES_POISON[5];
    } else {
      this.unitsPoison = amount;
      let index = Math.round(amount);
      imagePath = this.IMAGES_POISON[index];
    }
    this.img = this.imageCache[imagePath];
  }
}
