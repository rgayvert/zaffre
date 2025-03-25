import { ArrayAtom, arrayAtom, emptyArrayAtom } from "../Atom";

//
// UndoManager
//  - a simple undo manager, with a single level of grouping
//  - each item is a pair of forward/reverse actions
// 
// TODO:
//   - add coalescing to group

interface UndoableAction {
  forward: () => void;
  reverse: () => void;
  description?: string;
}
type UndoGroup = UndoableAction[];
type Undoable = UndoableAction | UndoGroup;

export class UndoManager {
  undoStack = emptyArrayAtom<Undoable>();
  redoStack = emptyArrayAtom<Undoable>();
  group?: UndoGroup;

  describe(undoable: Undoable): string {
    const u = Array.isArray(undoable) ? undoable.map((u) => u.description).toString() : undoable.description || "";
    return `${u} undo=${this.undoStack.length} redo=${this.redoStack.length}`;
  }

  // perform a new action and keep track
  public performWithUndo(action: () => void, undoAction: () => void, description?: string): void {
    action();
    const undoable = { forward: action, reverse: undoAction, description };
    // add to the group if it exists, otherwise to the undo stack
    if (this.group) {
      this.group.push(undoable);
    } else {
      this.undoStack.push(undoable);
      this.redoStack.clear();
    }
  }
  canUndo(): boolean {
    return this.undoStack.length > 0;
  }
  canRedo(): boolean {
    return this.redoStack.length > 0;
  }
  undoGroup(group: UndoGroup): void {
    [...group].reverse().forEach((undoable) => undoable.reverse());
  }
  redoGroup(group: UndoGroup): void {
    [...group].forEach((undoable) => undoable.forward());
  }
  undo(): void {
    const undoable = this.undoStack.pop();
    if (undoable) {
      if (Array.isArray(undoable)) {
        this.undoGroup(undoable);
      } else {
        undoable.reverse();
      }
      this.redoStack.push(undoable);
    }
  }
  redo(): void {
    const undoable = this.redoStack.pop();
    if (undoable) {
      if (Array.isArray(undoable)) {
        this.redoGroup(undoable);
      } else {
        undoable.forward();
      }
      this.undoStack.push(undoable);
    }
  }
  beginGroup(): void {
    this.group = [];
  }
  endGroup(): void {
    if (this.group) {
      this.undoStack.push(this.group);
      this.group = undefined;
    }
  }
}
