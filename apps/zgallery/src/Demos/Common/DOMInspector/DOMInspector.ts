import { Atom, atom, core, TreeNode, pct, vh, px, Ensemble, ScrollPane, mergeComponentOptions, BV, restoreOptions } from "zaffre";
import { SplitGridOptions, defineComponentBundle } from "zaffre";
import { TextBox, View, SplitGrid, BoxOptions } from "zaffre";
import { viewStyleText } from "./ViewStyle";
import { DOMObjectTree } from "./DOMObjectTree";
import { DomTree } from "./DOMTree";

/**
 * #DOMInspector
 *   - provide a 3-column inspector showing the hierarchy, styles, and view data for a component
 *   - the hierachy is a simple tree of the names of the view and descendants
 *   - the style panel shows the collected styles and content of the selected view
 *   - the view data is a tree formed from the view and its children, as wrapped objects
 */

export interface DOMInspectorOptions extends SplitGridOptions {
  reset?: Atom<boolean>;
}

defineComponentBundle<DOMInspectorOptions>("DOMInspector", "SplitGrid", {
  columnMins: [100, 100, 100],
  columnMaxes: [2, 3, 3],
  width: pct(100),
  height: vh(80),
  maxHeight: px(500),
  gap: core.space.s1,
});

function treeNodeFromView(view: View): TreeNode<View> {
  return new TreeNode(view, () => view.children.get().map((child) => treeNodeFromView(child)));
}

export function DOMInspector(baseView: View, inOptions: BV<DOMInspectorOptions> = {}): View {
  const options = mergeComponentOptions("DOMInspector", inOptions);
  const selectedDOMView = atom(baseView);
  const viewStyle = atom(() => viewStyleText(selectedDOMView));
  const selectedViewID = atom(() => selectedDOMView.get().zname);
  const root = treeNodeFromView(baseView);
  baseView.addMutationAction(() => root.reload());
  options.reset?.addAction(() => root.reload());

  const commonOptions: BoxOptions = {
    background: core.color.background,
    border: core.border.none,
    justifyContent: "start",
    minHeight: pct(100),
  };
  return restoreOptions(
    SplitGrid(options).append(
      ScrollPane().append(DomTree(root, selectedDOMView, commonOptions)),
      TextBox(viewStyle, {
        ...commonOptions,
        color: core.color.surface.contrast,
        font: core.font.body_small,
        overflow: "auto",
        paddingLeft: core.space.s2,
      }),
      ScrollPane().append(Ensemble(selectedViewID, () => DOMObjectTree(selectedDOMView, commonOptions)))
    )
  );
}
