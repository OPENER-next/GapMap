import type { LngLatBoundsLike } from "maplibre-gl";
import type Platform from "./platform";

export default class Line {
  readonly id: string;
  readonly name: string;
  readonly bbox: LngLatBoundsLike;
  readonly stops: Platform[];

  constructor({
    id, name, bbox, stops
  }: {
    id: string, name: string, bbox: LngLatBoundsLike, stops: Platform[]
  }) {
    this.id = id;
    this.name = name;
    this.bbox = bbox;
    this.stops = stops;
  }
}
