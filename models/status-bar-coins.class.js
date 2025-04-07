class StatusBarCoins extends DrawableObject {
  IMAGES_COINS = ["img/4. Marcadores/green/Coin/0_copia4.png", "img/4. Marcadores/green/Coin/20_copia2.png", "img/4. Marcadores/green/Coin/40_copia4.png", "img/4. Marcadores/green/Coin/60_copia4.png", "img/4. Marcadores/green/Coin/80_copia4.png", "img/4. Marcadores/green/Coin/100_copia4.png"];
  wallet = 0;

  constructor() {
    super();
    this.loadImages(this.IMAGES_COINS);
    this.setWallet(0);
    this.x = 20;
    this.y = 50;

    this.width = 180;
    this.height = 50;
  }

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
