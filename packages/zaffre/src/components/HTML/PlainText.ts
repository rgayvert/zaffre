import { zutil, Interval, isNullInterval, nullInterval, intervalBoundedBy, Rect2D, zlog } from ":foundation";

//
// Assorted low-level functions for dealing with text elements. These are used primarily for 
// getting and setting selection intervals.
//

export interface TextRange {
  startLine: number;
  startCharacter: number;
  endLine: number;
  endCharacter: number;
}


export function nullTextRange(): TextRange {
  return { startLine: 0, startCharacter: 0, endLine: 0, endCharacter: 0 };
}

function lengthOfNode(node: Node): number {
  const nodeName = node.nodeName.toLowerCase();
  return nodeName === "br" ? 1 : nodeName === "#text" ? (<Text>node).length : 0;
}
function setRangeStart(range: Range, startNode: Node, startOffset: number): void {
  const offset = startNode.nodeName.toLowerCase() === "br" ? 0 : startOffset;
  try {
    range.setStart(startNode, offset);
  } catch(e) {
    zlog.warn("Error setting range start: "+e);
  }
}
function setRangeEnd(range: Range, endNode: Node, endOffset: number): void {
  const offset = endNode.nodeName.toLowerCase() === "br" ? 0 : endOffset;
  try {
    range.setEnd(endNode, offset);
  } catch(e) {
    zlog.warn("Error setting range end: "+e);
  }
}
function getNodeAtPosition(elt: Element, position: number): Node | null {
  const nodeIterator = document.createNodeIterator(elt, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
  let pos = 0;
  let node;
  let lastNode = null;
  while ((node = nodeIterator.nextNode())) {
    const len = lengthOfNode(node);
    if (pos + len > position) {
      return node;
    }
    pos = pos + len;
    lastNode = node;
  }
  return lastNode;
}
function getPositionOfNode(elt: Element, nodeToFind: Node): number {
  const nodeIterator = document.createNodeIterator(elt, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
  let position = 0;
  let node;
  while ((node = nodeIterator.nextNode())) {
    if (node === nodeToFind) {
      return position;
    }
    position = position + lengthOfNode(node);
  }
  return position;
}
function convertRangeToInterval(elt: Element, range: Range): Interval {
  elt.normalize();
  const startNode = range.startContainer === elt ? elt.childNodes[range.startOffset] : range.startContainer;
  const endNode = range.endContainer === elt ? elt.childNodes[range.endOffset] : range.endContainer;
  let start = getPositionOfNode(elt, startNode);
  let end = getPositionOfNode(elt, endNode);
  if (range.startContainer !== elt) {
    start = start + range.startOffset;
    end = end + range.endOffset;
  }
  return { start, end };
}
function convertIntervalToRange(elt: Element, interval: Interval): Range | null {
  if (isNullInterval(interval)) {
    return null;
  }
  elt.normalize();
  const range = document.createRange();
  const startNode = getNodeAtPosition(elt, interval.start);
  if (!startNode) {
    return null;
  }
  const startPosition = getPositionOfNode(elt, startNode);
  if (interval.start === interval.end && startPosition === interval.start && startNode !== elt) {
    // use elt as the container
    const pos = Array.prototype.indexOf.call(elt.childNodes, startNode);
    setRangeStart(range, elt, pos);
    setRangeEnd(range, elt, pos);
  } else {
    const endNode = getNodeAtPosition(elt, interval.end);
    if (!endNode) {
      return null;
    }
    const endPosition = getPositionOfNode(elt, endNode);
    setRangeStart(range, startNode, interval.start - startPosition);
    setRangeEnd(range, endNode, interval.end - endPosition);
  }
  return range;
}
export function setSelectionInterval(elt: HTMLElement, interval: Interval): void {
  if (interval) {
    const oldFocus = <HTMLElement>document.activeElement;
    elt.focus();
    const selection = window.getSelection();
    //console.log("setSelectionInterval: interval="+JSON.stringify(interval));
    const range = convertIntervalToRange(elt, interval);
    if (selection && range) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
    oldFocus?.focus();
  }
}
export function getSelectionInterval(elt: HTMLElement): Interval {
  elt.focus();
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return nullInterval();
  }
  return convertRangeToInterval(elt, selection.getRangeAt(0));
}
function deleteTextInInterval(elt: HTMLElement, interval: Interval): void {
  const intvl = intervalBoundedBy(interval, 0, elt.innerText.length);
  const range = convertIntervalToRange(elt, intvl);
  if (!range) {
    return;
  }
  if (intvl.end === intvl.start + 1 && range.startContainer.nodeName === "BR") {
    (range.startContainer as HTMLElement).remove();
    return;
  }
  if (intvl.end === intvl.start + 1 && range.endContainer.nodeName === "BR") {
    (range.endContainer as HTMLElement).remove();
    return;
  }
  range.deleteContents();
}
export function insertText(elt: HTMLElement, text: string, position: number): void {
  const pos = Math.max(0, Math.min(position, elt.innerText.length));
  const node = getNodeAtPosition(elt, pos);
  if (!node) {
    zutil.error("insertText: null node");
    return;
  }
  const range = convertIntervalToRange(elt, { start: pos, end: pos });
  if (range) {
    const textNode = document.createTextNode(text);
    range.insertNode(textNode);
    range.selectNodeContents(textNode);
    range.collapse(false);
    const end = position + text.length;
    setSelectionInterval(elt, { start: end, end: end });
  }
}

export function scrollRangeIntoView(range: Range): void {
  let node: Node | null;
  node = range.startContainer;
  if (node.nodeType == 1) {
    node = node.childNodes[range.startOffset];
  }
  while (node && node.nodeType != 1) {
    node = node.previousSibling || node.parentNode;
  }
  if (node instanceof HTMLElement) {
    scrollIntoViewIfNeeded(node);
    //node.scrollIntoView();
  }
}

export function selectTextInterval(elt: HTMLElement, interval: Interval): void {
  elt.focus();
  const viewSelection = window.getSelection();
  viewSelection?.removeAllRanges();
  const range = convertIntervalToRange(elt, interval);
  if (range) {
    viewSelection?.addRange(range);
    scrollRangeIntoView(range);
  }
}

export function convertTextRangeToInterval(elt: HTMLElement, textRange: TextRange): Interval {
  if (!elt.textContent) {
    return nullInterval();
  }
  const len = elt.textContent.length;
  const lines = (elt.textContent || "").split("\n");
  const start = zutil.sum(lines.slice(0, textRange.startLine), (val: string) => val.length + 1) + textRange.startCharacter;
  const end = zutil.sum(lines.slice(0, textRange.endLine), (val: string) => val.length + 1) + textRange.endCharacter;
  return { start: zutil.clamp(start, 0, len), end: zutil.clamp(end, 0, len) };
}
export function selectTextRange(elt: HTMLElement, textRange: TextRange): void {
  selectTextInterval(elt, convertTextRangeToInterval(elt, textRange));
}

export function scrollIntoViewIfNeeded(elt: HTMLElement): void {
  const parentElt = getScrollParent(elt);
  if (!parentElt) {
    return;
  }
  const pr = Rect2D.fromDOMRect(parentElt.getBoundingClientRect());
  const r = Rect2D.fromDOMRect(elt.getBoundingClientRect()).translatedBy(pr.origin.negated());

  if (r.bottom > pr.height) {
    parentElt.scrollTop = r.top;
  }
  const rr = Rect2D.fromDOMRect(elt.getBoundingClientRect());
  if (rr.top < 0) {
    // make the top visible
    parentElt.scrollBy(0, rr.top - pr.top);
  }
}

function getScrollParent(elt: HTMLElement | null): HTMLElement | undefined {
  return !elt ? undefined : elt.scrollHeight > elt.clientHeight ? elt : getScrollParent(elt.parentElement);
}
// Insert text at the current position of caret
export function insertTextAtCursor(s: string): void {
  const selection = document.getSelection();
  if (selection) {
    const range = selection.getRangeAt(0);
    range.deleteContents();

    const textNode = document.createTextNode(s);
    range.insertNode(textNode);
    range.selectNodeContents(textNode);
    range.collapse(false);

    selection.removeAllRanges();
    selection.addRange(range);
  }
}