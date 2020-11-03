<script>
  import { selectedIcons } from "../js/store";
  import Icon from "../components/icon.svelte";
</script>

<style>
  .selection {
    overflow-y: auto;
  }
</style>

<div class="selection">
  <ul class="icongrid">
    {#each $selectedIcons as iconRecord}
      <Icon {iconRecord} />
    {/each}
  </ul>
</div>
