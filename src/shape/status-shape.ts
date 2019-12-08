import { LMS_Text } from '../../lib/lms-games/generic-shape.js';


export class WalkDownStairStatus {
    x: number;
    y: number;
    color: string;
    textObj: LMS_Text;
    score: number;
    level: number;

    constructor(options: any) {
        const { x, y, score, color } = options;
        this.x = x;
        this.y = y;
        this.color = color;
        this.textObj = this.getText();
        this.score = score || 0;
        this.level = 1;
    }

    draw(tFrame: number, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
        const { level, score } = this;
        this.textObj.text = `Level: ${level}  Score: ${score}`;
        this.textObj.draw(tFrame, ctx, canvas);
    }

    private getText() : LMS_Text {
        return new LMS_Text({
            text: 'Level: 1  Score: 0',
            x: this.x,
            y: this.y,
            font: '14px sans-serif',
            color: this.color,
            align: 'center',
        });
    }
}


