import type Entrance from "./entrance";
import type Platform from "./platform";

export enum AccessSynopsis {accessible, aided, inaccessible, unknown}

export class AccessAssessment {
  /**
   * The vertical gap between platform and the vehicles boarding height.
   * May be undefined if the platform height is unknown.
   */
  readonly verticalGap?: number;
  /**
   * The vertical difference between platform and the vehicles floor height.
   * Mostly relevant to calculate the angle (up-/downwards) and steepness of a ramp.
   * May be undefined if the platform height is unknown.
   */
  readonly verticalDiff?: number;
  readonly stepCount: number;
  readonly ramp: boolean;

  constructor({
    verticalGap,
    verticalDiff,
    stepCount = 0,
    ramp = false,
  }: {
    verticalGap?: number,
    verticalDiff?: number,
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

    let verticalGap:number | undefined,
        verticalDiff: number | undefined;
    if (platform.boardingHeight !== undefined) {
      verticalGap = Math.abs(entrance.boardingHeight - platform.boardingHeight);
      verticalDiff = Math.abs(floorHeight - platform.boardingHeight);
    }

    return new AccessAssessment({
      verticalGap: verticalGap,
      verticalDiff: verticalDiff,
      stepCount: entrance.steps?.count ?? 0,
      ramp: entrance.ramp,
    });
  }

  get hasGap(): boolean {
    return this.verticalGap !== undefined && this.verticalGap > 0.05;
  }

  get hasSteps(): boolean {
    return this.stepCount > 0;
  }

  get hasRamp(): boolean {
    return this.ramp;
  }

  get synopsis(): AccessSynopsis {
    if (this.verticalGap === undefined || this.verticalDiff === undefined) {
      return AccessSynopsis.unknown;
    }
    else if (!this.hasSteps && !this.hasGap) {
      return AccessSynopsis.accessible;
    }
    else if (this.hasRamp && this.verticalDiff <= 0.3) {
      return AccessSynopsis.aided;
    }
    return AccessSynopsis.inaccessible;
  }
}
