export interface KeyValuePair<T> {
    [key: string]: T;
}

export interface OffYouGoConfig {
    width: number;
    height: number;
    maxStairs: number;
    minimumYBetweenStair: number;
    minStairDistanceX: number;
    stairSpacing: number;
    stairUnitWidth: number;
    stiarRisingSpeed: number;
    hpHealFromHeart: number;
    heartSize: number;
    heartInitConfig: heartInitConfig;
    hpBarConfig: hpBarConfig;
    coinConfig : coinConfig;
    // frame rate control
    tickLength: number;
    playerSpeedX: number;
    playerFallAcceleration: number;
    fpsUpdateFrequency: number;
    stairDuration: number;
    heartSpwanChance: number;
    coinSpawnChance: number;
    scorePerCoin: number;
    scorePerBounce: number;
    // style here
    statusTextColor: string;
    specialTypeStairsRatio: SpecialTypeStairsRatio;
    fpsText: fpsText;
    player1Assets: Array<string>;
    player2Assets: Array<string>;
}

export const defaultOffYouGoConfig: OffYouGoConfig = {
    width: 500,
    height: 600,
    maxStairs: 6,
    minimumYBetweenStair: 70,
    minStairDistanceX: 40,
    // this control the spacing of the stair, small number results = average bigger gap between the stairs
    stairSpacing: 0.1,
    stairUnitWidth: 35,
    stiarRisingSpeed: -125,
    // hearts
    hpHealFromHeart: 0.3333,
    heartSize: 15,
    heartInitConfig: {
        x: 50,
        y: 100,
        size: 15,
        color: '#FF0000'
    },
    // frame rate control
    tickLength: 5,
    playerSpeedX: 350,
    playerFallAcceleration: 1000,
    // playerFallAcceleration : 0,
    fpsUpdateFrequency: 2000, // in milisecond
    specialTypeStairsRatio: {
        BumpyStair: 0.15,
        SpikeStair: 0.15,
        FadeOutStair: 0.15,
        CollapseStair: 0.15,
    },
    fpsText: {
        text: '',
        xOffset: 60,
        yPosition: 20,
        color: '#0095DD',
        align: 'left'
    },
    hpBarConfig: {
        x: 10,
        y: 5,
        width: 75,
        height: 15,
        bgColor: 'rgba(255, 255, 255, 0.5)',
        borderColor: 'rgba(194, 0, 0, 0.5)',
        hpColor: 'rgba(255, 0, 0, 0.5)',
        hp: 1,
        borderWidth: 2,
    },
    coinConfig: {
        thickness: 2,
        r: 6,
        r2: 4
    },
    stairDuration: 1000, // 1 second
    heartSpwanChance: 0.1,
    coinSpawnChance: 0.8,
    scorePerCoin: 5,
    scorePerBounce: 10,
    // style here
    statusTextColor: '#fff',
    player1Assets: [
        'monkey-frame-1',
        'monkey-frame-2',
        'monkey-frame-3',
        'monkey-frame-4',
    ],
    player2Assets: [
        'cici-frame-1',
        'cici-frame-2',
        'cici-frame-3',
        'cici-frame-4',
    ],
};

export type SpecialTypeStairsRatio = KeyValuePair<number>;

export interface GameStage {
    condition: {
        time: number;
    };

    config: Partial<OffYouGoConfig>;
}

export interface fpsText {
    text: string,
    xOffset: number,
    yPosition: number,
    color: string,
    align: string
}

export interface heartInitConfig {
    x: number,
    y: number,
    size: number,
    color: string
}

export interface hpBarConfig {
    x: number,
    y: number,
    width: number,
    height: number,
    bgColor: string,
    borderColor: string,
    hpColor: string,
    hp: number,
    borderWidth: number,
}

export interface coinConfig {
    thickness: number,
    r: number,
    r2: number
}

export type StageConfig = Array<GameStage>;

export const defaultStageConfig: StageConfig = [
    {
        condition: {
            time: 30,
        },
        config: {
            stiarRisingSpeed: -140,
        },
    },
    {
        condition: {
            time: 60,
        },
        config: {
            stiarRisingSpeed: -160,
        },
    },
    {
        condition: {
            time: 90,
        },
        config: {
            stiarRisingSpeed: -180,
        },
    },
    {
        condition: {
            time: 120,
        },
        config: {
            stiarRisingSpeed: -200,
        },
    },
];

