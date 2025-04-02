class MovableObjects {
  x = 120;
  y = 250;
  img;
  height = 100;
  width = 100;
  offsetY = 0;
  imageCache = {}; // we use this object to store the images
  currentImage = 0;
  speed = 0.15 + Math.random() * 0.25;
  otherDirection = false;
  swimUp = false;
  swimDown = false;
  energy = 100;
  lastHit;
  isNear = false;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  draw() {}

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image(); // is a js method to create an image element. It is equivalent to document.createElement("img")
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height); // drawImage is a method to draw an image, the first parameters is the image it self, the second and third are the x and y coordinates, the third and fourth parameters are the width and height of the image
  }

  drawFrame(ctx) {
    if (this instanceof Jellyfish || this instanceof Boss) {
      ctx.beginPath();
      ctx.lineWidth = "3";
      ctx.strokeStyle = "blue";
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
    if (this instanceof Sharky) {
      ctx.beginPath();
      ctx.lineWidth = "3";
      ctx.strokeStyle = "blue";
      ctx.rect(this.x + this.offset.left, this.y + this.offset.top, this.width - (this.offset.left + this.offset.right), this.height - (this.offset.top + this.offset.bottom));
      ctx.stroke();
    }

    if (this instanceof Puffers) {
      ctx.beginPath();
      ctx.lineWidth = "3";
      ctx.strokeStyle = "blue";
      ctx.rect(this.x + this.offset.left, this.y + this.offset.top, this.width - (this.offset.left + this.offset.right), this.height - (this.offset.top + this.offset.bottom));
      ctx.stroke();
    }
  }

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

  transition(img) {
    setInterval(() => {
      this.playAnimation(img);
    }, 200);
  }

  isClose(obj) {
    const adjustedX = this.x + this.width - this.offset.right + 40;
    const adjustedY = this.y + this.height - this.offset.bottom + 40;
    const adjustedWidth = obj.x + obj.width - obj.offset.left + 40;
    const adjustedHeight = obj.y + obj.height - obj.offset.top + 40;
    return adjustedX >= obj.x + obj.offset.left && this.x + this.offset.left <= adjustedWidth && adjustedY >= obj.y + obj.offset.top && this.y + this.offset.top <= adjustedHeight;
  }

  // prettier-ignore
  isColliding(obj) {
    return this.x + this.width - this.offset.right >= obj.x + obj.offset.left && 
           this.x + this.offset.left <= obj.x + obj.width - obj.offset.right &&
           this.y + this.height - this.offset.bottom >= obj.y + obj.offset.top && 
           this.y + this.offset.top <= obj.y + obj.height - obj.offset.bottom;
}

  closeBy() {
    console.log("🚀 ~ MovableObjects ~ close ~ isNear:", this.isNear);
    this.isNear = true;
    console.log("🚀 ~ MovableObjects ~ close ~ isNear:", this.isNear);
    return this.isNear;
  }

  isInProximity() {
    console.log("🚀 ~ MovableObjects ~ isInProximity ~ isNear:", this.isNear);
    return this.isNear;
  }

  hit() {
    let now = new Date().getTime();
    if (!this.lastHit || now - this.lastHit >= 1000) {
      this.energy -= 5;
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
