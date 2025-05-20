/**
 * Base class for all objects in the game that can move and interact with the environment.
 * Extends DrawableObject and adds properties related to movement, direction,
 * interaction states, and combat behavior.
 *
 * Features:
 * - Horizontal and vertical movement states
 * - Basic energy/health tracking
 * - Flags for proximity, transition, and attack logic
 * - Randomized speed for natural variation in behavior
 */

class MovableObjects extends DrawableObject {
  speed = 0.15 + Math.random() * 0.25;
  otherDirection = false;
  swimUp = false;
  swimDown = false;
  energy = 100;
  lastHit;
  isNear = false;
  moving = false;
  isAttacking = false;
  isTransitioning = false;
  specialAttackPlayed = false;
  speedY = 0;
  speedX = 2;
  accelerationY = -0.02;
  accelerationX = 0;
  isDead = false;
  currentlyPlayingOnce = false;

  // applyGravity(direction = 1) {
  //   this.moveInterval = setInterval(() => {
  //     this.x += this.speedX * direction;
  //     this.y += this.speedY;
  //     this.speedY += this.accelerationY;
  //     this.speedX += this.accelerationX;
  //     if (this.accelerationX <= 0 && this.speedX <= 0) {
  //       this.speedX = 0;
  //       this.accelerationX = 0;
  //     }
  //   }, 1000 / 25);
  // }

  applyGravity(direction = 1) {
    this.moveInterval = setInterval(() => {
      this.x += this.speedX * direction;
      this.y += this.speedY;
      this.speedY += this.accelerationY;
      this.speedX += this.accelerationX;
      if (this.accelerationX <= 0 && this.speedX <= 0) {
        this.speedX = 0;
        this.accelerationX = 0;
      }
    }, 1000 / 25);
  }

