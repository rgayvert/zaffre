import { zutil, zlog } from "../Util";

//
// Atoms and Actions. This is the core of the reactive mechanism.
//
// An Atom is a generic reactive value. To access the value of an atom you need to use the get() method,
// and to change the value you must use set(). The primary utility of atoms comes from the actions that
// are attached. An action associated with an atom will be evaluated whenever its value changes.
//
// An Action is a closure, often attached to an Atom.
//
// A DerivedAtom is an atom whose value is a closure that references one or more other atoms.
//
// A reaction is an Action that is created automatically when an atom is accessed while evaluating a
// ReactiveAction, such as applying content or style to a View.
//

// certain options like disabled
export type AtomOrClosure<T> = Atom<T> | (() => T);

// geometry objects + text transforms
export type AtomOrValue<T> = T | Atom<T>;

// most attributes
export type ZType<T> = T | AtomOrClosure<T>;

// special sauce to ensure we can call a closure
export const isClosure = <T>(arg: ZType<T>): arg is () => T => {
  return typeof arg === "function";
};

export const avget = <T>(val: AtomOrValue<T>): T => {
  return val instanceof Atom ? val.get() : val;
};

export const zget = <T>(val: ZType<T>): T => {
  return val instanceof Atom ? val.get() : isClosure(val) ? val() : val;
};

export const zset = <T>(zval: ZType<T>, val: T): void => {
  zval instanceof Atom && zval.set(val);
};
export const ztoggle = (zval: ZType<boolean>): void => {
  zval instanceof Atom && toggleAtomValue(zval);
};
export const isAtomOfType = (val: any, type: string) => {
  return Boolean(val instanceof Atom && typeof val.get() === type);
};

export type BasicAction = () => void;
export type TAction<T> = (arg: T) => void;
export type AtomAction<T> = (newVal: T, atom?: Atom<T>) => void;
export type AsyncAtomAction<T, R> = (newVal: T) => Promise<R>;
export const noOp: BasicAction = () => undefined;
export const identityFn = <T>(x: T) => x;

//
// TODO: eliminate SimpleAction; this is tricky because all sorts of actions are thrown
// around here, and we want to pass AtomActions in the options.
// Maybe we modify the constructor to take an array of actions? (because of the actions list?)
//
export type SimpleAction = (...args: any[]) => void;

export type FileAction = (file: File) => void;

export interface BasicActions {
  [key: string]: BasicAction;
}
// export interface StringKeyed {
//   [key: string]: any
// }

// Aliases for the most common ZTypes
export type zstring = ZType<string>;
export type znumber = ZType<number>;
export type zboolean = ZType<boolean>;
export type zdate = ZType<Date>;
export type zlength = ZType<number | string>; // primarily for SVG attributes

export const disableReactionsWhile = <T>(fn: () => T): T => {
  Atom.reactionDisableCount++;
  const val = fn();
  Atom.reactionDisableCount--;
  return val;
};

export interface AtomOptions {
  action?: SimpleAction;
  name?: string;
  alwaysFire?: boolean; // e.g., EventHandler, or for message
  debug?: zboolean;
  debounce?: znumber;
  parent?: Atom<unknown>;
  childChanged?: SimpleAction;
  debugPrint?: (val: any) => string;
  initialValue?: any;
  remapValue?: (val: any) => any;
  validateValue?: (val: any) => boolean;
  onInvalidValue?: (val: any) => void;
  onReset?: SimpleAction;
}

export class Atom<T> {
  public static inViewLayout = false;

  public static reactionDisableCount = 0;
  private static reactionStack: ReactiveAction[] = [];

  public static evaluateWithoutReactions<T>(fn: () => T): T {
    this.reactionDisableCount++;
    const val = fn();
    this.reactionDisableCount--;
    return val;
  }
  public static reactionsDisabled(): boolean {
    return this.reactionDisableCount > 0;
  }
  public static pushReaction(action: ReactiveAction): void {
    this.reactionStack.push(action);
  }
  public static popReaction(): void {
    this.reactionStack.pop();
  }

  private static _nextID = 0;
  private nextID(): number {
    return Atom._nextID++;
  }

  protected actions: SimpleAction[] = [];

  protected reactions = new Set<ReactiveAction>();
  protected val: T;
  public initialValue: T;
  public previousVal?: T;
  public defaultValue?: T;
  public storageKey?: string;
  public readonly id: number;

