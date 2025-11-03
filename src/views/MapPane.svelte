<script lang="ts">
  import type { MapMouseEvent, Map, MapLibreEvent } from 'maplibre-gl';
  import { GeolocateControl, GlobeControl, MapLibre, NavigationControl, Projection, ScaleControl } from 'svelte-maplibre-gl';

	let {
    class: className,
	}: {
    class?: string;
  } = $props();

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

  function toggleActive(target: MapGeoJSONFeature, map: Map): boolean {
    const gState = map.getGlobalState();
    const osmId = target.properties['_id'];
    if (osmId && gState['active'] != osmId) {
      map.setGlobalStateProperty('active', osmId);
      return true;
    }
    else {
      map.setGlobalStateProperty('active', null);
      return false;
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
        const isActive = toggleActive(stop, e.target);
        if (isActive) e.target.flyTo({
          center: stop.geometry.coordinates as [number, number],
          speed: 0.75,
          duration: 1000,
          zoom: 19,
        });
      }
      return;
    }

    const line = targets.find((t) => t.layer.id == 'Tram-lines-main');
    if (line) {
      console.log("Clicked line", line);
      if (line.geometry.type == 'LineString') {
        const isActive = toggleActive(line, e.target);
        // Calculating bounds based on geometry/coordinates doesn't work because the coordinates are clamped to the tile
        // therefore it is precalculated and added as a property
        if (isActive) e.target.fitBounds(
          JSON.parse(line.properties['_bbox']), {
            padding: 100,
            duration: 1000
          }
        );
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
</style>
