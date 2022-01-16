import type * as Ikon from "../../typings/types";
import { writable, derived } from "svelte/store";
import fuzzysearch from "fuzzysearch-ts";

/**
 * Create a custom store that allows bulk selection of child icons
 * Track directories to preserve state
 */
function createSelected() {
	const { subscribe, set, update } = writable<Set<string>>(new Set());

	return {
		subscribe,
		select: (
			{ fullPath, type }: Ikon.IconRecord,
			iconDict: Map<string, Ikon.IconRecord>
		) => {
			update((selectedPaths) => {
				const isSelected = !selectedPaths.has(fullPath);

				isSelected
					? selectedPaths.add(fullPath)
					: selectedPaths.delete(fullPath);

				if (type === "directory") {
					const childRecords = [...iconDict.keys()].flatMap((key) => {
						const isValidKey = key.startsWith(fullPath);
						if (isValidKey) {
							const icon = iconDict.get(key);
							return icon ? [icon] : [];
						}
						return [];
					});

					for (const record of childRecords) {
						if (record) {
							isSelected
								? selectedPaths.add(record.fullPath)
								: selectedPaths.delete(record.fullPath);
						}
					}
				}

				return selectedPaths;
			});
		},
		clear: () => set(new Set()),
	};
}

// Deriver methods
/**
 * @param {IconDict} $iconDict
 */
function deriveIconList($iconDict: Ikon.IconDict) {
	return [...$iconDict.values()].filter((record) => record.type === "file");
}

function deriveSelectedIcons([$iconDict, $pathsSelected]: [
	$iconDict: Ikon.IconDict,
	$pathsSelected: Set<string>
]): Ikon.IconFile[] {
	if ($iconDict.size === 0) return [];

	return [...$pathsSelected].flatMap((path) => {
		const record = $iconDict.get(path);
		return record?.type === "file" ? [record] : [];
	});
}

function deriveFilteredIconList([$iconList, $searchTerm]: [
	$iconList: Ikon.IconRecord[],
	$searchTerm: string
]) {
	return $searchTerm.length === 0
		? $iconList
		: $iconList.filter((record) => fuzzysearch($searchTerm, record.name));
}

export const iconTree = writable<Ikon.IconRecord[]>([]);

export const iconMap = writable<Map<string, Ikon.IconRecord>>(new Map());

export const pathsSelected = createSelected();

export const searchTerm = writable("");

// Derived stores
export const iconList = derived(iconMap, deriveIconList);

export const selectedIcons = derived(
	[iconMap, pathsSelected],
	deriveSelectedIcons
);

export const filteredIconList = derived(
	[iconList, searchTerm],
	deriveFilteredIconList
);

export function resetStores() {
	iconTree.set([]);
	iconMap.set(new Map());
	pathsSelected.clear();
	searchTerm.set("");
}
