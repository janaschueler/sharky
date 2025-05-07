/**
 * Represents a game level containing all essential game elements.
 * Stores arrays of enemies, lighting effects, background visuals, and collectable items.
 * Also defines the horizontal end boundary of the level.
 */
class Level {
  enemies;
  light;
  backgroundObject;
  collectables;
  level_end_x = 2200;

  /**
   * Creates an instance of the Level class.
   *
   * @constructor
   * @param {Array} enemies - An array of enemy objects present in the level.
   * @param {Object} light - The light configuration or object for the level.
   * @param {Object} backgroundObject - The background object or configuration for the level.
   * @param {Array} collectables - An array of collectible items in the level.
   */
  constructor(enemies, light, backgroundObject, collectables) {
    this.enemies = enemies;
    this.light = light;
    this.backgroundObject = backgroundObject;
    this.collectables = collectables;
  }
}
