import * as utils from "./utils";

/**
 * Turn the supplied FileSystemDirectoryEntry into an asynchronously 
 * iterable collection of entries
 *
 * @param { FileSystemDirectoryEntry } dirEntry
 */
async function* asyncDirectoryIterator(dirEntry) {
  const reader = dirEntry.createReader();
  const getNextBatch = () =>
    new Promise((resolve, reject) => {
      reader.readEntries(resolve, reject);
    });

  /** @type {FileSystemEntry[]} */
  let entries;
  do {
    entries = await getNextBatch();
    for (const entry of entries) {
      yield entry;
    }
  } while (entries.length > 0);
}

/**
 * @param {FileSystemEntry} entry
 * @param {IconRecord[]} arr
 */
export async function scanEntries(entry, arr) {
  if (!entry) return arr;

  try {
    const { fullPath, name } = entry;

    if (utils.isDirectory(entry)) {
      const contents = [];
      for await (const dirEntry of asyncDirectoryIterator(entry)) {
        await scanEntries(dirEntry, contents);
      }

      arr.push({ type: "directory", name, fullPath, contents });
    }

    if (utils.isFile(entry)) {
      const fileType = await utils.getType(entry);

      if (fileType === "image/svg+xml") {
        const contents = await utils.getText(entry);
        arr.push({
          type: "file",
          name,
          fullPath,
          contents: String(contents),
        });
      }
    }
  } catch (error) {
    console.log(error);
  }

  return arr;
}

/**
 * @param {DataTransferItemList} items
 * @returns {Promise<IconRecord[]>}
 */
export async function scanDroppedItems(items) {
  // Async operations occur outside the scope of the event handler, so creating a new local record
  // of the dataTransfer items is required...
  /** @type {FileSystemEntry[]} */
  const files = items.map((item) => item.webkitGetAsEntry());

  let scannedEntries = [];
  for (let file of files) {
    await scanEntries(file, scannedEntries);
  }

  return scannedEntries;
}