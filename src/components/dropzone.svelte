<script>
  import { scanDroppedItems } from "../js/data";
  import * as stores from "../js/stores";

  /**
   * @param {DragEvent} event
   */
  async function onDrop(event) {
    event.preventDefault();

    stores.iconRecords.set([]);

    try {
      const [iconRecords, fileDict] = await scanDroppedItems([...event.dataTransfer.items]);
      stores.iconRecords.set(iconRecords);
      stores.fileDict.set(fileDict);
    } catch (error) {
      console.log(error);
    }
  }

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
