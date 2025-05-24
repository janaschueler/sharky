// prettier-ignore
/**
 * Creates and returns the configuration for level 1 of the game.
 *
 * @function
 * @returns {Level} A new Level instance configured with:
 *   - Enemies: Alternating Puffers and Jellyfish.
 *   - Lights: A single Light object.
 *   - Background: Multiple BackgroundObject instances for parallax effect.
 *   - Collectibles: Alternating Coin and Poison objects.
 */
function createLevel1() {
  return new Level(
    [
      new Puffers(),
      new Jellyfish(),
      new Puffers(),
      new Jellyfish(),
      new Puffers(),
      new Jellyfish(),
    ],
    [new Light()],
    [
    new BackgroundObject("img/3. Background/Layers/5. Water/D.png", -1439),
    new BackgroundObject("img/3. Background/Layers/5. Water/D.png", 0),
    new BackgroundObject("img/3. Background/Layers/5. Water/D.png", 1439),

    new BackgroundObject("img/3. Background/Layers/4.Fondo 2/D.png", -1439),
    new BackgroundObject("img/3. Background/Layers/4.Fondo 2/D.png", 0),
    new BackgroundObject("img/3. Background/Layers/4.Fondo 2/D.png", 1439),

    new BackgroundObject("img/3. Background/Layers/3.Fondo 1/D.png", -1439),
    new BackgroundObject("img/3. Background/Layers/3.Fondo 1/D.png", 0),
    new BackgroundObject("img/3. Background/Layers/3.Fondo 1/D.png", 1439),

    new BackgroundObject("img/3. Background/Layers/2. Floor/D.png", -1439),
    new BackgroundObject("img/3. Background/Layers/2. Floor/D.png", 0),
    new BackgroundObject("img/3. Background/Layers/2. Floor/D.png", 1439),
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
      new Poison(),
      new Poison(),
      new Poison(),
      new Poison(),
      new Poison(),
    ]
  );
}
