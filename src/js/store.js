import { writable, derived } from "svelte/store";
import fuzzysearch from "fuzzysearch";

/**
 * Create a custom store that allows bulk selection of child icons
 * Track directories to preserve state
 */
function createSelected() {
  const { subscribe, set, update } = writable(new Set());

  return {
    subscribe,
    select: ({ fullPath, type }, iconDict) => {
      update((selectedPaths) => {
        const isSelected = !selectedPaths.has(fullPath);

        isSelected
          ? selectedPaths.add(fullPath)
          : selectedPaths.delete(fullPath);

        if (type === "directory") {
          const childRecords = [...iconDict.keys()]
            .filter((key) => key.startsWith(fullPath))
            .map((key) => iconDict.get(key));

          for (const record of childRecords) {
            isSelected
              ? selectedPaths.add(record.fullPath)
              : selectedPaths.delete(record.fullPath);
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
function deriveIconList($iconDict) {
  return [...$iconDict.values()].filter((record) => record.type === "file");
}

/**
 * @param {[$iconDict: IconDict, $pathsSelected: PathsSelected]} args
 * @returns {IconFile[]}
 */
function deriveSelectedIcons([$iconDict, $pathsSelected]) {
  if ($iconDict.length === 0) return [];

  return [...$pathsSelected]
    .map((path) => $iconDict.get(path))
    .filter((record) => record?.type === "file");
}

/**
 * @param {[ $iconList: IconRecord[], $searchTerm: string]} args
 */
function deriveFilteredIconList([$iconList, $searchTerm]) {
  return $searchTerm.length === 0
    ? $iconList
    : $iconList.filter((record) => fuzzysearch($searchTerm, record.name));
}

let currentSelectedNum = 0;

/** @type {Writable<IconRecord[]>} */
export const iconTree = writable([]);

/** @type {IconDict} */
export const iconDict = writable(new Map());

/** @type {PathsSelected} */
export const pathsSelected = createSelected();

export const searchTerm = writable("");

// Derived stores
export const iconList = derived(iconDict, deriveIconList);

export const selectedIcons = derived(
  [iconDict, pathsSelected],
  deriveSelectedIcons
);

export const filteredIconList = derived(
  [iconList, searchTerm],
  deriveFilteredIconList
);

export function resetStores() {
  iconTree.set([]);
  iconDict.set(new Map());
  pathsSelected.clear();
  searchTerm.set("");
  currentSelectedNum = 0;
}
