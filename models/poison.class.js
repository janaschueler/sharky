/**
 * Represents a poison collectable in the game.
 * Inherits from MovableObjects and includes basic animation and sound playback.
 *
 * Features:
 * - Static poison image (ground object)
 * - Randomized horizontal spawn position
 * - Simple animation loop
 * - Plays a sound when collected
 */
class Poison extends MovableObjects {
  width = 60;
  height = 80;
  IMAGES_GROUND = ["img/4. Marcadores/Posiขn/Dark - Left.png"];
  AUDIO_COLLECT = new Audio("audio/collectPoison.mp3");
  offset = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  /**
   * Constructs a new instance of the class and initializes its properties.
   * - Loads the initial image and a set of images for the object.
   * - Sets the object's position randomly along the x-axis within a specified range.
   * - Sets the y-axis position to a fixed value.
   * - Starts the animation process for the object.
   */
  constructor() {
    super();
    this.loadImage(this.IMAGES_GROUND[0]);
    this.loadImages(this.IMAGES_GROUND);
    this.x = -400 + Math.random() * 2200;
    this.y = 350;
    this.animate();
  }

  /**
   * Animates the object by periodically playing a ground animation.
   * The animation is played using the images specified in `this.IMAGES_GROUND`.
   * The animation interval is set to 300 milliseconds.
   */
  animate() {
    setInterval(() => this.playAnimation(this.IMAGES_GROUND), 300);
  }

  /**
   * Plays the collect sound effect by resetting the audio's current time to 0
   * and then playing the audio. This method assumes that `AUDIO_COLLECT` is
   * an audio element that has been properly initialized.
   */
  playSound() {
    this.AUDIO_COLLECT.currentTime = 0;
    this.AUDIO_COLLECT.play();
  }
}
