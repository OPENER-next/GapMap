
<script lang="ts">
  import type Vehicle from "$lib/models/vehicle";

	const {
    vehicle,
	}: {
    vehicle: Vehicle;
  } = $props();

  // required here to take it into account for the SVGs view box
  const outlineStrokeWidth = 2;
</script>


<svg class='vehicle-plan'
  viewBox="{-outlineStrokeWidth/2} {-outlineStrokeWidth/2} {vehicle.width + outlineStrokeWidth} {vehicle.length + outlineStrokeWidth}"
  xmlns="http://www.w3.org/2000/svg"
>
  <rect
    class='vehicle-plan-outline'
    width={vehicle.width}
    height={vehicle.length}
    stroke-width={outlineStrokeWidth}
  />
  {#each vehicle.entrances as entrance}
    {@const x = entrance.side === 'right' ? vehicle.width : 0}

    <line
      class='vehicle-plan-entrance'
      x1={x}
      y1={entrance.distanceFront}
      x2={x}
      y2={entrance.distanceFront + entrance.width}
      onclick={() => console.log(entrance)}
    />
  {/each}
</svg>


<style>
  .vehicle-plan {
    display: block;
    margin: 0 auto;
    width: 200px;
  }

  .vehicle-plan-outline {
    stroke: gray;
    fill: none;
    rx: 1px;
    ry: 1px;
    vector-effect: non-scaling-stroke;
  }

  .vehicle-plan-entrance {
    stroke: #ff6e00;
    stroke-width: 7;
    vector-effect: non-scaling-stroke;
  }
</style>
