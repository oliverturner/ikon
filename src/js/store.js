import { writable, derived } from "svelte/store";
import fuzzysearch from "fuzzysearch";

import * as utils from "../js/utils";

function createIconDict() {
  const { subscribe, set, update } = writable(new Map());

  return {
    subscribe,
    set,
    select: (key) =>
      update((map) => {
        const iconRecord = map.get(key);
        iconRecord.selected = !iconRecord.selected;

        // If a directory, apply `selected` value to all children, regardless of depth
        if (iconRecord.type === "directory") {
          // Prefer relevant records to iterating over the entire map
          const childKeys = [...map.keys()].filter((k) => k.startsWith(key));
          for (const childKey of childKeys) {
            map.get(childKey).selected = iconRecord.selected;
          }
        }

        return map;
      }),
    clear: () =>
      update((map) => {
        for (const record of map.values()) {
          record.selected = false;
        }

        return map;
      }),
    reset: () => set(new Map()),
  };
}

function getIconList($iconDict) {
  return [...$iconDict.values()].filter((record) => record.type === "file");
}

// TODO: Preserve selection order
function getSelectedIcons($iconDict) {
  return [...$iconDict.values()]
    .filter((iconRecord) => iconRecord.type === "file" && iconRecord.selected)
    .sort(utils.sortByRecordKey("fullPath"));
}

function filterIconList([$iconList, $searchTerm]) {
  return $searchTerm.length === 0
    ? $iconList
    : $iconList.filter((record) => fuzzysearch($searchTerm, record.name));
}

export const iconTree = writable([]);
export const iconDict = createIconDict();
export const searchTerm = writable("");

export const iconList = derived(iconDict, getIconList);
export const selectedIcons = derived(iconDict, getSelectedIcons);
export const filteredIconList = derived([iconList, searchTerm], filterIconList);
