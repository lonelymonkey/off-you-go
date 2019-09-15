import { LMS_Text, LMS_hourglass, LMS_coin, LMS_heart, LMS_HpBar } from '../../lib/lms-games/generic-shape.js';

export class ShapeGeneratorHelper {
    static getLMSText(text: string, x: number, y: number, color: string, align: string): LMS_Text {
        return  new LMS_Text({
            text: text,
            x: x,
            y: y,
            font: '14px sans-serif',
            color: color,
            align: align,
        });
    }
     
    static getLMSHourglass(x: number, y: number, color: string): LMS_hourglass {
        return new LMS_hourglass({
            x: x,
            y: y,
            width: 13,
            height: 14,
            color: color,
        });
    }

    static getLMSCoin(x: number, y: number, thickness: number, r: number, r2: number, dy: number): LMS_coin {
        return new LMS_coin({
            x: x,
            y: y,
            thickness: thickness,
            r: r,
            r2: r2,
            dy: dy
        });
    }

    static getLMSHeart(x: number, y: number, size: number, color: string, dy: number): LMS_heart {
        return new LMS_heart({
            x: x,
            y: y,
            size: size,
            color: color,
            dy: dy,
        });
    }

    static getLMSHpBar(x: number, y: number, width: number, height: number, bgColor: string, borderColor: string, hpColor: string, hp: number, borderWidth: 2): LMS_HpBar {
        return new LMS_HpBar({
            x: x,
            y: y,
            width: width,
            height: height,
            bgColor: bgColor,
            borderColor: borderColor,
            hpColor: hpColor,
            hp: hp,
            borderWidth: borderWidth,
        });
    }
}
