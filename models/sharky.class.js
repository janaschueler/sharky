class Sharky extends MovableObjects {
  width = 200;
  height = 200;
  y = 100;
  speed = 10;
  offset = {
    top: 90,
    left: +40,
    right: 30,
    bottom: +50,
  };
  world;

  lastActionTime = Date.now();
  isSleeping = false;

  IMAGES_HOVER = ["img/1.Sharkie/1.IDLE/1.png", "img/1.Sharkie/1.IDLE/2.png", "img/1.Sharkie/1.IDLE/3.png", "img/1.Sharkie/1.IDLE/4.png", "img/1.Sharkie/1.IDLE/5.png", "img/1.Sharkie/1.IDLE/6.png", "img/1.Sharkie/1.IDLE/7.png", "img/1.Sharkie/1.IDLE/8.png", "img/1.Sharkie/1.IDLE/9.png", "img/1.Sharkie/1.IDLE/10.png", "img/1.Sharkie/1.IDLE/11.png", "img/1.Sharkie/1.IDLE/12.png", "img/1.Sharkie/1.IDLE/13.png", "img/1.Sharkie/1.IDLE/14.png", "img/1.Sharkie/1.IDLE/15.png", "img/1.Sharkie/1.IDLE/16.png", "img/1.Sharkie/1.IDLE/17.png", "img/1.Sharkie/1.IDLE/18.png"];
  IMAGES_SLEEP = ["img/1.Sharkie/2.Long_IDLE/i1.png", "img/1.Sharkie/2.Long_IDLE/i2.png", "img/1.Sharkie/2.Long_IDLE/i3.png", "img/1.Sharkie/2.Long_IDLE/i4.png", "img/1.Sharkie/2.Long_IDLE/i5.png", "img/1.Sharkie/2.Long_IDLE/i6.png", "img/1.Sharkie/2.Long_IDLE/i7.png", "img/1.Sharkie/2.Long_IDLE/i8.png", "img/1.Sharkie/2.Long_IDLE/i9.png", "img/1.Sharkie/2.Long_IDLE/i10.png", "img/1.Sharkie/2.Long_IDLE/i11.png", "img/1.Sharkie/2.Long_IDLE/i12.png", "img/1.Sharkie/2.Long_IDLE/i13.png", "img/1.Sharkie/2.Long_IDLE/i14.png"];
  IMAGES_SWIM = ["img/1.Sharkie/3.Swim/1.png", "img/1.Sharkie/3.Swim/2.png", "img/1.Sharkie/3.Swim/3.png", "img/1.Sharkie/3.Swim/4.png", "img/1.Sharkie/3.Swim/5.png", "img/1.Sharkie/3.Swim/6.png"];
  IMAGES_ATTACK_BUBBLE = ["img/1.Sharkie/4.Attack/Bubble trap/op1/1.png", "img/1.Sharkie/4.Attack/Bubble trap/op1/2.png", "img/1.Sharkie/4.Attack/Bubble trap/op1/3.png", "img/1.Sharkie/4.Attack/Bubble trap/op1/4.png", "img/1.Sharkie/4.Attack/Bubble trap/op1/5.png", "img/1.Sharkie/4.Attack/Bubble trap/op1/6.png", "img/1.Sharkie/4.Attack/Bubble trap/op1/7.png", "img/1.Sharkie/4.Attack/Bubble trap/op1/8.png"];
  IMAGES_ATTACK_FIN = ["img/1.Sharkie/4.Attack/Fin slap/1.png", "img/1.Sharkie/4.Attack/Fin slap/2.png", "img/1.Sharkie/4.Attack/Fin slap/3.png", "img/1.Sharkie/4.Attack/Fin slap/4.png", "img/1.Sharkie/4.Attack/Fin slap/5.png", "img/1.Sharkie/4.Attack/Fin slap/6.png", "img/1.Sharkie/4.Attack/Fin slap/7.png", "img/1.Sharkie/4.Attack/Fin slap/8.png"];
  IMAGES_ATTACK_BUBBLE_POISON = ["img/1.Sharkie/4.Attack/Bubble trap/For Whale/1.png", "img/1.Sharkie/4.Attack/Bubble trap/For Whale/2.png", "img/1.Sharkie/4.Attack/Bubble trap/For Whale/3.png", "img/1.Sharkie/4.Attack/Bubble trap/For Whale/4.png", "img/1.Sharkie/4.Attack/Bubble trap/For Whale/5.png", "img/1.Sharkie/4.Attack/Bubble trap/For Whale/6.png", "img/1.Sharkie/4.Attack/Bubble trap/For Whale/7.png", "img/1.Sharkie/4.Attack/Bubble trap/For Whale/8.png"];
  IMAGES_HURT_POISON = ["img/1.Sharkie/5.Hurt/1.Poisoned/1.png", "img/1.Sharkie/5.Hurt/1.Poisoned/2.png", "img/1.Sharkie/5.Hurt/1.Poisoned/3.png", "img/1.Sharkie/5.Hurt/1.Poisoned/4.png", "img/1.Sharkie/5.Hurt/1.Poisoned/5.png"];
  IMAGES_HURT_ELECTRIC = ["img/1.Sharkie/5.Hurt/2.Electric shock/o1.png", "img/1.Sharkie/5.Hurt/2.Electric shock/o2.png", "img/1.Sharkie/5.Hurt/2.Electric shock/1.png", "img/1.Sharkie/5.Hurt/2.Electric shock/2.png", "img/1.Sharkie/5.Hurt/2.Electric shock/3.png"];
  IMAGES_DEAD = ["img/1.Sharkie/6.dead/1.Poisoned/1.png", "img/1.Sharkie/6.dead/1.Poisoned/2.png", "img/1.Sharkie/6.dead/1.Poisoned/3.png", "img/1.Sharkie/6.dead/1.Poisoned/4.png", "img/1.Sharkie/6.dead/1.Poisoned/5.png", "img/1.Sharkie/6.dead/1.Poisoned/6.png", "img/1.Sharkie/6.dead/1.Poisoned/7.png", "img/1.Sharkie/6.dead/1.Poisoned/8.png", "img/1.Sharkie/6.dead/1.Poisoned/9.png", "img/1.Sharkie/6.dead/1.Poisoned/10.png", "img/1.Sharkie/6.dead/1.Poisoned/11.png", "img/1.Sharkie/6.dead/1.Poisoned/12.png"];

  constructor() {
    super();
    this.world = world;
    this.loadImage(this.IMAGES_HOVER[0]);
    this.loadImages(this.IMAGES_HOVER);
    this.loadImages(this.IMAGES_SLEEP);
    this.loadImages(this.IMAGES_SWIM);
    this.loadImages(this.IMAGES_ATTACK_BUBBLE);
    this.loadImages(this.IMAGES_ATTACK_FIN);
    this.loadImages(this.IMAGES_HURT_POISON);
    this.loadImages(this.IMAGES_HURT_ELECTRIC);
    this.loadImages(this.IMAGES_DEAD);

    this.animate();
  }

  animate() {
    setInterval(() => {
      const k = this.world.keyboard;

      if (k.RIGHT && this.x < this.world.level.level_end_x) {
        this.x += this.speed;
        this.otherDirection = false;
        this.resetSleep();
      }
      if (k.LEFT && this.x > -1300) {
        this.x -= this.speed;
        this.otherDirection = true;
        this.resetSleep();
      }
      if (k.UP && !this.otherDirection && this.x > -1300 && this.x < this.world.level.level_end_x && this.y > -80) {
        this.x += this.speed;
        this.y -= this.speed / 5;
        this.swimUp = true;
        this.swimDown = false;
        this.resetSleep();
      }
      if (k.UP && this.otherDirection && this.x > -1300 && this.x < 2000 && this.y > -80) {
        this.x -= this.speed;
        this.y -= this.speed / 5;
        this.swimUp = true;
        this.swimDown = false;
        this.resetSleep();
      }
      if (k.DOWN && !this.otherDirection && this.x > -1300 && this.x < this.world.level.level_end_x && this.y < 400) {
        this.x += this.speed;
        this.y += this.speed / 5;
        this.swimDown = true;
        this.swimUp = false;
        this.resetSleep();
      }
      if (k.DOWN && this.otherDirection && this.x > -1300 && this.x < 2000 && this.y < 400) {
        this.x -= this.speed;
        this.y += this.speed / 5;
        this.swimDown = true;
        this.swimUp = false;
        this.resetSleep();
      }

      if (k.SPACE) {
        this.isAttacking = true;
        this.resetSleep();
      } else {
        this.isAttacking = false;
      }

      this.world.camera_x = -this.x + 60;
    }, 1000 / 60);

    setInterval(() => {
      const now = Date.now();
      if (now - this.lastActionTime > 3000) {
        this.isSleeping = true;
      } else {
        this.isSleeping = false;
      }
      if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT_POISON);
        return;
      }
      if (this.world.keyboard.SPACE) {
        this.handleAttackAnimation();
      } else if (this.isSleeping) {
        this.playAnimation(this.IMAGES_SLEEP);
      } else if (this.isIdle()) {
        this.handleIdle();
      } else {
        this.handleSwim();
      }
    }, 200);
  }

  handleAttackAnimation() {
    this.world.level.enemies.forEach((enemy) => {
      if (this.startFinAttack(enemy)) {
        this.playAnimation(this.IMAGES_ATTACK_FIN);
        if (this.isColliding(enemy)) {
          setTimeout(() => enemy.reactToHit(), 200);
        }
        return;
      } else if (this.startBubbleAttack(enemy)) {
        this.playAnimation(this.IMAGES_ATTACK_BUBBLE);
        enemy.reactToHit();
        return;
      }
    });

    const boss = this.world.boss;
    if (this.startPoisonAttack(boss)) {
      this.playAnimation(this.IMAGES_ATTACK_BUBBLE_POISON);
      boss.reactToHit();
      return;
    }
  }

  startFinAttack(enemy) {
    const isTarget = enemy instanceof Puffers;
    const isInRange = this.isClose(enemy) || this.isColliding(enemy);
    console.log("Fin Attack Check:", { isTarget, isInRange, result: isTarget && isInRange });
    return isTarget && isInRange;
  }

  startBubbleAttack(enemy) {
    return enemy instanceof Jellyfish && (this.isClose(enemy) || this.isColliding(enemy));
  }

  startPoisonAttack(enemy) {
    return enemy instanceof Boss && (this.isClose(enemy) || this.isColliding(enemy));
  }

  isIdle() {
    const k = this.world.keyboard;
    return !k.LEFT && !k.RIGHT && !k.UP && !k.DOWN;
  }

  handleIdle() {
    this.playAnimation(this.IMAGES_HOVER);
    this.swimUp = false;
    this.swimDown = false;
  }

  handleSwim() {
    this.playAnimation(this.IMAGES_SWIM);
  }

  resetSleep() {
    this.lastActionTime = Date.now();
  }
}
