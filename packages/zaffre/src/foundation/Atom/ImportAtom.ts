import { zlog } from "../Util";
import { Atom, AtomOptions } from "./Atom";

//
// An ImportAtom waits for a dynamic import to complete. This is used in conjunction
// with a Loading component to do dynamic imports of components.
//
// Example: importAtom(async () => import(":demos/Animation/AnimationDemo"))],
//
//

export function importAtom<T>(fn: ImportFn<T>, options: AtomOptions = {}): ImportAtom<T> {
  return new ImportAtom(fn, options || {});
}
type ImportFn<T> = () => Promise<{ default: T }>;

export class ImportAtom<T> extends Atom<T | undefined> {
  constructor(protected fn: ImportFn<T>, public options: AtomOptions) {
    super(undefined, options);
    this.getValue();
  }

  async getValue(): Promise<void> {
    try {
      const { default: value } = await this.fn();
      if (value) {
        this.set(value);
      } else {
        zlog.error("failed to import");
      }
    } catch (e) {
      zlog.debug("failed to import: " + e);
    }
  }
}
