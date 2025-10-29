import { AccessAssessment } from "./access-assessment";
import type Platform from "./platform";
import type Steps from "./steps";

export default class Entrance {
  readonly width: number;
  readonly height: number;
  readonly distanceFront: number;
  readonly side: string;
  readonly boardingHeight: number;
  readonly steps?: Steps;
  readonly ramp: boolean;

  constructor({
    width, height, distanceFront, side, boardingHeight, steps, ramp = false
  }: {
    width: number, height: number, distanceFront: number, side: string, boardingHeight: number, steps?: Steps, ramp?: boolean
  }) {
    this.width = width;
    this.height = height;
    this.distanceFront = distanceFront;
    this.side = side;
    this.boardingHeight = boardingHeight;
    this.steps = steps;
    this.ramp = ramp;
  }

  get isStepless(): boolean {
    return !this.steps || this.steps.count === 0;
  }

  assessAccess(platform: Platform): AccessAssessment {
    const totalStepHeight = this.steps ? this.steps.count * this.steps.height : 0;
    const floorHeight = this.boardingHeight + totalStepHeight;
    const accessHeightDifference = Math.abs(floorHeight - platform.boardingHeight);

    if (this.isStepless && accessHeightDifference <= 0.05) {
      return AccessAssessment.accessible;
    }
    else if (this.ramp && accessHeightDifference <= 0.3) {
      return AccessAssessment.aided;
    }
    return AccessAssessment.inaccessible;
  }
}
