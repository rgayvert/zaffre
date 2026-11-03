import { ArrayAtom, Atom, PickList, ZArray } from "../Atom";
import { Size2D } from "../Geometry";
import { DateTimeFormatter } from "../Plugins";
import { BooleanFormatter, Formatter, NumericFormatter } from "../Support";
import { Builder, IBuilder } from "../Util";

//
// A TableColumn represents a value that is calculated from a record and displayed in a column
// of a table. The value may be the value of a single property of the record, or some value
// calculated as a function of several properties. The calculated value is then passed through a
// formatter for display in a cell view.
//
// R is the record type, T is the value type
//
// Notes:
//  - not all columns are sortable or settable
//  -
//

// TODO: this needs to go somewhere lower than Components/Content
type InputType =
  | "button"
  | "checkbox"
  | "color"
  | "date"
  | "datetime-local"
  | "email"
  | "file"
  | "hidden"
  | "image"
  | "month"
  | "number"
  | "password"
  | "radio"
  | "range"
  | "reset"
  | "search"
  | "submit"
  | "tel"
  | "text"
  | "time"
  | "url"
  | "week";

export type TableValueFn<R, T> = (row: R) => T;
export type TableValueSetter<R, T> = (row: R, val: T) => void;
export type TableValueCompareFn<T> = (val1: T, val2: T) => number;
export type TableColumnAlignment = "left" | "right" | "center";
export type ColumnSortDirection = "asc" | "desc" | "none";

export type TableColumnList<R extends {}> = TableColumn<R, any>[];
export type TableColumns<R extends {}> = ArrayAtom<TableColumn<R, any>>;

export type TableColumnType =
  | "string"
  | "number"
  | "date"
  | "boolean"
  | "image"
  | "button"
  | "menu"
  | "input" 
  | "select"
  | "checkbox";

export interface ITableColumn<R extends {}, T> {
  type: TableColumnType;
  valueFn: TableValueFn<R, T>;
  title: string;
  columnName: string;
  formatter: Formatter<T>;
  sortDirection?: ColumnSortDirection;
  setter?: TableValueSetter<R, T>;
  inputType?: InputType;
  subtype?: string;
  minWidth?: number;
  width?: number;
  size?: Size2D;
  alignment?: TableColumnAlignment;
  compareFn?: TableValueCompareFn<T>;
  action?: TableValueFn<R, void>;
  icon?: string;
  pickListFn?: (r: R) => PickList<T>;
  hidden?: Atom<boolean>;
  cls?: string;
  value?: Atom<T>;
}

export interface TableColumn<R extends {}, T> extends ITableColumn<R, T> {}

export class TableColumn<R extends {}, T> implements ITableColumn<R, T> {
  constructor() {
    this.formatter ??= (val) => `${val}`;
    this.type ??= "string";
    this.title ??= this.columnName;
  }
  getValue(r: R): T {
    return this.valueFn(r);
  }
  toggleSortDirection(): void {
    this.sortDirection = this.sortDirection === "desc" ? "asc" : "desc";
  }
}

export type TableColumnBuilder<R extends {}, T> = IBuilder<TableColumn<R, T>>;

export type AnyTableColumnBuilder<R extends {}> = IBuilder<TableColumn<R, any>>;

export type TableColumnBuilderList<R extends {}> = ZArray<TableColumnBuilder<R, any>>;

//////////////////////////

const dollars = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
const booleanFormatter = BooleanFormatter("yes/no");
const dateFormatter = DateTimeFormatter("DD-MM-YYYY");
const dateTimeFormatter = DateTimeFormatter("DD-MM-YYYY HH:mm");
const timeFormatter = DateTimeFormatter("HH:mm");

const stringCompare = (val1: string, val2: string): number => {
  return val1.localeCompare(val2);
};
const numberCompare = (val1: number, val2: number): number => {
  return val1 - val2;
};
const booleanCompare = (val1: boolean, val2: boolean): number => {
  return val1 === val2 ? 0 : 1;
};
const dateCompare = (val1: Date, val2: Date): number => {
  return val1.getTime() - val2.getTime();
};

//////////////////////////

