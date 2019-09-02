import { PlayerOptions } from '../../_models/shape_model';

export class Player {
    x: number;
    y: number;
    dx: number;
    dy: number;
    ddy: number;
    r: number;
    stationaryAvatarFacingLeft: HTMLOrSVGImageElement;
    movingAvatarFacingLeft: HTMLOrSVGImageElement;
    stationaryAvatarFacingRight: HTMLOrSVGImageElement;
    movingAvatarFacingRight: HTMLOrSVGImageElement;
    prevDx: number;
    animationFrame: number;
    invincible: boolean;
    canJump: boolean;

    constructor(options: PlayerOptions) {
        const { x, y, dx, dy, ddy, stationaryAvatarFacingLeft, movingAvatarFacingLeft,
            stationaryAvatarFacingRight, movingAvatarFacingRight } = options;
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.ddy = ddy;
        this.r = 15;
        this.stationaryAvatarFacingLeft = stationaryAvatarFacingLeft;
        this.movingAvatarFacingLeft = movingAvatarFacingLeft;
        this.stationaryAvatarFacingRight = stationaryAvatarFacingRight;
        this.movingAvatarFacingRight = movingAvatarFacingRight;
        this.prevDx = 0;
        this.animationFrame = 0;
        this.invincible = false;
        this.canJump = false;
    }

    draw(tFrame: number, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
        ctx.save();
        if (this.invincible) {
            if (this.animationFrame) {
                ctx.globalAlpha = 0.5;
            } else {
                ctx.globalAlpha = 1;
            }
        }

        if (this.stationaryAvatarFacingLeft && this.movingAvatarFacingLeft &&
            this.stationaryAvatarFacingRight && this.movingAvatarFacingRight) {
            if (this.dx === 0) {
                if (this.prevDx >= 0) {
                    ctx.drawImage(this.stationaryAvatarFacingRight, this.x - 15, this.y - 15);
                } else {
                    ctx.drawImage(this.stationaryAvatarFacingLeft, this.x - 15, this.y - 15);
                }
            } else {
                if (this.dx >= 0) {
                    if (this.animationFrame) {
                        ctx.drawImage(this.movingAvatarFacingRight, this.x - 15, this.y - 15);
                    } else {
                        ctx.drawImage(this.stationaryAvatarFacingRight, this.x - 15, this.y - 15);
                    }
                } else {
                    if (this.animationFrame) {
                        ctx.drawImage(this.movingAvatarFacingLeft, this.x - 15, this.y - 15);
                    } else {
                        ctx.drawImage(this.stationaryAvatarFacingLeft, this.x - 15, this.y - 15);
                    }
                }
                this.prevDx = this.dx;
            }
            this.animationFrame = Math.floor((tFrame / 250) % 2);
        } else {
            ctx.beginPath();
            ctx.fillStyle = 'red';
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
        }
        ctx.restore();
    }
}
