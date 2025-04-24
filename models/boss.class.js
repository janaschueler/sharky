class Boss extends MovableObjects {
  width = 350;
  height = this.width;
  y = -50;
  offset = {
    top: 120,
    left: 30,
    right: 50,
    bottom: 50,
  };
  world;
  firstContact = false;
  energy = 60;
  speed = 2;
  returning = false;
  hurtAnimationPlaying = false;

  IMAGES_INTRO = ["img/2.Enemy/3 Final Enemy/1.Introduce/1.png", "img/2.Enemy/3 Final Enemy/1.Introduce/2.png", "img/2.Enemy/3 Final Enemy/1.Introduce/3.png", "img/2.Enemy/3 Final Enemy/1.Introduce/4.png", "img/2.Enemy/3 Final Enemy/1.Introduce/5.png", "img/2.Enemy/3 Final Enemy/1.Introduce/6.png", "img/2.Enemy/3 Final Enemy/1.Introduce/7.png", "img/2.Enemy/3 Final Enemy/1.Introduce/8.png", "img/2.Enemy/3 Final Enemy/1.Introduce/9.png", "img/2.Enemy/3 Final Enemy/1.Introduce/10.png"];
  IMAGES_HOVER = ["img/2.Enemy/3 Final Enemy/2.floating/1.png", "img/2.Enemy/3 Final Enemy/2.floating/2.png", "img/2.Enemy/3 Final Enemy/2.floating/3.png", "img/2.Enemy/3 Final Enemy/2.floating/4.png", "img/2.Enemy/3 Final Enemy/2.floating/5.png", "img/2.Enemy/3 Final Enemy/2.floating/6.png", "img/2.Enemy/3 Final Enemy/2.floating/7.png", "img/2.Enemy/3 Final Enemy/2.floating/8.png", "img/2.Enemy/3 Final Enemy/2.floating/9.png", "img/2.Enemy/3 Final Enemy/2.floating/10.png", "img/2.Enemy/3 Final Enemy/2.floating/11.png", "img/2.Enemy/3 Final Enemy/2.floating/12.png", "img/2.Enemy/3 Final Enemy/2.floating/13.png"];
  IMAGES_TRANSITION = ["img/2.Enemy/3 Final Enemy/Attack/1.png", "img/2.Enemy/3 Final Enemy/Attack/2.png", "img/2.Enemy/3 Final Enemy/Attack/3.png", "img/2.Enemy/3 Final Enemy/Attack/4.png", "img/2.Enemy/3 Final Enemy/Attack/5.png", "img/2.Enemy/3 Final Enemy/Attack/6.png"];
  IMAGES_ATTACKING = ["img/2.Enemy/3 Final Enemy/Attack/1.png", "img/2.Enemy/3 Final Enemy/Attack/2.png", "img/2.Enemy/3 Final Enemy/Attack/3.png", "img/2.Enemy/3 Final Enemy/Attack/4.png", "img/2.Enemy/3 Final Enemy/Attack/5.png", "img/2.Enemy/3 Final Enemy/Attack/6.png"];
  IMAGES_HURT = ["img/2.Enemy/3 Final Enemy/Hurt/1.png", "img/2.Enemy/3 Final Enemy/Hurt/2.png", "img/2.Enemy/3 Final Enemy/Hurt/3.png", "img/2.Enemy/3 Final Enemy/Hurt/4.png"];
  IMAGES_DEAD = ["img/2.Enemy/3 Final Enemy/Dead/2.png", "img/2.Enemy/3 Final Enemy/Dead/6.png", "img/2.Enemy/3 Final Enemy/Dead/7.png", "img/2.Enemy/3 Final Enemy/Dead/8.png", "img/2.Enemy/3 Final Enemy/Dead/9.png", "img/2.Enemy/3 Final Enemy/Dead/10.png"];

  constructor(world) {
    super();
    this.world = world;

    this.loadImages(this.IMAGES_INTRO);
    this.loadImages(this.IMAGES_HOVER);
    this.loadImages(this.IMAGES_TRANSITION);
    this.loadImages(this.IMAGES_ATTACKING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);

    this.loadImage(this.IMAGES_INTRO[0]);
    this.img = this.imageCache[this.IMAGES_INTRO[0]];

    this.x = 2100;
  }

  animate() {
    let i = 0;
    setInterval(() => {
      if (this.energy <= 0) {
        if (!this.deadAnimationPlayed) {
          this.deadAnimationPlayed = true;

          this.playAnimationOnce(this.IMAGES_DEAD, () => {
            this.img = this.imageCache[this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1]];
          });
        } else {
          this.img = this.imageCache[this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1]];
          if (this.y < 400) this.y += 4; 
        }
        return;
      } else if (this.isHurt() && this.world.coins >= 5) {
        if (!this.hurtAnimationPlaying) {
          this.hurtAnimationPlaying = true;
          this.playAnimationOnce(this.IMAGES_HURT, () => {
            this.hurtAnimationPlaying = false;
            this.playAnimation(this.IMAGES_HOVER);
          });
        }
        return;
      } else if ((this.isInProximity() || this.returning) && this.world.coins >= 5) {
        this.movingAttack();
        this.playAnimation(this.IMAGES_ATTACKING);
        return;
      } else if (this.world.character && this.world.character.x >= 1000 && this.world.coins >= 5) {
        if (i < this.IMAGES_INTRO.length) {
          this.playAnimation(this.IMAGES_INTRO);
          i++;
        } else {
          this.playAnimation(this.IMAGES_HOVER);
        }
      }
    }, 200);
  }

  movingAttack() {
    const forwardSpeed = this.speed * 15;
    const returnSpeed = this.speed * 25;

    if (!this.returning) {
      this.x -= forwardSpeed;
      if (this.x <= 900) {
        this.returning = true;
        this.otherDirection = true;
      }
    } else {
      this.x += returnSpeed;
      if (this.x >= 2100) {
        this.returning = false;
        this.otherDirection = false;
      }
    }
  }

  lastHit = 0;

  reactToHit() {
    const now = Date.now();

    if (this.dead) return;
    if (now - this.lastHit < 1000) return;

    this.lastHit = now;
    this.energy -= 20;
    console.log("🔥 Boss hit! Energy left:", this.energy);

    if (this.energy <= 0) {
      this.dead = true;
      this.currentImage = 0;
    }
  }
}
