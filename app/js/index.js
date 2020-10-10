import { getText } from "./utils";

const dropzone = document.querySelector("[data-component=dropzone]");
const rootContainer = document.querySelector("[data-component=container]");

async function* getEntriesAsAsyncIterator(dirEntry) {
  const reader = dirEntry.createReader();
  const getNextBatch = () =>
    new Promise((resolve, reject) => {
      reader.readEntries(resolve, reject);
    });

  let entries;

  do {
    entries = await getNextBatch();
    for (const entry of entries) {
      yield entry;
    }
  } while (entries.length > 0);
}

async function scanEntries(entry, acc) {
  if (!entry) return acc;

  const key = entry.name

  acc[key] = { entry };

  if (entry.isDirectory) {
    acc[key].files = {};
    for await (const e of getEntriesAsAsyncIterator(entry)) {
      await scanEntries(e, acc[key].files);
    }
  }

  if (entry.isFile) {
    acc[key].contents = await getText(entry);
  }

  return acc;
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
async function onDrop(event) {
  event.preventDefault();

  console.log("event.dataTransfer.items:", event.dataTransfer.items);

  const data = {};
  for (let item of event.dataTransfer.items) {
    const entry = item.webkitGetAsEntry();
    await scanEntries(entry, data);
  }

  console.log(data);
}

dropzone.addEventListener("dragover", onDragOver, false);
dropzone.addEventListener("drop", onDrop, false);
