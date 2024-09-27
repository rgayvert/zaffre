import { Atom } from "../Atom";
import { ExHandler } from "../Support";
import { ClassConstructor, TQueryOptions, TableRecord, TableRecordList, TableStore } from "./TableStore";

//
// A FetchTableStore is a TableStore that uses the Fetch API to perform CRUD operations.
//
// Note that this should work in parallel with a server API that implements the
// corresponding calls on the actual database. See apps/todo-server for an example.
// 

export class FetchTableStore<R extends TableRecord> extends TableStore<R> {
  constructor(public baseURL: string, cls: ClassConstructor<R>, public ex?: ExHandler) {
    super(cls, ex);
  }
  toString(): string {
    return `FetchTableStore[${this.baseURL}]`;
  }

  async create(record: R): Promise<void> {
    record.prepareToSave();
    const { recordID, ...rest } = this.instanceToPlain(record);
    const options: RequestInit = {
      method: "POST",
      body: JSON.stringify(rest),
      headers: { "Content-Type": "application/json" },
    };
    try {
      const response = await fetch(this.baseURL, options);
      if (response.ok) {
        const json = await response.json();
        record.recordID = json.recordID;
      } else {
        this.ex?.push(`${this.toString()}/create: ${response.status}`);
      }
    } catch (e) {
      this.ex?.push(`${this.toString()}/create: fetch failed`, e);
    }
  }
  async get(result: Atom<R | undefined>, recordID: number): Promise<void> {
    const options: RequestInit = {
      method: "GET",
    };
    const url = `${this.baseURL}/${recordID}`;
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        const json = await response.json();
        const record = this.plainToInstance(json);
        record && result.set(record);
      } else {
        this.ex?.push(`${this.toString()}/get: ${response.status}`);
      }
    } catch (e) {
      this.ex?.push(`${this.toString()}/get: fetch failed`, e);
    }
  }

  async getAll(targetList: TableRecordList<R>, where?: TQueryOptions<R>, restoreFn?: (records: R[]) => void): Promise<void> {
    const options: RequestInit = {
      method: "POST",
      body: JSON.stringify(where),
      headers: { "Content-Type": "application/json" },
    };
    try {
      const response = await fetch(`${this.baseURL}/all`, options);
      if (response.ok) {
        const json = (await response.json()) as [];
        const records = json.map((val) => this.plainToInstance(val));
        if (restoreFn) {
          restoreFn?.(records);
        } else {
          records.forEach((record) => record.restore());
        }
        targetList.set(records);
      } else {
        this.ex?.push(`${this.toString()}/getAll: ${response.status}`);
      }
    } catch (e) {
      this.ex?.push(`${this.toString()}/getAll: fetch failed`, e);
    }
  }

  async update(record: R): Promise<void> {
    record.prepareToSave();
    const options: RequestInit = {
      method: "PUT",
      body: JSON.stringify(this.instanceToPlain(record)),
      headers: { "Content-Type": "application/json" },
    };
    const url = `${this.baseURL}/${record.recordID}`;
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        this.ex?.push(`${this.toString()}/update: ${response.status}`);
      }
    } catch (e) {
      this.ex?.push(`${this.toString()}/update: fetch failed`, e);
    }
  }

  async delete(record: R): Promise<void> {
    const options: RequestInit = {
      method: "DELETE",
    };
    const url = `${this.baseURL}/${record.recordID}`;
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        this.removeRecord(record);
      } else {
        this.ex?.push(`${this.toString()}/getAll: ${response.status}`);
      }
    } catch (e) {
      this.ex?.push(`${this.toString()}/getAll: fetch failed`, e);
    }
  }
}
