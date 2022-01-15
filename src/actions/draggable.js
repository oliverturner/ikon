import DragSelect from "dragselect";

export function draggable(node) {
  const ds = new DragSelect({
    selectables: node.querySelectorAll("[data-key]"),
    area: node,
  });

  ds.subscribe("callback", () => {
    const detail = ds.getSelection().map((btn) => btn.dataset.key);
    node.dispatchEvent(new CustomEvent("dragselect", { detail }));
  });

  return {
    destroy() {
      console.log("DragSelect destroy called");
      ds.stop();
    },
  };
}
