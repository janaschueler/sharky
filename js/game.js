let world;
let canvas;
let keyboard = new Keyboard();
let isMuted = false;
const buttonToKey = {
  moveLeftBtn: "ArrowLeft",
  moveRightBtn: "ArrowRight",
  moveUpBtn: "ArrowUp",
  moveDownBtn: "ArrowDown",
  attackBtn: "Space",
};

/**
 * Initializes the game by setting up the canvas element and configuring the start button.
 * This function retrieves the canvas element from the DOM and prepares the game environment.
 */
function init() {
  canvas = document.getElementById("canvas");
  setupStartButton();
}

/**
 * Sets up the start button by making it visible and adding a click event listener.
 * The event listener triggers the `startGame` function and is executed only once.
 */
function setupStartButton() {
  document.getElementById("start-btn").style.display = "block";
  document.getElementById("start-btn").addEventListener("click", startGame, { once: true });
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
  if (event.type === "keydown" || event.code === "Space" || event.code === "Enter") {
    event.preventDefault();
    return;
  }
  const icon = document.querySelector("#sound-btn img");
  isMuted = !isMuted;
  icon.src = isMuted ? "img/icon/volume-xmark-solid.svg" : "img/icon/volume-high-solid.svg";
  if (world) {
    toggleBackgroundMusic();
    toggleCharacterSounds();
    toggleBossSounds();
    toggleEnemySounds();
    toggleCollectableSounds();
    toggleLevelSounds();
  }
}

/**
 * Toggles the mute state of the background music in the game world.
 * If the background music exists, its muted property is set based on the `isMuted` variable.
 */
function toggleBackgroundMusic() {
  if (world.backgroundMusic) {
    world.backgroundMusic.muted = isMuted;
  }
}

/**
 * Toggles the mute state of character-related audio in the game.
 * If the `isMuted` flag is true, all character sounds are muted and any currently playing sounds are stopped.
 */
function toggleCharacterSounds() {
  if (world.character) {
    world.character.AUDIO_BUBBLE.muted = isMuted;
    world.character.AUDIO_FIN_SLAP.muted = isMuted;
    world.character.AUDIO_NO_POISON.muted = isMuted;
    world.character.AUDIO_SLEEP.muted = isMuted;
    if (isMuted) {
      stopCharacterSounds();
    }
  }
}

/**
 * Stops all character-related sounds in the game.
 * This function halts the playback of specific audio effects
 * associated with the character, such as "bubble", "fin-slap",
 * and "sleep" sounds.
 */
function stopCharacterSounds() {
  world.character.stopSound("bubble", world.character.AUDIO_BUBBLE);
  world.character.stopSound("fin-slap", world.character.AUDIO_FIN_SLAP);
  world.character.stopSound("sleep", world.character.AUDIO_SLEEP);
}

/**
 * Toggles the sound effects for the boss character in the game.
 * If the boss exists and has an attack audio property, it sets the muted state
 * based on the global `isMuted` variable. Additionally, it stops the boss sound
 * if the sound is muted.
 */
function toggleBossSounds() {
  if (world.boss && world.boss.AUDIO_ATTACK) {
    world.boss.AUDIO_ATTACK.muted = isMuted;
    if (isMuted) {
      stopBossSound();
    }
  }
}

/**
 * Stops the boss attack sound effect by pausing the audio and resetting its playback time to the beginning.
 * This ensures the sound does not continue playing or overlap when triggered again.
 */
function stopBossSound() {
  world.boss.AUDIO_ATTACK.pause();
  world.boss.AUDIO_ATTACK.currentTime = 0;
}

/**
 * Toggles the sound effects for enemy characters in the game.
 * This function iterates through all enemies in the current game level
 * and mutes or unmutes their hurt sound effects based on the global `isMuted` flag.
 * Additionally, it stops the sound for specific enemy types if muted.
 */
function toggleEnemySounds() {
  if (world.level && world.level.enemies) {
    world.level.enemies.forEach((enemy) => {
      if (enemy instanceof Puffers || enemy instanceof Jellyfish) {
        enemy.AUDIO_HURT.muted = isMuted;
        if (isMuted) {
          stopEnemySound(enemy);
        }
      }
    });
  }
}

/**
 * Stops the sound associated with an enemy's hurt audio.
 * This function pauses the audio and resets its playback position to the beginning.
 *
 * @param {Object} enemy - The enemy object containing the AUDIO_HURT property.
 * @param {HTMLAudioElement} enemy.AUDIO_HURT - The audio element for the enemy's hurt sound.
 */
function stopEnemySound(enemy) {
  enemy.AUDIO_HURT.pause();
  enemy.AUDIO_HURT.currentTime = 0;
}

/**
 * Toggles the sound effects for collectable items in the game.
 * This function iterates through all collectable items in the current game level
 * and mutes or unmutes their associated audio based on the global `isMuted` state.
 * If the sound is muted, it also stops the collectable sound for the item.
 *
 * @function
 * @throws {Error} Throws an error if `world.level` or `world.level.collectables` is undefined.
 */
function toggleCollectableSounds() {
  if (world.level && world.level.collectables) {
    world.level.collectables.forEach((item) => {
      if (item instanceof Coin || item instanceof Poison) {
        item.AUDIO_COLLECT.muted = isMuted;
        if (isMuted) {
          stopCollectableSound(item);
        }
      }
    });
  }
}

/**
 * Stops the collectable sound for a given item by pausing the audio
 * and resetting its playback position to the beginning.
 *
 * @param {Object} item - The item containing the audio to be stopped.
 * @param {HTMLAudioElement} item.AUDIO_COLLECT - The audio element associated with the item.
 */
function stopCollectableSound(item) {
  item.AUDIO_COLLECT.pause();
  item.AUDIO_COLLECT.currentTime = 0;
}

/**
 * Toggles the sound settings for the current game level, including collectable items
 * (coins and poisons) and background music for win and lose scenarios.
 *
 * This function checks if a level exists in the game world and applies sound toggling
 * for the collectable items within the level. Additionally, it toggles the background
 * music for the game's win and lose states.
 *
 * @function
 */
function toggleLevelSounds() {
  if (world.level) {
    toggleCollectablesSounds(world.level.coins);
    toggleCollectablesSounds(world.level.poisons);
  }
  toggleMusic(world.lostMusic);
  toggleMusic(world.winMusic);
}

/**
 * Toggles the sound settings for a collection of collectable items.
 *
 * @param {Array<Object>} collectables - An array of collectable objects.
 * Each object is expected to have an `AUDIO_COLLECT` property, which is an audio element.
 * @param {boolean} isMuted - A global variable that determines whether the sounds should be muted.
 * If `isMuted` is true, the sound for each collectable will be muted and stopped.
 */
function toggleCollectablesSounds(collectables) {
  if (collectables) {
    collectables.forEach((item) => {
      item.AUDIO_COLLECT.muted = isMuted;
      if (isMuted) {
        stopCollectableSound(item);
      }
    });
  }
}

/**
 * Toggles the playback and muting state of the provided music object.
 *
 * @param {HTMLAudioElement} music - The audio element to be toggled.
 *                                   If null or undefined, the function does nothing.
 * @global {boolean} isMuted - A global variable that determines whether the music should be muted.
 *                             If true, the music will be paused and its playback position reset.
 */
function toggleMusic(music) {
  if (music) {
    music.muted = isMuted;
    if (isMuted) {
      music.pause();
      music.currentTime = 0;
    }
  }
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
});

document.addEventListener("keyup", (event) => {
  keyboard.releaseKey(event.code);
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
