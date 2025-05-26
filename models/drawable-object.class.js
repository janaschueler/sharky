/**
 * Base class for all drawable objects in the game.
 * Provides foundational properties for positioning, sizing, and image handling.
 * Intended to be extended by objects that require visual representation on the canvas.
 *
 * Features:
 * - Manages a main image and an image cache for animations or states
 * - Includes position (x, y), dimensions (width, height), and optional vertical offset
 */
class DrawableObject {
  img;
  imageCache = {}; // we use this object to store the images
  currentImage = 0;
  x = 120;
  y = 250;
  height = 100;
  width = 100;
  offsetY = 0;


  /**
   * Loads an image from the specified file path and assigns it to the `img` property.
   * If the image fails to load, a warning is logged to the console.
   *
   * @param {string} path - The file path of the image to load.
   */
  loadImage(path) {
    const img = new Image();
    img.src = path;
    img.onerror = () => {
      console.warn("could not load image:", path);
    };
    this.img = img;
  }

  /**
   * Loads an array of image paths into the image cache.
   * For each path, an Image object is created, and its source is set to the path.
   * If an image fails to load, a warning is logged to the console.
   *
   * @param {string[]} arr - An array of image file paths to be loaded.
   */
  loadImages(arr) {
    arr.forEach((path) => {
      const img = new Image();
      img.src = path;
      img.onerror = () => {
        console.warn("could not load image:", path);
      };
      this.imageCache[path] = img;
    });
  }

  /**
   * Clears the image cache by resetting the `imageCache` object to an empty state
   * and setting the `currentImage` index to 0.
   * 
   * This method is useful for freeing up memory or resetting the state of the 
   * drawable object when the cached images are no longer needed.
   */
  clearImageCache() {
    this.imageCache = {};
    this.currentImage = 0;
  }

  /**
   * Draws the current object onto the provided canvas context.
   *
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context where the object will be drawn.
   * @throws {Error} Logs an error if the image cannot be drawn, including the image source path for debugging.
   */
  draw(ctx) {
    try {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    } catch (error) {
      console.error("Error drawing image:", error);
    }
  }

  
}
