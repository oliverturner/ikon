<script lang="ts">
  import { scanDroppedItems } from "./js/data";
  import { iconMap, iconTree, pathsSelected, resetStores } from "./js/store";

  import Dropzone from "./panels/dropzone.svelte";
  import Gallery from "./panels/gallery.svelte";
  import Selection from "./panels/selection.svelte";
  import Spritesheet from "./panels/spritesheet.svelte";

  import Content from "./components/content.svelte";
  import Loader from "./components/loader.svelte";
  import GHCorner from "./components/gh-corner.svelte";

  let PromptImport =
    import.meta.env?.NODE_ENV === "production"
      ? import("./components/sw-prompt.svelte")
      : import("./components/sw-prompt-dev.svelte");

  let scannedItems: Promise<unknown>;

  /**
   * Return a promise while parsing FileEntry items that, when resolved, will
   * display the main view
   */
  function handleDroppedItems(droppedItems: DataTransferItem[]) {
    resetStores();
    scannedItems = scanDroppedItems(droppedItems).then(
      ({ fileDict, iconRecords }) => {
        iconMap.set(fileDict);
        iconTree.set(iconRecords);
      }
    );
  }

  /**
   * Remove selected items from Selection
   */
  function onIconClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const item = target?.closest("[data-key]") as HTMLButtonElement | null;
    const icon = $iconMap.get(item?.dataset.key || "");
    if (icon) {
      pathsSelected.select(icon, $iconMap);
    }
  }

  /**
   * Add / Remove items selected from Gallery
   */
  function onDragSelect(event: CustomEvent) {
    for (const key of event.detail) {
      const icon = $iconMap.get(key);
      if (icon) {
        pathsSelected.select(icon, $iconMap);
      }
    }
  }

  $: scannedItems;
</script>

<main class="app">
  <Dropzone {handleDroppedItems} />

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
</main>

<GHCorner href="https://github.com/oliverturner/ikon" />

{#await PromptImport then { default: Prompt }}
  <Prompt />
{/await}