  constructor(
    val: T,
    public options: AtomOptions = {},
  ) {
    this.id = this.nextID();
    this.val = val;
    this.initialValue = val;
    if (options.action) {
      this.addAction(options.action);
    }
    if (options.name && zget(options.debug)) {
      zlog.info(`created ${this}`);
    }
  }
  toString(): string {
    return `${this.constructor.name}[id=${this.id}${this.options.name ? ",name=" + this.options.name : ""}]`;
  }
  clone(): Atom<T> {
    return atom(this.get());
  }
  resetToInitialValue(): void {
    this.set(this.initialValue);
  }
  resetToDefaultValue(): void {
    if (this.defaultValue !== undefined) {
      this.set(this.defaultValue);
    }
  }
  reset(): void {
    this.options.onReset?.();
  }
  matchesDefault(): boolean {
    return this.get() === this.defaultValue;
  }
  updateDefault(): void {
    this.defaultValue = this.get();
  }
  public isReactive(): boolean {
    return true;
  }

  public release(): void {
    this.actions = [];
    this.reactions.clear();
    this.derivedAtoms = [];
  }

  public value(): T {
    return this.val;
  }

  derivedAtoms: DerivedAtom<unknown>[] = [];

  // If we're in the process of evaluating a derived atom and
  // do a get() on this atom, add the derived atom to our list. This
  // happens on every get(), so only add it the first time.
  private addCurrentDerivedAtom(): void {
    const derivedAtom = DerivedAtom.derivationStack.at(-1);

    if (derivedAtom && !this.derivedAtoms.includes(derivedAtom)) {
      this.derivedAtoms.push(derivedAtom);
      derivedAtom.addReferencedAtom(this);
    }
  }
  performDerivations(): void {
    this.derivedAtoms.forEach((derivedAtom) => derivedAtom.deriveValue());
  }
  public get(): T {
    if (Atom.inViewLayout && Atom.reactionDisableCount === 0) {
      console.trace();
      throw "atom access during apply layout";
    }
    if (!Atom.reactionsDisabled()) {
      Atom.reactionStack.forEach((reaction) => this.addReaction(reaction));
    }
    this.addCurrentDerivedAtom();
    return this.val;
  }
  public previousValue(): T | undefined {
    return this.previousVal;
  }
  public setValue(value: T): void {
    this.previousVal = this.val;
    this.val = value;
  }

  performActionsAndDerivations(skipReactions = false): void {
    if (!Atom.reactionsDisabled()) {
      this.performActions(skipReactions);
      this.performDerivations();
    }
  }

  private printDebugValue(val: T): string {
    return this.options.debugPrint ? this.options.debugPrint(val) : `${val}`;
  }
  private inSet = false;
  public setNow(value: T, skipReactions = false): void {
    if (this.inSet) {
      // prevent circular update
      return;
    }
    this.inSet = true;
    this.waitingForDebounce = false;
    if (value !== this.val || this.options.alwaysFire) {
      if (zget(this.options.debug)) {
        zlog.info(
          `atom[${this.options.name}].set(${this.printDebugValue(value)}), old=${this.printDebugValue(this.val)}`,
        );
      }
      this.setValue(value);
      this.performActionsAndDerivations(skipReactions);
      this.options.parent?.options.childChanged?.(this);
    }
    this.inSet = false;
  }

  private waitingForDebounce = false;

  protected remapValue(value: T): T {
    if (this.options.remapValue) {
      const mappedValue = this.options.remapValue?.(value);
      if (mappedValue !== value) {
        zlog.debug(`remapping value: ${value} to ${mappedValue}`);
      }
      return mappedValue;
    } else {
      return value;
    }
  }
  protected validate(value: T): boolean {
    if (this.options.validateValue) {
      return this.options.validateValue(value);
    } else {
      return true;
    }
  }
  public set(value: T, skipReactions = false): void {
    const v = this.remapValue(value);
    if (this.validate(v)) {
      if (!this.options.debounce) {
        this.setNow(v, skipReactions);
      } else if (!this.waitingForDebounce) {
        setTimeout(() => this.setNow(v), zget(this.options.debounce));
        this.waitingForDebounce = true;
      }
    } else {
      this.options.onInvalidValue?.(v);
    }
  }

  // TODO: is there a valid reason to call this?
  setWithoutActions(value: T): void {
    this.val = value;
  }

  beforeActions: SimpleAction[] = [];

  addBeforeAction(action: AsyncAtomAction<T, unknown>): void {
    this.beforeActions.push(action);
  }
  async setAsync(value: T): Promise<void> {
    await Promise.all(this.beforeActions.map((action) => action(value)));

    if (!this.options.debounce) {
      this.setNow(value);
    } else if (!this.waitingForDebounce) {
      setTimeout(() => this.setNow(value), zget(this.options.debounce));
      this.waitingForDebounce = true;
    }
  }

