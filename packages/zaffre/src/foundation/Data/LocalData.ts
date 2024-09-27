import { atom, Atom, AtomAction } from "../Atom";
import { lazyinit } from "../Support";
import { serializerFor } from "./Serialize";

//
// Serialization scheme for foundation objects. This is used primarily with LocalData.
//

export class LocalData {
  @lazyinit public static get instance(): LocalData {
    return new LocalData();
  }
  atoms = new Map<string, Atom<any>>();

  addAtom<T>(key: string, defaultValue: T, action?: AtomAction<T>): Atom<T> {
    let val = defaultValue;
    const serializer = serializerFor(defaultValue);
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, serializer.serialize(defaultValue));
    } else {
      val = <T>serializer.deserialize(localStorage.getItem(key) || "");
    }
    const datom = atom(val, { action: (val: T, atom: Atom<T>) => this.valueChanged(val, atom) });
    datom.storageKey = key;
    datom.defaultValue = defaultValue;
    this.atoms.set(key, datom);
    if (action) {
      datom.addAction(action);
      action?.(val);
    }
    return datom;
  }
  getAtom<T>(key: string, defaultValue: T, action?: AtomAction<T>): Atom<T> {
    const atom = this.atoms.get(key);
    return atom ? atom : this.addAtom<T>(key, defaultValue, action);
  }
  valueChanged<T>(val: T, atom: Atom<T>): void {
    const serializedVal = serializerFor(val).serialize(val);
    localStorage.setItem(atom.storageKey!, serializedVal);
  }
  resetValue(storageKey: string): void {
    this.atoms.get(storageKey)?.resetToDefaultValue();
  }
  resetAll(): void {
    localStorage.clear();
    this.atoms.forEach((atom) => atom.resetToDefaultValue());
  }
}