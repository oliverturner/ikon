<script>
  import { scale } from "svelte/transition";
  import { flip } from "svelte/animate";

  import { pathsSelected, selectedIcons } from "../js/store";

  export let onIconClick;

  let diff = 0;
  let currentNum = 0;
  let optimise = false;

  const btnProps = {
    class: "iconbtn",
    type: "button",
  };

  // Check whether animations should be disbled
  $: (() => {
    diff = $selectedIcons ? $selectedIcons.length - currentNum : 0;
    currentNum = $selectedIcons ? $selectedIcons.length : 0;
    optimise = diff > 30 || $selectedIcons.length > 30;
  })();
</script>

<style>
  .panel {
    grid-template-rows: 1fr auto;
  }
  .icongrid {
    height: 100%;
    overflow-y: auto;
  }

  .controlbtn {
    margin-left: auto;
  }
</style>

<div class="panel">
  <div class="icongrid">
    {#if optimise}
      {#each $selectedIcons as iconRecord (iconRecord)}
        <button {...btnProps} data-key={iconRecord.fullPath} on:click={onIconClick}>
          {@html iconRecord.contents}
        </button>
      {/each}
    {:else}
      {#each $selectedIcons as iconRecord (iconRecord)}
        <button
          {...btnProps} 
          data-key={iconRecord.fullPath}
          on:click={onIconClick}
          in:scale
          out:scale
          animate:flip={{ duration: 250 }}>
          {@html iconRecord.contents}
        </button>
      {/each}
    {/if}
  </div>
  {#if $selectedIcons.length > 0}
    <div class="controls controls--footer">
      <button
        class="control controlbtn"
        type="button"
        on:click={() => pathsSelected.clear()}>Clear</button>
    </div>
  {/if}
</div>
