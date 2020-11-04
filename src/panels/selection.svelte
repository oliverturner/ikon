<script>
  import { selectedIcons } from "../js/store";

  export let onIconClick;
</script>

<style>
  .icongrid {
    height: 100%;
    overflow-y: auto;
  }

  .icon {
    max-width: 24px;
    max-height: 24px;
  }
</style>

<div class="icongrid">
  {#each $selectedIcons as iconRecord (`selection-${iconRecord.id}`)}
    <button
      class="iconbtn"
      data-key={iconRecord.fullPath}
      on:click={onIconClick}>
      <svg class="icon"><use href={`#${iconRecord.id}`} /></svg>
    </button>
  {/each}
</div>
