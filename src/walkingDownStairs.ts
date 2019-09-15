import { Processor } from './walkDownStairs.processor';
import { UserControl } from './walkDownStairs.userControl';
import { LMS_GameRenderer } from '../lib/lms-games/LMS_GameRenderer.js';
import { Player, WalkDownStairTimer, WalkDownStairStatus, NormalStair } from './shape';
import { OffYouGoConfig, defaultOffYouGoConfig, StageConfig, defaultStageConfig, KeyValuePair } from './_models/config';
import { MathHelper, ShapeGeneratorHelper } from './_helpers';
import { GameStore } from './_models/game-store';
import { GameController } from './_models/game-controller';

export class WalkDownStairs {
    private container: HTMLElement;
    private canvas: HTMLCanvasElement;
    private canvasUI: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private stage0Config: OffYouGoConfig;
    private config: OffYouGoConfig = defaultOffYouGoConfig;

    private stageConfig: StageConfig = defaultStageConfig;
    private readonly gameStore = GameStore.getInstance();

    private control = GameController.getInstance();

    private gameManager: {
        renderer: LMS_GameRenderer;
        processor: Processor;
        userControl: UserControl
    } = {
        renderer: undefined,
        processor: undefined,
        userControl: undefined
    };

    constructor(
    ) {
        this.gameManager.processor = new Processor();
        this.gameManager.userControl = new UserControl(
            this.restart.bind(this),
            this.resume.bind(this)
        );
    }

    load(id: string, options: Partial<OffYouGoConfig>): void {
        console.log('loading modules...rednerer');
        this.gameManager.renderer = new LMS_GameRenderer();
        // initializing control signals
        this.control.init();
        // assign options
        options = options || {};
        this.config = { ...this.config, ...options };
        this.stage0Config = { ...this.config };
        this.container = document.getElementById(id);
        this.createCanvas();
        this.gameStore.fpsObj = ShapeGeneratorHelper.getLMSText('', this.canvas.width - 60, 20, '#0095DD', 'left');
        // load user control
        this.gameManager.userControl.load(this.canvasUI);

        // test drawing
        const heart = ShapeGeneratorHelper.getLMSHeart(50, 100, 15, '#FF0000', this.config.stiarRisingSpeed);
        this.gameStore.shapeObjects.hearts.push(heart);

        Promise.all(this.getPlayerAssets())
            .then((results) => {
                console.log('all promises resolved', results);
                results.forEach(img => this.gameStore.assets.player1.push(img));
                this.initializeView(this.config, this.canvas);
                this.main();
            });
    }

    restart(): void {
        this.control.pauseGame();

        this.config = {...this.config, ...this.stage0Config};

        this.control.init();
        this.initializeView(this.config, this.canvas);
        this.main();
    }

    resume(): void {
        this.control.init();
        this.main();
    }

    private initializeView(config: OffYouGoConfig, canvas: HTMLCanvasElement): void {
        this.gameStore.resetShapeObjects();

        while (this.gameStore.shapeObjects.stairs.length < 6) {
            const stairLength = MathHelper.randomInteger(3, 5);
            const lastStair = this.gameStore.shapeObjects.stairs[this.gameStore.shapeObjects.stairs.length - 1];
            let stairPosX = MathHelper.randomInteger(0, canvas.width - config.stairUnitWidth * stairLength);
            let stairPosY;
            if (lastStair) {
                while (Math.abs(stairPosX - lastStair.x) <= config.minStairDistanceX) {
                    stairPosX = MathHelper.randomInteger(0, canvas.width - config.stairUnitWidth * stairLength);
                }
                stairPosY = MathHelper.randomInteger(lastStair.y + 80, lastStair.y + 150);
            } else {
                stairPosY = MathHelper.randomInteger(120, 150);
            }

            const stair = new NormalStair({
                x: stairPosX, y: stairPosY, length: stairLength,
                dx: 0, dy: config.stiarRisingSpeed,
                unitWidth: config.stairUnitWidth,
            });
            this.gameStore.shapeObjects.stairs.push(stair);
        }
        const firstStair = this.gameStore.shapeObjects.stairs[0];
        const playerPosX = MathHelper.randomInteger(firstStair.x + 15, firstStair.x + firstStair.length * firstStair.unitWidth - 15);
        const player = new Player({
            stationaryAvatarFacingLeft: this.gameStore.assets.player1[0],
            movingAvatarFacingLeft: this.gameStore.assets.player1[1],
            stationaryAvatarFacingRight: this.gameStore.assets.player1[2],
            movingAvatarFacingRight: this.gameStore.assets.player1[3],
            x: playerPosX, y: firstStair.y - 15,
            dx: 0, dy: 0, ddy: 0,
        });

        this.gameStore.shapeObjects.players.push(player);
        const hpBar = ShapeGeneratorHelper.getLMSHpBar(10, 5, 75, 15, 'rgba(255, 255, 255, 0.5)', 'rgba(194, 0, 0, 0.5)', 'rgba(255, 0, 0, 0.5)', 1, 2);
        const status = new WalkDownStairStatus({ x: canvas.width / 2 - 20, y: 20, color: config.statusTextColor });
        const timer = new WalkDownStairTimer({ x: canvas.width / 2 + 75, y: 55, color: config.statusTextColor });

        this.gameStore.shapeObjects.hpBars.push(hpBar);
        this.gameStore.shapeObjects.status.push(status);
        this.gameStore.shapeObjects.timer.push(timer);
    }

