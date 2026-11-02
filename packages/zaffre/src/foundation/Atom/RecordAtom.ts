import { atom, Atom, AtomAction, AtomOptions, SimpleAction } from "./Atom";

class RHandler<R extends {}> {
  constructor(public recordAtom: RecordAtom<R>) {}
  set(target: R, prop: PropertyKey, value: any, _receiver: any) {
    target[prop as keyof typeof target] = value;
    this.recordAtom.fire();
    return true;
  }
}

export class RecordAtom<R extends {}> extends Atom<R> {
  proxyVal: R;

  constructor(val: R, options: AtomOptions = {}) {
    super(val, options);
    this.proxyVal = new Proxy(val, new RHandler(this));
  }

  get(): R {
    super.get();
    return this.proxyVal;
  }
  getRecord(): R {
    return super.get();
  }
  set(r: R): void {
    this.proxyVal = new Proxy(r, new RHandler(this));
    super.set(r);
  }

  fieldAtom<T>(key: keyof R, value: T | Atom<T>): FieldAtom<T> {
    if (value instanceof Atom) {
      const fa = new FieldAtom(key, value.get(), { action: (val) => value.set(val) });
      this.addAction((r) => {
        fa.clearActions();
        fa.addAction((val) => (r[key] as Atom<T>).set(val));
        fa.setValue((r[key] as Atom<T>).get());
      });
      return fa;
    } else {
      // create a simple atom that updates the proxy when changed
      const fa = new FieldAtom(key, value, { action: (val) => (this.get()[key] = val) });
      // update each field atom when the overall record changes
      this.addAction((r) => fa.setFromRecordChange(r[key] as T));
      return fa;
    }
  }
}

export const recordAtom = <R extends {}>(val: R, options: AtomOptions = {}) => {
  return new RecordAtom(val, options);
};

export class FieldAtom<T> extends Atom<T> {
  formActions: SimpleAction[] = [];
  skipFormActions = false;
  inSetFromRecordChange = false;
  constructor(public key: PropertyKey, value: T, options: AtomOptions) {
    super(value, options);
  }
  addFormAction(action: AtomAction<T>) {
    this.formActions.push(action);
  }
  setFromRecordChange(val: T): void {
    if (this.inSetFromRecordChange) {
      return;
    }
    this.inSetFromRecordChange = true;
    // don't perform form actions
    this.skipFormActions = true;
    this.set(val);
    this.skipFormActions = false;
    this.inSetFromRecordChange = false;
  }
  performActions(skipReactions = false): void {
    super.performActions(skipReactions);
    if (!this.skipFormActions) {
      this.formActions.forEach((a) => a(this.val, this));
    }
  }
}
