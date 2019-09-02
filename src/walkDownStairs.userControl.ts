import { GameController, Players } from './_models/game-controller';

export class UserControl {
    private mousePosition = { x: 0, y: 0 };
    private lastPos = this.mousePosition;
    private UIActivated = false;
    private loaded = false;
    private gameController = GameController.getInstance();

    constructor(
        private readonly restart: () => void,
        private readonly resume: () => void
    ) {

    }

    private getKeyUpHandler() {
        return (e: KeyboardEvent) => {
            // console.log(e.keyCode);
            switch (e.keyCode) {
                case 38:
                    this.gameController.jumpOff(Players.player1);
                    break;
                case 37:
                    this.gameController.moveLeftOff(Players.player1);
                    break;
                case 39:
                    this.gameController.moveRightOff(Players.player1);
                    break;
                default:
                    break;
            }
        };
    }

    getKeyDownHandler() {
        return (e: KeyboardEvent) => {
            // console.log(e.keyCode);
            switch (e.keyCode) {
                // enter ( return )
                case 13:
                    if (this.gameController.gameOver)
                        this.restart();
                    break;
                // p
                case 80:
                    this.gameController.togglePause();
                    if (!this.gameController.pause) {
                        this.resume();
                    }
                    break;
                case 38:
                    this.gameController.jumpOn(Players.player1);
                    break;
                // left arrow key
                case 37:
                    this.gameController.moveLeftOn(Players.player1);
                    if (this.gameController.pause) {
                        this.gameController.togglePause();
                        this.resume();
                    }
                    break;
                case 39:
                    this.gameController.moveRightOn(Players.player1);
                    if (this.gameController.pause) {
                        this.gameController.togglePause();
                        this.resume();
                    }
                    break;
                default:
                    break;
            }
        };
    }

    private setControlBasedOnMousePosition(pos, canvasUI) {
        if (pos.x >= canvasUI.width / 2) {
            this.gameController.movePlayer1ToRight();
        } else {
            this.gameController.movePlayer1ToLeft();
        }
    }

    private initializeUI(canvasUI) {
        const ctxUI = canvasUI.getContext('2d');
        // draw left circle
        ctxUI.save();
        ctxUI.beginPath();
        // ctxUI.arc(canvasUI.width / 4, 100, 50, 0, Math.PI*2, true);
        // ctxUI.arc(canvasUI.width * 0.75, 100, 50, 0, Math.PI*2, true);
        ctxUI.moveTo(canvasUI.width / 2, 0);
        ctxUI.lineTo(canvasUI.width / 2, canvasUI.height);
        ctxUI.strokeStyle = '#efefef';
        ctxUI.stroke();
        ctxUI.closePath();
        ctxUI.restore();
        console.log('UIActivated', this.UIActivated);
        this.registerEvent(canvasUI);
        // mobile events
        this.registerMobileEvent(canvasUI);
    }

    private registerEvent(canvasUI) {
        document.body.addEventListener('touchstart', (e) => {
            console.log('touchstart event from body');
            if (this.gameController.gameOver) {
                this.restart();
            }
        });

        canvasUI.addEventListener('mousedown', (e: MouseEvent) => {
            this.UIActivated = true;
            this.lastPos = this.getMousePos(canvasUI, e);
            this.setControlBasedOnMousePosition(this.lastPos, canvasUI);
            if (this.gameController.pause) {
                this.gameController.pauseGame();
                this.resume();
            }
        }, false);

        canvasUI.addEventListener('mouseup', (_: MouseEvent) => {
            this.UIActivated = false;
            this.gameController.resetPlayer();
        }, false);

        canvasUI.addEventListener('mousemove', (e: MouseEvent) => {
            if (this.UIActivated) {
                this.mousePosition = this.getMousePos(canvasUI, e);
                this.setControlBasedOnMousePosition(this.mousePosition, canvasUI);
            }
        }, false);
    }

    /**
    * registerMobileEvent
    * @param {object} canvas The first number.
    */
    private registerMobileEvent(canvas) {
        canvas.addEventListener('touchstart', (e) => {
            this.mousePosition = this.getTouchPos(canvas, e);
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY,
            });
            canvas.dispatchEvent(mouseEvent);
            e.preventDefault();
        }, false);

        canvas.addEventListener('touchend', function (e) {
            const mouseEvent = new MouseEvent('mouseup', {});
            canvas.dispatchEvent(mouseEvent);
        }, false);

        canvas.addEventListener('touchmove', function (e) {
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY,
            });
            canvas.dispatchEvent(mouseEvent);
        }, false);
    }

    private getTouchPos(canvasDom, touchEvent) {
        const rect = canvasDom.getBoundingClientRect();

        return {
            x: touchEvent.touches[0].clientX - rect.left,
            y: touchEvent.touches[0].clientY - rect.top,
        };
    }

    private getMousePos(canvasDom, mouseEvent) {
        const rect = canvasDom.getBoundingClientRect();
        return {
            x: mouseEvent.clientX - rect.left,
            y: mouseEvent.clientY - rect.top,
        };
    }

    load(canvasUI: HTMLCanvasElement) {
        if (this.loaded) {
            return;
        }
        this.initializeUI(canvasUI);
        document.addEventListener('keydown', this.getKeyDownHandler(), false);
        document.addEventListener('keyup', this.getKeyUpHandler(), false);
        this.loaded = true;
    }

}
