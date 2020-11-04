/**
 * @param {FileSystemFileEntry} entry
 * @returns {Promise<string | ArrayBuffer>}
 */
export function getText(entry) {
  return new Promise(function (resolve, reject) {
    entry.file(function (file) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    }, reject);
  });
}

export function getImg(entry) {
  return new Promise(function (resolve, reject) {
    entry.file(function (file) {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => URL.revokeObjectURL(url);
      img.onerror = reject;
      img.src = url;
      resolve(img);
    }, reject);
  });
}

/**
 * Generate a unique id to be referenced from the embedded SVG
 * Replace slashes in the path with hyphens, omit the extension
 * 
 * @param {string} path
 */
export function getIconId(path) {
  return "icon-" + path.split("/").slice(1).join("-").split(".").slice(0, -1);
}

/**
 * @param {FileSystemFileEntry} entry
 * @returns {Promise<string>}
 */
export function getType(entry) {
  return new Promise(function (resolve, reject) {
    entry.file(function (file) {
      resolve(file.type);
    }, reject);
  });
}

/**
 * Sort by supplied key
 *
 * @example contents.sort(utils.sortByRecordKey("type")); // directories first
 * @param {keyof IconRecord} key
 */
export function sortByRecordKey(key) {
  /**
   * @param {IconRecord} a
   * @param {IconRecord} b
   */
  function compareRecords(a, b) {
    if (a[key] < b[key]) return -1;
    if (a[key] > b[key]) return 1;
    return 0;
  }

  return compareRecords;
}

//#region Type guards
/**
 * @param {FileSystemEntry} entry
 * @returns {entry is FileSystemDirectoryEntry}
 */
export function isDirectory(entry) {
  return entry.isDirectory;
}

/**
 * @param {FileSystemEntry} entry
 * @returns {entry is FileSystemFileEntry}
 */
export function isFile(entry) {
  return entry.isFile;
}
//#endregion
