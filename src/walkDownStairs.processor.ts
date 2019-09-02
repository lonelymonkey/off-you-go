import { LMS_coin, LMS_heart } from '../lib/lms-games/generic-shape.js';
import { Player, BumpyStair, SpikeStair, FadeOutStair, CollapseStair, NormalStair } from './shape';
import { OffYouGoConfig } from './_models/config.js';
import { GameStore } from './_models/game-store';
import { GameController } from './_models/game-controller';
import { MathHelper } from './_helpers';
import { StageConfig } from './_models/config';
import { PlayerControlSignal } from './_models/game-controller';

/**
 * walkDownStairs.processor
    this layer updates all the signals (controller to model)
    takes control, model as input  -> mutate model
    it does all the calculation, boundary check , collision detection etc
 */

export class Processor {
  private readonly gameController = GameController.getInstance();
  private readonly gameStore = GameStore.getInstance();

  getDistance(x1: number, y1: number, x2: number, y2: number): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.pow(Math.pow( dx, 2 ) + Math.pow( dy, 2 ), 0.5);
  }

  isPlayerCollidedWithHeart( heart: LMS_heart, player: Player ): boolean {
    const distance = this.getDistance(heart.x, heart.y, player.x, player.y);
    if (distance <= (heart.r + player.r)) return true;

    return false;
  }

  isPlayerCollidedWithCoin( coin: LMS_coin, player: Player ): boolean {
    const distance = this.getDistance(coin.x, coin.y, player.x, player.y);
    if ( distance <= (coin.r + player.r) ) return true;

    return false;
  }

  playerStairCollisionDetection( stair: any, player: Player ): string {
    const hitBox = stair.hitBox;
    const errorMarginY = stair.unitHeight / 4;

    if ( player.x >= hitBox.x &&
        player.x <= hitBox.x + hitBox.shape.width) {
      if (Math.abs(player.y + player.r - hitBox.y) <= errorMarginY) {
        return 'bottom';
      }
    }
    // side edge
    if ( player.y + player.r > hitBox.y &&
      player.y - player.r <= hitBox.y + stair.unitHeight) {
      if ( player.x - player.r <= hitBox.x + hitBox.shape.width &&
          player.x > hitBox.x + hitBox.shape.width) {
        return 'left';
      }
      if ( player.x + player.r >= stair.x && player.x <= stair.x) {
        return 'right';
      }
    }
    return undefined;
  }

  addStairs( config: OffYouGoConfig, canvas: HTMLCanvasElement ): void {
    const stairLength = MathHelper.randomInteger(3, 5);
    let stairPosX = MathHelper.randomInteger(0, canvas.width - config.stairUnitWidth * stairLength);
    const lastStair = this.gameStore.shapeObjects.stairs[this.gameStore.shapeObjects.stairs.length - 1];
    if (lastStair) {
      while ( Math.abs(stairPosX - lastStair.x) <= config.minStairDistanceX ) {
        stairPosX = MathHelper.randomInteger(0, canvas.width - config.stairUnitWidth * stairLength);
      }
    }
    let stair;
    const stairProb = Math.random();
    let matchstair = '';
    let staircurrentProb = 0;
    for (const typeStair in config.specialTypeStairsRatio) {
      if (typeStair) {
        staircurrentProb += config.specialTypeStairsRatio[typeStair];
        if (stairProb <= staircurrentProb) {
          matchstair = typeStair;
          break;
        }
      }
    }

    switch (matchstair) {
      case 'BumpyStair':
        stair = new BumpyStair({
          x: stairPosX, y: canvas.height,
          length: stairLength,
          dx: 0, dy: config.stiarRisingSpeed,
          unitWidth: config.stairUnitWidth,
        });
        break;
      case 'SpikeStair':
        stair = new SpikeStair({
          x: stairPosX, y: canvas.height,
          length: stairLength,
          dx: 0, dy: config.stiarRisingSpeed,
          unitWidth: config.stairUnitWidth,
        });
        break;
      case 'FadeOutStair':
        stair = new FadeOutStair({
          x: stairPosX, y: canvas.height,
          length: stairLength, dx: 0,
          dy: config.stiarRisingSpeed,
          unitWidth: config.stairUnitWidth,
          totalDuration: config.stairDuration,
        });
        break;
      case 'CollapseStair':
        stair = new CollapseStair({
          x: stairPosX, y: canvas.height,
          length: stairLength, dx: 0,
          dy: config.stiarRisingSpeed, unitWidth: config.stairUnitWidth,
          totalDuration: config.stairDuration,
        });
        break;
      default:
        stair = new NormalStair({
          x: stairPosX, y: canvas.height,
          length: stairLength, dx: 0,
          dy: config.stiarRisingSpeed, unitWidth: config.stairUnitWidth,
        });
    }
    this.gameStore.shapeObjects.stairs.push(stair);
    return stair;
  }

  recycleEle(): void {
    if ( this.gameStore.numberOfStairs > 0 ) {
      const highestStair = this.gameStore.shapeObjects.stairs[0];
      if ( highestStair.y + highestStair.unitHeight < 0 ) {
        this.gameStore.shapeObjects.stairs.shift();
      }
    }
    if ( this.gameStore.numberOfHearts > 0 ) {
      const topHeart = this.gameStore.shapeObjects.hearts[0];
      if (topHeart.y + topHeart.size / 2 < 0 ) {
        this.gameStore.shapeObjects.hearts.shift();
      }
    }
  }

  spawnStairs( canvas: HTMLCanvasElement, config: OffYouGoConfig ): void {
    // enforce rule: no more than maxStairs stairs can be in a frame
    let stair;
    if ( this.gameStore.numberOfStairs < config.maxStairs) {
      const lastStair = this.gameStore.shapeObjects.stairs[this.gameStore.numberOfStairs - 1];
      if ( !lastStair ) {
        // initializeStairs( config, canvas, model );
        stair = this.addStairs( config, canvas );
      } else {
        const shouldAddStair = ( Math.random() < config.stairSpacing ) ? true : false;
        if (shouldAddStair && (canvas.height - lastStair.y) >= config.minimumYBetweenStair) {
          stair = this.addStairs( config, canvas );
        }
      }
      if ( stair ) {
        const spawnHeart = ( Math.random() <= config.heartSpwanChance );
        const spawnCoin = ( Math.random() <= config.coinSpawnChance );
        if ( spawnHeart ) {
          const heart = new LMS_heart({
            x: MathHelper.randomInteger( stair.x, stair.x + stair.unitWidth * stair.length ),
            y: stair.y - 10,
            size: config.heartSize,
            color: '#FF0000',
            dy: config.stiarRisingSpeed,
          });
          this.gameStore.shapeObjects.hearts.push( heart );
        } else if ( spawnCoin ) {
          // random coins
          const numCoins = MathHelper.randomInteger(1, 5);
          let startPosX = MathHelper.randomInteger( stair.x, stair.x + stair.unitWidth * stair.length - (6 + 10) * numCoins );
          for (let i = 0; i < numCoins; i++) {
            const coin = new LMS_coin({
              x: startPosX,
              y: stair.y - 6, thickness: 2,
              r: 6, r2: 4,
              dy: config.stiarRisingSpeed,
            });
            this.gameStore.shapeObjects.coins.push( coin );
            startPosX += 6 + 10;
          }
        }
      }
    }
  }

  processControl( config: OffYouGoConfig ): void {
    this.gameController.players.forEach( ( playerControl: PlayerControlSignal, playerIndex: number ) => {
      const player = this.gameStore.shapeObjects.players[playerIndex];
      if ( player ) {
        if ( playerControl.moveToLeft) {
          player.dx = -config.playerSpeedX;
        } else if ( playerControl.moveToRight ) {
          player.dx = config.playerSpeedX;
        } else {
          player.dx = 0;
        }
        if ( playerControl.jumpUp && player.canJump) {
          player.dy = config.stiarRisingSpeed - 300;
        }
      }
    });
  }

  collisionDetection( canvas: any, config: any ): void {
    this.gameStore.shapeObjects.players.forEach(( player: any, playerIdx: number ) => {
      let landedStairIdx;
      let falling = true;
      let playerHurt = false;
      player.canJump = false;
      this.gameStore.shapeObjects.stairs.forEach(( stair: any, stairIdx: number) => {
        const collision = this.playerStairCollisionDetection( stair, player );
        if ( collision ) {
          switch (collision) {
            case 'bottom':
              // landedStair = stair;
              landedStairIdx = stairIdx;
              // we'll need this for bumpy stair
              falling = false;
              switch (stair.type) {
                case 'bumpy':
                  player.dy = config.stiarRisingSpeed - 300;
                  this.gameStore.shapeObjects.status[0].score += config.scorePerBounce;
                  player.y = stair.y - player.r;
                  break;
                case 'spike':
                  player.dy = config.stiarRisingSpeed;
                  player.y = stair.y - player.r + stair.spikeLegnth;
                  playerHurt = true;
                  break;
                case 'fadeOut':
                  stair.duration += config.tickLength;
                  const fadeOutWidth = stair.unitWidth * stair.length * stair.duration / stair.totalDuration;
                  if (player.x >= stair.x + fadeOutWidth && player.x <= stair.x + stair.unitWidth * stair.length) {
                    player.y = stair.y - player.r;
                    player.dy = config.stiarRisingSpeed;
                  } else {
                    falling = true;
                  }
                  if (stair.duration >= config.stairDuration) {
                    this.gameStore.shapeObjects.stairs.splice(stairIdx, 1);
                  }
                  break;
                case 'collapse':
                  stair.duration += config.tickLength;
                  player.dy = config.stiarRisingSpeed;
                  player.y = stair.y - player.r;
                  if (stair.duration >= config.stairDuration) {
                    this.gameStore.shapeObjects.stairs.splice(stairIdx, 1);
                    falling = true;
                  }
                  break;
                default:
                  player.dy = config.stiarRisingSpeed;
                  player.y = stair.y - player.r;
              }
              player.canJump = true;
              player.ddy = 0;
              break;
            case 'left':
              // instead of updating the dx, we should just reset the position
              // player.dx = Math.max(0, player.dx);
              player.x = stair.x + stair.unitWidth * stair.length + player.r;
              break;
            case 'right':
              // player.dx = Math.min(0, player.dx);
              player.x = stair.x - player.r;
              break;
            default:
              break;
          }
        }
      });
      // eat a heart to heal!
      const collidedHeartIdx = this.gameStore.shapeObjects.hearts.findIndex(( heart: any ) => this.isPlayerCollidedWithHeart(heart, player));

      if ( collidedHeartIdx > -1 ) {
        const hpBar = this.gameStore.shapeObjects.hpBars[playerIdx];
        hpBar.newHp = Math.min(hpBar.hp + config.hpHealFromHeart, 1);
        this.gameStore.shapeObjects.hearts.splice(collidedHeartIdx, 1);
      }

      // get coins for score
      const collidedCoinIdx = this.gameStore.shapeObjects.coins.findIndex(( coin: any, coinIdx: any) => this.isPlayerCollidedWithCoin(coin, player));

      if ( collidedCoinIdx > -1 ) {
        this.gameStore.shapeObjects.coins.splice(collidedCoinIdx, 1);
        this.gameStore.shapeObjects.status[0].score += config.scorePerCoin;
      }

      if ( falling ) {
        player.ddy = config.playerFallAcceleration;
      }
      if ( player.x + player.r > canvas.width ) {
        player.x = canvas.width - player.r;
      }
      if ( player.x - player.r < 0) {
        player.x = player.r;
      }
      if ( player.y + player.r > canvas.height ) {
        this.gameController.endGame();
      }

      if (playerHurt) {
        if (!player.invincible) {
          const hpBar = this.gameStore.shapeObjects.hpBars[playerIdx];
          hpBar.newHp = Math.max(hpBar.hp - 1 / 3, 0);
          if ( hpBar.newHp <= 0.0000001) {
            this.gameController.endGame();
          } else {
            player.invincible = true;
            setTimeout(() => {
              player.invincible = false;
            }, 3000);
          }
        }
      }

      if ( player.y - player.r <= 0) {
        player.y = player.r;
        if (!player.invincible) {
          const hpBar = this.gameStore.shapeObjects.hpBars[playerIdx];
          hpBar.newHp = Math.max(hpBar.hp - 1 / 3, 0);
          if ( hpBar.newHp <= 0.0000001) {
            this.gameController.endGame();
          } else {
            player.invincible = true;
            this.gameStore.shapeObjects.stairs.splice(landedStairIdx, 1);
            setTimeout(() => {
              player.invincible = false;
            }, 3000);
          }
        }
      }
    });
  }

  processPhysics( config: any ) {
    for (const type in this.gameStore.shapeObjects) {
      if ( this.gameStore.shapeObjects.hasOwnProperty(type) ) {
        this.gameStore.shapeObjects[type].forEach(( shape: any ) => {
          shape.y = shape.y || 0;
          shape.dy = shape.dy || 0;
          shape.x = shape.x || 0;
          shape.dx = shape.dx || 0;

          const accelerationX = shape.ddx || 0;
          const accelerationY = shape.ddy || 0;
          const velocityY = shape.dy || 0;
          const velocityX = shape.dx || 0;

          shape.y += velocityY * config.tickLength / 1000;
          shape.dy += accelerationY * config.tickLength / 1000;
          shape.x += velocityX * config.tickLength / 1000;
          shape.dx += accelerationX * config.tickLength / 1000;
        });
      }
    }
  }

  advanceLevel(config: OffYouGoConfig, stageConfig: StageConfig): void {
    // get the next stage config
    const currentLevel = this.gameStore.shapeObjects.status[0].level;
    const currentTime = this.gameStore.shapeObjects.timer[0].time;
    const nextStage = stageConfig[currentLevel - 1];
    if (nextStage) {
      if (currentTime >= nextStage.condition.time) {
        for (const prop in nextStage.config) {
          if (nextStage.config.hasOwnProperty(prop) && config.hasOwnProperty(prop)) {
            config[prop] = nextStage.config[prop];
          }
        }
        this.gameStore.advanceOneLevel();
      }
    }
  }

  updatePhysics( canvas: HTMLCanvasElement, config: OffYouGoConfig, stageConfig: StageConfig ): void {
    this.recycleEle();
    this.spawnStairs( canvas, config );
    // add players if needed
    this.processControl( config );
    this.processPhysics( config );
    this.collisionDetection( canvas, config );
    this.advanceLevel(config, stageConfig);
    // paint the fps text last so it's on top of everything else
    this.gameStore.fpsObj.text = `FPS: ${this.gameStore.frameRate}`;
  }
}
