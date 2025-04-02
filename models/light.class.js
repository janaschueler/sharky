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
