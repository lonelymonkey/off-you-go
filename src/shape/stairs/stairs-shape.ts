import { LMS_CollisionObject } from '../../../lib/lms-games/generic-shape.js';

export class Stairs {

    protected unitHeight = 25;

    constructor(width: number, height: number, offsetX: number, offsetY: number) {
        LMS_CollisionObject.call(this, 'rectangle', {
            offsetX, offsetY, width, height,
        });
    }
}
