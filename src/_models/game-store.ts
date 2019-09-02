import { LMS_Text } from '../../lib/lms-games/generic-shape.js';
import { AvatarList, AssetsList, GameModel } from './game-model.type.js';
import { WalkDownStairTimer } from '../shape';

export class GameStore {

    private static instance: GameStore;
    private readonly _model: GameModel = {
        frameRate: 0,
        fpsObj: {},
        shapeObjects: {
            stairs: [],
            players: [],
            hpBars: [],
            hearts: [],
            coins: [],
            timer: [],
            status: [],
        },
        assets: {
            player1: [],
        },
    };

    private constructor() { }

    static getInstance(): GameStore {
        if (!GameStore.instance)
            GameStore.instance = new GameStore();

        return GameStore.instance;
    }

    get frameRate(): number {
        return this._model.frameRate;
    }

    get fpsObj(): LMS_Text {
        return this._model.fpsObj;
    }

    set fpsObj(text: LMS_Text) {
        this._model.fpsObj = text;
    }

    get shapeObjects(): AvatarList {
        return this._model.shapeObjects;
    }

    get assets(): AssetsList {
        return this._model.assets;
    }

    get gameTimer(): WalkDownStairTimer {
        return this._model.shapeObjects.timer[0];
    }

    get numberOfStairs(): number {
        return this._model.shapeObjects.stairs.length;
    }

    get numberOfHearts(): number {
        return this._model.shapeObjects.hearts.length;
    }

    updateFrameRate(currentTime: number, lastRenderedTime: number): void {
        this._model.frameRate = Math.floor(1000 / (currentTime - lastRenderedTime));
    }

    resetShapeObjects(): void {
        Object.values(this._model.shapeObjects).forEach(shapeList => shapeList.splice(0));
    }

    advanceOneLevel(): void {
        this._model.shapeObjects.status[0].level++;
    }
}
