import { atom, TreeNode, simpleTreeNodeFromText } from ":foundation";
import { BV, View, defineComponentBundle, mergeComponentOptions, restoreOptions } from ":core";
import { SimpleTree, SimpleTreeOptions } from "./SimpleTree";

//
// A BulletList is a simple static indented list that can be constructed from
// formatted text. This is implemented using a SimpleTree, so options like indent
// may be used here. The bullets are created as simple Unicode text labels.
//

export interface BulletListOptions extends SimpleTreeOptions {
  bullets?: string;
}
defineComponentBundle<BulletListOptions>("BulletList", "SimpleTree", {
  bullets: "∙◦-+",
  showRoot: false,
  alignItems: "start",
  alwaysExpanded: true,
});

export function BulletList(text: string, inOptions: BV<BulletListOptions> = {}): View {
  const options = mergeComponentOptions("BulletList", inOptions);

  function simpleBulletTitle(node: TreeNode<string>): string {
    return `${options.bullets![node.level - 1]} ${node.data}`;
  }
  return restoreOptions(
    SimpleTree(simpleTreeNodeFromText(text).expandAll(), atom(undefined), simpleBulletTitle, options)
  );
}