  public fire(): void {
    this.performActionsAndDerivations();
  }

  public setAndFire(value: T): void {
    this.setValue(value);
    this.performActionsAndDerivations();
  }

  performActions(skipReactions = false): void {
    this.actions.forEach((a) => a(this.val, this));
    if (!skipReactions) {
      this.reactions.forEach((a) => a.performReaction());
    }
  }
  public addReaction(reaction: ReactiveAction): void {
    this.reactions.add(reaction);
  }

  public addAction(action?: AtomAction<T>): Atom<T> {
    if (zget(this.options.debug)) {
      zlog.debug(this + " adding action");
    }
    if (action && !this.actions.includes(action)) {
      this.actions.push(action);
    }
    return this;
  }
  public addActionFirst(action?: AtomAction<T>): Atom<T> {
    if (action && !this.actions.includes(action)) {
      this.actions = [action, ...this.actions];
    }
    return this;
  }
  // this is useful for mapping menu values to actions
  public addValueActions(actions: Map<T, SimpleAction>): void {
    Object.entries(actions).forEach(([key, fn]) => this.addAction(() => this.get() === key && fn(key)));
  }

  public addActionAndFire(action: AtomAction<T>): Atom<T> {
    this.addAction(action);
    this.performActionsAndDerivations();
    return this;
  }
  public clearActions(): void {
    this.actions = [];
  }

  mirror(otherAtom: Atom<T>): void {
    this.addAction((val) => otherAtom.set(val));
    otherAtom.addAction((val) => this.set(val));
  }

  // Reordering derivations
  // TODO: generalize this
  // How should derived atoms be sorted? For transition effects, we need to ensure that
  // an exit transition is done before a new entry transitoin. In other cases we may want
  // some sort of topological sort based on dependencies.

  public moveDerivedAtomFirst(name: string): void {
    const index = this.derivedAtoms.findIndex((a) => a.options.name === name);
    if (index !== -1) {
      this.derivedAtoms = zutil.moveElementFirst(this.derivedAtoms, index);
    }
  }

  // Add a complementary pair of actions to ensure that only one registered
  // boolean atom may be true at a given time.
  public addSingletonDependent(atom: Atom<boolean>, value: T, negate = false): void {
    if (negate) {
      atom.addAction((b) => !b && this.set(value));
      this.addAction((v: T) => atom.set(negate ? v !== value : v === value));
    } else {
      atom.addAction((b) => b && this.set(value));
      this.addAction((v: T) => atom.set(v === value));
    }
  }

  // A couple of ideas for bundling constraints (not currently used)
  public addSingularConstraint(atom: Atom<boolean>, value: T, negate = false): void {}
  public static addGroupDependent<T>(group: Atom<Set<T>>, atom: Atom<boolean>, value: T): void {}
}

// A message atom may be used to send a message from a parent to a child. The sender should create
// a message atom, and pass this to the receiver in its options. The receiver needs to add an action
// in its constructor to handle this message. The value may be ignored in the case of a simple
// notification, or it may be passed to the action.
//
// TODO: is this useful? Or should we just use an atom that always fires? Currently we're only using this
// in a color selector.
//

export const messageAtom = <T>(value: T): Atom<T> => {
  return atom(value, { alwaysFire: true });
};

export const incrementAtom = (atom: Atom<number>, delta = 1): void => {
  atom.set(atom.get() + delta);
};
export const decrementAtom = (atom: Atom<number>, delta = 1): void => {
  atom.set(atom.get() - delta);
};
export const toggleAtomValue = (atom: Atom<boolean>): void => {
  atom.set(!atom.get());
};

export interface DerivedAtomOptions<T> extends AtomOptions {
  initialValue?: T;
}

export class DerivedAtom<T> extends Atom<T> {
  referencedAtoms = new Set<Atom<unknown>>();
  addReferencedAtom<T>(atom: Atom<T>): void {
    this.referencedAtoms.add(atom);
  }
  hasReferences(): boolean {
    return this.referencedAtoms.size > 0;
  }

  public static derivationStack: DerivedAtom<unknown>[] = [];

