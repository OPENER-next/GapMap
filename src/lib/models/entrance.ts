import type Steps from "./steps";

export default class Entrance {
  width: number;
  height: number;
  distanceFront: number;
  side: string;
  boardingHeight: number;
  steps?: Steps;

  constructor({
    width, height, distanceFront, side, boardingHeight, steps
  }: {
    width: number, height: number, distanceFront: number, side: string, boardingHeight: number, steps?: Steps
  }) {
    this.width = width;
    this.height = height;
    this.distanceFront = distanceFront;
    this.side = side;
    this.boardingHeight = boardingHeight;
    this.steps = steps;
  }
}
