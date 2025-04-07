class MovableObjects extends DrawableObject {
  speed = 0.15 + Math.random() * 0.25;
  otherDirection = false;
  swimUp = false;
  swimDown = false;
  energy = 100;
  lastHit;

  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  moveLeft() {
    setInterval(() => {
      // with this function I call upon the individual images and store them in my imageCache
      this.playAnimation(this.IMAGES_SWIM);
    }, 200);
    let direction = 1;
    setInterval(() => {
      // with this function I move the object to the left with a speed of 1 * speed
      this.x -= this.speed;
      this.y += this.speed * direction;
    }, 1000 / 60);
    const toggleDirection = () => {
      //this a a variable with a function - after a random time the direction changes
      direction *= -1;
      let randomTime = Math.random() * 11000 + 1000;
      setTimeout(toggleDirection, randomTime);
    };
    toggleDirection(); // I call the function toggleDirection
  }

  attack() {
    setInterval(() => {
      // with this function I call upon the individual images and store them in my imageCache
      this.playAnimation(this.IMAGES_ATTACKING);
    }, 200);
    let direction = 1;
    setInterval(() => {
      // with this function I move the object to the left with a speed of 1 * speed
      this.x -= this.speed;
      this.y += this.speed * direction;
    }, 1000 / 60);
    const toggleDirection = () => {
      //this a a variable with a function - after a random time the direction changes
      direction *= -1;
      let randomTime = Math.random() * 11000 + 1000;
      setTimeout(toggleDirection, randomTime);
    };
    toggleDirection(); // I call the function toggleDirection
  }

  transition(img) {
    setInterval(() => {
      this.playAnimation(img);
    }, 200);
  }

  // prettier-ignore
  isColliding(obj) {
    return this.x + this.width - this.offset.right >= obj.x + obj.offset.left && 
           this.x + this.offset.left <= obj.x + obj.width - obj.offset.right &&
           this.y + this.height - this.offset.bottom >= obj.y + obj.offset.top && 
           this.y + this.offset.top <= obj.y + obj.height - obj.offset.bottom;
}

  isClose(obj) {
    const adjustedX = this.x + this.width - this.offset.right + 40;
    const adjustedY = this.y + this.height - this.offset.bottom + 40;
    const adjustedWidth = obj.x + obj.width - obj.offset.left + 40;
    const adjustedHeight = obj.y + obj.height - obj.offset.top + 40;
    return adjustedX >= obj.x + obj.offset.left && this.x + this.offset.left <= adjustedWidth && adjustedY >= obj.y + obj.offset.top && this.y + this.offset.top <= adjustedHeight;
  }

  hit() {
    let now = new Date().getTime();
    if (!this.lastHit || now - this.lastHit >= 3000) {
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

  isDead() {
    return this.energy == 0;
  }
}
