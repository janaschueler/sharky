/**
 * Represents a game level containing all essential game elements.
 * Stores arrays of enemies, lighting effects, background visuals, and collectable items.
 * Also defines the horizontal end boundary of the level.
 *
 * Components:
 * - `enemies`: Array of enemy objects present in the level
 * - `light`: Array of light-related objects or effects
 * - `backgroundObject`: Array of background elements (e.g., parallax layers)
 * - `collectables`: Array of items that can be collected by the player
 * - `level_end_x`: Numeric value indicating where the level ends horizontally
 *
 * @param {Array} enemies - Enemies to be included in the level
 * @param {Array} light - Lighting or visual effects
 * @param {Array} backgroundObject - Background elements for visual depth
 * @param {Array} collectables - Collectable items (coins, bottles, etc.)
 */
class Level {
  enemies;
  light;
  backgroundObject;
  collectables;
  level_end_x = 2200;

  constructor(enemies, light, backgroundObject, collectables) {
    this.enemies = enemies;
    this.light = light;
    this.backgroundObject = backgroundObject;
    this.collectables = collectables;
  }
}
