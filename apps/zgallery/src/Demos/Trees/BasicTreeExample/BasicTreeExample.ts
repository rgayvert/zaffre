import { TreeNode, SimpleTree, SoftGrid, loremTree, zlog } from "zaffre";
import { atom, Atom, KeyAndTitle } from "zaffre";
import { galleryTree } from ":gallery";
import { basicTreeExampleRules, treeRules2 } from "./BasicTreeExample.rules";

export const BasicTreeExample = () => {
  const tree = loremTree.treeNode(5, 3, 2);
  const selection1: Atom<TreeNode<string> | undefined> = atom(undefined, {
    action: (item) => zlog.info("selection1: " + item),
  });
  const selection2: Atom<TreeNode<KeyAndTitle> | undefined> = atom(undefined, { action: (item) => zlog.info(item) });

  return SoftGrid({ rules: basicTreeExampleRules }).append(
    SimpleTree(tree, selection1, (node) => node?.data || "", { cls: "tree1" }), 
    SimpleTree(galleryTree, selection2, (node) => node?.data?.title || node?.data?.key || "", { rules: treeRules2 })
  );
};
