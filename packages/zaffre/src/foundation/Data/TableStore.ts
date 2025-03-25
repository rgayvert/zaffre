import { zutil } from "../Util";
import { ArrayAtom, atom, Atom, ResponseAction, responseAtom, ResponseAtom } from "../Atom";
import { ExHandler, lazyinit } from "../Support";

//
// A TableStore manages persistence storage of TableRecord data.
//
// TableStore itself is abstract; see LocalTableStore and FetchTableStore for concrete examples.
//

export type ClassConstructor<T> = {
  new (...args: any[]): T;
};

export interface PlainRecord {
  [key: string]: any;
}

export type RecordEditor<R> = {
  [P in keyof R]: Atom<R[P]>;
};

export type TableRecordEditor<R extends TabularRecord> = {
  [P in keyof R]: Atom<R[P]>;
};

// These two functions come into play if the record editor does not updateOnChange; it's up to
// the client to decide when to update.

export function updateEditorFromRecord<R extends TabularRecord>(record: R): void {
  const editor = <RecordEditor<R>>record.editor;
  Object.entries(editor).forEach(([property, _field]) => {
    const key = property as keyof R;
    if (record[key] instanceof Atom) {
      editor[key].set(record[key].get());
      record[key].addAction((val) => editor[key].set(val)); // <- update editor when record changes
    } else {
      editor[key].set(record[key]);
    }
  });
}
export function updateRecordFromEditor<R extends TabularRecord>(record: R): void {
  const editor = <RecordEditor<R>>record.editor;
  Object.entries(editor).forEach(([property, _field]) => {
    const key = property as keyof R;
    if (record[key] instanceof Atom) {
      record[key].set(editor[key].get());
    } else {
      record[key] = editor[key].get();
    }
  });
}

export function recordEditor<R extends {}>(record: R): RecordEditor<R> {
  function atomForValue<R>(record: R, k: keyof R, v: unknown): Atom<unknown> {
    const answer = atom(v, {
      // update the record when the editor value changes
      action: (val) => {
        record[k] instanceof Atom ? record[k].set(val) : (record[k] = val);
      },
    });
    if (v instanceof Atom) {
      // update the editor when this record value changes
      v.addAction((val) => answer.set(val));
    }
    return answer;
  }
  const entries = Object.entries(record);
  return <RecordEditor<R>>(
    Object.fromEntries(entries.map(([k, v]) => [k as keyof R, atomForValue(record, k as keyof R, v)]))
  );
}

export function tableRecordEditor<R extends TableRecord>(record: R, updateOnChange = false): RecordEditor<R> {
  function atomForValue<R extends TabularRecord>(record: R, k: keyof R, v: unknown): Atom<unknown> {
    const answer = atom(v, {
      // update the record when the editor value changes
      action: (val) => {
        record[k] instanceof Atom ? record[k].set(val) : (record[k] = val);
        updateOnChange && record.update();
      },
    });
    if (v instanceof Atom) {
      // update the editor when this record value changes
      v.addAction((val) => answer.set(val));
    }
    return answer;
  }
  const keys = record.store?.editableFields() || record.editableFields();
  const entries = Object.entries(record).filter(([k, v]) => keys.includes(k));
  return <RecordEditor<R>>(
    Object.fromEntries(entries.map(([k, v]) => [k as keyof R, atomForValue(record, k as keyof R, v)]))
  );
}

let _nextRecordID = -1;
export function uniqueRecordID(): number {
  return _nextRecordID--;
}

//
// A TabularRecord represents a tabular data record that may or may not be persisted. In either case, we
// need a value (assumed numeric) to uniquely identify the record in order to manage it properly within a list.
//
export abstract class TabularRecord implements PlainRecord {
  _editor?: RecordEditor<TabularRecord>;
  abstract get recordID(): number;
  abstract set recordID(id: number);

  update(): void {
    // no-up
  }
  // properties to be ignored by a record editor
  get nonPersistentProperties(): string[] {
    return [];
  }
  @lazyinit get editor(): RecordEditor<TabularRecord> {
    return (this._editor = recordEditor(this));
  }
}

