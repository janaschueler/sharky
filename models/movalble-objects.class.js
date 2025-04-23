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

  playAnimation(images) {
    if (this.dead && images !== this.IMAGES_DEAD) return;
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
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

  moveLeft() {
    if (this.moveInterval) clearInterval(this.moveInterval);

    let direction = 1;
    this.moveInterval = setInterval(() => {
      if (this.dead) {
        clearInterval(this.moveInterval);
        return;
      }

      this.x -= this.speed;
      this.y += this.speed * direction;
    }, 1000 / 60);

    const toggleDirection = () => {
      direction *= -1;
      let randomTime = Math.random() * 11000 + 1000;
      setTimeout(toggleDirection, randomTime);
    };
    toggleDirection();
  }

  // prettier-ignore
  isColliding(obj) {
    return this.x + this.width - this.offset.right >= obj.x + obj.offset.left && 
           this.x + this.offset.left <= obj.x + obj.width - obj.offset.right &&
           this.y + this.height - this.offset.bottom >= obj.y + obj.offset.top && 
           this.y + this.offset.top <= obj.y + obj.height - obj.offset.bottom;
}

  isClose(obj) {
    const adjustedX = this.x + this.width - this.offset.right + 60;
    const adjustedY = this.y + this.height - this.offset.bottom + 60;
    const adjustedWidth = obj.x + obj.width - obj.offset.left + 60;
    const adjustedHeight = obj.y + obj.height - obj.offset.top + 60;
    return adjustedX >= obj.x + obj.offset.left && this.x + this.offset.left <= adjustedWidth && adjustedY >= obj.y + obj.offset.top && this.y + this.offset.top <= adjustedHeight;
  }

  bossIsClose(obj) {
    const adjustedX = this.x + this.width - this.offset.right + 160;
    const adjustedY = this.y + this.height - this.offset.bottom + 160;
    const adjustedWidth = obj.x + obj.width - obj.offset.left + 160;
    const adjustedHeight = obj.y + obj.height - obj.offset.top + 160;
    return adjustedX >= obj.x + obj.offset.left && this.x + this.offset.left <= adjustedWidth && adjustedY >= obj.y + obj.offset.top && this.y + this.offset.top <= adjustedHeight;
  }

  isInFront(obj) {
    const thisRight = this.x + this.width - this.offset.right;
    const thisTop = this.y + this.offset.top;
    const thisBottom = this.y + this.height - this.offset.bottom;

    const objLeft = obj.x + obj.offset.left;
    const objTop = obj.y + obj.offset.top;
    const objBottom = obj.y + obj.height - obj.offset.bottom;

    return thisRight >= objLeft && thisRight <= objLeft + 10 && thisBottom >= objTop && thisTop <= objBottom;
  }

  hit() {
    let now = new Date().getTime();
    if (this.isAttacking) return;
    if (this.world.keyboard.SPACE) return;
    if ((!this.lastHit || now - this.lastHit >= 3000) && !this.specialAttackPlayed) {
      this.energy -= 20;
      if (this.energy < 0) {
        this.energy = 0;
      }
      this.lastHit = now;
    }
  }

  isHurt() {
    let timePassed = new Date().getTime() - this.lastHit; // difference in ms
    timePassed = timePassed / 1000; // difference in seconds
    return timePassed < 1;
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

  isInProximity() {
    return this.isNear;
  }

  closeBy() {
    this.isNear = true;
    return this.isNear;
  }

  farAway() {
    this.isNear = false;
  }

  isDead() {
    return this.energy == 0;
  }
}
