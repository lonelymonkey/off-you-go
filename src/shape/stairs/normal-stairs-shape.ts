import { StairOptions } from '../../_models/shape_model';
import { Stairs } from './stairs-shape';

export class NormalStair extends Stairs {
    x: number;
    y: number;
    unitWidth: number;
    unitHeight: number;
    length: number;
    dx: number;
    dy: number;
    borderWidth: number;
    type: string;

    constructor(options: StairOptions) {
        const { x, y, length, dx, dy, unitWidth } = options;
        const borderWidth = 3;
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
        this.borderWidth = borderWidth;
        this.type = 'normal';
    }

    draw(tFrame: number, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        ctx.save();
        for (let i = 0; i < this.length; i++) {
            const posX = this.x + this.borderWidth + i * (this.unitWidth);
            ctx.fillStyle = '#606060';
            ctx.fillRect(this.x + i * this.unitWidth,
                this.y, this.unitWidth, this.unitHeight);
            ctx.fillStyle = '#808080';
            ctx.fillRect(posX, this.y + this.borderWidth,
                this.unitWidth - 2 * this.borderWidth,
                this.unitHeight - 2 * this.borderWidth);
        }
        ctx.restore();
    }
}
