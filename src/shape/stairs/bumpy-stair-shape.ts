import { BumpyStairOptions } from '../../_models/shape_model';
import { Stairs } from './stairs-shape';
import { LMS_spring } from '../../../lib/lms-games/generic-shape.js';

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
        this.drawSpring(tFrame, ctx, canvas);
        ctx.restore();
    }

    private drawSpring(tFrame: number, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement):void {
        for (let pos = 0; pos < this.length; pos++) {
            if (pos > 0 && pos < this.length) {
                const spring = this.getSpring(pos);
                spring.draw(tFrame, ctx, canvas);
            }
        }
    }

    private getSpring(position: number): LMS_spring {
        const posX = this.x + this.borderWidth + position * (this.unitWidth);
        return new LMS_spring({
            x1: posX,
            y1: this.y + 2,
            x2: posX,
            y2: this.y + this.unitHeight - 2,
            windings: 2,
            width: 10,
            offset: 1,
            col1: '#1caf9f',
            col2: '#1caf9f',
            lineWidth: 2
        });
    }
}
