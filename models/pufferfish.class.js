class Puffers extends MovableObjects {
  width = 60;
  height = this.width;
  offset = {
    top: 10,
    left: 5,
    right: 10,
    bottom: 20,
  };
  energy = 5;
  isNear = false;
  moving = false;
  isAttacking = false;
  isTransitioning = false;

  IMAGES_SWIM = ["img/2.Enemy/1.Pufferfish/1.Swim/3.swim1.png", "img/2.Enemy/1.Pufferfish/1.Swim/3.swim2.png", "img/2.Enemy/1.Pufferfish/1.Swim/3.swim3.png", "img/2.Enemy/1.Pufferfish/1.Swim/3.swim4.png", "img/2.Enemy/1.Pufferfish/1.Swim/3.swim5.png"];
  IMAGES_TRANSITION = ["img/2.Enemy/1.Pufferfish/2.transition/3.transition1.png", "img/2.Enemy/1.Pufferfish/2.transition/3.transition2.png", "img/2.Enemy/1.Pufferfish/2.transition/3.transition3.png", "img/2.Enemy/1.Pufferfish/2.transition/3.transition4.png", "img/2.Enemy/1.Pufferfish/2.transition/3.transition5.png"];
  IMAGES_ATTACKING = ["img/2.Enemy/1.Pufferfish/3.Bubbleeswim/3.bubbleswim1.png", "img/2.Enemy/1.Pufferfish/3.Bubbleeswim/3.bubbleswim2.png", "img/2.Enemy/1.Pufferfish/3.Bubbleeswim/3.bubbleswim3.png", "img/2.Enemy/1.Pufferfish/3.Bubbleeswim/3.bubbleswim4.png", "img/2.Enemy/1.Pufferfish/3.Bubbleeswim/3.bubbleswim5.png"];
  IMAGES_DEAD = ["img/2.Enemy/1.Pufferfish/4.DIE/3.png", "img/2.Enemy/1.Pufferfish/4.DIE/3.2.png", "img/2.Enemy/1.Pufferfish/4.DIE/3.3.png"];

  constructor() {
    super();
    this.loadImage(this.IMAGES_SWIM[0]);
    this.loadImages(this.IMAGES_SWIM);
    this.loadImages(this.IMAGES_TRANSITION);
    this.loadImages(this.IMAGES_ATTACKING);

    this.x = 400 + Math.random() * 300;
    this.y = 0 + Math.random() * 400;
    this.animate();
  }

  animate() {
    setInterval(() => {
      if (this.isInProximity()) {
        this.startTransition();
      } else if (!this.isAttacking && !this.isTransitioning) {
        this.playAnimation(this.IMAGES_SWIM);
        if (!this.moving) {
          this.moveLeft();
          this.moving = true;
        }
      }
    }, 200);
  }

  startTransition() {
    if (!this.isTransitioning) {
      this.isTransitioning = true;
      this.playAnimationOnce(this.IMAGES_TRANSITION, () => {
        this.startAttack();
      });
    }
  }

  startAttack() {
    if (!this.isAttacking) {
      this.isAttacking = true;
      this.playAnimationOnce(this.IMAGES_ATTACKING, () => {
        this.attackLoop();
      });
    }
  }

  attackLoop() {
    if (this.isInProximity()) {
      this.attack();
      setTimeout(() => this.attackLoop(), 500);
    } else {
      this.isAttacking = false;
      this.isTransitioning = false;
    }
  }

  playAnimationOnce(images, callback) {
    let index = 0;
    let interval = setInterval(() => {
      this.img = this.imageCache[images[index]];
      index++;
      if (index >= images.length) {
        clearInterval(interval);
        if (callback) callback();
      }
    }, 200);
  }

  closeBy() {
    this.isNear = true;
    // console.log("🚀 ~ MovableObjects ~ close ~ isNear:", this.isNear);
    return this.isNear;
  }

  farAway() {
    this.isNear = false;
  }
  isInProximity() {
    // console.log("🚀 ~ MovableObjects ~ isInProximity ~ isNear:", this.isNear);
    return this.isNear;
  }
}
