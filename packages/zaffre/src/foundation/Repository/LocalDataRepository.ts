import { arrayAtom, ArrayAtom, atom, Atom } from "../Atom";
import { lazyinit } from "../Support";
import { Repository } from "./Repository";
import { TEntity, TEntityID, TEntityList } from "./TEntity";

export class LocalDataRepository<T extends TEntity> extends Repository<T> {
  constructor(public tableName: string, public newRecordFn: (data?: Partial<T>) => T, cachePolicy = "none") {
    super(newRecordFn, cachePolicy);
  }

  async create(record: T) {
    record.prepareToSave();
    record.id = this.nextID();
    this.ids.push(record.id);
    this.update(record);
    this.addToCache(record);
    return record.id;
  }
  async get(result: Atom<T | undefined>, id: TEntityID) {
    const recordKey = `${this.tableName}-${id}`;
    const item = localStorage.getItem(recordKey);
    const record = item ? this.newRecord(JSON.parse(item)) : null;
    if (record) {
      result.set(record);
      this.addToCache(record);
    }
    return record;
  }
  async update(record: T) {
    record.prepareToSave();
    localStorage.setItem(this.fullKeyFor(record.id), JSON.stringify(<typeof record>record));
    return record.id;
  }

  async delete(record: T) {
    const recID = record.id;
    localStorage.removeItem(this.fullKeyFor(recID));
    this.ids.delete(recID);
    this.removeFromCache(record);
    return true;
  }
  async getAll(recordList: TEntityList<T>) {
    const list: T[] = [];
    const result: Atom<T | undefined> = atom(undefined, { action: (r) => r && list.push(r) });
    // go through the list of record ids and add each record (synchronously)
    this.ids.map((id) => this.get(result, id));
    recordList.set(list);
    return recordList;
  }

  /////////////////////////////////////////////////////////////////////

  // records ids are maintained in memory, and saved on any change
  @lazyinit get ids(): ArrayAtom<TEntityID> {
    return arrayAtom(JSON.parse(localStorage.getItem(this.tableName) || "[]") as TEntityID[], {
      action: () => this.saveIDs(),
    });
  }
  saveIDs(): void {
    localStorage.setItem(this.tableName, JSON.stringify(this.ids.get()));
  }
  nextID(): TEntityID {
    return (this.ids.max((r) => parseInt((r || 0).toString())) + 1).toString();
  }
  // numericID(id: TEntityID): number {
  //   return typeof id === "string" ? parseInt(id) : id === null ? 0 : id;
  // }
  fullKeyFor(id: TEntityID): string {
    //const recID = this.numericID(id);
    return `${this.tableName}-${id}`;
  }
}