//
// A TableRecord is a persistent TabularRecord.
//

export type ReadOnlyTableRecordKeys = "nonPersistentProperties";
export type PartialTableRecord<R extends TableRecord> = Partial<Omit<R, ReadOnlyTableRecordKeys>>;

export abstract class TableRecord extends TabularRecord {
  _persisted = atom(false);
  abstract persistentFields(): string[];

  constructor(public store?: TableStore<TableRecord>) {
    super();
  }


  // persistentFields(): string[] {
  //   return Object.getOwnPropertyNames(this).filter(
  //     (s) => s !== "store" && s !== "_persisted" && s !== "_editor" && s !== "editor"
  //   );
  // }
  editableFields(): string[] {
    return [...this.persistentFields(), ...this.additionalFields()];
  }
  editableEntries() {
    return Object.fromEntries(this.editableFields().map((key) => [key, (this as any)[key]]));
  }

  @lazyinit get editor(): TableRecordEditor<TableRecord> {
    return (this._editor = tableRecordEditor(this));
  }

  // in addition to the store, we might typically see values like createdAt or updatedAt
  // that may be created and maintained in the store
  get nonPersistentProperties(): string[] {
    return ["store", "_persisted", "_editor", "editor"];
  }
  additionalFields(): string[] {
    return [];
  }
  prepareToSave(): void {
    // subclass hook
  }
  restore(): void {
    // subclass hook
  }
  toPlain(): PlainRecord {
    return this.store?.instanceToPlain(this) || this;
  }

  restoreFromDB(persisted: boolean): void {
    this._persisted.set(persisted);
    this.restore();
  }
  afterCreate(): void {
    // subclass hook
  }
  isPersisted(): boolean {
    return this._persisted.get();
  }
  // TODO: does this actually get called? or is it always done by table store?
  create(): ResponseAtom {
    this.prepareToSave();
    if (this.store) {
      return this.store.create(this, (response) => {
        if (response.ok) {
          this._persisted.set(true);
          this.afterCreate();
        }
      });
    } else {
      return responseAtom();
    }
  }
  update(): ResponseAtom {
    this.prepareToSave();
    if (this.store) {
      return this.store.update(this, (response) => {
        if (response.ok) {
          this._persisted.set(true);
        }
      });
    } else {
      return responseAtom();
    }
  }
  save(): ResponseAtom {
    return this.createOrUpdate();
  }
  saveIfPersisted(): ResponseAtom {
    return this.isPersisted() ? this.save() : responseAtom("ok");
  }
  createOrUpdate(): ResponseAtom {
    return this.isPersisted() ? this.update() : this.create();
  }
  delete(): ResponseAtom {
    if (this.store && this.isPersisted()) {
      return this.store.delete(this, (response) => {
        if (response.ok) {
          this.recordID = uniqueRecordID();
          this._persisted.set(false);
        }
      });
    } else {
      return responseAtom();
    }
  }
}


//
// A TableRecordList is a reactive list of TableRecords.

export type TRecordListLoader<R extends TableRecord> = (list: TableRecordList<R>) => ResponseAtom;

export class TableRecordList<R extends TableRecord> extends ArrayAtom<R> {
  add(record: R): void {
    if (!record.isPersisted()) {
      this.store.create(record);
    }
    this.push(record);
  }
  addAll(where?: TQueryOptions<R>): void {
    this.store.getAll(this, where);
  }
  updateRecord(record: R): void {
    this.store.update(record);
    const index = this.indexOf(record);
    super.delete(record);
    this.insert(index, record);
  }
  deleteAll(...records: R[]): void {
    records.forEach((record) => record.delete());
  }
  addOrUpdate(record: R): void {
    if (!record.isPersisted()) {
      this.add(record);
    } else {
      this.updateRecord(record);
    }
  }
  constructor(public store: TableStore<R>, records: R[] = []) {
    super(records);
  }
}

export interface TableStoreOptions {
  ex?: ExHandler;
}

export abstract class TableStore<R extends TableRecord> {
  recordLists: TableRecordList<R>[] = [];
  recordCache: Map<number, R> = new Map([]);

  constructor(public cls: ClassConstructor<R>, public options: TableStoreOptions = {}) {}

