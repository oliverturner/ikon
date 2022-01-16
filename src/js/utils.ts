import type * as Ikon from "../../typings/types";

export function getText(
	entry: FileSystemFileEntry
): Promise<string | ArrayBuffer> {
	return new Promise(function (resolve, reject) {
		entry.file(function (file) {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result || "");
			reader.onerror = () => reject(reader.error);
			reader.readAsText(file);
		}, reject);
	});
}

export function getImg(entry: FileSystemFileEntry) {
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
 */
export function getIconId(pathRaw: string) {
	const path = pathRaw
		.split("/")
		.slice(1)
		.join("-")
		.split(".")
		.slice(0, -1)
		.join("");
	return "icon-" + path;
}

/**
 * @param {FileSystemFileEntry} entry
 * @returns {Promise<string>}
 */
export function getType(entry: FileSystemFileEntry): Promise<string> {
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
export function sortByRecordKey(key: keyof Ikon.IconRecord) {
	/**
	 * @param {IconRecord} a
	 * @param {IconRecord} b
	 */
	function compareRecords(a: Ikon.IconRecord, b: Ikon.IconRecord) {
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
export function isDirectory(
	entry: FileSystemEntry
): entry is FileSystemDirectoryEntry {
	return entry.isDirectory;
}

/**
 * @param {FileSystemEntry} entry
 * @returns {entry is FileSystemFileEntry}
 */
export function isFile(entry: FileSystemEntry): entry is FileSystemFileEntry {
	return entry.isFile;
}
//#endregion
