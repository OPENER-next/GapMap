import type { LngLatLike } from "maplibre-gl";

export default class Platform {
  readonly id: string;
  readonly name: string;
  readonly coordinates: LngLatLike;
  readonly boardingHeight: number;

  constructor({
    id, name, coordinates, boardingHeight
  }: {
    id: string, name: string, coordinates: LngLatLike, boardingHeight: number
  }) {
    this.id = id;
    this.name = name;
    this.coordinates = coordinates;
    this.boardingHeight = boardingHeight;
  }
}
