<script>
  /**
   * @param {DragEvent} event
   */
  function onDragOver(event) {
    event.preventDefault();
  }

  export let onDrop;
</script>

<style>
  .dropzone {
    display: grid;
    place-content: center;

    text-align: center;
    height: 100px;
    border: 4px dashed currentColor;
    border-radius: 10px;
    color: red;
  }
</style>

<div class="dropzone" on:dragover={onDragOver} on:drop={onDrop}>
  Drop folders and individual SVGs here
</div>
