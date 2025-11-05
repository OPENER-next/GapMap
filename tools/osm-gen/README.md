# OSM Gen

Small scripts to query and process exemplary OSM data to feed the demo App.

The data is queried via Overpass and then transformed into 2 GeoJSON data structures enriched with additional details relevant for the application and rendering.

## Usage

### Vite plugin

Import it directly in the app's code:
```ts
import geojsonStopData from "virtual:osm-gen/stops";
import geojsonLineData from "virtual:osm-gen/lines";
```

Requires changes to the following files:

`tsconfig.json`
```diff
{
  "compilerOptions": {
+   "types": [
+     "./tools/osm-gen/osm-gen"
+   ],
  }
}
```

`vite.config.ts`
```diff
+import OSMGen from './tools/osm-gen/osm-gen';

export default defineConfig({
  plugins: [
+    OSMGen()
  ]
});
```

### Generate the geojson files by running:

`lines.geojson`
```shell
node osm-gen-run.ts lines > lines.geojson
```

`stops.geojson`
```shell
node osm-gen-run.ts stops > stops.geojson
```