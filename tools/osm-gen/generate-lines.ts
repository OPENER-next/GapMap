import type { Feature, FeatureCollection, GeoJsonProperties, LineString } from 'geojson';
import { arrayEquals, overpassToGeoJSONBounds, overpassToGeoJSONCoords, queryOverpassData }from './utils.ts';

const query = `
[out:json][timeout:25];
relation["type"="route"]["route"="tram"]["network:short"="VMS"];
out geom;
`;

interface OverpassResponse {
  elements: Array<{
    id: number;
    bounds: {
      minlon: number;
      minlat: number;
      maxlon: number;
      maxlat: number;
    };
    members: Array<{
      type: string;
      role: string;
      geometry: Array<{ lon: number; lat: number }>;
      ref: number;
    }>;
    tags: Record<string, string>;
  }>;
}

export async function generateLineData(): Promise<FeatureCollection<LineString, GeoJsonProperties>> {
  const data = await queryOverpassData(query) as OverpassResponse;
  const lines: Feature<LineString>[] = [];

  for (const relation of data.elements) {
    const coordinates: Array<[number, number]> = [];
    const stops: string[] = [];

    for (const member of relation.members) {
      if (member.type === 'way' && member.role === '') {
        const newPoints = Array.from(overpassToGeoJSONCoords(member.geometry));
        // Drop overlapping coordinates and swap/align coordinates
        if (coordinates.length === 0) {
          coordinates.push(...newPoints);
        }
        else if (arrayEquals(coordinates[coordinates.length - 1], newPoints[0])) {
          newPoints.shift();
          coordinates.push(...newPoints);
        }
        else if (arrayEquals(coordinates[coordinates.length - 1], newPoints[newPoints.length - 1])) {
          newPoints.pop();
          newPoints.reverse();
          coordinates.push(...newPoints);
        }
      }
      else if (member.type === 'node' && ['stop', 'stop_entry_only', 'stop_exit_only'].includes(member.role)) {
        stops.push(`node/${member.ref}`);
      }
    }

    const id = `relation/${relation.id}`;
    const bbox = overpassToGeoJSONBounds(relation.bounds);

    const feature: Feature<LineString> = {
      type: 'Feature',
      id,
      bbox,
      geometry: {
        type: 'LineString',
        coordinates: coordinates,
      },
      properties: {
        ...relation.tags,
        _id: id,
        _stops: stops,
      },
    };

    lines.push(feature);
  }

  return {
    type: 'FeatureCollection',
    features: lines,
  };
}
