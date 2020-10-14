import { scanEntries } from "./data";
import { getHTML } from "./view";

const dropzone = document.querySelector("[data-component=dropzone]");
const gallery = document.querySelector("[data-component=container]");

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

    /** @type {Record<string, IconRecord>} */
    const iconRecords = {};

    for (let file of files) {
      await scanEntries(file, iconRecords);
    }

    getHTML(iconRecords, gallery);

    console.log(JSON.stringify(iconRecords, null, 2));
  } catch (error) {
    console.log(error);
  }
}

dropzone.addEventListener("dragover", onDragOver, false);
dropzone.addEventListener("drop", onDrop, false);
