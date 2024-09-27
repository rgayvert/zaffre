import { expect, test, describe } from "vitest";
import { TreeNode, loremTree, simpleTreeNodeFromText, keyAndTitleTreeNodeFromText } from ":foundation";

// NB: TreeNodes are usually lazy, so we have to expand them to see anything.

function treeFromObjectKeys(name: string, obj: any): TreeNode<string> {
  return new TreeNode(name, () => Object.entries(obj).map(([key, value]) => treeFromObjectKeys(key, value)));
}

const tree1 = treeFromObjectKeys("root", {
  A: {
    b: 1,
    c: 2,
    d: 3,
  },
  E: {
    f: 3,
    g: 4,
    H: {
      i: 5,
      j: 6,
    },
  },
});

const treeText = `
line 1
 line 1.a
  line 1.a.1
  line 1.a.2
 line 1.b
line 2
 line 2.a
 line 2.b
`;
const tree2 = simpleTreeNodeFromText(treeText);
tree2.expandAll();

const tree3 = loremTree.tree(3, 2);

const treeText4 = `
line1 :: Line 1
  line 1.a :: Line 1A
    line 1.a.1 :: Line 1A1
    line 1.a.2 :: Line 1A2
  line 1.b :: Line 1B
line 2 :: Line 2
  line 2.a :: Line 2A
  line 2.b :: Line 2B
`;

const tree4 = keyAndTitleTreeNodeFromText(treeText4, 2);
tree4.expandAll();


describe("tree1", () => {
  test("root level", () => {
    expect(tree1.level).toBe(0);
  });
  test("child count", () => {
    expect(tree1.childCount).toBe(0);
    tree1.expand();
    expect(tree1.childCount).toBe(2);
  });

  test("nodeArray", () => {
    const nodes = tree1.nodeArray;
    expect(tree1.nodeArray.get().length).toBe(3);
    //expect(tree1.nodeArray.referencedAtoms.size).toBe(1);
    //expect(Array.from(tree1.nodeArray.referencedAtoms)[0]).toBe(tree1.childNodes);
  });

  test("children", () => {
    expect(tree1.childAt(0)).toBeInstanceOf(TreeNode);
    expect(tree1.childAt(0)!.data).toBe("A");
    expect(tree1.childAt(0)!.parentNode).toBe(tree1);
    expect(tree1.level).toBe(0);
    expect(tree1.childAt(0)!.level).toBe(1);
    expect(tree1.childAt(0)!.childAt(1)!.level).toBe(2);
    expect(tree1.childAt(2)).toBeUndefined();
    expect(tree1.childAt(0)!.childAt(3)).toBeUndefined();
    tree1.expandAll();
    expect(tree1.nodeWithID("0.1.1")).toBeDefined();
    expect(tree1.nodeWithID("0.1.1")!.data).toBe("g");
  });

  test("depth", () => {
    expect(tree1.depth).toBe(3);
    expect(tree1.childAt(1)!.depth).toBe(2);
  });
  test("siblings", () => {
    expect(tree1.siblingIndex).toBe(0);
    expect(tree1.childAt(0)!.siblingIndex).toBe(0);
  });
  test("child id", () => {
    expect(tree1.id).toBe("0");
    //expect(tree1.childAt(1)!.id).toBe("0.1");
    //expect(tree1.childAt(1)!.childAt(0)!.id).toBe("0.1.0");
  });

  test("tree from text", () => {
    expect(tree2.depth).toBe(3);

  });
});

describe("tree4", () => {
  test("tree4 depth", () => {
    expect(tree4.depth).toBe(3);
  });

});
