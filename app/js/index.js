import * as utils from "./utils";

const dropzone = document.querySelector("[data-component=dropzone]");
const gallery = document.querySelector("[data-component=container]");

async function* asyncDataTransferIterator(items) {
  do {
    for (const item of items) {
      yield item.webkitGetAsEntry();
    }
  } while (items.length > 0);
}

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
    if (utils.isDirectory(entry)) {
      /** @type IconRecord */
      const value = { type: "directory", entry, contents: {} };
      for await (const dirEntry of asyncDirectoryIterator(entry)) {
        await scanEntries(dirEntry, value.contents);
      }
      acc[entry.name] = value;
    }

    if (utils.isFile(entry)) {
      // const fileType = await utils.getType(entry);

      // if (fileType === "image/svg+xml") {
      //   const contents = await utils.getText(entry);
      //   acc[entry.name] = { type: "file", entry, contents: String(contents) };
      // }
      acc[entry.name] = { type: "file", entry, contents: "<svg>lol</svg>" };
    }
  } catch (error) {
    console.log(error);
  }

  return acc;
}

/**
 *
 * @param {Record<string, IconRecord>} data
 * @param {Element} container
 */
function getHTML(data, container) {
  for (const [key, val] of Object.entries(data)) {
    let el;
    if (val.type === "directory") {
      // TODO: don't render empty directories
      // if(Object.keys(val.files).length === 0) return;

      const label = document.createElement("li");
      label.textContent = key;
      label.className = "dir__label";

      const subcontainer = document.createElement("ul");
      subcontainer.className = "dir__contents";

      const contents = document.createElement("li");
      contents.appendChild(subcontainer);

      el = document.createElement("ul");
      el.className = "dir";
      el.appendChild(label);
      el.appendChild(contents);

      getHTML(val.contents, subcontainer);
    }

    if (val.type === "file") {
      const label = document.createElement("p");
      label.textContent = key;

      el = document.createElement("li");
      el.className = "icon";
      el.appendChild(utils.createSVG(val.contents));
    }

    container.appendChild(el);
  }
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

  try {
    /** @type {Record<string, IconRecord>} */
    const data = {};
    for (let item of event.dataTransfer.items) {
      await scanEntries(item.webkitGetAsEntry(), data);
    }

    // for await (const item of asyncDataTransferIterator(event.dataTransfer.items)) {
    //   await scanEntries(item, data);
    // }

    getHTML(data, gallery);
  } catch (error) {
    console.log(error);
  }
}

dropzone.addEventListener("dragover", onDragOver, false);
dropzone.addEventListener("drop", onDrop, false);
