class Sharky extends MovableObjects {
  width = 200;
  height = 200;
  y = 100;
  speed = 10;
  offset = {
    top: 110,
    left: +50,
    right: 45,
    bottom: +50,
  };
  world;

  IMAGES_HOVER = ["img/1.Sharkie/1.IDLE/1.png", "img/1.Sharkie/1.IDLE/2.png", "img/1.Sharkie/1.IDLE/3.png", "img/1.Sharkie/1.IDLE/4.png", "img/1.Sharkie/1.IDLE/5.png", "img/1.Sharkie/1.IDLE/6.png", "img/1.Sharkie/1.IDLE/7.png", "img/1.Sharkie/1.IDLE/8.png", "img/1.Sharkie/1.IDLE/9.png", "img/1.Sharkie/1.IDLE/10.png", "img/1.Sharkie/1.IDLE/11.png", "img/1.Sharkie/1.IDLE/12.png", "img/1.Sharkie/1.IDLE/13.png", "img/1.Sharkie/1.IDLE/14.png", "img/1.Sharkie/1.IDLE/15.png", "img/1.Sharkie/1.IDLE/16.png", "img/1.Sharkie/1.IDLE/17.png", "img/1.Sharkie/1.IDLE/18.png"];
  IMAGES_SLEEP = ["img/1.Sharkie/2.Long_IDLE/i1.png", "img/1.Sharkie/2.Long_IDLE/i2.png", "img/1.Sharkie/2.Long_IDLE/i3.png", "img/1.Sharkie/2.Long_IDLE/i4.png", "img/1.Sharkie/2.Long_IDLE/i5.png", "img/1.Sharkie/2.Long_IDLE/i6.png", "img/1.Sharkie/2.Long_IDLE/i7.png", "img/1.Sharkie/2.Long_IDLE/i8.png", "img/1.Sharkie/2.Long_IDLE/i9.png", "img/1.Sharkie/2.Long_IDLE/i10.png", "img/1.Sharkie/2.Long_IDLE/i11.png", "img/1.Sharkie/2.Long_IDLE/i12.png", "img/1.Sharkie/2.Long_IDLE/i13.png", "img/1.Sharkie/2.Long_IDLE/i14.png"];
  IMAGES_SWIM = ["img/1.Sharkie/3.Swim/1.png", "img/1.Sharkie/3.Swim/2.png", "img/1.Sharkie/3.Swim/3.png", "img/1.Sharkie/3.Swim/4.png", "img/1.Sharkie/3.Swim/5.png", "img/1.Sharkie/3.Swim/6.png"];
  IMAGES_ATTACK_BUBBLE = ["img/1.Sharkie/4.Attack/Bubble trap/op1/1.png", "img/1.Sharkie/4.Attack/Bubble trap/op1/2.png", "img/1.Sharkie/4.Attack/Bubble trap/op1/3.png", "img/1.Sharkie/4.Attack/Bubble trap/op1/4.png", "img/1.Sharkie/4.Attack/Bubble trap/op1/5.png", "img/1.Sharkie/4.Attack/Bubble trap/op1/6.png", "img/1.Sharkie/4.Attack/Bubble trap/op1/7.png", "img/1.Sharkie/4.Attack/Bubble trap/op1/8.png"];
  IMAGES_ATTACK_FIN = ["img/1.Sharkie/4.Attack/Fin slap/1.png", "img/1.Sharkie/4.Attack/Fin slap/2.png", "img/1.Sharkie/4.Attack/Fin slap/3.png", "img/1.Sharkie/4.Attack/Fin slap/4.png", "img/1.Sharkie/4.Attack/Fin slap/5.png", "img/1.Sharkie/4.Attack/Fin slap/6.png", "img/1.Sharkie/4.Attack/Fin slap/7.png", "img/1.Sharkie/4.Attack/Fin slap/8.png"];
  IMAGES_HURT_POISON = ["img/1.Sharkie/5.Hurt/1.Poisoned/1.png", "img/1.Sharkie/5.Hurt/1.Poisoned/2.png", "img/1.Sharkie/5.Hurt/1.Poisoned/3.png", "img/1.Sharkie/5.Hurt/1.Poisoned/4.png", "img/1.Sharkie/5.Hurt/1.Poisoned/5.png"];
  IMAGES_HURT_ELECTRIC = ["img/1.Sharkie/5.Hurt/2.Electric shock/.o1.png", "img/1.Sharkie/5.Hurt/2.Electric shock/.o2.png", "img/1.Sharkie/5.Hurt/2.Electric shock/.o3.png"];
  IMAGES_DEAD = ["img/1.Sharkie/6.dead/1.Poisoned/1.png", "img/1.Sharkie/6.dead/1.Poisoned/2.png", "img/1.Sharkie/6.dead/1.Poisoned/3.png", "img/1.Sharkie/6.dead/1.Poisoned/4.png", "img/1.Sharkie/6.dead/1.Poisoned/5.png", "img/1.Sharkie/6.dead/1.Poisoned/6.png", "img/1.Sharkie/6.dead/1.Poisoned/7.png", "img/1.Sharkie/6.dead/1.Poisoned/8.png", "img/1.Sharkie/6.dead/1.Poisoned/9.png", "img/1.Sharkie/6.dead/1.Poisoned/10.png", "img/1.Sharkie/6.dead/1.Poisoned/11.png", "img/1.Sharkie/6.dead/1.Poisoned/12.png"];

