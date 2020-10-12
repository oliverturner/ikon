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
 * @param {string} svgString
 */
export function createSVG(svgString) {
  const fragment = document.createElement("div");
  fragment.innerHTML = svgString;
  return fragment.querySelector('svg');
}

/**
 * Sort directories first
 *
 * @param {IconRecord} a
 * @param {IconRecord} b
 */
export function compareRecordTypes(a, b) {
  if (a.type < b.type) return -1;
  if (a.type > b.type) return 1;
  return 0;
}

// Type guards
//--------------------------------------------------------------------------------------------------
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
