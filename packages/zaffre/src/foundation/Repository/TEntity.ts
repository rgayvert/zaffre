import { ArrayAtom, Atom,  } from "../Atom";
import { PaginatedArrayAtom, PaginatedArrayAtomOptions } from "../Misc";
import { isNullish, removeNullish } from "../Support";
import { basicValidator } from "./Validator";

//export type TEntityID = number | string | null;
export type TEntityID = string | null;

export type TEntityList<T extends TEntity> = PaginatedArrayAtom<T>;
export type TEntityListOptions<T> = PaginatedArrayAtomOptions<T>;

export type TRelatedEntity = Atom<TEntity | null> | ArrayAtom<TEntity | null>;

export interface TRelatedEntities {
  [key: string]: TRelatedEntity;
}

export interface TEntity {
  id: TEntityID;
  relatedEntities?: TRelatedEntities;
}

export class TEntity {
  constructor(data?: Partial<TEntity>, validator = basicValidator) {
    Object.assign(this, validator.parse({ ...this.defaultValues(), ...data }));
  }
  get uid(): TEntityID {
    return this.id;
  }
  defaultValues(): Partial<TEntity> {
    return {};
  }
  mergeValues(data?: Partial<TEntity>, validator = basicValidator): void {
    //Object.assign(this, validator.parse({ ...this, ...removeNullish(data) }));
    Object.assign(this, validator.parse({ ...this, ...data }));
    this.validate();
  }
  isPersisted(): boolean {
    return !isNullish(this.id);
  }
  // hook for subclasses
  setID(id: TEntityID): void {
    this.id = id;
  }
  // ensure values are of proper types, coercing if necessary
  validate(): void {}
  prepareToSave(): void {}

  // TODO: remove this
  nonPersistentFields(): string[] {
    return [];
  }

  updateFieldsToOmit(): string[] {
    return ["createdAt", "updatedAt"];
  }

  // NOTE: nullish values will yield an invalid date
  ensureDate(val: any): Date {
    return val instanceof Date ? val : typeof val === "string" ? new Date(val) : !val ? new Date("") : new Date();
  }

  updateRelatedFields(): void {
    // subclass hook
  }

  asPlain(): TEntity {
    const omit = [...this.nonPersistentFields(), ...this.updateFieldsToOmit()];
    return <TEntity>(
      Object.fromEntries(Object.entries(this).filter(([k, v]) => !(v instanceof Atom) && !omit.includes(k)))
    );
  }
}
