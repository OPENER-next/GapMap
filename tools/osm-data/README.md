# OSM Data

Small scripts to query and process exemplary OSM data to feed the demo App.

The data is queried via Overpass and then transformed into 2 GeoJSON data structures enriched with additional details relevant for the application and rendering.

## Usage

### Vite plugin

Import it directly in the app's code:
```ts
import { geoJSONLineData, geoJSONStopData } from "virtual:osm-data/data";
```

Requires changes to the following files:

`tsconfig.json`
```diff
{
  "compilerOptions": {
+   "types": [
+     "./tools/osm-data/osm-data"
+   ],
  }
}
```

`vite.config.ts`
```diff
+import OSMData from './tools/osm-data/osm-data';

export default defineConfig({
  plugins: [
+    OSMData()
  ]
});
```

### Generate the geojson files by running:

`lines.geojson`
```shell
node osm-data-run.ts lines > lines.geojson
```

`stops.geojson`
```shell
node osm-data-run.ts stops > stops.geojson
```