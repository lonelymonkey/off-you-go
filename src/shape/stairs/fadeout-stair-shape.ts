import { FadeOutStairOptions } from '../../_models/shape_model';
import { Stairs } from './stairs-shape';

export class FadeOutStair extends Stairs {
    x: number;
    y: number;
    unitWidth: number;
    unitHeight: number;
    length: number;
    dx: number;
    dy: number;
    borderWidth: number;
    type: string;
    totalDuration: number;
    duration: number;

    constructor(options: FadeOutStairOptions) {
        const { x, y, length, dx, dy, unitWidth, totalDuration } = options;
        const unitHeight = 25;

        const width = unitWidth * length;
        const height = unitHeight - unitHeight / 4;
        super(width, height, 0, unitHeight / 4);

        this.x = x;
        this.y = y;
        this.unitWidth = unitWidth;
        this.length = length;
        this.dx = dx;
        this.dy = dy;
        this.borderWidth = 3;
        this.type = 'fadeOut';
        this.totalDuration = totalDuration;
        this.duration = 0;
    }

    draw(tFrame: number, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
        ctx.save();
        const stairLengthPercentage = 1;
        const fadeOutPercentage = stairLengthPercentage - this.duration / this.totalDuration;
        const arrowOffset = 23;
        const arrowPixel = 30;

        ctx.beginPath();
        ctx.rect(this.x, this.y, this.unitWidth * this.length * fadeOutPercentage, this.unitHeight);
        ctx.strokeStyle = '#76e482';
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.closePath();
        ctx.clip();

        for (let i = 0; i < this.length; i++) {
            const posX = this.x + this.borderWidth + i * (this.unitWidth);
            ctx.fillStyle = '#606060';
            ctx.fillRect(this.x + i * this.unitWidth,
                this.y, this.unitWidth, this.unitHeight);
            ctx.font = `${arrowPixel}px Georgia`;
            ctx.fillStyle = '#808080';
            ctx.fillText('➡', posX, this.y + arrowOffset);
        }
        ctx.restore();
    }
}
