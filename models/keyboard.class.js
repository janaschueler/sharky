/**
 * Handles keyboard input state for player controls.
 * Tracks directional keys and spacebar status as boolean flags.
 * Used to control character movement and actions within the game loop.
 *
 * Keys tracked:
 * - ArrowLeft → `LEFT`
 * - ArrowRight → `RIGHT`
 * - ArrowDown → `DOWN`
 * - ArrowUp → `UP`
 * - Space → `SPACE`
 */

class Keyboard {
  LEFT = false;
  RIGHT = false;
  DOWN = false;
  UP = false;
  SPACE = false;
  D = false;

  pressKey(event) {
    switch (event) {
      case "ArrowLeft":
        this.LEFT = true;
        break;
      case "ArrowRight":
        this.RIGHT = true;
        break;
      case "ArrowDown":
        this.DOWN = true;
        break;
      case "ArrowUp":
        this.UP = true;
        break;
      case "Space":
        this.SPACE = true;
        break;
      case "KeyD":
        this.D = true;
        break;
    }
  }
  releaseKey(event) {
    switch (event) {
      case "ArrowLeft":
        this.LEFT = false;
        break;
      case "ArrowRight":
        this.RIGHT = false;
        break;
      case "ArrowDown":
        this.DOWN = false;
        break;
      case "ArrowUp":
        this.UP = false;
        break;
      case "Space":
        this.SPACE = false;
        break;
      case "KeyD":
        this.D = false;
        break;
    }
  }
}