  @lazyinit get persistentFields(): string[] {
    return (new this.cls).persistentFields();
  }

  editableFields(): string[] {
    const record = new this.cls();
    return [...this.persistentFields, ...record.additionalFields()];
  }

  // TODO: allow for a factory mechanism to return subclasses

  // the default plain-to-instance converter copies all values over, with the exception of
  // string values that appear to be ISO dates; these are converted to Date objects.
  plainToInstance(plain: Partial<R>, persisted = true): R {
    const record = new this.cls();
    const vals = Object.fromEntries(
      Object.entries(plain).map(([k, v]) => [k, typeof v === "string" && zutil.isISO8601(v) ? new Date(v) : v])
    );
    const inst = <R>Object.assign(record, vals);
    inst.store = <TableStore<TableRecord>>this;
    inst.restoreFromDB(persisted);
    return inst;
  }
  // the default instance-to-plain converter copies over all editable properties
  instanceToPlain(record: R): PlainRecord {
    const fields = this.persistentFields;
    return <PlainRecord>Object.fromEntries(Object.entries(record).filter(([k, v]) => fields.includes(k)));
  }

  clone(record: R): R {
    const clone = this.plainToInstance(<Partial<R>>this.instanceToPlain(record));
    clone.recordID = uniqueRecordID();
    clone._persisted.set(false);
    return clone;
  }

  removeRecord(record: R): void {
    this.recordCache.delete(record.recordID);
    this.recordLists.forEach((list) => list.delete(record));
  }

  abstract create(record: R, action?: ResponseAction): ResponseAtom;
  abstract get(record: Atom<R | undefined>, recordID: number, restoreFn?: (record: R) => void): ResponseAtom;
  abstract update(record: R, action?: ResponseAction): ResponseAtom;
  abstract delete(record: R, action?: ResponseAction): ResponseAtom;
  abstract getAll(
    targetList: TableRecordList<R>,
    where?: TQueryOptions<R>,
    restoreFn?: (record: R) => void
  ): ResponseAtom;

  save(record: R): void {
    return this.createOrUpdate(record);
  }

  createOrUpdate(record: R): void {
    if (record.isPersisted()) {
      this.update(record);
    } else {
      this.create(record);
    }
  }
  createRecordList(records: R[] = []): TableRecordList<R> {
    const list = new TableRecordList<R>(this, records);
    this.recordLists.push(list);
    return list;
  }
  // createDerivedRecordList(recordsFn: () => R[]): TableRecordList<R> {
  //   const records = atom(() => recordsFn());
  //   const list = new TableRecordList<R>(this, records.get());
  //   records.addAction(() => list.set(records.get()));
  //   return list;
  // }

  deleteList(recordList: TableRecordList<R>): void {
    recordList.forEach((record) => this.delete(record));
  }

  findCachedRecord(recordID: number): R | undefined {
    let rec = this.recordCache.get(recordID);
    if (!rec) {
      const list = this.recordLists.find((list) => list.find((r) => r.recordID === recordID));
      if (list) {
        rec = list.find((r) => r.recordID === recordID);
      }
    }
    return rec;
  }

  findRecord(record: Atom<R | undefined>, recordID: number): ResponseAtom {
    const response = responseAtom();
    let rec = this.findCachedRecord(recordID);
    if (rec) {
      record.set(rec);
      response.set("ok");
      return response;
    } else {
      return this.get(record, recordID);
    }
  }
}

type TableQueryOrderSpec<R> = [keyof R, "ASC" | "DESC"];

export interface TQueryOptions<R extends PlainRecord> {
  //where: Partial<R>;
  where?: any;
  order?: TableQueryOrderSpec<R>[];
}

//
// export class DataStore {
//   static with(...tstores: TableStore<TableRecord, TableRecord>[]): DataStore {
//     const ds = new DataStore();
//     ds.add(...tstores);
//     return ds;
//   }
//   tables: TableStore<TableRecord, TableRecord>[] = [];

//   add(...tstores: TableStore<TableRecord, TableRecord>[]): void {
//     this.tables.push(...tstores);
//   }
// }
