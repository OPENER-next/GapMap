<script lang="ts">
  import * as Select from "$lib/components/ui/select/index.js";
  import { vehicleData } from  "$lib/data/vehicles";
  import logoImage from "$lib/assets/logo.svg";
  import AccessSchematic from "./AccessSchematic.svelte";
  import { LineStore } from "$lib/stores/line-store.svelte";
  import { getContext } from "svelte";

	let {
    class: className,
	}: {
    class?: string;
  } = $props();

  const lineStore = getContext<LineStore>('line-store');

  let vehicleSelectValue = $state('');
  let vehicle = $derived(isNaN(parseInt(vehicleSelectValue))
    ? null
    : vehicleData[parseInt(vehicleSelectValue)]
  );
</script>


<div class="{className} flex flex-col">
  <header class="p-[1.5rem]">
    <h1 class="text-2xl font-bold flex items-center gap-[0.5em]">
      <img alt="" src={logoImage} class="h-[1.3em]">
      <span>GapMap</span>
    </h1>
  </header>
  <main class="flex-1 min-h-0 flex flex-col">
    <div
      class="px-[1.5rem]"
    >
      <Select.Root
        allowDeselect={true}
        type="single"
        bind:value={
          () => lineStore.selectedLineId,
          (v) => lineStore.selectedLineId = v === '' ? undefined : v
        }
      >
        <Select.Trigger class="w-full">
          {#if lineStore.selectedLine}
            {lineStore.selectedLine.name}
          {:else}
            Linie auswählen
          {/if}
        </Select.Trigger>
        <Select.Content>
          {#each lineStore.lines as [id, line]}
            <Select.Item value={id}>{line.name}</Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
      <div class="flex flex-row gap-[1rem] my-[1rem]">
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
        <Select.Root
          allowDeselect={true}
          disabled={!lineStore.isLineSelected}
          type="single"
          bind:value={
            () => lineStore.selectedPlatformId,
            (v) => lineStore.selectedPlatformId = v === '' ? undefined : v
          }
        >
          <Select.Trigger class="w-full">
            {#if lineStore.selectedPlatform}
              {lineStore.selectedPlatform.name}
            {:else}
              Haltestelle auswählen
            {/if}
          </Select.Trigger>
          <Select.Content>
            {#each lineStore.selectedLine?.stops as platform}
              <Select.Item value={platform.id}>{platform.name}</Select.Item>
            {/each}
          </Select.Content>
        </Select.Root>
      </div>
    </div>

    <div class="access-assessment-box flex-1 overflow-scroll p-[1.5rem] border-t">
      {#if lineStore.selectedPlatform && vehicle}
        <AccessSchematic
          vehicle={vehicle}
          platform={lineStore.selectedPlatform}
          class=""
          onNext={_ => lineStore.nextPlatform()}
          onPrevious={_ => lineStore.previousPlatform()}
        />
      {/if}
    </div>
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