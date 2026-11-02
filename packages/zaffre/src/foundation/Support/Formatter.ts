import { nullish } from "./Types";

//
// Basic formatting functions
//

export type LabelFn<S> = (item: S | nullish, index?: number) => string;

export type Formatter<S> = (value: S | nullish) => string;

export type Parser<S> = (value?: string) => S | null;

export const DefaultStringFormatter = (value: string) => value;

export const defaultLabelFn = <T>(item: T) => `${item}`;

export interface NumericFormat {
  fixed?: number;
  precision?: number;
  exponential?: number;
  round?: "round" | "floor" | "ceiling";
  intl?: Intl.NumberFormat;
}
export const NumericFormatter = (format: NumericFormat): Formatter<number> => {
  const formatNumber = (value: number): string => {
    if (format.fixed) {
      return value.toFixed(format.fixed);
    } else if (format.precision) {
      return value.toPrecision(format.precision);
    } else if (format.exponential) {
      return value.toExponential(format.exponential);
    } else if (format.round === "round") {
      return Math.round(value).toString();
    } else if (format.round === "floor") {
      return Math.floor(value).toString();
    } else if (format.round === "ceiling") {
      return Math.ceil(value).toString();
    } else if (format.intl) {
      return format.intl.format(value);
    } else {
      return value.toString();
    }
  };
  return (value: number | nullish) => (typeof value === "number" && !isNaN(value) ? formatNumber(value) : "");
};
export const DefaultNumericFormatter = (value: number) => value.toString();

export const BooleanFormatter = (format: string): Formatter<boolean> => {
  return (value: boolean | nullish) => (value ? format.split("/")[value ? 1 : 0] : "");
};

export const DefaultBooleanFormatter = BooleanFormatter("y/n");

export const DefaultDateFormatter = (date: Date) => date.toISOString();
