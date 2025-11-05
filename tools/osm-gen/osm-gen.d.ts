declare module 'virtual:osm-gen/lines' {
  import { FeatureCollection, GeoJsonProperties, LineString } from "geojson"

  const component: FeatureCollection<LineString, GeoJsonProperties>;
  export default component;
}

declare module 'virtual:osm-gen/stops' {
  import { FeatureCollection, GeoJsonProperties, Point } from "geojson"

  const component: FeatureCollection<Point, GeoJsonProperties>;
  export default component;
}
