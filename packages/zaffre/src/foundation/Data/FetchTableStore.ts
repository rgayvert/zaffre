import { Atom, responseAtom, ResponseAtom, ResponseStatus } from "../Atom";
import { zlog } from "../Util";
import { ClassConstructor, TQueryOptions, TableRecord } from "./TableStore";
import { TableRecordList, TableStore, TableStoreOptions } from "./TableStore";

//
// A FetchTableStore is a TableStore that uses the Fetch API to perform CRUD operations.
//
// Note that this should work in parallel with a server API that implements the
// corresponding calls on the actual database. See apps/todo-server for an example.
//

export class FetchTableStore<R extends TableRecord> extends TableStore<R> {
  constructor(
    public baseURL: string,
    cls: ClassConstructor<R>,
    public options: TableStoreOptions = {}
  ) {
    super(cls, options);
  }
  toString(): string {
    return `FetchTableStore[${this.baseURL}]`;
  }

  logBadStatus(response: ResponseAtom, status: ResponseStatus, msg: string): void {
    zlog.info(msg);
    this.options.ex?.push(msg);
    response.errorMessage = msg;
    response.set(status);
  }

  create(record: R): ResponseAtom {
    const response = responseAtom();
    this.createWithResponse(response, record);
    return response;
  }

  async createWithResponse(response: ResponseAtom, record: R): Promise<void> {
    const { recordID, ...rest } = this.instanceToPlain(record);
    const options: RequestInit = {
      method: "POST",
      body: JSON.stringify(rest),
      headers: { "Content-Type": "application/json" },
    };
    try {
      const result = await fetch(this.baseURL, options);
      if (result.ok) {
        const json = await result.json();
        record.recordID = json.recordID;
        record._persisted.set(true);
        record.afterCreate();
        response.set("ok");
      } else {
        this.logBadStatus(response, "failed", `${this.toString()}/create: ${result.status}`);
      }
    } catch (e) {
      this.logBadStatus(response, "failed", `${this.toString()}/create: fetch failed`);
    }
  }

  get(record: Atom<R | undefined>, recordID: number, restoreFn?: (record: R) => void): ResponseAtom {
    const response = responseAtom();
    this.getWithResponse(response, record, recordID, restoreFn);
    return response;
  }

  async getWithResponse(
    response: ResponseAtom,
    record: Atom<R | undefined>,
    recordID: number,
    restoreFn?: (record: R) => void
  ): Promise<void> {
    const options: RequestInit = {
      method: "GET",
    };
    const url = `${this.baseURL}/${recordID}`;
    try {
      const result = await fetch(url, options);
      if (result.ok) {
        const json = await result.json();
        const newRecord = this.plainToInstance(json);
        if (newRecord) {
          const existingRecord = this.findCachedRecord(recordID);
          if (existingRecord) {
            record.set(existingRecord);
          } else {
            restoreFn?.(newRecord);
            record.set(newRecord);
          }
          response.set("ok");
        } else {
          this.logBadStatus(response, "missing", `${this.toString()}/get: ${result.status}`);
        }
      } else {
        this.logBadStatus(response, "failed", `${this.toString()}/get: ${result.status}`);
      }
    } catch (e) {
      this.logBadStatus(response, "failed", `${this.toString()}/get: fetch failed`);
    }
  }

  getAll(targetList: TableRecordList<R>, where?: TQueryOptions<R>, restoreFn?: (record: R) => void): ResponseAtom {
    const response = responseAtom();
    this.getAllWithResponse(response, targetList, where, restoreFn);
    return response;
  }

  async getAllWithResponse(
    response: ResponseAtom,
    targetList: TableRecordList<R>,
    where?: TQueryOptions<R>,
    restoreFn?: (record: R) => void
  ): Promise<void> {
    const options: RequestInit = {
      method: "POST",
      body: JSON.stringify(where),
      headers: { "Content-Type": "application/json" },
    };
    try {
      const result = await fetch(`${this.baseURL}/all`, options);
      if (result.ok) {
        const json = (await result.json()) as [];
        const newRecords = json.map((val) => this.plainToInstance(val));
        const finalRecords = newRecords.map((record) => {
          const existingRecord = this.findCachedRecord(record.recordID);
          if (existingRecord) {
            return existingRecord;
          } else {
            restoreFn?.(record);
            return record;
          }
        });
        targetList.set(finalRecords);
        response.set("ok");
      } else {
        this.logBadStatus(response, "failed", `${this.toString()}/getAll: ${result.status}`);
      }
    } catch (e) {
      this.logBadStatus(response, "failed", `${this.toString()}/getAll: fetch failed`);
    }
  }

  update(record: R): ResponseAtom {
    const response = responseAtom();
    this.updateWithResponse(response, record);
    return response;
  }

  async updateWithResponse(response: ResponseAtom, record: R): Promise<void> {
    record.prepareToSave();
    const options: RequestInit = {
      method: "PUT",
      body: JSON.stringify(this.instanceToPlain(record)),
      headers: { "Content-Type": "application/json" },
    };
    const url = `${this.baseURL}/${record.recordID}`;
    try {
      const result = await fetch(url, options);
      if (!result.ok) {
        this.logBadStatus(response, "failed", `${this.toString()}/update: ${result.status}`);
      } else {
        response.set("ok");
      }
    } catch (e) {
      this.logBadStatus(response, "failed", `${this.toString()}/update: fetch failed`);
    }
  }

  delete(record: R): ResponseAtom {
    const response = responseAtom();
    this.deleteWithResponse(response, record);
    return response;
  }

  async deleteWithResponse(response: ResponseAtom, record: R): Promise<void> {
    const options: RequestInit = {
      method: "DELETE",
    };
    const url = `${this.baseURL}/${record.recordID}`;
    try {
      const result = await fetch(url, options);
      if (result.ok) {
        this.removeRecord(record);
        response.set("ok");
      } else {
        this.logBadStatus(response, "failed", `${this.toString()}/delete: ${result.status}`);
      }
    } catch (e) {
      this.logBadStatus(response, "failed", `${this.toString()}/delete: fetch failed`);
    }
  }
}
