import { StairTimerOptions } from '../_models/shape_model';
import { LMS_Text, LMS_hourglass } from '../../lib/lms-games/generic-shape.js';

export class WalkDownStairTimer {
    x: number;
    y: number;
    color: string;
    hourGlass: LMS_hourglass;
    time: number;
    textObj: LMS_Text;
    state: string;
    preState: string;
    lastTFrame: number;

    constructor(options: StairTimerOptions) {
        const { x, y, color } = options;
        this.x = x;
        this.y = y;
        this.color = color;
        this.hourGlass = this.getHourglass();
        this.time = 0;
        this.textObj = this.getText();
        this.state = 'paused';
        this.preState = 'paused';
        this.lastTFrame = 0;
    }

    draw(tFrame: number, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
        ctx.save();
        if (this.state === 'count' && this.preState === 'count') {
            this.time += (tFrame - this.lastTFrame) / 1000;
            this.textObj.text = ': ' + Math.round(this.time);
        }
        this.preState = this.state;
        this.lastTFrame = tFrame;
        this.hourGlass.draw(tFrame, ctx, canvas);
        this.textObj.draw(tFrame, ctx, canvas);
        ctx.restore();
    }

    start(): void {
        this.state = 'count';
    }

    pause(): void {
        this.state = 'paused';
    }

    private getHourglass(): LMS_hourglass {
        return new LMS_hourglass({
            x: this.x,
            y: this.y,
            width: 13,
            height: 14,
            color: this.color,
        });
    }

    private getText(): LMS_Text {
        return new LMS_Text({
            text: ': ' + this.time,
            x: this.x + 10,
            y: this.y - 35,
            font: '14px sans-serif',
            color: this.color,
            align: 'left',
        });
    }
}
