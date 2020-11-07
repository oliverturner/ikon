<script>
  import { scanDroppedItems } from "./js/data";
  import { iconTree, iconDict, searchTerm, pathsSelected } from "./js/store";
  import Dropzone from "./panels/dropzone.svelte";
  import Gallery from "./panels/gallery.svelte";
  import Selection from "./panels/selection.svelte";
  import Spritesheet from "./panels/spritesheet.svelte";
  import Content from "./components/content.svelte";
  import Loader from "./components/loader.svelte";

  let scannedItems;

  function parseDroppedItems(items) {
    searchTerm.set("");
    scannedItems = undefined;
    pathsSelected.clear();

    return scanDroppedItems(items).then(({ iconRecords, fileDict }) => {
      iconTree.set(iconRecords);
      iconDict.set(fileDict);
    });
  }

  /**
   * @param {DragEvent} event
   */
  function handleDroppedItems(droppedItems) {
    scannedItems = parseDroppedItems(droppedItems);
  }

  /**
   * @param {MouseEvent} event
   */
  function onIconClick(event) {
    const item = event.target.closest("[data-key]");
    if (item) {
      pathsSelected.select($iconDict.get(item.dataset.key), $iconDict);
    }
  }

  /**
   * @param {CustomEvent} event
   */
  function onDragSelect(event) {
    for (const key of event.detail) {
      pathsSelected.select($iconDict.get(key), $iconDict);
    }
  }
</script>

<main class="app">
  <Dropzone {handleDroppedItems} />

  {#if scannedItems}
    {#await scannedItems}
      <Loader />
    {:then}
      <Content>
        <div slot="gallery">
          <Gallery {onDragSelect} />
        </div>
        <div slot="selection">
          <Selection {onIconClick} />
        </div>
        <div slot="spritesheet">
          <Spritesheet />
        </div>
      </Content>
    {:catch error}
      <p>oops... something went awry: {error.message}</p>
    {/await}
  {/if}
</main>
