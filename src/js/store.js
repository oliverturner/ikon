import { writable, derived } from "svelte/store";
import fuzzysearch from "fuzzysearch";

function togglePath(paths, path) {
  const index = paths.indexOf(path);
  index >= 0 ? paths.splice(index, 1) : paths.push(path);
  return paths;
}

function createSelected() {
  const { subscribe, set, update } = writable([]);

  return {
    subscribe,
    select: ({ fullPath, type }, iconDict) => {
      update((selectedPaths) => {
        if (type === "file") {
          selectedPaths = togglePath(selectedPaths, fullPath);
        }

        if (type === "directory") {
          const addChildren = selectedPaths.indexOf(fullPath) < 0;
          const childRecords = [...iconDict.keys()]
            .filter((key) => key.startsWith(fullPath))
            .map((key) => iconDict.get(key));

          addChildren
            ? selectedPaths.push(fullPath)
            : selectedPaths.splice(selectedPaths.indexOf(fullPath), 1);

          for (const record of childRecords) {
            addChildren
              ? selectedPaths.push(record.fullPath)
              : selectedPaths.splice(selectedPaths.indexOf(record.fullPath), 1);
          }
        }

        return [...new Set(selectedPaths)];
      });
    },
    clear: () => set([]),
  };
}

function getIconList($iconDict) {
  return [...$iconDict.values()].filter((record) => record.type === "file");
}

/**
 * @param {[
 *   $iconDict: Map<string, IconRecord>,
 *   $pathsSelected: string[]
 * ]} args
 *
 * @returns {IconFile[]}
 */
function getSelectedIcons([$iconDict, $pathsSelected]) {
  console.log({ $pathsSelected });
  return $pathsSelected
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