  constructor() {
    super();
    this.loadImage(this.IMAGES_HOVER[0]);
    this.loadImages(this.IMAGES_HOVER);
    this.loadImages(this.IMAGES_SLEEP);
    this.loadImages(this.IMAGES_SWIM);
    this.loadImages(this.IMAGES_ATTACK_BUBBLE);
    this.loadImages(this.IMAGES_ATTACK_FIN);
    this.loadImages(this.IMAGES_HURT_POISON);
    this.loadImages(this.IMAGES_HURT_ELECTRIC);
    this.loadImages(this.IMAGES_DEAD);

    this.animate();
  }

  /**
   * Animates the sharky object by updating its position and triggering animations
   * based on keyboard input. The method uses two intervals:
   *
   * 1. Updates the position of the object and camera based on keyboard input
   *    (e.g., moving left or right).
   * 2. Plays the appropriate animation (hover or swim) depending on whether
   *    any movement keys are pressed.
   *
   * @method
   */
  animate() {
    setInterval(() => {
      if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
        this.x += this.speed; // I move the object to the right with a speed of 10ms
        this.otherDirection = false; // I keep the order of the images
        this.swimUp = false;
        this.swimDown = false;
      }
      if (this.world.keyboard.LEFT && this.x > -1300) {
        this.x -= this.speed;
        this.otherDirection = true; // I flip the image
        this.swimUp = false;
        this.swimDown = false;
      }
      if (this.world.keyboard.UP && this.otherDirection === false && this.x > -1300 && this.x < this.world.level.level_end_x && this.y > -80) {
        this.x += this.speed;
        this.y -= this.speed / 5;
        this.swimUp = true;
        this.swimDown = false;
      }

      if (this.world.keyboard.UP && this.otherDirection === true && this.x > -1300 && this.x < 2000 && this.y > -80) {
        this.x -= this.speed;
        this.y -= this.speed / 5;
        this.swimUp = true;
        this.swimDown = false;
      }

      if (this.world.keyboard.DOWN && this.otherDirection === false && this.x > -1300 && this.x < this.world.level.level_end_x && this.y < 400) {
        this.x += this.speed;
        this.y += this.speed / 5;
        this.swimDown = true;
        this.swimUp = false;
      }
      if (this.world.keyboard.DOWN && this.otherDirection === true && this.x > -1300 && this.x < 2000 && this.y < 400) {
        this.x -= this.speed;
        this.y += this.speed / 5;
        this.swimDown = true;
        this.swimUp = false;
      }
      this.world.camera_x = -this.x + 60;
    }, 1000 / 60);

    setInterval(() => {
      if (this.isDead()) {
        this.playAnimation(this.IMAGES_DEAD);
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT_POISON);
      } else if (!this.world.keyboard.LEFT && !this.world.keyboard.RIGHT && !this.world.keyboard.UP && !this.world.keyboard.DOWN) {
        // with this function I call upon the individual images HOVER as I an not pressing any key and store them in my imageCache
        this.playAnimation(this.IMAGES_HOVER);
        this.swimUp = false;
        this.swimDown = false;
      } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT || this.world.keyboard.UP || this.world.keyboard.DOWN) {
        // with this function I call upon the individual images SWIM as I am pressing a key and store them in my imageCache
        this.playAnimation(this.IMAGES_SWIM);
      }
    }, 200);
  }
}
