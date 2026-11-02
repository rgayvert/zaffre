import { atom, TreeNode, simpleTreeNodeFromText, nullish } from ":foundation";
import { addClass } from ":view";
import { SimpleTree } from "./SimpleTree";
import { SimpleTreeOptions } from "./SimpleTree";

//
// A BulletList is a simple static indented list that can be constructed from
// formatted text. This is implemented using a SimpleTree, so options like indent
// may be used here. The bullets are created as simple Unicode text labels.
//

export interface BulletListOptions extends SimpleTreeOptions {
  bullets?: string;
}

export const BulletList = (text: string, inOptions: BulletListOptions = {}) => {
  const options = addClass(inOptions, "BulletList");
  options.model = text;

  const simpleBulletTitle = (node: TreeNode<string> | nullish): string => {
    return node ? `${options.bullets![node.level - 1]} ${node.data}` : "";
  };
  return SimpleTree(simpleTreeNodeFromText(text).expandAll(), atom(undefined), simpleBulletTitle, options);
};
