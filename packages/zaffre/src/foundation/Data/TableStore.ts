import { zutil } from "../Util";
import { ArrayAtom, atom, Atom } from "../Atom";
import { ExHandler } from "../Support";

//
// A TableStore manages persistence storage of TableRecord data. 
//
// TableStore itself is generic; see LocalTableStore and FetchTableStore for concrete examples.
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

export function updateEditorFromRecord<R>(editor: RecordEditor<R>, record: R): void {
  Object.entries(editor).forEach(([k, v]) => editor[k as keyof R].set(record[k as keyof R]));
}
export function updateRecordFromEditor<R>(editor: RecordEditor<R>, record: R): void {
  Object.entries(editor).forEach(([property, _field]) => {
    const key = property as keyof R;
    record[key] = editor[key].get();
  });
}

export function recordEditor<R extends {}>(record: R): RecordEditor<R> {
  function atomForValue<R>(record: R, k: keyof R, v: unknown): Atom<unknown> {
    return atom(v, {
      action: (val) => {
        record[k] = val;
      },
    });
  }
  const entries = Object.entries(record);
  return <RecordEditor<R>>(
    Object.fromEntries(entries.map(([k, v]) => [k as keyof R, atomForValue(record, k as keyof R, v)]))
  );
}


export function tableRecordEditor<R extends TabularRecord>(record: R, updateOnChange = false): RecordEditor<R> {
  function atomForValue<R extends TabularRecord>(record: R, k: keyof R, v: unknown): Atom<unknown> {
    return atom(v, {
      action: (val) => {
        record[k] = val;
        updateOnChange && record.update();
      },
    });
  }
  const entries = Object.entries(record).filter(([k, v]) => !record.nonEditableProperties.includes(k));
  return <RecordEditor<R>>(
    Object.fromEntries(entries.map(([k, v]) => [k as keyof R, atomForValue(record, k as keyof R, v)]))
  );
}

//
// A TabularRecord represents a tabular data record that may or may not be persisted. In either case, we
// need a value (assumed numeric) to uniquely identify the record in order to manage it properly within a list.
// 
export abstract class TabularRecord implements PlainRecord {
  abstract get recordID(): number;
  abstract set recordID(id: number);
  get invalidRecordID(): number {
    return -1;
  }
  update(): void {
    // no-up
  }
  // properties to be ignored by a record editor
  get nonEditableProperties(): string[] {
    return [];
  }
}

//
// A TableRecord is a persistent TabularRecord.
// 
export abstract class TableRecord extends TabularRecord {
  
  constructor(public store: TableStore<TableRecord> | undefined) {
    super();
  }

  restore(): void {
    // subclass hook
  }
  // in addition to the store, we might typically see values like createdAt or updatedAt
  // that may be created and maintained in the store
  get nonEditableProperties(): string[] {
    return ["store", "invalidRecordID"];
  }
  prepareToSave(): void {
    // subclass hook
  }
  isPersisted(): boolean {
    return this.recordID !== this.invalidRecordID;
  }
  create(): void {
    this.store && this.store.create(this);
  }
  update(): void {
    this.store && this.store.update(this);
  }
  createOrUpdate(): void {
    if (this.isPersisted()) {
      this.update();
    } else {
      this.create();
    }
  }
  delete(): void {
    this.store && this.store.delete(this);
    this.recordID = this.invalidRecordID;
  }
}

//
// A TableRecordList is a reactive list of TableRecords. 

//
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
  constructor(public store: TableStore<R>) {
    super([]);
  }
}

export abstract class TableStore<R extends TableRecord> {
  recordLists: TableRecordList<R>[] = [];
  recordCache: Map<number, R> = new Map([]);

  constructor(public cls: ClassConstructor<R>, public ex?: ExHandler) {}

  // the default plain-to-instance converter copies all values over, with the exception of
  // string values that appear to be ISO dates; these are converted to Date objects.
  plainToInstance(plain: Partial<R>): R {
    const record = new this.cls();
    const vals = Object.fromEntries(
      Object.entries(plain).map(([k, v]) => [k, typeof v === "string" && zutil.isISO8601(v) ? new Date(v) : v])
    );
    const inst = <R>Object.assign(record, vals);
    inst.store = <TableStore<TableRecord>>this;
    inst.restore();
    return inst;
  }
  // the default instance-to-plain converter copies over all editable properties
  instanceToPlain(record: R): PlainRecord {
    return <PlainRecord>(
      Object.fromEntries(Object.entries(record).filter(([k, v]) => !record.nonEditableProperties.includes(k)))
    );
  }


  removeRecord(record: R): void {
    this.recordCache.delete(record.recordID);
    this.recordLists.forEach((list) => list.delete(record));
  }

  abstract create(record: R): void;
  abstract get(result: Atom<R | undefined>, recordID: number): void;
  abstract update(record: R): void;
  abstract delete(record: R): void;
  abstract getAll(targetList: TableRecordList<R>, where?: TQueryOptions<R>, restoreFn?: (records: R[]) => void): void;
  
  createOrUpdate(record: R): void {
    if (record.isPersisted()) {
      this.update(record);
    } else {
      this.create(record);
    }
  }
  createRecordList(): TableRecordList<R> {
    const list = new TableRecordList<R>(this);
    this.recordLists.push(list);
    return list;
  }
  deleteList(recordList: TableRecordList<R>): void {
    recordList.forEach((record) => this.delete(record));
  }

}

type TableQueryOrderSpec<R> = [keyof R, "ASC" | "DESC"];

export interface TQueryOptions<R extends PlainRecord> {
  where: Partial<R>;
  order?: TableQueryOrderSpec<R>[];
}


