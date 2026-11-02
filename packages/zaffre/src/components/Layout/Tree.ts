import { zget, Atom, TreeNode, atom, counterAtomForDataSelection, zboolean } from ":foundation";
import { ChildCreator, ChildDataIDFn, LengthToken, View, addClass, counterKeyBindings } from ":core";
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
  selectLeavesOnly?: boolean;
}

interface TreeModel<T> {
  root: TreeNode<T>;
  selectedNode: Atom<TreeNode<T> | undefined>;
  idFn: ChildDataIDFn<TreeNode<T>>;
  labelFn: ChildCreator<TreeNode<T>>;
}

export const Tree = <T>(model: TreeModel<T>, inOptions: TreeOptions = {}) => {

  const options = addClass(inOptions, "Tree");

  const { root, selectedNode, idFn, labelFn } = model;

  // expand the tree to the selection
  selectedNode.addAction((node) => node && root.expandTo(node));

  const data = options.showRoot ? root.nodeArray : root.descendantArray;
  const currentIndex = counterAtomForDataSelection(data, selectedNode);
  options.model = root;

  const handleEnter = (node: TreeNode<T>): void => {
    // TODO: this locks up keybindings; probably has to do with currentIndex
    // being messed up by the data change
    //node.toggle();
    //selectedItem.set(node);
  }

  const TreeNodeLabel = (node: TreeNode<T>, index: number, selectable: boolean) => {
    const view = labelFn(node, index);
    const keyBindings = {
      ...counterKeyBindings(currentIndex),
      "ArrowRight": (): void => handleEnter(node),
    };
    view.options.clickAction = (): void => {
      if (!options.alwaysExpanded) {
        node.toggle();
      }
      selectable && selectedNode.set(node);
    };
    if (selectable) {
      view.options.selected = atom(() => selectedNode.get() === node);
    }
    view.options.events = {
      keyBindings: keyBindings,
    };
    return view;
  }
  const afterRenderingList = (view: View): void => {
    const initialLevel = zget(options.initialExpansionLevel) || 0;
    if (initialLevel > 0) {
      setTimeout(() => root.expandToLevel(initialLevel), 100);
      options.initialExpansionLevel = 0;
    }
  }
  const nodeSelectable = (node: TreeNode<T>) => {
    return !options.selectLeavesOnly || !node.hasChildren();
  }

  return VStack(options).append(
    ViewList(
      data,
      (node, index) => idFn(node, index),
      (node, index) => TreeNodeLabel(node, index, nodeSelectable(node)),
      { afterRender: (view) => afterRenderingList(view) }
    )
  );
}

