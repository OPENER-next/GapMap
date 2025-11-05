const endPoint = "http://overpass-api.de/api/interpreter";

export async function queryOverpassData(query: string): Promise<any> {
  const response = await fetch(endPoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ data: query }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export function* overpassToGeoJSONCoords(coordinates: Array<{ lon: number; lat: number }>): Generator<[number, number]> {
  for (const coord of coordinates) {
    yield [coord.lon, coord.lat];
  }
}

export function overpassToGeoJSONBounds(bounds: { minlon: number; minlat: number; maxlon: number; maxlat: number }): [number, number, number, number] {
  return [bounds.minlon, bounds.minlat, bounds.maxlon, bounds.maxlat];
}

export function arrayEquals<T>(array1: T[], array2: T[]): boolean {
  if (array1.length !== array2.length) return false;
  return array1.every((v, i) => v === array2[i]);
}