export const stringColumn = <R extends {}>(
  title: string,
  valueFn: TableValueFn<R, string>,
): TableColumnBuilder<R, string> => {
  return Builder(TableColumn<R, string>)
    .title(title)
    .valueFn(valueFn)
    .formatter((s) => s || "")
    .alignment("left")
    .compareFn((a, b) => stringCompare(a, b));
};

export const numberColumn = <R extends {}>(
  title: string,
  valueFn: TableValueFn<R, number>,
  subtype = "number",
): TableColumnBuilder<R, number> => {
  return Builder(TableColumn<R, number>)
    .title(title)
    .valueFn(valueFn)
    .subtype(subtype)
    .formatter((num) => (num ? num.toString() : ""))
    .alignment("right")
    .compareFn((a, b) => numberCompare(a, b));
};

export const integerColumn = <R extends {}>(
  title: string,
  valueFn: TableValueFn<R, number>,
): TableColumnBuilder<R, number> => {
  return numberColumn(title, valueFn, "integer").formatter(NumericFormatter({ round: "round" }));
};

export const currencyColumn = <R extends {}>(
  title: string,
  valueFn: TableValueFn<R, number>,
): TableColumnBuilder<R, number> => {
  return numberColumn(title, valueFn, "currency").formatter(NumericFormatter({ intl: dollars }));
};

export const booleanColumn = <R extends {}>(
  title: string,
  valueFn: TableValueFn<R, boolean>,
): TableColumnBuilder<R, boolean> => {
  return Builder(TableColumn<R, boolean>)
    .title(title)
    .valueFn(valueFn)
    .formatter((b) => booleanFormatter(b))
    .alignment("center")
    .compareFn((a, b) => booleanCompare(a, b));
};

export const dateColumn = <R extends {}>(
  title: string,
  valueFn: TableValueFn<R, Date>,
  subtype = "date",
): TableColumnBuilder<R, Date> => {
  return Builder(TableColumn<R, Date>)
    .title(title)
    .valueFn(valueFn)
    .subtype(subtype)
    .formatter((dt) => dateFormatter(dt))
    .alignment("center")
    .compareFn((a, b) => dateCompare(a, b));
};

export const datetimeColumn = <R extends {}>(
  title: string,
  valueFn: TableValueFn<R, Date>,
): TableColumnBuilder<R, Date> => {
  return dateColumn(title, valueFn, "datetime").formatter(dateTimeFormatter);
};

export const timeColumn = <R extends {}>(
  title: string,
  valueFn: TableValueFn<R, Date>,
): TableColumnBuilder<R, Date> => {
  return dateColumn(title, valueFn, "time").formatter(timeFormatter);
};

export const imageColumn = <R extends {}>(
  title: string,
  valueFn: TableValueFn<R, string>,
): TableColumnBuilder<R, string> => {
  return Builder(TableColumn<R, string>)
    .title(title)
    .valueFn(valueFn)
    .type("image")
    .formatter((s) => s || "")
    .alignment("center")
    .compareFn((a, b) => stringCompare(a, b));
};

const noop = <R extends {}>(r: R) => {};

export const buttonColumn = <R extends {}>(
  iconURI: string,
  action: TableValueFn<R, void>,
): TableColumnBuilder<R, void> => {
  return Builder(TableColumn<R, void>)
    .icon(iconURI)
    .action(action)
    .type("button")
    .valueFn(noop<R>);
};

export const menuColumn = <R extends {}>(
  iconURI: string,
  pickListFn: (r: R) => PickList<string>,
): TableColumnBuilder<R, string> => {
  return Builder(TableColumn<R, string>)
    .icon(iconURI)
    .pickListFn(pickListFn)
    .type("menu")
    .valueFn((r) => "");
};

export const inputColumn = <R extends {}>(
  title: string,
  valueFn: TableValueFn<R, string>,
  setter: TableValueSetter<R, string>,
): TableColumnBuilder<R, string> => {
  return Builder(TableColumn<R, string>)
    .title(title)
    .valueFn(valueFn)
    .type("input")
    .setter(setter);
};

export const selectColumn = <R extends {}, T>(
  title: string,
  pickListFn: (r: R) => PickList<T>,
  valueFn: TableValueFn<R, T>,
): TableColumnBuilder<R, T> => {
  return Builder(TableColumn<R, T>)
    .title(title)
    .pickListFn(pickListFn)
    .type("select")
    .valueFn(valueFn);
};