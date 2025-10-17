
<script lang="ts">
  import VehiclePlan from "./VehiclePlan.svelte";
  import * as Select from "$lib/components/ui/select/index.js";
  import vehicleData from "$lib/data";

	const {
    class: className,
	}: {
    class?: string;
  } = $props();

  let selectValue = $state('');
  let vehicle = $derived(isNaN(parseInt(selectValue))
    ? null
    : vehicleData[parseInt(selectValue)]
  );
</script>


<div class={className}>
  <Select.Root type="single" bind:value={selectValue}>
    <Select.Trigger class="w-[10rem]">
      {#if vehicle}
        {vehicle.name}
      {/if}
    </Select.Trigger>
    <Select.Content>
      {#each vehicleData as vehicle, i}
        <Select.Item value={i.toString()}>{vehicle.name}</Select.Item>
      {/each}
    </Select.Content>
  </Select.Root>

  {#if vehicle}
    <VehiclePlan vehicle={vehicle}/>
  {/if}
</div>
