import { BumpyStairOptions } from '../../_models/shape_model';
import { Stairs } from './stairs-shape';
import { ShapeGeneratorHelper } from '../../_helpers';

export class BumpyStair extends Stairs {
    x: number;
    y: number;
    unitWidth: number;
    unitHeight: number;
    length: number;
    dx: number;
    dy: number;
    borderWidth: number;
    type: string;
    constructor(options: BumpyStairOptions) {
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
        this.type = 'bumpy';
    }

    draw(tFrame: number, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
        ctx.save();
        ctx.fillStyle = '#1caf9f';
        ctx.fillRect(this.x, this.y, this.unitWidth * this.length, this.unitHeight);
        ctx.fillStyle = '#04e2cc';
        ctx.fillRect(this.x + this.borderWidth, this.y + this.borderWidth,
            this.unitWidth * this.length - 2 * this.borderWidth,
            this.unitHeight - 2 * this.borderWidth);
        for (let i = 0; i < this.length; i++) {
            const posX = this.x + this.borderWidth + i * (this.unitWidth);
            if (i > 0 && i < this.length) {
                const spring = ShapeGeneratorHelper.getLMSSpring(posX, this.y + 2, posX, this.y + this.unitHeight - 2, 2, 10, 1, '#1caf9f', '#1caf9f', 2);
                spring.draw(tFrame, ctx, canvas);
            }
        }
        ctx.restore();
    }
}
