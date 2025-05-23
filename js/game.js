let world;
let canvas;
let keyboard = new Keyboard();
let isMuted = true;
const buttonToKey = {
  moveLeftBtn: "ArrowLeft",
  moveRightBtn: "ArrowRight",
  moveUpBtn: "ArrowUp",
  moveDownBtn: "ArrowDown",
  attackBtn: "Space",
  bubbleAttackBtn: "KeyD",
};

/**
 * Initializes the game by setting up the canvas element and configuring the start button.
 * This function retrieves the canvas element from the DOM and prepares the game environment.
 */
function init() {
  canvas = document.getElementById("canvas");

  const storedMute = localStorage.getItem("isMuted");
  if (storedMute !== null) {
    isMuted = storedMute === "true";
  }
  const icon = document.querySelector("#sound-btn img");
  icon.src = isMuted ? "img/icon/volume-xmark-solid.svg" : "img/icon/volume-high-solid.svg";
  setupStartButton();
}

/**
 * Sets up the start button by making it visible and adding a click event listener.
 * The event listener triggers the `startGame` function and is executed only once.
 */
function setupStartButton() {
  document.getElementById("start-btn").style.display = "block";
  document.getElementById("start-btn").addEventListener("click", startGame, { once: true });
  document.querySelector("#sound-btn img").src = "img/icon/volume-xmark-solid.svg";
}

/**
 * Initializes and starts the game by hiding the start screen,
 * setting up the game canvas, and creating a new game world.
 *
 * @global {World} world - The global game world instance.
 */
function startGame() {
  document.getElementById("start-screen").style.display = "none";
  const canvas = document.getElementById("canvas");
  const container = document.querySelector(".game-container");
  const displaySize = canvas.getBoundingClientRect();
  world = new World(canvas, keyboard, displaySize.width, displaySize.height);

  setMuteState(isMuted);
  const icon = document.querySelector("#sound-btn img");
  icon.src = isMuted ? "img/icon/volume-xmark-solid.svg" : "img/icon/volume-high-solid.svg";
}

window.addEventListener("load", checkOrientation);
window.addEventListener("resize", checkOrientation);
window.addEventListener("orientationchange", checkOrientation);

/**
 * Checks the orientation of the device and adjusts the visibility of the
 * overlay and game container accordingly. If the viewport width is less
 * than 550 pixels, it displays an overlay prompting the user to rotate
 * their device and hides the game container. Otherwise, it hides the
 * overlay and displays the game container.
 *
 * @returns {void}
 */
function checkOrientation() {
  const overlay = document.getElementById("rotate-device-overlay");
  const game = document.querySelector(".game-container");
  if (window.innerWidth < 550) {
    overlay.style.display = "flex";
    game.style.display = "none";
  } else {
    overlay.style.display = "none";
    game.style.display = "block";
  }
}

document.getElementById("sound-btn").addEventListener("click", toggleIcon);
document.getElementById("sound-btn").addEventListener("keydown", toggleIcon);

/**
 * Toggles the sound icon and updates the sound settings in the game.
 *
 * This function handles both click and keyboard events. If triggered by a
 * keyboard event (e.g., "Space" or "Enter"), it prevents the default behavior.
 * It updates the sound icon based on the `isMuted` state and toggles various
 * sound settings in the game if the `world` object exists.
 *
 * @param {Event} event - The event object triggered by the user interaction.
 * @property {string} event.type - The type of the event (e.g., "keydown", "click").
 * @property {string} [event.code] - The code of the key pressed (e.g., "Space", "Enter").
 */
function toggleIcon(event) {
  if (event.type === "keydown" && (event.code === "Space" || event.code === "Enter")) {
    event.preventDefault();
    return;
  }
  const icon = document.querySelector("#sound-btn img");
  const newMuteState = !isMuted;
  icon.src = newMuteState ? "img/icon/volume-xmark-solid.svg" : "img/icon/volume-high-solid.svg";
  localStorage.setItem("isMuted", newMuteState ? "true" : "false");
  if (world) {
    setMuteState(newMuteState);
  } else {
    isMuted = newMuteState;
  }
}

/**
 * Sets the mute state of the game and applies it to all sound-related components.
 *
 * @param {boolean} muted - If true, all sounds will be muted and stopped.
 */
function setMuteState(muted) {
  isMuted = muted;
  toggleBackgroundMusic();
  toggleCharacterSounds();
  toggleBossSounds();
  toggleEnemySounds();
  toggleCollectableSounds();
  toggleLevelSounds();
}

/**
 * Temporarily mutes and stops all game sounds as if the game were muted.
 * Restores the original mute state afterward.
 */
function stopAllSoundsTemporarily() {
  const originalMuteState = isMuted;
  setMuteState(true);
  isMuted = originalMuteState;
}

/**
 * Stops the "lost music" in the game by pausing it and resetting its playback time to the beginning.
 * This function ensures that the music associated with losing the game is halted and reset.
 */
function stopLostMusic() {
  world.lostMusic.pause();
  world.lostMusic.currentTime = 0;
}

/**
 * Stops the win music by pausing it and resetting its playback position to the beginning.
 * This function ensures that the win music does not continue playing.
 */
function stopWinMusic() {
  world.winMusic.pause();
  world.winMusic.currentTime = 0;
}

/**
 * Opens the instructions overlay by removing the "opacity" class from the overlay element.
 * Also adds an event listener to close the overlay when clicking outside of it.
 *
 * @function
 * @returns {void}
 */
