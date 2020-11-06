<script>
  import { scale } from "svelte/transition";
  import { flip } from "svelte/animate";

  import { iconDict, selectedIcons } from "../js/store";

  export let onIconClick;
</script>

<style>
  .panel {
    grid-template-rows: 1fr auto;
  }
  .icongrid {
    height: 100%;
    overflow-y: auto;
  }

  .icon {
    max-width: 24px;
    max-height: 24px;
  }

  .controlbtn {
    margin-left: auto;
  }
</style>

<div class="panel">
  <div class="icongrid">
    {#each $selectedIcons as iconRecord (`selection-${iconRecord.id}`)}
      <button
        class="iconbtn"
        data-key={iconRecord.fullPath}
        on:click={onIconClick}
        in:scale
        out:scale
        animate:flip={{ duration: 250 }}>
        <svg class="icon"><use href={`#${iconRecord.id}`} /></svg>
      </button>
    {/each}
  </div>
  {#if $selectedIcons.length > 0}
    <div class="controls controls--footer">
      <button
        class="control controlbtn"
        on:click={() => iconDict.clear()}>Clear</button>
    </div>
  {/if}
</div>
