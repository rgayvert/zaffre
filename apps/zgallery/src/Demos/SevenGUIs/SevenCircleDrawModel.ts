import { ArrayAtom, Atom, arrayAtom, atom, UndoManager } from "zaffre";

export interface GCircle {
  id: string;
  x: number;
  y: number;
  r: Atom<number>;
}
export class SevenCircleDrawModel {
  static _nextID = 1;
  nextID(): string {
    return (SevenCircleDrawModel._nextID++).toString();
  }
  undoManager = new UndoManager();
  circles: ArrayAtom<GCircle> = arrayAtom([]);
  initialRadius = 25;
  selectedID: Atom<string> = atom("", { action: () => this.selectedRadius.set(this.selectedCircle?.r.get() || this.initialRadius) });
  get selectedCircle(): GCircle | undefined {
    return this.circles.find((spec) => spec.id === this.selectedID.get());
  }
  selectedRadius: Atom<number> = atom(this.initialRadius, { action: (r) => this.changeSelectedRadiusWithUndo(this.selectedID.get(), r) });

  circleWithID(id: string): GCircle | undefined {
    return this.circles.find((spec) => spec.id === id);
  }
  addCircleAt(x: number, y: number, id: string): void {
    this.circles.push({
      id: id,
      x: x,
      y: y,
      r: atom(this.initialRadius),
    });
    this.selectedID.set(id);
  }
  addCircleWithUndo(x: number, y: number): void {
    const id = this.nextID();
    this.undoManager.performWithUndo(
      () => this.addCircleAt(x, y, id),
      () => this.removeCircle(id),
      `AddCircle(${x}, ${y})`
    );
  }
  removeCircle(id: string): void {
    const circleSpec = this.circleWithID(id);
    if (circleSpec) {
      this.circles.delete(circleSpec);
      if (circleSpec.id === this.selectedID.get()) {
        this.clearSelection();
      }
    }
  }
  changeSelectedRadiusWithUndo(id: string, newRadius: number): void {
    const circle = this.circleWithID(id);
    if (circle) {
      const oldRadius = circle.r.get();
      this.undoManager.performWithUndo(
        () => this.changeRadius(id, newRadius),
        () => this.changeRadius(id, oldRadius),
        `ChangeRadius(${oldRadius} => ${newRadius})`
      );
    }
  }
  changeRadius(id: string, newRadius: number): void {
    this.circleWithID(id)?.r.set(newRadius);
  }

  hasSelection(): boolean {
    return Boolean(this.selectedID.get());
  }
  clearSelection(): void {
    this.selectedID.set("");
  }
  canUndo(): boolean {
    return this.undoManager.canUndo();
  }
  canRedo(): boolean {
    return this.undoManager.canRedo();
  }
  undo(): void {
    this.undoManager.undo();
  }
  redo(): void {
    this.undoManager.redo();
  }
  beginUndoGroup(): void {
    this.undoManager.beginGroup();
  }
  endUndoGroup(): void {
    this.undoManager.endGroup();
  }
}
