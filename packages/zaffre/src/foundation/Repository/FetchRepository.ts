import { TEntity, TEntityID, TEntityList } from "./TEntity";
import { ArrayAtom, Atom } from "../Atom";
import { Pagination, safeEval } from "../Misc";
import { ResponseFn } from "./SendFetchRequest";
import { Repository } from "./Repository";

//export type ResponseFn<T> = (response: Response) => Promise<T | null>;
export const NoOpResponseFn = async (_response: Response) => null;

export type FetchData = {
  record: any;
  // + related data
};
export type FetchListData = {
  records: any[];
  totalCount?: number;
  cursor?: number;
};

export class FetchRepository<T extends TEntity> extends Repository<T> {
  constructor(
    public baseURL: string,
    public newRecordFn: (data?: Partial<T>) => T,
    public credentials: RequestCredentials = "same-origin",
    public cachePolicy = "some",
  ) {
    super(newRecordFn, cachePolicy);
  }

  afterCreate(_record: T, _json: any) {
    // hook for subclasses
  }

  async create(record: T) {
    // id is sent as a parameter, not in the body
    const { id, ...rest } = record.asPlain();
    const body = JSON.stringify(rest);
    return this.sendPostRequest(`${this.baseURL}`, body, async (response) => {
      const json = await response.json();
      record.id = json.id;
      this.afterCreate(record, json);
      record.validate();
      return record.id;
    });
  }

  extractRecordFromJSON(json: any): T | null {
    if (json) {
      const rec = this.recordWithID(json.id, json);
      this.addToCache(rec);
      return rec;
    } else {
      return null;
    }
  }

  async getOne(record: Atom<T | undefined>, url: string) {
    return this.sendGetRequest(url, async (response) => {
      if (response.ok) {
        const r = this.unpackOne(await response.json());
        r && record.set(r);
        return r;
      } else {
        return null;
      }
    });
  }
  unpackOne(json: any): T | null {
    return this.extractRecordFromJSON(json.record);
  }

  async get(record: Atom<T | undefined>, id: TEntityID) {
    return this.getOne(record, `${this.baseURL}/${this.mapEntityID(id)}`);
  }
  async getAll(recordList: TEntityList<T>) {
    return this.getList(recordList, `${this.baseURL}`);
  }

  async getListWithPost(recordList: TEntityList<T>, url: string, body: string) {
    return this.sendPostRequest(url, body, async (response) => {
      if (response.ok) {
        const json = (await response.json()) as FetchListData;
        recordList.setResult(this.unpackList(json), json.totalCount || 0, json.cursor || 0);
        return recordList;
      } else {
        return null;
      }
    });
  }

  async getList(recordList: TEntityList<T>, url: string) {
    return this.sendGetPageRequest(url, recordList.pagination, async (response) => {
      if (response.ok) {
        const json = (await response.json()) as FetchListData;
        recordList.setResult(this.unpackList(json), json.totalCount || 0, json.cursor || 0);
        return recordList;
      } else {
        return null;
      }
    });
  }

  async getAugmentedList(recordList: TEntityList<T>, url: string, unpack: (data: any) => T) {
    return this.sendGetRequest(url, async (response) => {
      if (response.ok) {
        const json = (await response.json()) as any[];
        const records = json.map((val) => unpack(val));
        recordList.setResult(records, records.length, 0);
        return recordList;
      } else {
        return null;
      }
    });
  }

  async getStringList(list: ArrayAtom<string>, url: string) {
    return this.sendGetRequest(url, async (response) => {
      if (response.ok) {
        const json = (await response.json()) as string[];
        list.set(json);
        return list;
      } else {
        return null;
      }
    });
  }

  unpackList(data: FetchListData): T[] {
    return data.records.map((val) => this.recordWithID(val.id, val));
  }

  mapEntityID(id: TEntityID): TEntityID {
    return id;
  }

  async update(record: T) {
    // id is sent as a parameter, not in the body
    const { id, ...values } = record.asPlain();
    const body = JSON.stringify(values);
    return this.sendPutRequest(`${this.baseURL}/${this.mapEntityID(record.id)}`, body, async (response) => (response.ok ? id : null));
  }

  async delete(record: T) {
    return this.sendDeleteRequest(`${this.baseURL}/${this.mapEntityID(record.id)}`, async (response) => {
      response.ok && this.removeFromCache(record);
      return response.ok;
    });
  }

  /////////////////////////////////////////////////////////////////////

  async evalResponseFn<T>(processResponse: ResponseFn<T>, response: Response) {
    return await processResponse(response);
  }

  async sendRequest<T>(url: string, request: RequestInit, processResponse: ResponseFn<T>) {
    try {
      console.log(`send(${request.method}): ${url}`);
      const response = await fetch(url, request);
      if (response.ok) {
        return safeEval(() => this.evalResponseFn(processResponse, response));
      } else {
        //this.logBadStatus(response, "failed", `failed: ${this.toString()}: ${response.status}`);
        return null;
      }
    } catch (e) {
      //this.logBadStatus(response, "failed", `${this.toString()}: fetch failed`);
      return null;
    }
  }


  async sendPatchRequest<T>(url: string, body: string, processResponse: ResponseFn<T>): Promise<T | null> {
    const request = this.addAuth({
      method: "PATCH",
      body: body,
      headers: { "Content-Type": "application/json" },
    });
    return this.sendRequest(url, request, processResponse);
  }

  async sendPutRequest<T>(url: string, body: string, processResponse: ResponseFn<T>): Promise<T | null> {
    const request = this.addAuth({
      method: "PUT",
      body: body,
      headers: { "Content-Type": "application/json" },
    });
    return this.sendRequest(url, request, processResponse);
  }

  async sendPostRequest<T>(url: string, body: any, processResponse: ResponseFn<T>): Promise<T | null> {
    const request = this.addAuth({
      method: "POST",
      body: body,
      headers: body instanceof FormData ? undefined : { "Content-Type": "application/json" },
    });
    return this.sendRequest(url, request, processResponse);
  }

  async sendDeleteRequest<T>(url: string, processResponse: ResponseFn<T>): Promise<T | null> {
    const request = this.addAuth({ method: "DELETE" });
    return this.sendRequest(url, request, processResponse);
  }

  async sendGetRequest<T>(url: string, processResponse: ResponseFn<T>): Promise<T | null> {
    const request = this.addAuth({ method: "GET" });
    return this.sendRequest(url, request, processResponse);
  }

  async sendGetPageRequest<T>(url: string, pagination: Pagination, processResponse: ResponseFn<T>): Promise<T | null> {
    const request = this.addAuth({ method: "GET" });
    return this.sendRequest(pagination.appendToURL(url), request, processResponse);
  }

  addAuth(request: RequestInit): RequestInit {
    request.credentials = this.credentials;
    return request;
  }
}
