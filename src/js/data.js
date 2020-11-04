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
 * @param {IconRecord[]} scannedEntries
 * @param {Map} fileDict
 */
export async function scanEntries(entry, scannedEntries, fileDict) {
  if (!entry) return;

  try {
    const { fullPath, name } = entry;

    if (utils.isDirectory(entry)) {
      const contents = [];
      for await (const dirEntry of asyncDirectoryIterator(entry)) {
        await scanEntries(dirEntry, contents, fileDict);
      }

      const record = { type: "directory", name, fullPath, contents };
      scannedEntries.push(record);
      fileDict.set(fullPath, record);
    }

    if (utils.isFile(entry)) {
      const fileType = await utils.getType(entry);

      if (fileType === "image/svg+xml") {
        const id = fullPath.split("/").slice(1).join("-").split(".").slice(0, -1);
        const contents = String(await utils.getText(entry));
        const record = { type: "file", id, name, fullPath, contents };
        scannedEntries.push(record);
        fileDict.set(fullPath, record);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * @param {DataTransferItemList} items
 * @returns {Promise<IconRecord[]>}
 */
export async function scanDroppedItems(items) {
  // Async operations occur outside the scope of the event handler, so creating a new local record
  // of the dataTransfer items is required...
  /** @type {FileSystemEntry[]} */
  const entries = items.map((item) => item.webkitGetAsEntry());

  let iconRecords = [];
  let fileDict = new Map();
  for (let entry of entries) {
    await scanEntries(entry, iconRecords, fileDict);
  }

  return { iconRecords, fileDict };
}
