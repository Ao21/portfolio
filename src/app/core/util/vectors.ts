import * as _ from 'lodash';

export interface IVector {
    x: number;
    y: number;
}

export class Vector implements IVector {
    public x: number;
    public y: number;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

}

export function distanceBetweenVectors(oldPoint, newPoint) {
    return Math.hypot(newPoint.x - oldPoint.x, newPoint.y - oldPoint.y);
}

export function sampleVectors(originVector, vectors: Vector[]) {
    let a = getClockwiseOrCounter(originVector, vectors[0], vectors[1]);
    let b = getClockwiseOrCounter(originVector, vectors[2], vectors[3]);
    let c = getClockwiseOrCounter(originVector, vectors[4], vectors[5]);

    var sum = [a, b, c].reduce(function (a, b) { return a + b; });
    return (sum > 0.5) ? true : false;
}

export function getClockwiseOrCounter(centerPoint, oldPoint, newPoint) {
    let v1x = oldPoint.x - centerPoint.x;
    let v1y = oldPoint.y - centerPoint.y;
    let v2x = newPoint.x - centerPoint.x;
    let v2y = newPoint.y - centerPoint.y;
    return  Math.atan2(v1x, v1y) - Math.atan2(v2x, v2y)  > 0 ? 1 : 0;

    // return ((b.x - origin.x) * (c.y - origin.y) - (b.y - origin.y) * (c.x - origin.x)) > 0 ? 1 : 0;
}