import { View, Atom, atom, zutil, SimpleTree, TreeNode, TreeOptions } from "zaffre";

export function DomTree(root: TreeNode<View>, selectedView: Atom<View>, inOptions: TreeOptions = {}): View {
  const defaultOptions: TreeOptions = {
    initialExpansionLevel: 1,
  };
  const options: TreeOptions = zutil.mergeOptions(defaultOptions, inOptions);

  const selectedNode: Atom<TreeNode<View> | undefined> = atom(undefined, {
    action: (node) => selectedView.set(node.data),
  });
  return SimpleTree(root, selectedNode, (node) => node.data.zname, options);
}
 