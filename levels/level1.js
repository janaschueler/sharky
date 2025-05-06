// prettier-ignore
/**
 * Represents the configuration for level 1 in the game.
 * 
 * @constant
 * @type {Level}
 * 
 * @param {Array<Object>} enemies - The array of enemy objects in the level.
 * @param {Array<Object>} lights - The array of light objects in the level.
 * @param {Array<BackgroundObject>} backgroundObjects - The array of background objects for the level.
 * @param {Array<Object>} collectibles - The array of collectible objects (e.g., coins, poison) in the level.
 * 
 * Enemies:
 * - Puffers: Repeated instances of the Puffer enemy.
 * - Jellyfish: Repeated instances of the Jellyfish enemy.
 * 
 * Lights:
 * - Light: A single light object.
 * 
 * Background Objects:
 * - Includes multiple layers of background images (Water, Fondo 2, Fondo 1, Floor) at different positions (-1440, 0, 1440).
 * 
 * Collectibles:
 * - Coin: Repeated instances of collectible coins.
 * - Poison: Repeated instances of collectible poison items.
 */
const level1 = new Level(
    [
      new Puffers(),
      new Jellyfish(),
      new Puffers(),
      new Jellyfish(),
      new Puffers(),
      new Jellyfish()

    ],
    [new Light()],
    [
      new BackgroundObject("img/3. Background/Layers/5. Water/D.png", -1440),
      new BackgroundObject("img/3. Background/Layers/4.Fondo 2/D.png", -1440),
      new BackgroundObject("img/3. Background/Layers/3.Fondo 1/D.png", -1440),
      new BackgroundObject("img/3. Background/Layers/2. Floor/D.png", -1440),
      new BackgroundObject("img/3. Background/Layers/5. Water/D.png", 0),
      new BackgroundObject("img/3. Background/Layers/4.Fondo 2/D.png", 0),
      new BackgroundObject("img/3. Background/Layers/3.Fondo 1/D.png", 0),
      new BackgroundObject("img/3. Background/Layers/2. Floor/D.png", 0),
      new BackgroundObject("img/3. Background/Layers/5. Water/D.png", 1440),
      new BackgroundObject("img/3. Background/Layers/4.Fondo 2/D.png", 1440),
      new BackgroundObject("img/3. Background/Layers/3.Fondo 1/D.png", 1440),
      new BackgroundObject("img/3. Background/Layers/2. Floor/D.png", 1440),
    ],
    [
      new Coin(),
      new Poison(),
      new Coin(),
      new Poison(),
      new Coin(),
      new Poison(),
      new Coin(),
      new Poison(),
      new Coin(),
      new Poison(),
    ],
  );
