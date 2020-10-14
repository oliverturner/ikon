import { scanEntries } from "./data";
import { getHTML } from "./view";

const dropzoneEl = document.querySelector("[data-component=dropzone]");
const galleryEl = document.querySelector("[data-component=container]");

// Drag handlers
//-----------------------------------------------------------------------------
/**
 * @param {DragEvent} event
 */
function onDragOver(event) {
  event.preventDefault();
}

/**
 * @param {DragEvent} event
 */
async function onDrop(event) {
  event.preventDefault();

  try {
    // Async operations occur outside the scope of the event handler, so creating a new local record 
    // of the dataTransfer items is required...
    /** @type {FileSystemEntry[]} */
    const files = [...event.dataTransfer.items].map((item) => item.webkitGetAsEntry());

    /** @type {IconRecord[]} */
    const iconRecords = [];

    for (let file of files) {
      await scanEntries(file, iconRecords);
    }

    getHTML(iconRecords, galleryEl);
  } catch (error) {
    console.log(error);
  }
}

dropzoneEl.addEventListener("dragover", onDragOver, false);
dropzoneEl.addEventListener("drop", onDrop, false);
