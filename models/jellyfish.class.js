class Jellyfish extends MovableObjects {
  width = 80;
  height = this.width;

  offset = {
    top: 10,
    left: 5,
    right: 10,
    bottom: 20,
  };
  dead = false;

  IMAGES_SWIM = ["img/2.Enemy/2 Jelly fish/Regular damage/Yellow 1.png", "img/2.Enemy/2 Jelly fish/Regular damage/Yellow 2.png", "img/2.Enemy/2 Jelly fish/Regular damage/Yellow 3.png", "img/2.Enemy/2 Jelly fish/Regular damage/Yellow 4.png"];
  IMAGES_TRANSITION = ["img/2.Enemy/2 Jelly fish/S｣per dangerous/Pink1.png", "img/2.Enemy/2 Jelly fish/S｣per dangerous/Pink2.png", "img/2.Enemy/2 Jelly fish/S｣per dangerous/Pink3.png", "img/2.Enemy/2 Jelly fish/S｣per dangerous/Pink4.png"];
  IMAGES_ATTACKING = ["img/2.Enemy/2 Jelly fish/S｣per dangerous/Pink1.png", "img/2.Enemy/2 Jelly fish/S｣per dangerous/Pink2.png", "img/2.Enemy/2 Jelly fish/S｣per dangerous/Pink3.png", "img/2.Enemy/2 Jelly fish/S｣per dangerous/Pink4.png"];
  IMAGES_DEAD = ["img/2.Enemy/2 Jelly fish/Dead/Yellow/y1.png", "img/2.Enemy/2 Jelly fish/Dead/Yellow/y2.png", "img/2.Enemy/2 Jelly fish/Dead/Yellow/y3.png", "img/2.Enemy/2 Jelly fish/Dead/Yellow/y4.png"];

  AUDIO_HURT = new Audio("audio/hurtElectricShock.mp3");

  constructor() {
    super();
    this.loadImage(this.IMAGES_SWIM[0]);
    this.loadImages(this.IMAGES_SWIM);
    this.loadImages(this.IMAGES_ATTACKING);
    this.loadImages(this.IMAGES_DEAD);

    this.x = 500 + Math.random() * 1200;
    this.y = 20 + Math.random() * 360;
    this.animate();
  }

  animate() {
    setInterval(() => {
      if (this.dead) {
        this.playAnimation(this.IMAGES_DEAD);
        if (!this.hasStartedFloating) {
          this.hasStartedFloating = true;
          this.floatInterval = setInterval(() => {
            this.y -= this.speed * 10;
            if (this.y + this.height < 0) {
              clearInterval(this.floatInterval);
              this.markedForRemoval = true;
            }
          }, 1000 / 60);
        }

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

  reactToHit() {
    if (this.dead) return;

    this.dead = true;
    this.hasStartedFloating = false;
    this.clearImageCache();
    this.loadImages(this.IMAGES_DEAD);
    this.playAnimation(this.IMAGES_DEAD);
    this.currentImage = 0;
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
}
