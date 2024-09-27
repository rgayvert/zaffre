
//
//
//

export type Formatter<S> = (value: S) => string;

export type Parser<S> = (value: string) => S | undefined;

export const DefaultStringFormatter = (value: string) => value;

export interface NumericFormat {
  fixed?: number;
  precision?: number;
  exponential?: number;
  round?: "round" | "floor" | "ceiling";
  intl?: Intl.NumberFormat;
}
export function NumericFormatter(format: NumericFormat): Formatter<number> {
  function formatNumber(value: number): string {
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
  }
  return (value: number) => formatNumber(value);
}
export const DefaultNumericFormatter = (value: number) => value.toString();

export function BooleanFormatter(format: string): Formatter<boolean> {
  return (value: boolean) => format.split("/")[value ? 1 : 0];
}

export const DefaultBooleanFormatter = BooleanFormatter("y/n");

export const DefaultDateFormatter = (date: Date) => date.toISOString();