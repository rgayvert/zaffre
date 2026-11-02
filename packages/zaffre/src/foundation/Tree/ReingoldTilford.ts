interface RTTreeNode {
  id: string;
  value: any;
  children: RTTreeNode[];
  parent?: RTTreeNode;
  // Internal layout properties
  prelim: number;
  mod: number;
  shift: number;
  thread?: RTTreeNode;
  x: number;
  y: number;
}

export class RTTreeLayout {
  private nodeWidth: number;
  private nodeSpacing: number;

  constructor(nodeWidth = 50, nodeSpacing = 20) {
    this.nodeWidth = nodeWidth;
    this.nodeSpacing = nodeSpacing;
  }

  layout(root: RTTreeNode): RTTreeNode {
    this.firstWalk(root, 0);
    this.secondWalk(root, 0, 0);
    return root;
  }

  private firstWalk(node: RTTreeNode, depth: number) {
    if (node.children.length === 0) {
      // Leaf node: set prelim based on sibling order
      if (node.parent) {
        const prevSibling = this.getPreviousSibling(node);
        if (prevSibling) {
          node.prelim = prevSibling.prelim + this.nodeWidth + this.nodeSpacing;
        } else {
          node.prelim = 0;
        }
      }
    } else {
      // Internal node: process children first
      node.children.forEach((child) => this.firstWalk(child, depth + 1));

      // Calculate midpoint of children
      const firstChild = node.children[0];
      const lastChild = node.children[node.children.length - 1];
      node.prelim = (firstChild.prelim + lastChild.prelim) / 2;

      // Adjust if not the first child
      if (node.parent) {
        const prevSibling = this.getPreviousSibling(node);
        if (prevSibling) {
          node.prelim = prevSibling.prelim + this.nodeWidth + this.nodeSpacing;
          node.mod = node.prelim - (firstChild.prelim + lastChild.prelim) / 2;
        }
      }
    }
  }

  private secondWalk(node: RTTreeNode, mod: number, depth: number) {
    // Final x is prelim + accumulated mod
    node.x = node.prelim + mod;
    node.y = depth;

    // Pass modified mod to children
    const newMod = mod + node.mod;
    node.children.forEach((child) => {
      this.secondWalk(child, newMod, depth + 1);
    });
  }

  private getPreviousSibling(node: RTTreeNode): RTTreeNode | undefined {
    if (!node.parent) return undefined;
    const siblings = node.parent.children;
    const index = siblings.indexOf(node);
    return index > 0 ? siblings[index - 1] : undefined;
  }

  debugResult(node: RTTreeNode): void {
    console.log(`${node.id}: ${node.x}, ${node.y}`);
    node.children.forEach((n) => this.debugResult(n));
  }
}

const tn = (id: string, parent?: RTTreeNode) => {
  const node = {
    id: id,
    value: id,
    children: [],
    parent: parent,
    prelim: 0,
    mod: 0,
    shift: 0,
    x: 0,
    y: 0,
  };
  parent && parent.children.push(node);
  return node;
};

export const rtTest1 = () => {
  const a = tn("A");
  const b = tn("B", a);
  const c = tn("C", a);
  const d = tn("D", a);
  const e = tn("E", b);
  const f = tn("F", b);
  const g = tn("G", d);

  const layout = new RTTreeLayout();
  layout.layout(a);
  layout.debugResult(a);
};
