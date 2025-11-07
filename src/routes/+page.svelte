<script lang="ts">
  import SidePane from "../views/SidePane.svelte";
  import MapPane from "../views/MapPane.svelte";
  import { setContext } from "svelte";
  import { LineStore } from "$lib/stores/line-store.svelte";

  setContext('line-store', new LineStore());
</script>

<SidePane class="min-w-0 max-w-md flex-1"/>
<MapPane class="flex-2 m-[1.5rem] ml-0"/>
