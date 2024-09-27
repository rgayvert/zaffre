import { Atom, AtomOptions } from "../Atom";

//
// A SharedModel contains a collection of named atoms, for use with a web worker.
// The idea is to have one SharedModel on the main thread, and another in the worker.
// Each will automatically synchronize the other when a reactive value changes.
//

export type ShareableValue = number | string | boolean;
export type ShareableValueList = [string, ShareableValue][];
export interface ZaffreMessage {
  zaffre_msg_type: string;
  changes: ShareableValueList;
}

export class NamedAtom<T> extends Atom<T> {
  lastChangeWasExternal = false;
  constructor(name: string, value: T, options: AtomOptions) {
    super(value, { ...options, name });
  }
  get name(): string {
    return this.options.name!;
  }
  setFromRemote(val: T): void {
    this.lastChangeWasExternal = true;
    super.set(val);
  }
  set(val: T): void {
    this.lastChangeWasExternal = false;
    super.set(val);
  }
}
export function namedAtom<T>(name: string, value: T, options: AtomOptions = {}): NamedAtom<T> {
  return new NamedAtom(name, value, options);
}

export class SharedModel {
  updating = false;
  atoms: NamedAtom<ShareableValue>[] = [];

  constructor(public worker?: Worker) {
    this.log("created model");
    if (this.worker) {
      this.worker.onmessage = (msg): void => this.update(msg.data.changes);
    }
  }
  setAtoms(atoms: NamedAtom<ShareableValue>[]): void {
    this.atoms = atoms;
    this.atoms.forEach((atom) =>
      atom.addAction((val) => {
        if (!atom.lastChangeWasExternal) {
          this.log(`change to ${atom.name}`);
          this.sendChange(atom.name, val);
        }
      })
    );
  }
  atomNamed(name: string): NamedAtom<ShareableValue> | undefined {
    return this.atoms.find((atom) => atom.name === name);
  }
  valueOf(name: string): string {
    return (this.atomNamed(name)?.get() || "").toString();
  }
  allValues(): ShareableValueList {
    return this.atoms.map((atom) => [atom.name, atom.get()]);
  }
  get side(): string {
    return this.worker ? "local" : "remote";
  }
  log(value: any): void {
    console.log(`${this.side}: ${value}`);
  }
  sendChange(name: string, value: ShareableValue): void {
    this.sendChanges([[name, value]]);
  }
  sendChanges(values: ShareableValueList): void {
    const msg = { zaffre_msg_type: "changes", changes: values };
    this.log(`sendChanges: ${msg.changes}`);
    if (this.worker) {
      this.worker.postMessage(msg);
    } else {
      postMessage(msg);
    }
  }
  update(values: ShareableValueList): void {
    if (values) {
      this.log(`updating: ${values}`);
      values.forEach(([name, val]) => this.atomNamed(name)?.setFromRemote(val));
    }

  }
}
