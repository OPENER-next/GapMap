

export abstract class Space {
  distanceFront: number;

  constructor({
    distanceFront
  }: {
    distanceFront: number
  }) {
    this.distanceFront = distanceFront;
  }
}

export class WheelchairSpace extends Space {

}
