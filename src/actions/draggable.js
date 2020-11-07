import DragSelect from "dragselect";

export function draggable(node) {
  const ds = new DragSelect({
    selectables: node.querySelectorAll("[data-key]"),
    area: node,
    callback: () => {
      const detail = ds.getSelection().map((btn) => btn.dataset.key);
      node.dispatchEvent(new CustomEvent("dragselect", { detail }));
    },
  });

  return {
    destroy() {
      console.log("destroy called");
      ds.stop();
    },
  };
}
