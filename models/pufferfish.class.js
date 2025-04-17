class Puffers extends MovableObjects {
  width = 60;
  height = this.width;

  offset = {
    top: 10,
    left: 5,
    right: 10,
    bottom: 20,
  };
  energy = 20;
  lastSoundTime;

  IMAGES_SWIM = ["img/2.Enemy/1.Pufferfish/1.Swim/3.swim1.png", "img/2.Enemy/1.Pufferfish/1.Swim/3.swim2.png", "img/2.Enemy/1.Pufferfish/1.Swim/3.swim3.png", "img/2.Enemy/1.Pufferfish/1.Swim/3.swim4.png", "img/2.Enemy/1.Pufferfish/1.Swim/3.swim5.png"];
  IMAGES_TRANSITION = ["img/2.Enemy/1.Pufferfish/2.transition/3.transition1.png", "img/2.Enemy/1.Pufferfish/2.transition/3.transition2.png", "img/2.Enemy/1.Pufferfish/2.transition/3.transition3.png", "img/2.Enemy/1.Pufferfish/2.transition/3.transition4.png", "img/2.Enemy/1.Pufferfish/2.transition/3.transition5.png"];
  IMAGES_ATTACKING = ["img/2.Enemy/1.Pufferfish/3.Bubbleeswim/3.bubbleswim1.png", "img/2.Enemy/1.Pufferfish/3.Bubbleeswim/3.bubbleswim2.png", "img/2.Enemy/1.Pufferfish/3.Bubbleeswim/3.bubbleswim3.png", "img/2.Enemy/1.Pufferfish/3.Bubbleeswim/3.bubbleswim4.png", "img/2.Enemy/1.Pufferfish/3.Bubbleeswim/3.bubbleswim5.png"];
  IMAGES_DEAD = ["img/2.Enemy/1.Pufferfish/4.DIE/3.png", "img/2.Enemy/1.Pufferfish/4.DIE/3.2.png", "img/2.Enemy/1.Pufferfish/4.DIE/3.3.png"];

  AUDIO_HURT = new Audio("audio/hurtPuffer.mp3");

  constructor() {
    super();
    this.loadImage(this.IMAGES_SWIM[0]);
    this.loadImages(this.IMAGES_SWIM);
    this.loadImages(this.IMAGES_TRANSITION);
    this.loadImages(this.IMAGES_ATTACKING);
    this.loadImages(this.IMAGES_DEAD);

    this.x = 300 + Math.random() * 900;
    this.y = 0 + Math.random() * 400;
    this.animate();
  }

  animate() {
    setInterval(() => {
      if (this.markedForRemoval || this.isDead()) {
        return;
      }
      if (this.isInProximity()) {
        if (!this.isTransitioning && !this.isAttacking) {
          this.startTransition();
        }
      } else {
        this.playAnimation(this.IMAGES_SWIM);
      }
    }, 200);
    this.moveLeft();
  }

  playSoundHurt() {
    const now = Date.now();

    if (!this.lastSoundTime || now - this.lastSoundTime >= 1000) {
      this.lastSoundTime = now;
      this.AUDIO_HURT.currentTime = 0;
      this.AUDIO_HURT.play();
    }
    setTimeout(() => {
      this.AUDIO_HURT.pause();
      this.AUDIO_HURT.currentTime = 0;
    }, 1300);
  }

  reactToHit() {
    this.energy = 0;
    this.playAnimationOnce(this.IMAGES_DEAD, () => {
      this.img = this.imageCache[this.IMAGES_DEAD[2]];
      let hitSpeed = this.speed * 5;
      let floatInterval = setInterval(() => {
        this.x -= hitSpeed;
        this.y -= hitSpeed;
        if (this.y + this.height < 0) {
          clearInterval(floatInterval);
          this.markedForRemoval = true;
        }
      }, 1000 / 60);
    });
  }
}
