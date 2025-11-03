import Line from "$lib/models/line";
import Platform from "$lib/models/platform";

import rawStopData from "./stops.json";
import rawLineData from "./lines.json";

/**
 * Generated example data from GeoJSON OSM extract.
 */
export const lineData = new Map(rawLineData.features.map((e) => {
  return [
    e.id,
    new Line({
      id: e.id,
      bbox: e.bbox as [number, number, number, number],
      name: e.properties.name,
      stops: e.properties._stops.map(id => {
        const stop = rawStopData.features.find(f => f.id === id)!;
        return new Platform({
          id: stop.id,
          coordinates: stop.geometry.coordinates as [number, number],
          name: stop.properties.name,
          boardingHeight: 0.3,
        })
      }),
    })
  ]
}));
