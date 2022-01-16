import type {
	IconRecord,
	IconDir,
	IconFile,
	IconTree,
	IconDict,
} from "../../typings/types";
import * as utils from "./utils";

/**
 * Turn the supplied FileSystemDirectoryEntry into an asynchronously
 * iterable collection of entries
 */
async function* asyncDirectoryIterator(dirEntry: FileSystemDirectoryEntry) {
	const reader = dirEntry.createReader();
	const getNextBatch = (): Promise<FileSystemEntry[]> =>
		new Promise((resolve, reject) => {
			reader.readEntries(resolve, reject);
		});

	let entries: FileSystemEntry[];
	do {
		entries = await getNextBatch();
		for (const entry of entries) {
			yield entry;
		}
	} while (entries.length > 0);
}

export async function scanEntries(
	entry: FileSystemEntry | null,
	scannedEntries: IconRecord[],
	fileDict: Map<string, IconRecord>
) {
	if (!entry) return;

	try {
		const { fullPath, name } = entry;

		if (utils.isDirectory(entry)) {
			const contents: IconRecord[] = [];
			for await (const dirEntry of asyncDirectoryIterator(entry)) {
				await scanEntries(dirEntry, contents, fileDict);
			}

			const record: IconDir = {
				type: "directory",
				name,
				fullPath,
				contents,
			};
			scannedEntries.push(record);
			fileDict.set(fullPath, record);
		}

		if (utils.isFile(entry)) {
			const fileType = await utils.getType(entry);

			if (fileType === "image/svg+xml") {
				const id = utils.getIconId(fullPath);
				const contents = String(await utils.getText(entry));
				const record: IconFile = {
					type: "file",
					id,
					name,
					fullPath,
					contents,
				};
				scannedEntries.push(record);
				fileDict.set(fullPath, record);
			}
		}
	} catch (error) {
		console.log(error);
	}
}

export async function scanDroppedItems(
	items: DataTransferItem[]
): Promise<{ iconRecords: IconTree; fileDict: IconDict }> {
	// Async operations occur outside the scope of the drag event handler, so
	// creating a new local record of the dataTransfer items is required.
	// flatMap is used to ensure that all entries are non-null
	const entries: FileSystemEntry[] = items.flatMap((item) => {
		const entry = item.webkitGetAsEntry();
		return entry ? [entry] : [];
	});

	const iconRecords: IconRecord[] = [];
	const fileDict: Map<string, IconRecord> = new Map();
	for (const entry of entries) {
		await scanEntries(entry, iconRecords, fileDict);
	}

	return { iconRecords, fileDict };
}
