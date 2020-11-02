import { writable, derived } from "svelte/store";

function createIconDict() {
  const { subscribe, set, update } = writable(new Map());

  return {
    subscribe,
    init: (map) => set(map),
    select: (key) =>
      update((map) => {
        const iconRecord = map.get(key);
        map.set(key, { ...iconRecord, selected: !iconRecord.selected });
        return map;
      }),
    reset: () => set(new Map()),
  };
}

function getSelectedIcons($iconDict) {
  return [...$iconDict.values()].filter((iconRecord) => iconRecord.selected);
}

export const iconDict = createIconDict();
export const selectedIcons = derived(iconDict, getSelectedIcons);
