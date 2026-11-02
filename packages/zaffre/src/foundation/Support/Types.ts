export type PartialWithRequired<T, K extends keyof T> = Partial<T> & Required<Pick<T, K>>;

export type nullish = null | undefined;

export const isNullish = (val: any) => val === null || val === undefined;

export type Nullable<T> = T | null | undefined;

export const removeNullish = (obj: any) =>
  Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== null && value !== "" && value !== undefined));
