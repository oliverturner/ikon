import * as utils from "./utils";

const dropzone = document.querySelector("[data-component=dropzone]");
const gallery = document.querySelector("[data-component=container]");

/**
 * Turn the supplied FileSystemDirectoryEntry into an iterable collection of entries
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
async function scanEntries(entry, acc) {
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

/**
 * Generate the HTML
 *
 * @param {Record<string, IconRecord>} iconRecords
 * @param {Element} container
 */
function getHTML(iconRecords, container) {
  // Sort directories first
  const sortedKeys = Object.values(iconRecords)
    .sort(utils.compareRecordTypes)
    .map((record) => record.name);

  for (const key of sortedKeys) {
    let el;
    const val = iconRecords[key];

    if (val.type === "directory") {
      // Skip rendering empty directories
      if (Object.keys(val.contents).length === 0) continue;

      const subContainer = document.createElement("ul");
      subContainer.className = "dir__contents icongrid";

      const dirContents = document.createElement("li");
      dirContents.appendChild(subContainer);

      const dirLabel = document.createElement("li");
      dirLabel.textContent = key;
      dirLabel.className = "dir__label";

      el = document.createElement("ul");
      el.className = "dir";
      el.appendChild(dirLabel);
      el.appendChild(dirContents);

      getHTML(val.contents, subContainer);
    }

    if (val.type === "file") {
      el = document.createElement("li");
      el.className = "icon";
      el.setAttribute("data-icon-key", val.name);
      el.appendChild(utils.createSVG(val.contents));
    }

    container.appendChild(el);
  }
}

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
    /** @type {Record<string, IconRecord>} */
    const iconRecords = {};

    // Async operations occur outside the original callstack of the event handler
    // Creating a new local record of the transformed items is required
    const files = [...event.dataTransfer.items].map((item) => item.webkitGetAsEntry());
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
