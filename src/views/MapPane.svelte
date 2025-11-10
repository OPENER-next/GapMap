<script lang="ts">
  import { LineStore } from '$lib/stores/line-store.svelte';
  import type { Map } from 'maplibre-gl';
  import { getContext } from 'svelte';
  import { GeoJSONSource, GeolocateControl, LineLayer, MapLibre, NavigationControl, Projection, ScaleControl, SymbolLayer } from 'svelte-maplibre-gl';
  import {geoJSONLineData, geoJSONStopData} from "virtual:osm-data/data";

	let {
    class: className,
	}: {
    class?: string;
  } = $props();

  const lineStore = getContext<LineStore>('line-store');

  let map: Map | undefined = $state();
  let mapCursor: string | undefined = $state();
  let mapGlobalState = $derived({
    'active': lineStore.selectedPlatformId ?? lineStore.selectedLineId ?? null
  });

  $effect(() => {
    if (map) {
      const stop = lineStore.selectedPlatform;
      const line = lineStore.selectedLine;
      if (stop) {
        map.flyTo({
          center: stop.coordinates,
          speed: 0.75,
          duration: 1000,
          zoom: 19,
        });
      }
      else if (line) {
        // Calculating bounds based on geometry/coordinates doesn't work because the coordinates are clamped to the tile
        // therefore it is precalculated and added as a property
        map.fitBounds(line.bbox, {
          padding: 100,
          duration: 1000
        });
      }
    }
  });
</script>


<div class="map-pane rounded-3xl {className}">
  <MapLibre
    bind:map
    class="w-full h-full"
    zoom={12}
    center={{ lng: 8.40219712, lat: 49.003463 }}
    style="https://api.maptiler.com/maps/019909f4-78cf-7dbe-a949-27df4805bb43/style.json?key=3Uam2soS3S9RCPvHdP7E"
    cursor={mapCursor}
    globalState={mapGlobalState}
  >
    <Projection type="globe" />
    <NavigationControl />
    <ScaleControl />
    <GeolocateControl />
    <GeoJSONSource
      maxzoom={22}
      data={geoJSONStopData}
    >
      <SymbolLayer
        beforeId=""
        id="tram-stops"
        onmouseenter={e => mapCursor = 'pointer'}
        onmouseleave={e => mapCursor = undefined}
        onclick={e => {
          const target = e.features?.[0];
          if (target) {
            lineStore.selectedPlatformId = target.properties['_id'];
            e.preventDefault();
          }
        }}
        minzoom={11}
        layout={{
          "text-field": "{name}",
          "text-font": ["Noto Sans Regular"],
          "visibility": "visible",
          "icon-image": "us-state_5",
          "icon-anchor": "center",
          "text-anchor": ["get", "_anchor"],
          "icon-size": 1,
          "text-overlap": "never",
          "icon-rotate": ["get", "_bearing"],
          "icon-rotation-alignment": "map",
          "text-ignore-placement": false,
          "text-optional": false,
          "text-padding": 2,
          "text-radial-offset": 1.5,
          "symbol-avoid-edges": true,
          "icon-optional": false,
          "icon-ignore-placement": false,
          "symbol-sort-key": [
            "case",
            [
              "==",
              ["global-state", "active"],
              ["get", "_id"]
            ],
            0,
            1
          ],
          "icon-padding": 0
        }}
        paint={{
          "text-color": "hsl(0, 0%, 0%)",
          "icon-halo-color": "hsl(0, 0%, 100%)",
          "text-halo-color": "hsl(0, 0%, 100%)",
          "icon-halo-width": 2,
          "text-halo-width": 2,
          "text-halo-blur": 0,
          "icon-color": [
            "case",
            [
              "==",
              ["global-state", "active"],
              ["get", "_id"]
            ],
            "blue",
            "hsl(26, 100%, 50%)"
          ],
          "icon-halo-blur": 0
        }}
        filter={[
          "all",
          [
            "==",
            ["geometry-type"],
            "Point"
          ],
          [
            "any",
            [
              "==",
              ["global-state", "active"],
              null
            ],
            [
              "in",
              ["global-state", "active"],
              ["get", "_relation_ids"]
            ],
            [
              "in",
              "node",
              ["global-state", "active"]
            ]
          ],
        ]}
      />
    </GeoJSONSource>
    <GeoJSONSource
      maxzoom={22}
      data={geoJSONLineData}
    >
      <LineLayer
        id="tram-lines-outline"
        beforeId="Building"
        minzoom={11}
        layout={{
          "line-join": "round",
          "line-cap": "round"
        }}
        paint={{
          "line-color": "hsl(0, 0%, 100%)",
          "line-width": [
            "interpolate",
            ["linear"],
            ["zoom"],
            0,
            0,
            22,
            26
          ],
          "line-blur": 0,
          "line-offset": [
            "interpolate",
            ["linear"],
            ["zoom"],
            0,
            11,
            22,
            0
          ]
        }}
        filter={[
          "==",
          ["geometry-type"],
          "LineString"
        ]}
      />
      <LineLayer
        id="tram-lines-main"
        beforeId="Building"
        onmouseenter={e => mapCursor = 'pointer'}
        onmouseleave={e => mapCursor = undefined}
        onclick={e => {
          const target = e.features?.[0];
          if (target) lineStore.selectedLineId = target.properties['_id'];
        }}
        minzoom={11}
        layout={{
          "line-join": "round",
          "line-cap": "round",
          "line-sort-key": [
            "case",
            [
              "==",
              ["global-state", "active"],
              ["get", "_id"]
            ],
            1,
            0
          ]
        }}
        paint={{
          "line-color": [
            "case",
            [
              "==",
              ["global-state", "active"],
              ["get", "_id"]
            ],
            "blue",
            "hsla(26, 100%, 50%, 0.25)"
          ],
          "line-color-transition": {
            "duration": 600
          },
          "line-width": [
            "interpolate",
            ["linear"],
            ["zoom"],
            0,
            0,
            22,
            12
          ],
          "line-offset": [
            "interpolate",
            ["linear"],
            ["zoom"],
            0,
            11,
            22,
            0
          ]
        }}
        filter={[
          "==",
          ["geometry-type"],
          "LineString"
        ]}
      />
    </GeoJSONSource>
  </MapLibre>
</div>


<style>
  .map-pane {
    position: relative;
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      box-shadow: inset 0 0 6px rgba(0,0,0,0.25);
      pointer-events: none;
      border-radius: inherit;
    }
  }

  :global(.map-pane :is(
    .maplibregl-ctrl-top-right,
    .maplibregl-ctrl-top-left,
    .maplibregl-ctrl-bottom-left,
    .maplibregl-ctrl-bottom-right
  )) {
    padding: 0.5rem;
  }
</style>
