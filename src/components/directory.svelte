<script>
  import * as utils from "../js/utils";
  import Record from "./record.svelte";

  /**
   * @param {IconRecord[]} contents
   * @returns {IconRecord[]}
   */
  function sortContents(contents) {
    if (!contents) {
      return {
        contents: [],
      };
    }
    contents.sort(utils.sortByRecordKey("name"));
    contents.sort(utils.sortByRecordKey("type"));
    return contents;
  }

  /** @type IconDir */
  export let iconRecord;

  $: sortedContents = sortContents(iconRecord?.contents);
</script>

<style>
  .dir {
    grid-column: 1 / -1;
  }

  .dir__contents {
    border-top-left-radius: 0;
  }

  .dir__label {
    all: unset;
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
  .dir__label:hover,
  .dir__label:focus {
    color: yellow;
  }
</style>

{#if iconRecord.contents.length > 0}
  <div class="dir">
    <button class="dir__label" data-key={iconRecord.fullPath}>
      {iconRecord.name}:
      {sortedContents.length}
    </button>
    <div class="dir__contents icongrid icongrid--bordered">
      {#each sortedContents as iconRecord (iconRecord)}
        <Record {iconRecord} />
      {/each}
    </div>
  </div>
{/if}
