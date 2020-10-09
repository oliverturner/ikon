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

async function show(entry, acc) {
  if (!entry) return acc;

  acc[entry.name] = entry;

  if (entry.isDirectory) {
    acc[entry.name] = { entry, files: {} };
    for await (const e of getEntriesAsAsyncIterator(entry)) {
      await show(e, acc[entry.name].files);
    }
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
    await show(entry, data);
  }

  console.log(data);
}

dropzone.addEventListener("dragover", onDragOver, false);
dropzone.addEventListener("drop", onDrop, false);
