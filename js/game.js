let world;
let canvas;
let keyboard = new Keyboard();
let isMuted = false;

function init() {
  canvas = document.getElementById("canvas");
  setupStartButton();
}

function setupStartButton() {
  document.getElementById("start-btn").addEventListener("click", () => {
    startGame();
  });
}

function startGame() {
  document.getElementById("start-screen").style.display = "none";

  const canvas = document.getElementById("canvas");
  const container = document.querySelector(".game-container");


  const displaySize = canvas.getBoundingClientRect();
  world = new World(canvas, keyboard, displaySize.width, displaySize.height);
  
}

// beim Laden prüfen
window.addEventListener("load", checkOrientation);
// bei Resize oder Rotation prüfen
window.addEventListener("resize", checkOrientation);
window.addEventListener("orientationchange", checkOrientation);

function checkOrientation() {
  const overlay = document.getElementById("rotate-device-overlay");
  const game = document.querySelector(".game-container");


  if (!overlay || !game) {
    console.warn("Elemente nicht gefunden!");
    return;
  }

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

function toggleIcon(event) {
  if (event.type === "keydown" || event.code === "Space" || event.code === "Enter") {
    event.preventDefault();
    return;
  }
  const icon = document.querySelector("#sound-btn img");
  isMuted = !isMuted;
  icon.src = isMuted ? "img/icon/volume-xmark-solid.svg" : "img/icon/volume-high-solid.svg";

  if (world) {
    if (world.backgroundMusic) {
      world.backgroundMusic.muted = isMuted;
    }

    if (world.character) {
      world.character.AUDIO_BUBBLE.muted = isMuted;
      world.character.AUDIO_FIN_SLAP.muted = isMuted;
      world.character.AUDIO_NO_POISON.muted = isMuted;
      world.character.AUDIO_SLEEP.muted = isMuted;

      if (isMuted) {
        world.character.stopSound("bubble", world.character.AUDIO_BUBBLE);
        world.character.stopSound("fin-slap", world.character.AUDIO_FIN_SLAP);
        world.character.stopSound("sleep", world.character.AUDIO_SLEEP);
      }
    }

    if (world.boss) {
      if (world.boss.AUDIO_ATTACK) {
        world.boss.AUDIO_ATTACK.muted = isMuted;
        if (isMuted) {
          world.boss.AUDIO_ATTACK.pause();
          world.boss.AUDIO_ATTACK.currentTime = 0;
        }
      }
    }

    if (world.level && world.level.enemies) {
      world.level.enemies.forEach((enemy) => {
        if (enemy instanceof Puffers) {
          enemy.AUDIO_HURT.muted = isMuted;
          if (isMuted) {
            enemy.AUDIO_HURT.pause();
            enemy.AUDIO_HURT.currentTime = 0;
          }
        }

        if (enemy instanceof Jellyfish) {
          enemy.AUDIO_HURT.muted = isMuted;
          if (isMuted) {
            enemy.AUDIO_HURT.pause();
            enemy.AUDIO_HURT.currentTime = 0;
          }
        }
      });
    }
    if (world.level && world.level.collectables) {
      world.level.collectables.forEach((item) => {
        if (item instanceof Coin || item instanceof Poison) {
          item.AUDIO_COLLECT.muted = isMuted;
          if (isMuted) {
            item.AUDIO_COLLECT.pause();
            item.AUDIO_COLLECT.currentTime = 0;
          }
        }
        if (world.level && world.level.coins) {
          world.level.coins.forEach((coin) => {
            coin.AUDIO_COLLECT.muted = isMuted;
            if (isMuted) {
              coin.AUDIO_COLLECT.pause();
              coin.AUDIO_COLLECT.currentTime = 0;
            }
          });
        }

        if (world.level && world.level.poisons) {
          world.level.poisons.forEach((poison) => {
            poison.AUDIO_COLLECT.muted = isMuted;
            if (isMuted) {
              poison.AUDIO_COLLECT.pause();
              poison.AUDIO_COLLECT.currentTime = 0;
            }
          });
        }
      });
    }
  }
}

function resizeCanvas() {
  const canvas = document.querySelector("canvas");
  const container = document.querySelector(".game-container");

  if (!canvas || !container) return;

  // Setze Canvas-Größe auf Container-Größe
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
}

// Initial & bei Resize aufrufen
window.addEventListener("load", resizeCanvas);
window.addEventListener("resize", resizeCanvas);

function openInstruction() {
  const overlay = document.getElementById("instructionsOverlay");
  overlay.classList.remove("opacity");
  document.addEventListener("mousedown", closeOnOutsideClick);
}

function closeInstruction() {
  const overlay = document.getElementById("instructionsOverlay");
  overlay.classList.add("opacity");
  document.removeEventListener("mousedown", closeOnOutsideClick);
}

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

// Funktion zum Umschalten zwischen Fullscreen und normalem Modus
function toggleFullscreen() {
  const elem = document.getElementById('fullscreen'); // Das gesamte game-container-Element

  // Überprüfen, ob wir bereits im Fullscreen-Modus sind
  if (document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
    // Wenn im Fullscreen, gehe zurück zum normalen Modus
    exitFullscreen();
  } else {
    // Wenn nicht im Fullscreen, gehe in den Fullscreen-Modus
    enterFullscreen(elem);
  }
}

// Funktion zum Aktivieren des Fullscreen-Modus
function enterFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.msRequestFullscreen) {      // für IE11
    element.msRequestFullscreen();
  } else if (element.webkitRequestFullscreen) {  // für iOS Safari
    element.webkitRequestFullscreen();
  }

  // Wechsel das Symbol zu "Minimize"
  document.getElementById('fullscreen-icon').src = "img/icon/minimize-solid.svg";

  // CSS für den Fullscreen-Container aktivieren
  document.body.style.overflow = 'hidden';  // Verhindert Scrollen im Fullscreen-Modus
}

// Funktion zum Verlassen des Fullscreen-Modus
function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }

  // Wechsel das Symbol zu "Maximize"
  document.getElementById('fullscreen-icon').src = "img/icon/maximize-solid.svg";

  // CSS für den Fullscreen-Container deaktivieren
  document.body.style.overflow = '';  // Setzt das Scrollen wieder frei
}

