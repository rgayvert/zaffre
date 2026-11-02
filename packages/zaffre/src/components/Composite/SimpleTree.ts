import { Atom, LabelFn, TreeNode } from ":foundation";
import { addClass, calc, View } from ":core";
import { Tree, TreeOptions } from "../Layout";
import { ExpansionLabel } from "./ExpansionLabel";

//
// A SimpleTree displays a tree structure using a label for each visible node.
//

export interface SimpleTreeOptions extends TreeOptions {
  avatarFn?: (node: any) => View | undefined
}

export const SimpleTree = <T>(
  root: TreeNode<T>,
  selectedItem: Atom<TreeNode<T> | undefined>,
  titleFn: LabelFn<TreeNode<T>>,
  inOptions: SimpleTreeOptions = {}
) => {
  const simpleTreeOptions = addClass(inOptions, "SimpleTree");

  const NodeItem = (node: TreeNode<T>) => {
    const level = simpleTreeOptions.showRoot ? node.level : node.level - 1;
    const label = ExpansionLabel(titleFn(node), {
      expanded: node.expanded,
      paddingLeft: calc(`${Math.max(level, 0)}*${simpleTreeOptions.indent}`),
      iconOpacity: () => (node.hasChildren() ? 1.0 : 0.0),
      iconName: () => (node.expanded!.get() ? simpleTreeOptions.expandedIconName! : simpleTreeOptions.collapsedIconName!),
      iconSide: simpleTreeOptions.iconSide,
      alwaysExpanded: simpleTreeOptions.alwaysExpanded,
      model: node,
      avatar: simpleTreeOptions.avatarFn?.(node)
    });

    return label;
  };
  const idFn = (node: TreeNode<T>): string => {
    return node
      .fullPath()
      .map((n) => titleFn(n))
      .join("-");
  };

  return Tree<T>(
    {
      root,
      selectedNode: selectedItem,
      idFn,
      labelFn: NodeItem,
    },
    simpleTreeOptions
  );
};
