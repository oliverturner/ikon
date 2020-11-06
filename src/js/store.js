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

function getIconList($iconDict) {
  return [...$iconDict.values()].filter((record) => record.type === "file");
}

/**
 * @param {[
 *   $iconDict: Map<string, IconRecord>,
 *   $pathsSelected: Set<string>
 * ]} args
 *
 * @returns {IconFile[]}
 */
function getSelectedIcons([$iconDict, $pathsSelected]) {
  
  return [...$pathsSelected]
    .map((path) => $iconDict.get(path))
    .filter((record) => record.type === "file");
}

function filterIconList([$iconList, $searchTerm]) {
  return $searchTerm.length === 0
    ? $iconList
    : $iconList.filter((record) => fuzzysearch($searchTerm, record.name));
}

export const iconTree = writable([]);
export const iconDict = writable(new Map());
export const pathsSelected = createSelected();
export const searchTerm = writable("");

export const iconList = derived(iconDict, getIconList);
export const selectedIcons = derived(
  [iconDict, pathsSelected],
  getSelectedIcons
);
export const filteredIconList = derived([iconList, searchTerm], filterIconList);
