<script lang="ts">
  import { LineStore } from '$lib/stores/line-store.svelte';
  import type { MapMouseEvent, Map, MapLibreEvent } from 'maplibre-gl';
  import { getContext } from 'svelte';
  import { GeolocateControl, GlobeControl, MapLibre, NavigationControl, Projection, ScaleControl } from 'svelte-maplibre-gl';

	let {
    class: className,
	}: {
    class?: string;
  } = $props();

  const lineStore = getContext<LineStore>('line-store');

  let map: Map | undefined = $state();

  function initMap(loadEvent: MapLibreEvent) {
    const map = loadEvent.target;
    function showPointer() {
      map.getCanvas().style.setProperty('cursor', 'pointer');
    }
    function hidePointer() {
      map.getCanvas().style.removeProperty('cursor');
    }
    map.on('mouseenter', 'Tram-lines-main', showPointer);
    map.on('mouseleave', 'Tram-lines-main', hidePointer);
    map.on('mouseenter', 'tram-stops', showPointer);
    map.on('mouseleave', 'tram-stops', hidePointer);
  }

  $effect(() => {
    if (map) {
      const line = lineStore.selectedLine;
      // Calculating bounds based on geometry/coordinates doesn't work because the coordinates are clamped to the tile
      // therefore it is precalculated and added as a property
      if (line) map.fitBounds(line.bbox, {
        padding: 100,
        duration: 1000
      });
      setActiveMapElementId(map, line?.id);
    }
  });

  $effect(() => {
    if (map) {
      const stop = lineStore.selectedPlatform;
      const line = lineStore.selectedLine;
      let activeId;
      if (stop) {
        map.flyTo({
          center: stop.coordinates,
          speed: 0.75,
          duration: 1000,
          zoom: 19,
        });
        activeId = stop.id;
      }
      else if (line) {
        map.fitBounds(line.bbox, {
          padding: 100,
          duration: 1000
        });
        activeId = line.id;
      }
      setActiveMapElementId(map, activeId);
    }
  });


  function setActiveMapElementId(map: Map, id?: string | undefined) {
    if (map.isStyleLoaded()) {
      // null is used to unset the id
      map.setGlobalStateProperty('active', id ?? null);
    }
  }

  function handleClick(e: MapMouseEvent) {
    const targets = e.target.queryRenderedFeatures(e.point, {
      layers: ['Tram-lines-main', 'tram-stops']
    });

    const stop = targets.find((t) => t.layer.id == 'tram-stops');
    if (stop) {
      console.log("Clicked stop", stop);
      if (stop.geometry.type == 'Point') {
        lineStore.selectedPlatformId = stop.properties['_id'];
      }
      return;
    }

    const line = targets.find((t) => t.layer.id == 'Tram-lines-main');
    if (line) {
      console.log("Clicked line", line);
      if (line.geometry.type == 'LineString') {
        lineStore.selectedLineId = line.properties['_id'];
      }
      return;
    }
  }
</script>


<div class="map-pane rounded-3xl {className}">
  <MapLibre
    bind:map
    class="w-full h-full"
    zoom={12}
    center={{ lng: 12.92361, lat: 50.82492 }}
    style="https://api.maptiler.com/maps/019909f4-78cf-7dbe-a949-27df4805bb43/style.json?key=3Uam2soS3S9RCPvHdP7E"
    onload={initMap}
    onclick={handleClick}
  >
    <Projection type="globe" />
    <NavigationControl />
    <ScaleControl />
    <GeolocateControl />
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
