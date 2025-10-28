<script lang="ts">
  import type Platform from "$lib/models/platform";
  import type Entrance from "$lib/models/entrance";

	let {
    entrance,
    platform,
	}: {
    entrance: Entrance;
    platform: Platform;
  } = $props();
</script>


<dl class="bg-white border-4 border-black p-[1em] rounded-2xl flex-[2_0_9rem]">
  <div class="flex flex-row justify-between">
    <dt class="access-attribute">Steps</dt>
    <dd>3</dd>
  </div>
  <div class="flex flex-row justify-between">
    <dt class="access-attribute">Gap</dt>
    <dd>3cm</dd>
  </div>
</dl>


<style>
  .access-attribute::after {
    content: ":";
  }
</style>
