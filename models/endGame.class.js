class EndGame {
  /**
   * Triggers the game over screen sequence. Ensures the game over screen is displayed
   * only once by checking the `endScreenShown` flag. If the flag is not set, it plays
   * the "lost" music, displays the game over animation, and shows the "Try Again" button.
   *
   * @param {World} world - The current instance of the game world.
   */
  static triggerGameOverScreen(world) {
    if (world.endScreenShown) return;
    world.endScreenShown = true;
    world.lostMusic.play();
    this.showGameOverAnimation(world.IMAGES_GAME_OVER);
    this.showTryAgainButton(world.IMAGES_TRAY_AGAIN);
  }

  /**
   * Displays a game over animation by creating an image element,
   * adding it to the document body, and cycling through a series
   * of images at a fixed interval to create an animation effect.
   *
   * @param {Array} images - An array of image paths for the game over animation.
   */
  static showGameOverAnimation(images) {
    const gameOverImg = document.createElement("img");
    gameOverImg.classList.add("game-over-image");
    document.body.appendChild(gameOverImg);

    let frame = 0;
    setInterval(() => {
      gameOverImg.src = images[frame];
      frame++;
      if (frame >= images.length) frame = 0;
    }, 150);
  }

  /**
   * Displays a "Try Again" button on the screen. The button is created as an image element,
   * styled with a specific class, and appended to the document body. When clicked, the button
   * reloads the page to restart the game.
   *
   * @param {Array} images - An array of image paths for the "Try Again" button animation.
   */
  static showTryAgainButton(images) {
    const tryAgainBtn = document.createElement("img");
    tryAgainBtn.src = images[0];
    tryAgainBtn.classList.add("try-again-button");
    document.body.appendChild(tryAgainBtn);
    tryAgainBtn.addEventListener("click", () => {
      document.body.innerHTML = "";
      init();
      startGame();
    });
  }

  /**
   * Triggers the win screen sequence if it has not already been shown.
   * Plays the "win" music, displays the win animation, and shows the "Try Again" button.
   *
   * @param {World} world - The current instance of the game world.
   */
  static triggerWinScreen(world) {
    if (world.endScreenShown) return;
    world.endScreenShown = true;
    world.winMusic.play();
    this.showWinAnimation(world.IMAGES_WIN_ANIMATION);
    this.showTryAgainButton(world.IMAGES_TRAY_AGAIN);
  }

  /**
   * Displays a win animation by creating an image element and cycling through
   * a series of images at a fixed interval. The animation loops through the
   * `IMAGES_WIN_ANIMATION` array, updating the `src` attribute of the image
   * element to display each frame in sequence.
   *
   * @param {Array} images - An array of image paths for the win animation.
   */
  static showWinAnimation(images) {
    const winImg = document.createElement("img");
    winImg.classList.add("win-screen-image");
    document.body.appendChild(winImg);

    let frame = 0;
    setInterval(() => {
      winImg.src = images[frame];
      frame++;
      if (frame >= images.length) frame = 0;
    }, 150);
  }
}
