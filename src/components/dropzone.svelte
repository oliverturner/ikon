<script>
  export let onDrop;

  /**
   * @param {DragEvent} event
   */
  function onDragOver(event) {
    event.preventDefault();
  }
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
</style>

<div class="dropzone" on:dragover={onDragOver} on:drop={onDrop}>Drop folders and SVGs here</div>
