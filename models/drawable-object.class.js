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

  clearImageCache() {
    this.imageCache = {};
    this.currentImage = 0;
  }

  draw(ctx) {
    try {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    } catch (error) {
      console.error("Error drawing image:", error);
      console.log("Image path:", this.img?.src);
    }
  }

  drawFrame(ctx) {
    if (this instanceof Jellyfish ) {
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

    if (this instanceof Boss) {
      ctx.beginPath();
      ctx.lineWidth = "3";
      ctx.strokeStyle = "blue";
      ctx.rect(this.x + this.offset.left, this.y + this.offset.top, this.width - (this.offset.left + this.offset.right), this.height - (this.offset.top + this.offset.bottom));
      ctx.stroke();
    }
  }
}
