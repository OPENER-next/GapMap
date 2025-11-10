declare module 'virtual:osm-data/data' {
  import { FeatureCollection, GeoJsonProperties, LineString, Point } from "geojson"

  const geoJSONLineData: FeatureCollection<LineString, GeoJsonProperties>;
  const geoJSONStopData: FeatureCollection<Point, GeoJsonProperties>;

  export { geoJSONLineData, geoJSONStopData }
}
