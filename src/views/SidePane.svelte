
<script lang="ts">
  import * as Select from "$lib/components/ui/select/index.js";
  import {vehicles as vehicleData, platforms as platformData} from  "$lib/dummy-data";
  import logoImage from "$lib/assets/logo.svg";
  import AccessSchematic from "./AccessSchematic.svelte";

	let {
    class: className,
	}: {
    class?: string;
  } = $props();

  let vehicleSelectValue = $state('');
  let vehicle = $derived(isNaN(parseInt(vehicleSelectValue))
    ? null
    : vehicleData[parseInt(vehicleSelectValue)]
  );

  let platformSelectValue = $state('');
  let platform = $derived(isNaN(parseInt(platformSelectValue))
    ? null
    : platformData[parseInt(platformSelectValue)]
  );
</script>


<div class="{className} flex flex-col">
  <header class="p-[1.5rem] border-b">
    <h1 class="mb-[1rem] text-2xl font-bold flex items-center gap-[0.5em]">
      <img alt="" src={logoImage} class="h-[1.3em]">
      <span>GapMap</span>
    </h1>
    <Select.Root type="single" bind:value={vehicleSelectValue}>
      <Select.Trigger class="w-full">
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
  </header>
  <main class="access-assessment-box overflow-scroll flex flex-col px-[1.5rem] py-[1.5rem]">
    <div class="flex flex-row gap-[2rem] mb-[2rem]">
      <Select.Root type="single" bind:value={vehicleSelectValue}>
        <Select.Trigger class="w-full">
          {#if vehicle}
            {vehicle.name}
          {:else}
            Fahrzeug auswählen
          {/if}
        </Select.Trigger>
        <Select.Content>
          {#each vehicleData as vehicle, i}
            <Select.Item value={i.toString()}>{vehicle.name}</Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
      <Select.Root type="single" bind:value={platformSelectValue}>
        <Select.Trigger class="w-full">
          {#if platform}
            {platform.name}
          {:else}
            Haltestelle auswählen
          {/if}
        </Select.Trigger>
        <Select.Content>
          {#each platformData as platform, i}
            <Select.Item value={i.toString()}>{platform.name}</Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    </div>

    {#if platform && vehicle}
      <AccessSchematic
        vehicle={vehicle}
        platform={platform}
        class="flex-1"
      />
    {/if}
  </main>
</div>


<style>
  .access-assessment-box {
    flex: 1;
    background-image: repeating-linear-gradient(0deg, #e2e2e2, #e2e2e2 10px, transparent 10px, transparent 20px);
    background-size: 1px 100%;
    background-position: center 0;
    background-repeat: no-repeat;
    background-attachment: scroll;
  }
</style>