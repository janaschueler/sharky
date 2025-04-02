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

  IMAGES_SWIM = ["img/2.Enemy/1.Pufferfish/1.Swim/3.swim1.png", "img/2.Enemy/1.Pufferfish/1.Swim/3.swim2.png", "img/2.Enemy/1.Pufferfish/1.Swim/3.swim3.png", "img/2.Enemy/1.Pufferfish/1.Swim/3.swim4.png", "img/2.Enemy/1.Pufferfish/1.Swim/3.swim5.png"];
  IMAGES_TRANSITION = ["img/2.Enemy/1.Pufferfish/2.transition/3.transition1.png", "img/2.Enemy/1.Pufferfish/2.transition/3.transition2.png", "img/2.Enemy/1.Pufferfish/2.transition/3.transition3.png", "img/2.Enemy/1.Pufferfish/2.transition/3.transition4.png", "img/2.Enemy/1.Pufferfish/2.transition/3.transition5.png"];
  IMAGES_ATTACKING = ["img/2.Enemy/1.Pufferfish/3.Bubbleeswim/3.bubbleswim1.png", "img/2.Enemy/1.Pufferfish/3.Bubbleeswim/3.bubbleswim2.png", "img/2.Enemy/1.Pufferfish/3.Bubbleeswim/3.bubbleswim3.png", "img/2.Enemy/1.Pufferfish/3.Bubbleeswim/3.bubbleswim4.png", "img/2.Enemy/1.Pufferfish/3.Bubbleeswim/3.bubbleswim5.png"];
  IMAGES_DEAD = ["img/2.Enemy/1.Pufferfish/4.DIE/3.png", "img/2.Enemy/1.Pufferfish/4.DIE/3.2.png", "img/2.Enemy/1.Pufferfish/4.DIE/3.3.png"];
  constructor() {
    super();
    this.loadImage(this.IMAGES_SWIM[0]);
    this.loadImages(this.IMAGES_SWIM);
    this.loadImages(this.IMAGES_TRANSITION);

    this.x = 400 + Math.random() * 300;
    this.y = 0 + Math.random() * 400;
    this.animate();
  }

  animate() {
    setInterval(() => {
      if (this.isDead()) {
        this.playAnimation(this.IMAGES_DEAD);
      } else if (this.isInProximity()) {
        this.playAnimation(this.IMAGES_TRANSITION);
      }
    }, 200);
    this.moveLeft();
  }
}
