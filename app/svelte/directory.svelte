<script>
  import * as utils from "../js/utils";
  import Record from "./record.svelte";

  /** type IconDir */
  export let iconDir = {
    contents: [],
  };

  function sortContents(contents) {
    contents.sort(utils.sortByRecordKey("name"));
    contents.sort(utils.sortByRecordKey("type"));
    return contents;
  }

  let sortedContents = sortContents(iconDir.contents);
</script>

<style>
  .dir {
    grid-column: 1 / -1;
  }

  .dir__contents {
    border-top-left-radius: 0;
  }

  .dir__label {
    position: relative;
    display: inline-block;
    padding: 0.125rem 0.3rem;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    background-color: var(--dir-border);
    color: var(--surface);
  }

  .dir__label::before,
  .dir__label::after {
    content: "";
    position: absolute;
    left: 100%;
    bottom: 0;
  }

  .dir__label::before {
    width: 5px;
    height: 5px;
    background-color: var(--dir-border);
  }

  .dir__label::after {
    width: 10px;
    height: 10px;
    border-radius: var(--border-radius);
    background-color: var(--surface);
  }
</style>

{#if iconDir.contents.length > 0}
  <ul class="dir">
    <li class="dir__label">{iconDir.name}: {sortedContents.length}</li>
    <ul class="dir__contents icongrid">
      {#each sortedContents as iconRecord}
        <Record {iconRecord} />
      {/each}
    </ul>
  </ul>
{/if}
