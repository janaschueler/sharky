let world;
let canvas;
let keyboard = new Keyboard();

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
  world = new World(canvas, keyboard);
}
