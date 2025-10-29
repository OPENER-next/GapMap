import type Entrance from "./entrance";
import type { Space } from "./space";

export default class Vehicle {
  readonly name: string;
  readonly width: number;
  readonly length: number;
  readonly height: number;
  readonly entrances: Entrance[];
  readonly spaces: Space[];

  constructor({
    name, width, length, height, entrances = [], spaces = []
  }: {
    name: string, width: number, length: number, height: number, entrances?: Entrance[], spaces?: Space[]
  }) {
    this.name = name;
    this.width = width;
    this.length = length;
    this.height = height;
    this.entrances = entrances;
    this.spaces = spaces;
  }
}