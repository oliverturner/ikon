<script>
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";

  export let onDrop;
  export let label = "";

  let visible = false;

  $: letters = label.split("").map((x) => (x === " " ? "&nbsp;" : x));

  /**
   * @param {DragEvent} event
   */
  function onDragOver(event) {
    event.preventDefault();
  }

  onMount(() => (visible = true));
</script>

<style>
  .dropzone {
    display: grid;
    place-content: center;

    text-align: center;
    height: 100px;
    border-radius: 10px;
    color: #333;
    background-color: #999;
  }

  .letters span {
    display: inline-block;
  }
</style>

<div class="dropzone" on:dragover={onDragOver} on:drop={onDrop}>
  {#if visible}
    <div class="letters">
      {#each letters as letter, i}
        <span
          key={i}
          transition:fly={{ y: -50, duration: 150, delay: i * 50 }}>{@html letter}</span>
      {/each}
    </div>
  {/if}
</div>
