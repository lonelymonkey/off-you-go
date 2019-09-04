import { LMS_Text, LMS_hourglass, LMS_spring, LMS_collapse, LMS_spike, LMS_coin, LMS_heart, LMS_HpBar } from '../../lib/lms-games/generic-shape.js';

export class ShapeGeneratorHelper {
    static getLMSText(text: string, x: number, y: number, font: string, color: string, align: string): LMS_Text {
        return  new LMS_Text({
            text: text,
            x: x,
            y: y,
            font: font,
            color: color,
            align: align,
        });
    }
     
    static getLMSHourglass(x: number, y: number, width: number, height: number, color: string): LMS_hourglass {
        return new LMS_hourglass({
            x: x,
            y: y,
            width: width,
            height: height,
            color: color,
        });
    }

    static getLMSSpring(x1: number, y1: number, x2: number, y2: number, windings: number, width: number, offset: number, col1: string, col2: string, lineWidth: number): LMS_spring {
        return new LMS_spring({
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            windings: windings,
            width: width,
            offset: offset,
            col1: col1,
            col2: col2,
            lineWidth: lineWidth
        });
    }

    static getLMSCollapse(x1: number, y1: number, width: number, height: number, length: number, crackPercentage: number): LMS_collapse {
        return new LMS_collapse({
            x1: x1,
            y1: y1,
            width: width,
            height: height,
            length: length,
            crackPercentage: crackPercentage
        });
    }

    static getLMSSpike(x1: number, y1: number, width: number, spikeLegnth: number, col1: string, lineWidth: number, frequency: number): LMS_spike {
        return new LMS_spike({
            x1: x1,
            y1: y1,
            width: width,
            spikeLegnth: spikeLegnth,
            col1: col1,
            lineWidth: lineWidth,
            frequency: frequency
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
