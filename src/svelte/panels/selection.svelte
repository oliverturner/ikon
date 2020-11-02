<script>
  import { selectedIcons } from "../../js/store";
</script>

<style>
  .selection {
    overflow-y: auto;
    background: hotpink;
  }
</style>

<div class="selection">
  selected icons shown here
  {#each $selectedIcons as record}{record.name}{/each}
</div>
