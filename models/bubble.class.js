
class Bubble extends ThrowableObject {
  width = 40;
  height = 40;
  IMAGES_BUBBLE = ["img/1.Sharkie/4.Attack/Bubble trap/Bubble.png"];
  IMAGES_BUBBLE_POISON = ["img/1.Sharkie/4.Attack/Bubble trap/Poisoned Bubble (for whale).png"];
  AUDIO_COLLECT = new Audio("audio/CollectCoin.mp3");
  offset = { top: 0, left: 0, right: 0, bottom: 0 };

  constructor() {
    super();
    this.loadImage(this.IMAGES_BUBBLE);
    this.loadImages(this.IMAGES_BUBBLE);
    this.loadImages(this.IMAGES_BUBBLE_POISON);
    
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES_BUBBLE);
    }, 300);
  }

  playSound() {
    this.AUDIO_COLLECT.currentTime = 0;
    this.AUDIO_COLLECT.play().catch(() => {});
  }
}
