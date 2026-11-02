import { expect, test, describe } from "vitest";
import { UndoManager } from ":foundation";

class Undo1 {
  a: number[] = [];
  b: string[] = [];
  undoManager = new UndoManager();

  addWithUndo(n: number): void {
    this.undoManager.performWithUndo(
      () => this.add(n),
      () => this.remove(n)
    );
  }
  removeWithUndo(n: number): void {
    this.undoManager.performWithUndo(
      () => this.remove(n),
      () => this.add(n)
    );
  }
  add(n: number): void {
    this.a.push(n);
  }
  remove(n: number): void {
    const idx = this.a.indexOf(n);
    this.a.splice(idx, 1);
  }

  pushCharWithUndo(s: string): void {
    this.undoManager.performWithUndo(
      () => this.pushChar(s),
      () => this.popChar(s)
    );
  }
  popCharWithUndo(s: string): void {
    this.undoManager.performWithUndo(
      () => this.popChar(s),
      () => this.pushChar(s),
    );
  }
  pushChar(s: string): void {
    this.b.push(s);
  }
  popChar(s: string): void {
    this.b.pop();
  }


}
describe("undo 1", () => {
  test("simple", () => {
    const u1 = new Undo1();
    u1.addWithUndo(1);
    expect(u1.a).toEqual([1]);
    expect(u1.undoManager.canUndo()).toEqual(true);
    expect(u1.undoManager.canRedo()).toEqual(false);
    u1.addWithUndo(2);
    expect(u1.a).toEqual([1, 2]);
    u1.addWithUndo(3);
    expect(u1.a).toEqual([1, 2, 3]);
    u1.undoManager.undo();
    expect(u1.a).toEqual([1, 2]);
    expect(u1.undoManager.canRedo()).toEqual(true);
    u1.undoManager.undo();
    expect(u1.a).toEqual([1]);
    u1.undoManager.redo();
    expect(u1.a).toEqual([1, 2]);
    u1.addWithUndo(4);
    expect(u1.a).toEqual([1, 2, 4]);
  });

  test("group 1", () => {
    const u1 = new Undo1();
    u1.addWithUndo(1);
    u1.undoManager.beginGroup();
    u1.pushCharWithUndo("a");
    u1.pushCharWithUndo("b");
    u1.pushCharWithUndo("c");
    expect(u1.b).toEqual(["a", "b", "c"]);
    expect(u1.undoManager.group?.length).toEqual(3);
    u1.undoManager.endGroup();
    expect(u1.undoManager.undoStack.length).toEqual(2);
    u1.undoManager.undo();
    expect(u1.b).toEqual([]);
  });

  test("group 2", () => {
    const u1 = new Undo1();
    u1.undoManager.beginGroup();
    u1.pushCharWithUndo("a");
    u1.pushCharWithUndo("b");
    u1.pushCharWithUndo("c");
    expect(u1.b).toEqual(["a", "b", "c"]);
    expect(u1.undoManager.group?.length).toEqual(3);
    u1.undoManager.endGroup();
    u1.undoManager.beginGroup();
    u1.pushCharWithUndo("d");
    u1.pushCharWithUndo("e");
    u1.undoManager.endGroup();
    expect(u1.b).toEqual(["a", "b", "c", "d", "e"]);
    u1.undoManager.undo();
    expect(u1.b).toEqual(["a", "b", "c"]);
    u1.undoManager.redo();
    expect(u1.b).toEqual(["a", "b", "c", "d", "e"]);
    u1.undoManager.undo();
    u1.undoManager.undo();
    expect(u1.b).toEqual([]);
  });

});
