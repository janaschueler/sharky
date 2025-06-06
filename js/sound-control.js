/**
 * Toggles the mute state of the background music in the game world.
 * If the background music exists, its muted property is set based on the `isMuted` variable.
 */
function toggleBackgroundMusic() {
  if (world.backgroundMusic) world.backgroundMusic.muted = isMuted;
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
    if (isMuted) stopCharacterSounds();
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
    if (isMuted && typeof world.boss.stopSounds === "function") world.boss.stopSounds();
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
        if (isMuted) stopEnemySound(enemy);
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
        if (isMuted) stopCollectableSound(item);
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
      if (isMuted) stopCollectableSound(item);
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
