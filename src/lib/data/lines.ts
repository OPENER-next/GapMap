import Line from "$lib/models/line";
import Platform from "$lib/models/platform";

import rawStopData from "virtual:osm-gen/stops";
import rawLineData from "virtual:osm-gen/lines";

/**
 * Generated example data from GeoJSON OSM extract.
 * See `tools` directory
 */
export const lineData = new Map(rawLineData.features.map((e) => {
  return [
    e.id,
    new Line({
      id: e.id as string,
      bbox: e.bbox as [number, number, number, number],
      name: e.properties!.name as string,
      stops: e.properties!._stops.map((id: string) => {
        const stop = rawStopData.features.find(f => f.id === id)!;
        return new Platform({
          id: stop.id as string,
          coordinates: stop.geometry.coordinates as [number, number],
          name: stop.properties!.name,
          boardingHeight: 0.3,
        })
      }),
    })
  ]
}));
