import { ZArray } from "../Atom";
import { DefaultDateFormatter, DefaultStringFormatter, Formatter } from "../Support";

//
// A TableColumn represents a value that is calculated from a record and displayed in a column
// of a table. The value may be the value of a single property of the record, or some value 
// calculated as a function of several properties. The calculated value is then passed through a 
// formatter for display in a cell view.
//
// R is the record type, S is the value type
//

export type TableValueFn<R, S> = (row: R) => S;
export type TableValueSetter<R, S> = (row: R, s: S) => void;
export type TableValueCompareFn<S> = (val1: S, val2: S) => number;

export type TableColumnAlignment = "left" | "right" | "center";
export type ColumnSortDirection = "asc" | "desc";


export type PartialTableColumn<R, S> = {
  title: string; 
  value: TableValueFn<R, S>;
  formatter?: Formatter<S>;
  type?: string, 
  alignment?: TableColumnAlignment;
  sortDirection?: ColumnSortDirection
  compareFn?: TableValueCompareFn<S>;
  setter?: TableValueSetter<R, S>;
  subtype?: string;
}

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }

type extraColumnProperties = "type" | "formatter" | "alignment" | "sortDirection" | "compareFn";

export type TableColumn<R, S> = WithRequired<PartialTableColumn<R, S>, extraColumnProperties>;

export type TableColumns<R> = ZArray<TableColumn<R, unknown>>;

export interface TableColumnType<S> {
  type: string;
  defaultFormatter: Formatter<S>;
  defaultAlignment: TableColumnAlignment;
  defaultCompareFn: TableValueCompareFn<S>,
  defaultSortDirection: ColumnSortDirection,
}
const tableColumnTypeDefaults = new Map<string, TableColumnType<unknown>>();

export function defineTableColumnType<S>(columnType: TableColumnType<S>): void {
  tableColumnTypeDefaults.set(columnType.type, <TableColumnType<unknown>>columnType);
}
defineTableColumnType({
  type: "string",
  defaultFormatter: DefaultStringFormatter,
  defaultAlignment: "center",
  defaultCompareFn: (val1: string, val2: string) => val1.localeCompare(val2),
  defaultSortDirection: "asc",
});
defineTableColumnType({
  type: "number",
  defaultFormatter: (num) => num.toString(),
  defaultAlignment: "right",
  defaultCompareFn: (val1: number, val2: number) => val1 - val2,
  defaultSortDirection: "asc",
});
defineTableColumnType({
  type: "boolean",
  defaultFormatter: (b) => b ? "y" : "n",
  defaultAlignment: "center",
  defaultCompareFn: (val1: boolean, val2: boolean) => val1 === val2 ? 0 : 1,
  defaultSortDirection: "asc",
});
defineTableColumnType({
  type: "date",
  defaultFormatter: DefaultDateFormatter,
  defaultAlignment: "center",
  defaultCompareFn: (val1: Date, val2: Date) => val1.getTime() - val2.getTime(),
  defaultSortDirection: "asc",
});


export function tableColumn<R, S>(type: string, column: PartialTableColumn<R, S>): TableColumn<R, S> {
  const defaults = tableColumnTypeDefaults.get(type);
  if (!defaults) {
    throw Error(`unknown column type ${type}`);
  }
  return {
    ...column,
    type: type,
    formatter: column.formatter || defaults.defaultFormatter,
    alignment: column.alignment || defaults.defaultAlignment,
    compareFn: column.compareFn || defaults.defaultCompareFn,
    sortDirection: column.sortDirection || defaults.defaultSortDirection,
  };
}

export function stringColumn<R>(column: PartialTableColumn<R, string>): TableColumn<R, string> {
  return tableColumn("string", column);
}
export function numericColumn<R>(column: PartialTableColumn<R, number>): TableColumn<R, number> {
  return tableColumn("number", column);
}
export function dateColumn<R>(column: PartialTableColumn<R, Date>): TableColumn<R, Date> {
  return tableColumn("date", column);
}
export function booleanColumn<R>(column: PartialTableColumn<R, boolean>): TableColumn<R, boolean> {
  return tableColumn("boolean", column);
}

