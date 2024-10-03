import { zget, Atom, TreeNode, atom, counterAtomForDataSelection, zboolean } from ":foundation";
import { ChildCreator, ChildDataIDFn, View, LengthToken, ch, counterKeyBindings, BV } from ":core";
import { core, defineBaseOptions, mergeComponentOptions } from ":core";
import { StackOptions, VStack } from "./Stack";
import { ViewList } from "./ViewList";

//
// A Tree is a vertical stack where the item data come from a TreeNode.
//
// The key to using a TreeNode with a Tree component is nodeArray(). This is a reactive list 
// that contains the nodes in the current expansion of the root node. This means that the Tree 
// component does not concern itself with any notions of expansion, other than the level of
// each node.
//

export interface TreeOptions extends StackOptions {
  allowMultipleExpanded?: zboolean;
  initialExpansionLevel?: number;
  collapsedIconName?: string;
  expandedIconName?: string;
  iconSide?: "left" | "right";
  toggleOnTitleClick?: zboolean;
  expandOnTitleClick?: zboolean;
  indent?: LengthToken;
  showRoot?: zboolean;
  alwaysExpanded?: boolean;
}
defineBaseOptions<TreeOptions>("Tree", "VStack", {
  background: core.color.background,
  font: core.font.title_medium,
  allowMultipleExpanded: true,

  collapsedIconName: "icon.chevron-right",
  expandedIconName: "icon.chevron-down",
  iconSide: "left",

  toggleOnTitleClick: true,
  expandOnTitleClick: true,

  alignItems: "stretch",
  justifyContent: "start",
  border: core.border.thin,
  overflow: "auto",
  indent: ch(1.5),
  showRoot: true,
  alwaysExpanded: false,
});

export function Tree<T>(
  root: TreeNode<T>,
  selectedNode: Atom<TreeNode<T> | undefined>,
  idFn: ChildDataIDFn<TreeNode<T>>,
  labelFn: ChildCreator<TreeNode<T>>,
  inOptions: BV<TreeOptions> = {}
): View {
  const options = mergeComponentOptions("Tree", inOptions);

  // expand the tree to the selection
  selectedNode.addAction((node) => node && root.expandTo(node));

  const data = options.showRoot ? root.nodeArray : root.descendantArray;
  const currentIndex = counterAtomForDataSelection(data, selectedNode);
  options.model = root;

  function handleEnter(node: TreeNode<T>): void {
    // TODO: this locks up keybindings; probably has to do with currentIndex
    // being messed up by the data change
    //node.toggle();
    //selectedItem.set(node);
  }

  function TreeNodeLabel(node: TreeNode<T>, index: number): View {
    const view = labelFn(node, index);
    const keyBindings = {
      ...counterKeyBindings(currentIndex),
      "ArrowRight": (): void => handleEnter(node),
    };
    view.options.clickAction = (): void => {
      if (!options.alwaysExpanded) {
        node.toggle();
      }
      selectedNode.set(node);
    };
    view.options.selected = atom(() => selectedNode.get() === node);
    view.options.events = {
      keyBindings: keyBindings,
    };
    return view;
  }
  function afterRenderingList(view: View): void {
    const initialLevel = zget(options.initialExpansionLevel) || 0;
    if (initialLevel > 0) {
      setTimeout(() => root.expandToLevel(initialLevel), 100);
      options.initialExpansionLevel = 0;
    }
  }

  return VStack(options).append(
    ViewList(
      data,
      (node, index) => idFn(node, index),
      (node, index) => TreeNodeLabel(node, index),
      { afterRender: (view) => afterRenderingList(view) }
    )
  );
}
