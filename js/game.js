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
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
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

    if (world.boss && world.boss.bossRoarSound) {
      world.boss.bossRoarSound.muted = isMuted;
    }

    if (world.level && world.level.enemies) {
      world.level.enemies.forEach((enemy) => {
        if (enemy instanceof Puffers && enemy.pufferSound) {
          enemy.pufferSound.muted = isMuted;
          if (isMuted) {
            enemy.pufferSound.stopSound("hurt", enemy.AUDIO_HURT);
          }
        }
        if (enemy instanceof Jellyfish && enemy.electricShockSound) {
          enemy.electricShockSound.muted = isMuted;
          if (isMuted) {
            enemy.electricShockSound.stopSound("hurt", enemy.AUDIO_HURT);
          }
        }
      });
    }
  }
}

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