  /**
   * Plays an animation by cycling through a given array of image paths.
   * Updates the current image to be displayed based on the provided images array.
   *
   * @param {string[]} images - An array of image paths to be used for the animation.
   *                             If the object is marked as "dead" (`this.dead`),
   *                             the animation will only proceed if the provided images
   *                             array matches `this.IMAGES_DEAD`.
   */
  playAnimation(images) {
    if (this.dead && images !== this.IMAGES_DEAD) return;
    if (this.currentlyPlayingOnce) return; 
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Plays an animation by cycling through an array of image paths at a fixed interval.
   * Once all images have been displayed, the animation stops and an optional callback is executed.
   *
   * @param {string[]} images - An array of image paths to be used in the animation.
   * @param {Function} [callback] - An optional callback function to be executed after the animation completes.
   */
  playAnimationOnce(images, callback) {
    this.currentlyPlayingOnce = true;
    let index = 0;
    let interval = setInterval(() => {
      let path = images[index];
      this.img = this.imageCache[path];
      index++;
      if (index >= images.length) {
        clearInterval(interval);
        this.currentlyPlayingOnce = false;
        if (callback) callback();
      }
    }, 200);
  }

  /**
   * Initiates the movement of the object to the left.
   * Clears any existing movement intervals before starting a new one.
   * The movement alternates direction periodically to simulate a zigzag or oscillating motion.
   *
   * @method moveLeft
   * @returns {void}
   */
  moveLeft() {
    if (this.moveInterval) clearInterval(this.moveInterval);
    let direction = 1;
    this.moveInterval = setInterval(() => {
      if (this.dead) return this.clearExistingMovement();
      this.performLeftMovement(direction);
    }, 1000 / 60);
    this.startDirectionToggle(() => (direction *= -1));
  }

  /**
   * Clears the existing movement interval if it is set.
   * This method stops any ongoing movement by clearing the interval
   * associated with the `moveInterval` property.
   */
  clearExistingMovement() {
    if (this.moveInterval) clearInterval(this.moveInterval);
  }

  /**
   * Moves the object to the left by decreasing its x-coordinate and adjusts the y-coordinate
   * based on the specified direction and the object's speed.
   *
   * @param {number} direction - The direction factor for vertical movement.
   *                             A positive value moves the object down,
   *                             and a negative value moves it up.
   */
  performLeftMovement(direction) {
    this.x -= this.speed;
    this.y += this.speed * direction;
  }

  /**
   * Starts a loop that repeatedly calls the provided toggle function (`toggleFn`)
   * at random intervals between 1 second and 12 seconds.
   *
   * @param {Function} toggleFn - The function to be called at each interval.
   *                              This function is responsible for toggling the direction or performing any desired action.
   */
  startDirectionToggle(toggleFn) {
    const loop = () => {
      toggleFn();
      const randomTime = Math.random() * 11000 + 1000;
      setTimeout(loop, randomTime);
    };
    loop();
  }

  /**
   * Plays a ping-pong animation by cycling through a given array of image paths.
   * The animation alternates direction when it reaches the beginning or end of the array.
   *
   * @param {string[]} images - An array of image paths to be used in the animation.
   */
  playPingPongAnimation(images) {
    let index = 0;
    let direction = 1;
    this.currentImage = 0;
    this.pingPongInterval = setInterval(() => {
      this.img = this.imageCache[images[index]];
      index += direction;
      if (index >= images.length - 1 || index <= 0) {
        direction *= -1;
      }
    }, 200);
  }

  // prettier-ignore
  /**
   * Checks if the current object is colliding with another object.
   *
   * @param {Object} obj - The object to check for collision.
   * @param {number} obj.x - The x-coordinate of the other object.
   * @param {number} obj.y - The y-coordinate of the other object.
   * @param {number} obj.width - The width of the other object.
   * @param {number} obj.height - The height of the other object.
   * @param {Object} obj.offset - The offset values for the other object.
   * @param {number} obj.offset.left - The left offset of the other object.
   * @param {number} obj.offset.right - The right offset of the other object.
   * @param {number} obj.offset.top - The top offset of the other object.
   * @param {number} obj.offset.bottom - The bottom offset of the other object.
   * @returns {boolean} True if the objects are colliding, false otherwise.
   */
  isColliding(obj) {
    return this.x + this.width - this.offset.right >= obj.x + obj.offset.left && 
           this.x + this.offset.left <= obj.x + obj.width - obj.offset.right &&
           this.y + this.height - this.offset.bottom >= obj.y + obj.offset.top && 
           this.y + this.offset.top <= obj.y + obj.height - obj.offset.bottom;
}

  /**
   * Determines if the current object is close to another object based on their positions,
   * dimensions, and offsets. The method adjusts the boundaries of both objects by adding
   * a margin of 60 pixels to each side before performing the proximity check.
   *
   * @param {Object} obj - The object to compare against.
   * @param {number} obj.x - The x-coordinate of the object.
   * @param {number} obj.y - The y-coordinate of the object.
   * @param {number} obj.width - The width of the object.
   * @param {number} obj.height - The height of the object.
   * @param {Object} obj.offset - The offset values for the object.
   * @param {number} obj.offset.left - The left offset of the object.
   * @param {number} obj.offset.right - The right offset of the object.
   * @param {number} obj.offset.top - The top offset of the object.
   * @param {number} obj.offset.bottom - The bottom offset of the object.
   * @returns {boolean} - Returns `true` if the current object is close to the given object, otherwise `false`.
   */
  isClose(obj) {
    const adjustedX = this.x + this.width - this.offset.right + 60;
    const adjustedY = this.y + this.height - this.offset.bottom + 60;
    const adjustedWidth = obj.x + obj.width - obj.offset.left + 60;
    const adjustedHeight = obj.y + obj.height - obj.offset.top + 60;
    return adjustedX >= obj.x + obj.offset.left && this.x + this.offset.left <= adjustedWidth && adjustedY >= obj.y + obj.offset.top && this.y + this.offset.top <= adjustedHeight;
  }

  /**
   * Determines if the boss object is close to another object based on their adjusted positions and dimensions.
   *
   * @param {Object} obj - The object to compare against.
   * @param {number} obj.x - The x-coordinate of the object.
   * @param {number} obj.y - The y-coordinate of the object.
   * @param {number} obj.width - The width of the object.
   * @param {number} obj.height - The height of the object.
   * @param {Object} obj.offset - The offset values for the object.
   * @param {number} obj.offset.left - The left offset of the object.
   * @param {number} obj.offset.top - The top offset of the object.
   *
   * @returns {boolean} - Returns `true` if the boss object is close to the specified object, otherwise `false`.
   */
  bossIsClose(obj) {
    const adjustedX = this.x + this.width - this.offset.right + 200;
    const adjustedY = this.y + this.height - this.offset.bottom + 200;
    const adjustedWidth = obj.x + obj.width - obj.offset.left + 200;
    const adjustedHeight = obj.y + obj.height - obj.offset.top + 200;
    return adjustedX >= obj.x + obj.offset.left && this.x + this.offset.left <= adjustedWidth && adjustedY >= obj.y + obj.offset.top && this.y + this.offset.top <= adjustedHeight;
  }

  /**
   * Determines if the current object is in front of another object.
   *
   * @param {Object} obj - The object to compare against.
   * @param {number} obj.x - The x-coordinate of the object.
   * @param {number} obj.y - The y-coordinate of the object.
   * @param {number} obj.width - The width of the object.
   * @param {number} obj.height - The height of the object.
   * @param {Object} obj.offset - The offset values for the object.
   * @param {number} obj.offset.left - The left offset of the object.
   * @param {number} obj.offset.top - The top offset of the object.
   * @param {number} obj.offset.bottom - The bottom offset of the object.
   * @returns {boolean} - Returns true if the current object is in front of the specified object, otherwise false.
   */
  isInFront(obj) {
    const thisRight = this.x + this.width - this.offset.right;
    const thisTop = this.y + this.offset.top;
    const thisBottom = this.y + this.height - this.offset.bottom;
    const objLeft = obj.x + obj.offset.left;
    const objTop = obj.y + obj.offset.top;
    const objBottom = obj.y + obj.height - obj.offset.bottom;
    return thisRight >= objLeft && thisRight <= objLeft + 10 && thisBottom >= objTop && thisTop <= objBottom;
  }

  /**
   * Handles the "hit" action for the object. This method reduces the object's energy
   * and updates the last hit timestamp if certain conditions are met.
   *
   * @returns {boolean} Returns `false` if the hit action cannot be performed due to any of the conditions.
   */
  hit() {
    let now = new Date().getTime();
    if (this.isDead || this.energy <= 0) return false;
    if (this.isAttacking) return;
    if (this.world.keyboard.SPACE) {
      if (this.isBoss && this.poisonAmount <= 0) {
      }
      if (this.isBoss && this.poisonAmount > 0) {
        return; 
      }
      if (!this.isBoss) {
        return;
      }
    }
    if ((!this.lastHit || now - this.lastHit >= 1000) && !this.specialAttackPlayed) {
      this.energy -= 20;
      if (this.energy < 0) {
        this.energy = 0;
      }
      this.lastHit = now;
    }
  }

  /**
   * Determines if the object is currently in a "hurt" state.
   * The object is considered hurt if the time elapsed since the last hit is less than 1 second.
   *
   * @returns {boolean} - Returns `true` if the object is hurt, otherwise `false`.
   */
  isHurt() {
    let timePassed = new Date().getTime() - this.lastHit; // difference in ms
    timePassed = timePassed / 1000; // difference in seconds
    return timePassed < 1;
  }

  /**
   * Initiates the transition process for the object.
   * If the object is not already transitioning, it sets the transitioning state to true,
   * plays a transition animation once using the specified images, and then starts the attack phase.
   *
   * @method
   */
  startTransition() {
    if (!this.isTransitioning) {
      this.isTransitioning = true;
      this.playAnimationOnce(this.IMAGES_TRANSITION, () => {
        this.startAttack();
      });
    }
  }


  /**
   * Initiates the attack sequence for the object if it is not already attacking.
   * Plays the attack animation once, then repeatedly checks if the object is still in proximity to continue attacking.
   * If the object is no longer in proximity, stops the attack and resets relevant state flags.
   *
   * @method
   * @returns {void}
   */
  startAttack() {
    if (!this.isAttacking) {
      this.isAttacking = true;
      this.playAnimationOnce(this.IMAGES_ATTACKING, () => {
        this.attackInterval = setInterval(() => {
          if (this.isInProximity()) {
            this.playAnimation(this.IMAGES_ATTACKING);
          } else {
            clearInterval(this.attackInterval);
            this.isAttacking = false;
            this.isTransitioning = false;
          }
        }, 200);
      });
    }
  }

  /**
   * Checks if the object is in proximity.
   *
   * @returns {boolean} Returns `true` if the object is near, otherwise `false`.
   */
  isInProximity() {
    return this.isNear;
  }

  /**
   * Marks the object as being near by setting the `isNear` property to `true`.
   *
   * @returns {boolean} Returns `true` to indicate the object is near.
   */
  closeBy() {
    this.isNear = true;
    return this.isNear;
  }

  /**
   * Marks the object as being far away by setting the `isNear` property to `false`.
   */
  farAway() {
    this.isNear = false;
  }

  /**
   * Checks if the object is considered "dead" based on its energy level.
   *
   * @returns {boolean} Returns `true` if the energy is 0, otherwise `false`.
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * Plays the provided audio element from the beginning.
   * If the audio is already playing, it will pause and reset before playing again.
   * Logs a warning to the console if the audio cannot be played.
   *
   * @param {HTMLAudioElement} audio - The audio element to be played. If null or undefined, the function will return without doing anything.
   */
  playSound(audio) {
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    audio.play().catch((e) => console.warn("🔇 Sound konnte nicht abgespielt werden:", e));
  }

  /**
   * Stops the playback of a specified audio sound.
   *
   * @param {string} name - The name of the audio sound to stop.
   * @param {HTMLAudioElement} audio - The audio element associated with the sound.
   * @returns {void} This method does not return a value.
   *
   * @description
   * This method pauses the audio playback, resets its playback position to the beginning,
   * disables looping, and updates the internal audio state to indicate that the sound is no longer playing.
   * If the audio element is not provided or the audio state for the given name is not active, the method exits early.
   */
  stopSound(name, audio) {
    if (!audio || !this.audioStates[name]) return;
    audio.pause();
    audio.currentTime = 0;
    audio.loop = false;
    this.audioStates[name] = false;
  }

  /**
   * Plays a sound in a loop if it is not already playing.
   *
   * @param {string} name - The unique identifier for the sound.
   * @param {HTMLAudioElement} audio - The audio element to be played.
   * @returns {void} This function does not return a value.
   *
   * @throws {DOMException} If the audio playback fails, a warning is logged to the console.
   *
   * @example
   * const audioElement = new Audio('path/to/sound.mp3');
   * playLoopedSound('backgroundMusic', audioElement);
   */
  playLoopedSound(name, audio) {
    if (!audio || this.audioStates[name]) return;
    audio.loop = true;
    audio.currentTime = 0;
    audio.play();
    this.audioStates[name] = true;
  }
}
