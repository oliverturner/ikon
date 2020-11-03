<script>
  import { selectedIcons } from "../js/store";
  import Icon from "../components/icon.svelte";
</script>

<style>
  .icongrid {
    max-height: 100%;
    overflow-y: auto;
  }
</style>

<ul class="icongrid">
  {#each $selectedIcons as iconRecord}
    <Icon {iconRecord} />
  {/each}
</ul>