    private main(): void {
        if (!this.control.pause && !this.control.gameOver) {
            this.control.stopMain = window.requestAnimationFrame(this.main.bind(this));
            this.gameStore.gameTimer.start();
        } else {
            this.gameStore.gameTimer.pause();
        }
        const currentTime = window.performance.now();
        const nextTickTime = this.control.lastTickTime + this.config.tickLength;
        let numTicks = 0;
        let timePassedSinceLastTick = 0;
        // If tFrame < nextTick then 0 ticks need to be updated (0 is default for numTicks).
        // If tFrame = nextTick then 1 tick needs to be updated (and so forth).
        // Note: As we mention in summary, you should keep track of how large numTicks is.
        // If it is large, then either your game was asleep, or the machine cannot keep up.
        if (currentTime > nextTickTime) {
            timePassedSinceLastTick = currentTime - this.control.lastTickTime;
            numTicks = Math.floor(timePassedSinceLastTick / this.config.tickLength);
        }
        this.queueUpdates(numTicks);
        this.gameManager.renderer.draw(currentTime, this.canvas, this.ctx, this.control, this.gameStore);
        if (currentTime - this.control.lastfpsUpdate >= this.config.fpsUpdateFrequency) {
            this.gameStore.updateFrameRate(currentTime, this.control.lastRender);
        }
        this.control.saveLastRenderTime(currentTime);
    }

    private queueUpdates(numTicks: number): void {
        for (let i = 0; i < numTicks; i++) {
            this.control.saveLastTickTime(this.control.lastTickTime + this.config.tickLength);
            this.gameManager.processor.updatePhysics(this.canvas, this.config, this.stageConfig);
        }
    }

    private createCanvas(): void {
        this.createGamePanel();
        this.createTouchPanel();
    }

    private createGamePanel(): void {
        this.canvas = document.createElement('canvas');
        const availableWidth = window.innerWidth;
        const availableHeight = window.innerHeight - 200;
        let scaleRatio = 1;
        if (availableHeight < this.config.height || availableWidth < this.config.width) {
            console.log('do some scaling');
            if (availableHeight >= availableWidth) {
                // ratio
                scaleRatio = availableWidth / this.config.width;
                this.canvas.style.width = availableWidth + 'px';
                this.canvas.style.height = (this.config.height * scaleRatio) + 'px';
            } else {
                scaleRatio = availableHeight / this.config.height;
                this.canvas.style.width = (this.config.width * scaleRatio) + 'px';
                this.canvas.style.height = availableHeight + 'px';
            }
        }
        this.canvas.height = this.config.height;
        this.canvas.width = this.config.width;
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        window['ctx'] = this.ctx;
        window['canvas'] = this.canvas;
    }

    private createTouchPanel(): void {
        this.canvasUI = document.createElement('canvas');
        const availableWidth = window.innerWidth;
        const availableHeight = window.innerHeight - 200;
        let scaleRatio = 1;
        if (availableHeight < this.config.height || availableWidth < this.config.width) {
            if (availableHeight >= availableWidth) {
                // ratio
                scaleRatio = availableWidth / this.config.width;

                this.canvasUI.style.width = availableWidth + 'px';
                this.canvasUI.style.height = (200 * scaleRatio) + 'px';
            } else {
                scaleRatio = availableHeight / this.config.height;

                this.canvasUI.style.width = (this.config.width * scaleRatio) + 'px';
                this.canvasUI.style.height = '200px';
            }
        }
        this.canvasUI.height = 200;
        this.canvasUI.width = this.config.width;
        this.canvasUI.style.marginTop = '0px';
        this.canvasUI.style.borderTopWidth = '1px';
        this.canvasUI.style.borderTopStyle = 'solid';
        this.canvasUI.style.borderTopColor = '#7b6d6d';
        this.container.appendChild(this.canvasUI);
    }

    private async loadImage(name: string): Promise<HTMLImageElement> {
        return new Promise(resolve => {
            const imgEle = document.createElement('img');
            imgEle.addEventListener('load', () => {
                resolve(imgEle);
            });
            imgEle.src = `/assets/images/${name}.png`;
        })
    }
    
    private getPlayerAssets(): Array<Promise<HTMLImageElement>> {
        return [
            ...this.config.player1Assets.map(name => this.loadImage(name)),
            ...this.config.player2Assets.map(name => this.loadImage(name))
        ]
    }
}
