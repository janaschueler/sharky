class StatusBarLife extends DrawableObject {
  IMAGES_LIFE = ["img/4. Marcadores/green/Life/0_ copia3.png", "img/4. Marcadores/green/Life/20_ copia4.png", "img/4. Marcadores/green/Life/40_ copia3.png", "img/4. Marcadores/green/Life/60_copia3.png", "img/4. Marcadores/green/Life/80_ copia3.png", "img/4. Marcadores/green/Life/100_ copia2.png"];
  percentageLife = 100;

  constructor() {
    super();
    this.loadImages(this.IMAGES_LIFE);
    this.setPercentage(100);
    this.x = 20;
    this.y = 10;
    this.width = 180;
    this.height = 50;
  }

  setPercentage(percentage) {
    this.percentageLife = percentage;
    let index = Math.round(percentage / 20);
    let imagePath = this.IMAGES_LIFE[index];
    this.img = this.imageCache[imagePath];
  }
}
