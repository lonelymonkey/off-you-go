import { CollapseStairOptions } from '../../_models/shape_model';
import { Stairs } from './../stairs/stairs-shape';
import { LMS_collapse } from '../../../lib/lms-games/generic-shape.js';

export class CollapseStair extends Stairs {
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
    crackPercentage: number;

    constructor(options: CollapseStairOptions) {
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
        this.type = 'collapse';
        this.totalDuration = totalDuration;
        this.duration = 0;
    }

    draw(tFrame: number, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
        ctx.save();
        this.crackPercentage = this.duration / this.totalDuration;
        for (let i = 0; i < this.length; i++) {
            const posX = this.x + this.borderWidth + i * (this.unitWidth);
            ctx.fillStyle = 'red';
            ctx.fillRect(this.x + i * this.unitWidth,
                this.y, this.unitWidth, this.unitHeight);
            ctx.fillStyle = '#808080';
            ctx.fillRect(posX, this.y + this.borderWidth,
                this.unitWidth - 2 * this.borderWidth,
                this.unitHeight - 2 * this.borderWidth);
        }

        this.drawCrack(tFrame, ctx, canvas);
        ctx.restore();
    }

    private drawCrack(tFrame: number, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
        if (this.crackPercentage > 0.1) {
            const collapse = this.getCrack();
            collapse.draw(tFrame, ctx, canvas);
        }
    }

    private getCrack(): LMS_collapse {
        return new LMS_collapse({
            x1: this.x,
            y1: this.y,
            width: this.unitWidth,
            height: this.unitHeight,
            length: this.length,
            crackPercentage: this.crackPercentage
        });
    }
}
