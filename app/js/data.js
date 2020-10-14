import * as utils from "./utils";

/**
 * Turn the supplied FileSystemDirectoryEntry into an asynchronously iterable collection of entries
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
 * @param {Record<string, IconRecord>} acc
 */
export async function scanEntries(entry, acc) {
  if (!entry) return acc;

  try {
    const { fullPath, name } = entry;

    if (utils.isDirectory(entry)) {
      const contents = {};
      for await (const dirEntry of asyncDirectoryIterator(entry)) {
        await scanEntries(dirEntry, contents);
      }

      acc[entry.name] = { type: "directory", name, fullPath, contents };
    }

    if (utils.isFile(entry)) {
      const fileType = await utils.getType(entry);

      if (fileType === "image/svg+xml") {
        const contents = await utils.getText(entry);
        acc[entry.name] = {
          type: "file",
          name,
          fullPath,
          contents: String(contents),
        };
      }
    }
  } catch (error) {
    console.log(error);
  }

  return acc;
}