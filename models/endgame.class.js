class EndGame {
  constructor(world) {
    this.world = world;
    this.endScreenShown = false;
    this.winAnimationInterval = null;
  }

  /**
   * Triggers the game over sequence.
   * Plays the losing music, shows the animation, and displays the retry button.
   */
  triggerGameOverScreen() {
    if (this.endScreenShown) return;
    this.endScreenShown = true;
    this.world.lostMusic.play();
    this.showGameOverAnimation();
    this.showTryAgainButton();
  }

  /**
   * Displays the game over animation using image frames in a loop.
   */
  showGameOverAnimation() {
    const gameOverImg = document.createElement("img");
    gameOverImg.classList.add("game-over-image");
    document.body.appendChild(gameOverImg);
    let frame = 0;
    setInterval(() => {
      gameOverImg.src = this.world.IMAGES_GAME_OVER[frame];
      frame = (frame + 1) % this.world.IMAGES_GAME_OVER.length;
    }, 150);
  }

  /**
   * Triggers the win sequence.
   * Stops all character activity, plays win music, shows win animation and retry button.
   */
  triggerWinScreen() {
    if (this.endScreenShown) return;
    this.endScreenShown = true;
    this.world.character.stopAllLoops();
    this.world.winMusic.play();
    this.showWinAnimation();
    this.showTryAgainButton();
  }

  /**
   * Displays a win animation by cycling through win image frames.
   */
  showWinAnimation() {
    const winImg = document.createElement("img");
    winImg.classList.add("win-screen-image");
    document.body.appendChild(winImg);
    let frame = 0;
    this.winAnimationInterval = setInterval(() => {
      winImg.src = this.world.IMAGES_WIN_ANIMATION[frame];
      frame = (frame + 1) % this.world.IMAGES_WIN_ANIMATION.length;
    }, 150);
  }

  /**
   * Displays a "Try Again" button on the screen that reloads the game on click.
   */
  showTryAgainButton() {
    const tryAgainBtn = document.createElement("img");
    tryAgainBtn.src = this.world.IMAGES_TRAY_AGAIN[0];
    tryAgainBtn.classList.add("try-again-button");
    document.body.appendChild(tryAgainBtn);
    tryAgainBtn.addEventListener("click", () => {
      restartGame(); // This function must be globally available
    });
  }

  /**
   * Stops all game loops and background music, and clears any win screen elements.
   */
  stop() {
    clearInterval(this.world.gameLoop);
    clearInterval(this.world.enemyLoop);
    clearInterval(this.winAnimationInterval);
    const winImg = document.querySelector(".win-screen-image");
    if (winImg) winImg.remove();
    if (this.world.level && this.world.level.enemies) {
      this.world.level.enemies = [];
    }
    if (this.world.backgroundMusic) {
      this.world.backgroundMusic.pause();
      this.world.backgroundMusic.currentTime = 0;
    }
  }
}
