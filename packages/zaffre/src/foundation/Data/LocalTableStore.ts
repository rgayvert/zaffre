import { arrayAtom, ArrayAtom, atom, Atom } from "../Atom";
import { lazyinit, ExHandler } from "../Support";
import { ClassConstructor, TQueryOptions, TableRecord, TableRecordList, TableStore } from "./TableStore";

//
// A LocalTableStore is a TableStore uses local storage.
//
//   - simulates a table in local storage by keeping a list of record ids in one item (the "table"),
//     and the table records in separate items keyed by tableName-recordID
//   - implements the CRUD methods in the TableRecordList interface, so we can migrate to a real database easily
//   - each subclass must provide a #createRecord method to create a T from a json object
//


export class LocalTableStore<R extends TableRecord> extends TableStore<R> {
  constructor(public tableName: string, cls: ClassConstructor<R>, public ex?: ExHandler) {
    super(cls, ex);
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
  async create(record: R): Promise<void> {
    record.prepareToSave();
    record.recordID = this.nextRecordID();
    this.recordIDs.push(record.recordID);
    this.update(record);
  }
  async get(result: Atom<R | undefined>, recordID: number): Promise<void> {
    const recordKey = `${this.tableName}-${recordID}`;
    const item = localStorage.getItem(recordKey);
    const record = item ? this.plainToInstance(JSON.parse(item)) : undefined;
    record && result.set(record);
  }
  async update(record: R): Promise<void> {
    record.prepareToSave();
    localStorage.setItem(this.fullKeyFor(record.recordID), JSON.stringify(this.instanceToPlain(record)));
  }
  async delete(record: R): Promise<void> {
    localStorage.removeItem(this.fullKeyFor(record.recordID));
    this.recordIDs.delete(record.recordID);
    this.removeRecord(record);
  }
  async getAll(targetList: TableRecordList<R>, where?: TQueryOptions<R>): Promise<void> {
    const list: R[] = [];
    const result: Atom<R | undefined> = atom(undefined, { action: (r) => r && list.push(r) });
    this.recordIDs.map((recordID) => this.get(result, recordID));
    targetList.set(list);
  }
  getAllRecords(where?: TQueryOptions<R>): TableRecordList<R> {
    const list = this.createRecordList();
    this.getAll(list, where);
    return list;
  }
} 
