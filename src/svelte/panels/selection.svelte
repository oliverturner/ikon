<script>
  /** @type {IconFile[]} */
  export let selectedRecords = [];
</script>

<style>
  .selection {
    overflow-y: auto;
    background: hotpink;
  }
</style>

<div class="selection">
  selected icons shown here
  {#each selectedRecords as record}{record.name}{/each}
</div>
