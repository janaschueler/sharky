class ThrowableObject extends MovableObjects {
  speedX = 20;
  speedY = 30;
  constructor() {
    super();
    this.offset = {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    };
    this.x = 0;
    this.y = 0;
    this.damage = 10;
    this.name = "Throwable Object";
  }

  throw() {
    console.log(`Throwing ${this.name} for ${this.damage} damage!`);
  }
}
