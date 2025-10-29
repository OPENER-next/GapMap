import type Entrance from "./entrance";
import type Platform from "./platform";

export enum AccessSynopsis {accessible, aided, inaccessible}

export class AccessAssessment {
  readonly verticalGap: number;
  readonly verticalDiff: number;
  readonly stepCount: number;
  readonly ramp: boolean;

  constructor({
    verticalGap = 0,
    verticalDiff = 0,
    stepCount = 0,
    ramp = false,
  }: {
    verticalGap: number,
    verticalDiff: number,
    stepCount: number,
    ramp: boolean,
  }) {
    this.verticalGap = verticalGap;
    this.verticalDiff = verticalDiff;
    this.stepCount = stepCount;
    this.ramp = ramp;
  }

  static evaluate(entrance: Entrance, platform: Platform): AccessAssessment {
    const totalStepHeight = entrance.steps ? entrance.steps.count * entrance.steps.height : 0;
    const floorHeight = entrance.boardingHeight + totalStepHeight;

    return new AccessAssessment({
      verticalGap: Math.abs(entrance.boardingHeight - platform.boardingHeight),
      verticalDiff: Math.abs(floorHeight - platform.boardingHeight),
      stepCount: entrance.steps?.count ?? 0,
      ramp: entrance.ramp,
    })
  }

  get hasGap(): boolean {
    return this.verticalGap > 0.05;
  }

  get hasSteps(): boolean {
    return this.stepCount > 0;
  }

  get hasRamp(): boolean {
    return this.ramp;
  }

  get synopsis(): AccessSynopsis {
    if (!this.hasSteps && !this.hasGap) {
      return AccessSynopsis.accessible;
    }
    else if (this.hasRamp && this.verticalDiff <= 0.3) {
      return AccessSynopsis.aided;
    }
    return AccessSynopsis.inaccessible;
  }
}