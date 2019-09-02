export interface PlayerControlSignal {
    moveToLeft: boolean;
    moveToRight: boolean;
    jumpUp: boolean;
    canJump: boolean;
}

export enum Players {
    player1,
    player2
}

export class GameController {

    private static gameController: GameController;
    private readonly controlSignals = {
        // requestAnimationFrame timer , in case if we need cancelAnimationFrame
        stopMain: 0,
        pause: true,
        lastTickTime: 0,
        lastRender: 0,
        lastfpsUpdate: 0,
        players: [
            { moveToLeft: false, moveToRight: false, jumpUp: false, canJump: false },
            { moveToLeft: false, moveToRight: false, jumpUp: false, canJump: false },
        ],
        gameOver: false,
    };

    private constructor() {}

    static getInstance(): GameController {
        if (!GameController.gameController)
            GameController.gameController = new GameController();

        return GameController.gameController;
    }

    get stopMain(): number {
        return this.controlSignals.stopMain;
    }

    set stopMain(requestId: number) {
        this.controlSignals.stopMain = requestId;
    }

    get pause(): boolean {
        return this.controlSignals.pause;
    }

    get lastTickTime(): number {
        return this.controlSignals.lastTickTime;
    }

    get lastRender(): number {
        return this.controlSignals.lastRender;
    }

    get lastfpsUpdate(): number {
        return this.controlSignals.lastfpsUpdate;
    }

    get players(): Array<PlayerControlSignal> {
        return this.controlSignals.players;
    }

    get gameOver(): boolean {
        return this.controlSignals.gameOver;
    }

    init(): void {
        this.controlSignals.gameOver = false;
        this.controlSignals.lastTickTime = window.performance.now();
        this.controlSignals.lastRender = this.controlSignals.lastTickTime;
    }

    pauseGame(): void {
        this.controlSignals.pause = true;
    }

    togglePause(): void {
        this.controlSignals.pause = !this.controlSignals.pause;
    }

    saveLastTickTime(time: number) {
        this.controlSignals.lastTickTime = time;
    }

    saveLastRenderTime(time: number) {
        this.controlSignals.lastRender = time;
    }

    movePlayer1ToRight(): void {
        this.moveRightOn(Players.player1);
        this.moveLeftOff(Players.player1);
    }

    movePlayer1ToLeft(): void {
        this.moveRightOff(Players.player1);
        this.moveLeftOn(Players.player1);
    }

    resetPlayer(): void {
        this.moveRightOff(Players.player1);
        this.moveLeftOff(Players.player1);
    }

    moveLeftOn(player: Players): void {
        this.controlSignals.players[player].moveToLeft = true;
    }

    moveLeftOff(player: Players): void {
        this.controlSignals.players[player].moveToLeft = false;
    }

    moveRightOn(player: Players): void {
        this.controlSignals.players[player].moveToRight = true;
    }

    moveRightOff(player: Players): void {
        this.controlSignals.players[player].moveToRight = false;
    }

    jumpOn(player: Players): void {
        this.controlSignals.players[player].jumpUp = true;
    }

    jumpOff(player: Players): void {
        this.controlSignals.players[player].jumpUp = false;
    }

    endGame(): void {
        this.controlSignals.gameOver = true;
    }
}
