let canvas;
let world;
let keyboard = new Keyboard();

function init() {
  canvas = document.getElementById("canvas"); // canvas is the id of <canvas>
  world = new World(canvas, keyboard);
}

document.addEventListener("keydown", (event) => {
  keyboard.pressKey(event.code);
});

document.addEventListener("keyup", (event) => {
  keyboard.releaseKey(event.code);
});
