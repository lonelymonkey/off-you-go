import { SpikeStairOptions } from '../../_models/shape_model';
import { Stairs } from './stairs-shape';
import { ShapeGeneratorHelper } from '../../_helpers';

export class SpikeStair extends Stairs {
    x: number;
    y: number;
    unitWidth: number;
    frequency: number;
    length: number;
    dx: number;
    dy: number;
    type: string;
    unitHeight: number;
    borderWidth: number;
    spikeLegnth: number;

    constructor(options: SpikeStairOptions) {
        const { x, y, length, dx, dy, unitWidth } = options;
        const unitHeight = 35;
        const borderWidth = 3;

        const width = unitWidth * length;
        const height = unitHeight - unitHeight / 4;
        super(width, height, 0, unitHeight / 4);

        this.x = x;
        this.y = y;
        this.unitWidth = unitWidth;

        this.frequency = 2;
        this.length = length;
        this.dx = dx;
        this.dy = dy;
        this.type = 'spike';
        this.unitHeight = unitHeight;
        this.borderWidth = borderWidth;
        this.spikeLegnth = unitHeight * 0.25;
    }

    draw(tFrame: number, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
        ctx.save();
        for (let i = 0; i < this.length; i++) {
            const posX = this.x + this.borderWidth + i * (this.unitWidth);
            ctx.fillStyle = '#606060';
            ctx.fillRect(this.x + i * this.unitWidth,
                this.y + this.spikeLegnth, this.unitWidth, this.unitHeight - this.spikeLegnth);
            ctx.fillStyle = '#808080';
            ctx.fillRect(posX, this.y + this.borderWidth + this.spikeLegnth,
                this.unitWidth - 2 * this.borderWidth,
                this.unitHeight - this.spikeLegnth - 2 * this.borderWidth);
            const needle = ShapeGeneratorHelper.getLMSSpike(this.x + i * this.unitWidth, this.y + this.spikeLegnth, this.unitWidth, this.spikeLegnth, '#606060', 3, this.frequency);
            needle.draw(tFrame, ctx, canvas);
        }
        ctx.restore();
    }
}
