export interface PlayerOptions {
    x: number;
    y: number;
    dx: number;
    dy: number;
    ddy: number;
    stationaryAvatarFacingLeft: HTMLOrSVGImageElement;
    movingAvatarFacingLeft: HTMLOrSVGImageElement;
    stationaryAvatarFacingRight: HTMLOrSVGImageElement;
    movingAvatarFacingRight: HTMLOrSVGImageElement;
}

export interface StairOptions {
    x: number;
    y: number;
    length: number;
    dx: number;
    dy: number;
    unitWidth: number;
}

export interface FadeOutStairOptions extends StairOptions {
    totalDuration: number;
}

export interface CollapseStairOptions extends StairOptions {
    totalDuration: number;
}

export interface StairTimerOptions {
    x: number;
    y: number;
    color: string;
}

export type BumpyStairOptions = StairOptions;
export type SpikeStairOptions = StairOptions;
