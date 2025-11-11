<script lang="ts">
  import type { AccessAssessment } from "$lib/models/access-assessment";

	let {
    assessment,
	}: {
    assessment: AccessAssessment;
  } = $props();

  const numberFormatter = new Intl.NumberFormat('de', {
    style: 'unit',
    unit: 'centimeter',
    maximumFractionDigits: 0,
  });

  function mToCm(value: number): string {
    return numberFormatter.format(value * 100);
  }
</script>


<dl class="bg-white border-4 border-black p-[1em] rounded-2xl flex-[2_0_9rem]">
  <div class="flex flex-row justify-between">
    <dt class="access-attribute">Spalt</dt>
    <dd>
      {#if assessment.verticalGap !== undefined}
        {mToCm(assessment.verticalGap)}
      {:else}
        Unbekannt
      {/if}
    </dd>
  </div>
  {#if assessment.hasSteps}
    <div class="flex flex-row justify-between">
      <dt class="access-attribute">Stufen</dt>
      <dd>{assessment.stepCount}</dd>
    </div>
  {/if}
  {#if assessment.hasRamp}
    <div class="flex flex-row justify-between">
      <dt class="access-attribute">Rampe</dt>
      <dd>Ja</dd>
    </div>
  {/if}
</dl>


<style>
  .access-attribute::after {
    content: ":";
  }
</style>
