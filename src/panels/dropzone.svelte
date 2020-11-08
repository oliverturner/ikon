<script>
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";

  export let handleDroppedItems;

  let label = "Drop folders and SVGs here";
  let dragCls = "dropzone";
  let visible = false;

  $: letters = label.split("").map((x) => (x === " " ? "&nbsp;" : x));

  /**
   * @param {DragEvent} event
   */
  function onDragInOut(event) {
    event.preventDefault();
    dragCls =
      event.type === "dragenter" ? "dropzone dropzone--hovered" : "dropzone";
  }

  /**
   * @param {DragEvent} event
   */
  function onDragOver(event) {
    event.preventDefault();
  }

  /**
   * @param {DragEvent} event
   */
  function onDrop(event) {
    event.preventDefault();
    dragCls = "dropzone";
    handleDroppedItems([...event.dataTransfer.items]);
  }

  onMount(() => (visible = true));
</script>

<style>
  .dropzone {
    display: grid;
    place-content: center;

    transition: background-color 0.25s;

    position: relative;
    text-align: center;
    height: 100px;
    border-radius: 10px;
    color: #333;
    background-color: #999;
  }

  .dropzone::after {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .dropzone.dropzone--hovered {
    background-color: #666;
  }

  .letters span {
    display: inline-block;
  }
</style>

<div
  class={dragCls}
  on:dragenter={onDragInOut}
  on:dragleave={onDragInOut}
  on:dragover={onDragOver}
  on:drop={onDrop}>
  {#if visible && dragCls === 'dropzone'}
    <div class="letters" out:fly={{ y: 25, duration: 150 }}>
      {#each letters as letter, i}
        <span
          key={i}
          in:fly={{ y: -25, duration: 150, delay: i * 25 }}>{@html letter}</span>
      {/each}
    </div>
  {/if}
</div>
