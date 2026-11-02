import { safeEval } from "../Misc";

export type ResponseFn<T> = (response: Response) => Promise<T | null>;

export type FetchMethod = "GET" | "PUT" | "POST" | "DELETE" | "PATCH";

const evalResponseFn = async <T>(processResponse: ResponseFn<T>, response: Response) => {
  return await processResponse(response);
};

export const sendFetchRequest = async <T>(
  method: FetchMethod,
  url: string,
  processResponse: ResponseFn<T>,
  body?: any,
  credentials: RequestCredentials = "same-origin",
) => {
  const request: RequestInit = {
    method: method,
    credentials: credentials,
  };
  if (method === "POST" || method === "PUT" || method === "PATCH") {
    request.body = body;
    if (!(body instanceof FormData)) {
      // with FormData, browser will set the headers to 'multipart/form-data'
      request.headers = { "Content-Type": "application/json" };
    }
  }

  try {
    console.log(`send(${request.method}): ${url}`);
    const response = await fetch(url, request);
    if (response.ok) {
      return safeEval(() => evalResponseFn(processResponse, response));
    } else {
      return null;
    }
  } catch (e) {
    return null;
  }
};

export const sendGetRequest = async <T>(url: string, processResponse: ResponseFn<T>) => {
  return sendFetchRequest("GET", url, processResponse);
};
export const sendDeleteRequest = async <T>(url: string, processResponse: ResponseFn<T>) => {
  return sendFetchRequest("DELETE", url, processResponse);
};
export const sendPutRequest = async <T>(url: string, body: any, processResponse: ResponseFn<T>) => {
  return sendFetchRequest("PUT", url, processResponse, body);
};
export const sendPostRequest = async <T>(url: string, body: any, processResponse: ResponseFn<T>) => {
  return sendFetchRequest("POST", url, processResponse, body);
};
export const sendPatchRequest = async <T>(url: string, body: any, processResponse: ResponseFn<T>) => {
  return sendFetchRequest("PATCH", url, processResponse, body);
};
