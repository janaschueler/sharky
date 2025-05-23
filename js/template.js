/**
 * Rebuilds the main game container by injecting the necessary HTML structure for the game interface.
 * This includes navigation buttons, the game canvas, mobile joystick controls, an instructions overlay,
 * and the start screen. Existing content within the container is replaced.
 *
 * @function
 * @returns {void}
 */
function rebuildGameContainer() {
  const container = document.querySelector(".game-container");
  container.innerHTML = `
    <div class="navigation">
      <button class="joyStickUnit" id="instructionsButton" onclick="openInstruction()">i</button>
      <button id="sound-btn">
        <img src="img/icon/volume-high-solid.svg" alt="sound icon" />
      </button>
    </div>
    <canvas id="canvas" width="720" height="480"></canvas>
    <div class="mobileJoystick">
      <div class="joyStickUnit">
        <button id="moveLeftBtn"><img src="img/icon/arrow-left-solid.svg" alt="left button" /></button>
        <button id="moveRightBtn"><img src="img/icon/arrow-right-solid.svg" alt="right button" /></button>
      </div>
      <button id="attackBtn"><img src="img/icon/burst-solid.svg" alt="attack button" /></button>
      <div class="joyStickUnit">
        <button id="moveUpBtn"><img src="img/icon/arrow-up-solid.svg" alt="up button" /></button>
        <button id="moveDownBtn"><img src="img/icon/arrow-down-solid.svg" alt="down button" /></button>
      </div>
    </div>
    <div id="instructionsOverlay" class="d_none opacity">
      <button id="close-btn" onclick="closeInstruction()">
        <img src="img/icon/xmark-solid.svg" alt="close" />
      </button>
      <img class="instructions" src="img/6.Botones/Instructions 2.png" alt="Instructions" />
      <div class="instructionGuide">Collect at least 2 coins and 3 poison vials to challenge the Boss!</div>
    </div>
    <div id="start-screen">
      <img id="start-background" src="img/6.Botones/Start/start.png" />
      <img id="start-btn" src="img/6.Botones/Start/1.png" />
    </div>
  `;
}
