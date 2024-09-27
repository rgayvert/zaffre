import { zutil } from "../Util";
import { TreeNode } from "../Tree";
import { lorem } from "./Lorem";

//
// loremTree - create a randomized tree of a requested depth and child size. Each node
// will have some random (lorem) text.
//


interface LoremTreeNode {
  data: string;
  children: LoremTreeNode[];
}
function treeFromLoremTreeNode(tree: LoremTreeNode): TreeNode<string> {
  return new TreeNode(tree.data, () => tree.children.map((child) => treeFromLoremTreeNode(child)));
}

export const loremTree = {
  tree: (depth: number, childrenPerNode: number, wordsPerNode = 1): LoremTreeNode => {
    const word = lorem.words(wordsPerNode);
    const tree: LoremTreeNode = { data: word, children: [] };
    for (let level = 1; level < depth; level++) {
      const nchildren = zutil.randomInt(0, childrenPerNode);
      for (let i = 0; i < nchildren; i++) {
        tree.children.push(loremTree.tree(depth - 1, childrenPerNode, wordsPerNode));
      }
    }
    return tree;
  },

  treeNode: (depth: number, childrenPerNode: number, wordsPerNode = 2): TreeNode<string> => {
    return treeFromLoremTreeNode(loremTree.tree(depth, childrenPerNode, wordsPerNode));
  }
};
