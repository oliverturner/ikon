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