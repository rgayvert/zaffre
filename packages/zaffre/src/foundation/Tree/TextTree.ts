import { zutil } from "../Util";
import { TreeNode } from "./TreeNode";

//
// treeNodeFromText - create a tree from indented text. See GalleryRoutes for an example.
//

export type TextTreeExtractFn<T> = (line: string) => T;

export interface KeyAndTitle {
  key: string;
  title: string;
}
export const extractKeyAndTitle = (line: string): KeyAndTitle => {
  const parts = line.split(" :: ").map((s) => s.trim());
  return { key: parts[0] || "", title: parts[1] || "" };
}

export const simpleTreeNodeFromText = (text: string, indent = 1): TreeNode<string> => {
  return treeNodeFromText(text, (line: string) => line, "", indent);
}

export const keyAndTitleTreeNodeFromText = (text: string, indent = 1): TreeNode<KeyAndTitle> => {
  return treeNodeFromText(text, extractKeyAndTitle, { key: "", title: "" }, indent);
}

export const treeNodeFromText = <T>(text: string, extractFn: TextTreeExtractFn<T>, rootData: T, indent = 1): TreeNode<T> => {
  return treeFromStringTree(stringTreeFromLines(zutil.asArrayOfLines(text), rootData, indent, extractFn), indent, extractFn);
}

interface stringTree<T> {
  data: T;
  children: stringTree<T>[];
}
const treeFromStringTree = <T>(tree: stringTree<T>, indent: number, extractFn: TextTreeExtractFn<T>): TreeNode<T> => {
  return new TreeNode(tree.data, () => tree.children.map((child) => treeFromStringTree(child, indent, extractFn)));
}
const levelOfLine = (line: string, indent: number): number => {
  return (line.length - line.trimStart().length) / indent;
}
const getStringTreeChildren = <T>(lines: string[], start: number, level: number, indent: number, extractFn: TextTreeExtractFn<T> ): stringTree<T>[] => {
  const answer: stringTree<T>[] = [];
  let i = start;
  while (i < lines.length && levelOfLine(lines[i], indent) >= level) {
    if (levelOfLine(lines[i], indent) === level) {
      answer.push({ data: extractFn(lines[i]), children: getStringTreeChildren(lines, i + 1, level + 1, indent, extractFn) });
    }
    i++;
  }
  return answer;
}
const stringTreeFromLines = <T>(lines: string[], rootData: T, indent: number, extractFn: TextTreeExtractFn<T>, ): stringTree<T> => {
  return { data: rootData, children: getStringTreeChildren(lines, 0, 0, indent, extractFn) };
}

export const createNestedArrayFromText = <T extends { children?: T[] }>(text: string, f: (s: string) => T): T[] => {
  return nestedArrayFromLines(text.trim().split("\n"), f);
}

const getNestedArrayChildren = <T  extends { children?: T[] }>(lines: string[], start: number, level: number, f: (s: string) => T): T[] => {
  const answer: T[] = [];
  let i = start;
  while (i < lines.length && levelOfLine(lines[i], 1) >= level) {
    if (levelOfLine(lines[i], 1) === level) {
      answer.push({ ...f(lines[i].trim()), children: getNestedArrayChildren(lines, i + 1, level + 1, f) });
    }
    i++;
  }
  return answer;
}
const nestedArrayFromLines = <T extends { children?: T[] }>(lines: string[], f: (s: string) => T): T[] => {
  return getNestedArrayChildren(lines, 0, 0, f);
}