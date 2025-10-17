import type Entrance from "./entrance";

export default class Vehicle {
  name: string;
  width: number;
  length: number;
  height: number;
  entrances: Entrance[];

  constructor({
    name, width, length, height, entrances
  }: {
    name: string, width: number, length: number, height: number, entrances: Entrance[]
  }) {
    this.name = name;
    this.width = width;
    this.length = length;
    this.height = height;
    this.entrances = entrances;
  }
}