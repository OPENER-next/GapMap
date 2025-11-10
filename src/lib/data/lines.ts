import Line from "$lib/models/line";
import Platform from "$lib/models/platform";

import {geoJSONLineData, geoJSONStopData} from "virtual:osm-data/data";

/**
 * Generated example data from GeoJSON OSM extract.
 * See `tools` directory
 */
export const lineData = new Map(geoJSONLineData.features.map(l => {
  return [
    l.id as string,
    new Line({
      id: l.id as string,
      bbox: l.bbox as [number, number, number, number],
      name: l.properties!.name as string,
      stops: l.properties!._stops.map((id: string) => {
        const stop = geoJSONStopData.features.find(f => f.id === id)!;
        return new Platform({
          id: stop.id as string,
          coordinates: stop.geometry.coordinates as [number, number],
          name: stop.properties!.name,
          boardingHeight: stop.properties?.height ?? 0.3,
        })
      }),
    })
  ]
}));
