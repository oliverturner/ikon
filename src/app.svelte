<script>
  import { scanDroppedItems } from "./js/data";
  import { iconDict, iconTree, pathsSelected, resetStores } from "./js/store";
  import Dropzone from "./panels/dropzone.svelte";
  import Gallery from "./panels/gallery.svelte";
  import Selection from "./panels/selection.svelte";
  import Spritesheet from "./panels/spritesheet.svelte";
  import Content from "./components/content.svelte";
  import Loader from "./components/loader.svelte";
  import GHCorner from "./components/gh-corner.svelte";

  let PromptImport =
    import.meta.env.NODE_ENV === "production"
      ? import("./components/sw-prompt.svelte")
      : import("./components/sw-prompt-dev.svelte");

  let scannedItems;

  /**
   * Return a promise while parsing FileEntry items that, when resolved, will
   * display the main view
   *
   * @param {DataTransferItemList} items
   */
  async function parseDroppedItems(items) {
    const { iconRecords, fileDict } = await scanDroppedItems(items);
    iconTree.set(iconRecords);
    iconDict.set(fileDict);
    return true;
  }

  /**
   * @param {DragEvent} event
   */
  function handleDroppedItems(droppedItems) {
    resetStores();
    scannedItems = parseDroppedItems(droppedItems);
  }

  /**
   * Remove selected items from Selection
   * @param {MouseEvent} event
   */
  function onIconClick(event) {
    const item = event.target.closest("[data-key]");
    if (item) {
      pathsSelected.select($iconDict.get(item.dataset.key), $iconDict);
    }
  }

  /**
   * Add / Remove items selected from Gallery
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

<GHCorner href="https://github.com/oliverturner/ikon" />

{#await PromptImport then { default: Prompt }}
  <Prompt />
{/await}
