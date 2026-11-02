import { arrayAtom, ArrayAtomOptions, Atom} from "../Atom";
import { Pagination, PaginatedArrayAtom, PaginationQuery } from "../Misc";


import { TEntity, TEntityID, TEntityList, TEntityListOptions } from "./TEntity";

export abstract class Repository<T extends TEntity> {
  constructor(  public newRecordFn: (data?: Partial<T>) => T,
    public cachePolicy = "recent",) {}

  abstract create(record: T): Promise<TEntityID | null>;
  abstract get(result: Atom<T | undefined>, id: TEntityID): Promise<T | null>;
  abstract update(record: T): Promise<TEntityID | null>;
  abstract delete(record: T): Promise<boolean | null>;
  abstract getAll(recordList: TEntityList<T>): Promise<TEntityList<T> | null>;

  // hook to allow repository to modify new records (esp. related fields)
  afterNewRecord(record: T): void {}


  // hook to allow repository to insert fields created on the server (e.g., created_at, uid)
  afterCreate(record: T, json: any): void {}

  newRecord(data?: Partial<T>): T {
    const record = this.newRecordFn(data);
    record.validate();
    this.addToCache(record);
    this.afterNewRecord(record);
    return record;
  }
  async save(record: T): Promise<TEntityID | null> {
    record.prepareToSave();
    if (record.isPersisted()) {
      await this.update(record);
    } else {
      await this.create(record);
      this.addToCache(record);
    }
    return record.id;
  }
  async saveIfPersisted(record: T): Promise<TEntityID | null> {
    return record.isPersisted() ? this.update(record) : null;
  }

  allRecords?: TEntityList<T>;

  lists = arrayAtom<TEntityList<T>>([]);
  cache: Map<TEntityID, T> = new Map([]);

  get useCache(): boolean {
    return this.cachePolicy === "some" || this.cachePolicy === "all";
  }
  createList(options: TEntityListOptions<T> = {}): TEntityList<T> {
    const list = <TEntityList<T>>new PaginatedArrayAtom(options);
    return list;
  }

  addToCache(record: T): void {
    if (this.useCache && record.id && !this.cache.get(record.id)) {
      this.cache.set(record.id, record);
      if (this.allRecords && !this.allRecords.includes(record)) {
        this.allRecords.push(record);
      }
    }
  }
  removeFromCache(record: T): void {
    this.cache.delete(record.id);
    this.lists.forEach((list) => list.delete(record));
    if (this.allRecords) {
      this.allRecords.delete(record);
    }
  }

  getAllRecords(): TEntityList<T> {
    if (!this.allRecords) {
      this.allRecords = this.createList();
      this.getAll(this.allRecords);
    }
    return this.allRecords;
  }

  removeListFromCache(list: TEntityList<T>): void {
    list.forEach((record) => this.removeFromCache(record));
    this.lists.delete(list);
  }
  recordWithID(id: TEntityID, data?: Partial<T>): T {
    const record = this.findInCache(id);
    if (record) {
      // merge the incoming data with the cached record
      const rr = record as any;
      if (data) {
        // only set values where the record value is nullish
        Object.entries(data).forEach(([k,v]) => {
          if (!rr[k] && v) {
            rr[k] = v
          }
        });
      }
      return record;
    } else {
      return this.newRecord(data);
    }
  }
  // async findRecordWithID(record: Atom<T | undefined>, id: TEntityID): Promise<T | null> {
  //   const existing = this.findInCache(id);
  //   if (existing) {
  //     record.set(existing);
  //     return existing;
  //   } else {
  //     return this.get(record, id);
  //   }
  // }
  // check the cache and lists for an existing record with the given id
  findInCache(id: TEntityID): T | undefined {
    return this.cache.get(id);
  }

  createPaginatedList(
    pagination: Pagination,
    pageFn: PaginationQuery<T>,
    options: ArrayAtomOptions<T> = {}
  ): TEntityList<T> {
    return this.createList({ ...options, pagination, pageFn });
  }

  createListWithArray(records: T[], options: TEntityListOptions<T> = {}): TEntityList<T> {
    return this.createList(options).set(records) as TEntityList<T>;
  }


}
