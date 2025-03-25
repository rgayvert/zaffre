import { arrayAtom, ArrayAtom, atom, Atom, responseAtom, ResponseAtom } from "../Atom";
import { lazyinit } from "../Support";
import { ClassConstructor, TQueryOptions, TableRecord, TableRecordList, TableStore, TableStoreOptions } from "./TableStore";

//
// A LocalTableStore is a TableStore uses local storage.
//
//   - simulates a table in local storage by keeping a list of record ids in one item (the "table"),
//     and the table records in separate items keyed by tableName-recordID
//   - implements the CRUD methods in the TableRecordList interface, so we can migrate to a real database easily
//   - each subclass must provide a #createRecord method to create a T from a json object
//


export class LocalTableStore<R extends TableRecord> extends TableStore<R> {
  constructor(public tableName: string, cls: ClassConstructor<R>, public options: TableStoreOptions = {}) {
    super(cls, options);
  }
  toString(): string {
    return `LocalTableStore<${this.tableName}>`;
  }
  // records ids are maintained in memory, and saved on any change
  @lazyinit get recordIDs(): ArrayAtom<number> {
    return arrayAtom(JSON.parse(localStorage.getItem(this.tableName) || "[]") as number[], { action: () => this.saveRecordIDs() });
  }
  saveRecordIDs(): void {
    localStorage.setItem(this.tableName, JSON.stringify(this.recordIDs.get()));
  }
  nextRecordID(): number {
    return this.recordIDs.max((r) => r) + 1;
  }
  fullKeyFor(recordID: number): string {
    return `${this.tableName}-${recordID}`;
  }
  create(record: R): ResponseAtom {
    record.prepareToSave();
    record.recordID = this.nextRecordID();
    this.recordIDs.push(record.recordID);
    this.update(record);
    return responseAtom();
  }
  get(result: Atom<R | undefined>, recordID: number, restoreFn?: (record: R) => void): ResponseAtom {
    const recordKey = `${this.tableName}-${recordID}`;
    const item = localStorage.getItem(recordKey);
    const record = item ? this.plainToInstance(JSON.parse(item)) : undefined;
    if (record) {
      restoreFn?.(record);
      result.set(record);
    }
    return responseAtom();
  }
  update(record: R): ResponseAtom {
    record.prepareToSave();
    localStorage.setItem(this.fullKeyFor(record.recordID), JSON.stringify(this.instanceToPlain(record)));
    return responseAtom();
  }

  delete(record: R): ResponseAtom {
    localStorage.removeItem(this.fullKeyFor(record.recordID));
    this.recordIDs.delete(record.recordID);
    this.removeRecord(record);
    return responseAtom();
  }
  getAll(targetList: TableRecordList<R>, where?: TQueryOptions<R>): ResponseAtom {
    const list: R[] = [];
    const result: Atom<R | undefined> = atom(undefined, { action: (r) => r && list.push(r) });
    this.recordIDs.map((recordID) => this.get(result, recordID));
    targetList.set(list);
    return responseAtom();
  }
  getAllRecords(where?: TQueryOptions<R>): TableRecordList<R> {
    const list = this.createRecordList();
    this.getAll(list, where);
    return list;
  }
} 
