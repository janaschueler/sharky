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