function openInstruction() {
  const overlay = document.getElementById("instructionsOverlay");
  overlay.classList.remove("opacity");
  document.addEventListener("mousedown", closeOnOutsideClick);
}

/**
 * Closes the instructions overlay by adding an opacity class to it
 * and removes the event listener for outside clicks.
 *
 * This function is typically used to hide the instructions overlay
 * when the user interacts with the interface.
 */
function closeInstruction() {
  const overlay = document.getElementById("instructionsOverlay");
  overlay.classList.add("opacity");
  document.removeEventListener("mousedown", closeOnOutsideClick);
}

/**
 * Handles closing the instructions overlay when a click occurs outside of it.
 * This function checks if the click event target is outside the overlay element
 * and not the instructions button, and if so, triggers the `closeInstruction` function.
 *
 * @param {MouseEvent} event - The mouse event triggered by the click.
 */
function closeOnOutsideClick(event) {
  const overlay = document.getElementById("instructionsOverlay");
  const instructionsButton = document.getElementById("instructionsButton");
  if (!overlay.contains(event.target) && event.target !== instructionsButton) {
    closeInstruction();
  }
}

document.addEventListener("keydown", (event) => {
  keyboard.pressKey(event.code);
  if (event.code === "KeyD") {
    keyboard.D = true;
  }
});

document.addEventListener("keyup", (event) => {
  keyboard.releaseKey(event.code);
  if (event.code === "KeyD") {
    keyboard.D = false;
  }
});

/**
 * Retrieves a button element from the DOM using its ID.
 *
 * @param {string} buttonId - The ID of the button element to retrieve.
 * @returns {HTMLElement | null} The button element if found, or null if not found.
 */
Object.entries(buttonToKey).forEach(([buttonId, key]) => {
  const button = document.getElementById(buttonId);
  button.addEventListener("mousedown", () => {
    keyboard.pressKey(key);
  });
  button.addEventListener("mouseup", () => {
    keyboard.releaseKey(key);
  });
  button.addEventListener("touchstart", () => {
    keyboard.pressKey(key);
  });
  button.addEventListener("touchend", () => {
    keyboard.releaseKey(key);
  });
});

/**
 * Restarts the game by stopping the current world instance, removing UI elements related to game over,
 * resetting the world, and restoring the mute state if it was previously enabled.
 *
 * - Stops the game world if it is running.
 * - Removes the "Try Again" button and "Game Over" image from the DOM if they exist.
 * - Calls `summaryRestart()` to reset summary-related state.
 * - Restores the mute state and updates the mute icon if the game was muted before restarting.
 */
function restartGame() {
  if (world && typeof world.stop === "function") {
    world.stop();
  }
  stopAllSoundsTemporarily();
  world = null;
  const wasMuted = isMuted;
  restartAnimation();
  summaryRestart();
  if (wasMuted) {
    isMuted = true;
    toggleIcon(new Event("click"));
  }

  /**
   * Removes the "Try Again" button, "Game Over" image, and "Win Screen" image elements
   * from the DOM if they exist, effectively resetting the end-of-game UI state.
   */
  function restartAnimation() {
    const tryAgainBtn = document.querySelector(".try-again-button");
    if (tryAgainBtn) tryAgainBtn.remove();
    const gameOverImg = document.querySelector(".game-over-image");
    if (gameOverImg) gameOverImg.remove();
    const winImg = document.querySelector(".win-screen-image");
    if (winImg) winImg.remove();
  }
}

/**
 * Restarts the game by rebuilding the game container, reinitializing game state,
 * starting the game loop, and rebinding touch and sound controls.
 */
function summaryRestart() {
  rebuildGameContainer();
  init();
  startGame();
  bindTouchControls();
  bindSoundButton();
  stopLostMusic();
  stopWinMusic();
}

/**
 * Binds touch and mouse controls to on-screen buttons, mapping each button to a corresponding keyboard key.
 * For each button specified in the `buttonToKey` mapping, adds event listeners for `mousedown`, `mouseup`,
 * `touchstart`, and `touchend` events to simulate keyboard key presses and releases using the `keyboard` object.
 *
 * Assumes the existence of a global `buttonToKey` object mapping button element IDs to key values,
 * and a global `keyboard` object with `pressKey` and `releaseKey` methods.
 */
function bindTouchControls() {
  Object.entries(buttonToKey).forEach(([buttonId, key]) => {
    const button = document.getElementById(buttonId);
    if (!button) return;
    button.addEventListener("mousedown", () => keyboard.pressKey(key));
    button.addEventListener("mouseup", () => keyboard.releaseKey(key));
    button.addEventListener("touchstart", () => keyboard.pressKey(key));
    button.addEventListener("touchend", () => keyboard.releaseKey(key));
  });
}

/**
 * Binds click and keydown event listeners to the sound button element.
 * When triggered, the event listeners call the toggleIcon function to change the sound icon state.
 * Assumes an element with the ID "sound-btn" exists in the DOM.
 */
function bindSoundButton() {
  const soundBtn = document.getElementById("sound-btn");
  if (soundBtn) {
    soundBtn.addEventListener("click", toggleIcon);
    soundBtn.addEventListener("keydown", toggleIcon);
  }

  /**
   * Shows the on-screen mobile joystick if the device supports touch events.
   * This enhances usability for mobile and tablet users by displaying
   * the joystick controls only on touch-capable devices.
   */
  if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
    document.querySelector(".mobileJoystick").style.display = "flex";
  }
}
