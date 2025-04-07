class DrawableObject {
  img;
  imageCache = {}; // we use this object to store the images
  currentImage = 0;
  x = 120;
  y = 250;
  height = 100;
  width = 100;
  offsetY = 0;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

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
}
