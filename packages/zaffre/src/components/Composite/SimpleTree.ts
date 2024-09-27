import { Atom, TreeNode, atom } from ":foundation";
import { View, calc, core, defineComponentDefaults, mergeComponentDefaults } from ":core";
import { Tree, TreeOptions } from "../Layout";
import { TextLabelOptions } from "../Content";
import { ExpandableItem } from "./ExpandableItem";

//
// A SimpleTree displays a tree structure using a text label for each visible node.
//
// TODO: 
//  - childIDFn should be something more likely to be unique, like the "fullPath"
//  - use LabelWithIcons instead of ExpandableItem, and use labelOptions
//

export interface SimpleTreeOptions extends TreeOptions {
  labelOptions?: TextLabelOptions;
}

defineComponentDefaults<SimpleTreeOptions>("SimpleTree", "Tree", {
});

type TreeTitleFn<T> = (node: TreeNode<T>) => string;

export function SimpleTree<T>(
  root: TreeNode<T>,
  selectedItem: Atom<TreeNode<T> | undefined>,
  titleFn: TreeTitleFn<T>,
  inOptions: SimpleTreeOptions = {},
  afterCreatedLabel?: (label: View, node: TreeNode<T>) => void,
): View {
  const options = mergeComponentDefaults("SimpleTree", inOptions);

  function NodeLabel(node: TreeNode<T>): View {
    const level = options.showRoot ? node.level : node.level - 1;
    const label = ExpandableItem({
      label: titleFn(node),
      expanded: node.expanded,
      marginLeft: calc(`${Math.max(level, 0)}*${options.indent}`),
      iconOpacity: atom(() => (node.hasChildren() ? 1.0 : 0.0)),
      iconName: atom(() => (node.expanded!.get() ? options.expandedIconName! : options.collapsedIconName!)),
      iconSide: options.iconSide,
      padding: core.space.s0,
      border: core.border.none,
      rounding: core.rounding.r0,
      background: core.color.inherit,
      font: core.font.inherit,
      alwaysExpanded: options.alwaysExpanded,
      model: node,
      labelOptions: options.labelOptions
    });
    afterCreatedLabel?.(label, node);
    return label;
  }
  function idFn(node: TreeNode<T>): string {
    return node.fullPath().map((n) => titleFn(n)).join("-");
  }

  return Tree<T>(root, selectedItem, idFn, NodeLabel, inOptions);
}