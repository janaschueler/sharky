class Boss extends MovableObjects {
  width = 350;
  height = this.width;
  y = -50;
  offset = {
    top: 10,
    left: 5,
    right: 10,
    bottom: 20,
  };
  world;
  firstContact = false;

  IMAGES_INTRO = ["img/2.Enemy/3 Final Enemy/1.Introduce/1.png", "img/2.Enemy/3 Final Enemy/1.Introduce/2.png", "img/2.Enemy/3 Final Enemy/1.Introduce/3.png", "img/2.Enemy/3 Final Enemy/1.Introduce/4.png", "img/2.Enemy/3 Final Enemy/1.Introduce/5.png", "img/2.Enemy/3 Final Enemy/1.Introduce/6.png", "img/2.Enemy/3 Final Enemy/1.Introduce/7.png", "img/2.Enemy/3 Final Enemy/1.Introduce/8.png", "img/2.Enemy/3 Final Enemy/1.Introduce/9.png", "img/2.Enemy/3 Final Enemy/1.Introduce/10.png"];
  IMAGES_HOVER = ["img/2.Enemy/3 Final Enemy/2.floating/1.png", "img/2.Enemy/3 Final Enemy/2.floating/2.png", "img/2.Enemy/3 Final Enemy/2.floating/3.png", "img/2.Enemy/3 Final Enemy/2.floating/4.png", "img/2.Enemy/3 Final Enemy/2.floating/5.png", "img/2.Enemy/3 Final Enemy/2.floating/6.png", "img/2.Enemy/3 Final Enemy/2.floating/7.png", "img/2.Enemy/3 Final Enemy/2.floating/8.png", "img/2.Enemy/3 Final Enemy/2.floating/9.png", "img/2.Enemy/3 Final Enemy/2.floating/10.png", "img/2.Enemy/3 Final Enemy/2.floating/11.png", "img/2.Enemy/3 Final Enemy/2.floating/12.png", "img/2.Enemy/3 Final Enemy/2.floating/13.png"];

  constructor(world) {
    super();
    this.world = world;

    this.loadImages(this.IMAGES_INTRO);
    this.loadImages(this.IMAGES_HOVER);

    this.loadImage(this.IMAGES_INTRO[0]);
    this.img = this.imageCache[this.IMAGES_INTRO[0]];

    this.x = 2100;
  }

  // animate() {
  //   let i = 0;
  //   let introDone = false;

  //   setInterval(() => {
  //     if (this.world.character && this.world.character.x > 1900) {
  //       if (!introDone && i < this.IMAGES_INTRO.length * 1.5) {
  //         this.playAnimation(this.IMAGES_INTRO);
  //         i++;
  //       } else {
  //         if (!introDone) {
  //           this.currentImage = 0;
  //           introDone = true;
  //         }
  //         this.playAnimation(this.IMAGES_HOVER);
  //       }
  //     }
  //   }, 200);
  // }
  animate() {
    let i = 0;
    setInterval(() => {
      if (this.world.character && this.world.character.x > 1300) {
        if (i < this.IMAGES_INTRO.length) {
          this.playAnimation(this.IMAGES_INTRO);
        } else {
          this.playAnimation(this.IMAGES_HOVER);
        }
        i++;
      }
    }, 200);
  }
}
