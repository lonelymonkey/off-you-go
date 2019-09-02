import { LMS_Text, LMS_heart, LMS_HpBar } from '../../lib/lms-games/generic-shape.js';

export interface GameModel {
    frameRate: number;
    fpsObj: LMS_Text;
    shapeObjects: AvatarList;
    assets: AssetsList;
}

export interface AssetsList {
    player1: Array<any>;
}

export interface AvatarList {
    stairs: Array<any>;
    players: Array<any>;
    hpBars: Array<LMS_HpBar>;
    hearts: Array<LMS_heart>;
    coins: Array<any>;
    timer: Array<any>;
    status: Array<any>;
}
