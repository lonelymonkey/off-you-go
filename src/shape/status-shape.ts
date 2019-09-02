import { LMS_Text } from '../../lib/lms-games/generic-shape.js';

export class WalkDownStairStatus {
    textObj: LMS_Text;
    score: number;
    level: number;

    constructor(options: any) {
        const { x, y, score, color } = options;
        this.textObj = new LMS_Text({
            text: 'Level: 1  Score: 0',
            x: x, y: y,
            font: '14px sans-serif',
            color: color,
            align: 'center',
        });
        this.score = score || 0;
        this.level = 1;
    }

    draw(tFrame: number, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
        const { level, score } = this;
        this.textObj.text = `Level: ${level}  Score: ${score}`;
        this.textObj.draw(tFrame, ctx, canvas);
    }
}