  constructor(
    public fn: AtomFn<T>,
    public options: DerivedAtomOptions<T> = {},
  ) {
    super(options.initialValue ?? Atom.evaluateWithoutReactions(fn), options);

    // evalute a second time to get initial referenced atoms
    // NB: if fn is a conjunction (A && B), it should be phrased as [A, B].every(...) so
    // that each part will be evaluated and not short-circuited.
    if (!this.hasInitialValue()) {
      Atom.evaluateWithoutReactions(() => this.get());
    }
  }
  hasInitialValue(): boolean {
    return this.options.initialValue !== undefined;
  }
  // One of the contained atoms has changed, so our value needs to be updated.
  // NB: our value might not actually change (as in the case of a window width breakpoint)
  public deriveValue(): void {
    if (zget(this.options.debug)) {
      zlog.debug(`deriveValue: ${this}: ${this.fn()}`);
    }
    this.set(this.fn());
  }
  public get(): T {
    // add this atom to the current derivation stack, so that it will be added to
    // any atom that is accessed in evaluating this.fn
    DerivedAtom.derivationStack.push(this);
    const val = this.fn();
    DerivedAtom.derivationStack.pop();
    super.get();
    return val;
  }
  public isReactive(): boolean {
    return this.hasReferences();
  }
  public release(): void {
    super.release();
    this.referencedAtoms.clear();
  }
}

export type AtomFn<T> = () => T;

export const atom = <T>(val: T | Atom<T> | AtomFn<T>, options: AtomOptions = {}): Atom<T> => {
  if (val instanceof Atom) {
    val.addAction(options.action);
    return val;
  } else if (typeof val === "function") {
    return new DerivedAtom(val as AtomFn<T>, options);
  } else {
    return new Atom(val, options);
  }
};

export const touch = (...values: any[]): void => {
  values.forEach((value) => value instanceof Atom && value.get());
};

export const derivedAtom = <T>(fn: () => T, options: DerivedAtomOptions<T> = {}): DerivedAtom<T> => {
  return new DerivedAtom(fn, options);
};

export class ReactiveAction {
  private static _nextID = 0;
  private nextID(): number {
    return ReactiveAction._nextID++;
  }

  waiting = false;
  public readonly id: number;

  constructor(
    protected action: SimpleAction,
    protected reaction = action,
    private debounce = 0,
  ) {
    this.id = this.nextID();
  }
  public setReaction(reaction: SimpleAction): void {
    this.reaction = reaction;
  }
  public release(): void {
    //
  }
  public perform(): void {
    Atom.pushReaction(this);
    this.action();
    Atom.popReaction();
  }

  public performReaction(): void {
    if (this.debounce === 0) {
      this.performReactionNow();
    } else if (!this.waiting) {
      setTimeout(() => this.performReactionNow(), this.debounce);
      this.waiting = true;
    }
  }
  public performReactionNow(): void {
    this.reaction();
    this.waiting = false;
  }
}

export const reactiveAction = (action: SimpleAction, reaction?: SimpleAction, debounce = 0): ReactiveAction => {
  return new ReactiveAction(action, reaction, debounce);
};

export const performAction = (action: ReactiveAction | SimpleAction | undefined): void => {
  if (action instanceof ReactiveAction) {
    action.perform();
  } else if (action) {
    action();
  }
};

/*
export type Atomized<R extends {}> = {
  [k in keyof R]: Atom<R[k]>
}
// Given a record R, create an atomized record which will update R. Note that the updates only go one way.
// This is sufficient for cases where we don't change the initial record (e.g., settings).
export const atomized = <R extends {}>(r: R, update = true): Atomized<R> => {
  const atomForKey = (r: R, k: keyof R, update: boolean) => {
    const a = atom(r[k]);
    update && a.addAction((val) => r[k] = val);
    return a;
  }
  const entries = Object.entries(r);
  return <Atomized<R>>Object.fromEntries(entries.map(([k, v]) => [k as keyof R, atomForKey(r, k as keyof R, update)]));
}

// Create an atom A and atomize it (AA). A and AA will update each other, but the initial record will not be modified.
// Note that the updates are bidirectional. This is needed for cases where the record may change, such as when it comes from a table.
export const atomizedPair = <R extends {}>(r: R, update = true): [Atom<R>, Atomized<R>] => {
  const atomForKey = (atomR: Atom<R>, k: keyof R, update: boolean) => {
    const a = atom(atomR.get()[k]);
    update && a.addAction((val) => atomR.get()[k] = val);
    return a;
  }
  const entries = Object.entries(r);
  const atomR = atom(r);
  const atomizedR = <Atomized<R>>Object.fromEntries(entries.map(([k, v]) => [k as keyof R, atomForKey(atomR, k as keyof R, update)]));
  atomR.addAction((rr) => Object.entries(rr).forEach(([k, v]) => {
    const ar = atomizedR[k as keyof R] as Atom<any>;
    ar && ar.set(v);
  }));
  return [atomR, atomizedR];
}

export const atomize = <R extends {}>(r: R): Atomized<R> => {
  return atomizedPair(r)[1]; 
}

*/
