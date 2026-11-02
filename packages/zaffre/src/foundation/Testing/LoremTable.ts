import { arrayAtom } from "../Atom";
import { NumericFormatter } from "../Support";
import { zutil } from "../Util";
import { booleanColumn, currencyColumn, dateColumn, datetimeColumn, TableColumnBuilder } from "../Data";
import { integerColumn, numberColumn, stringColumn } from "../Data";
import { TableColumnList, TableModelOptions, timeColumn } from "../Data";
import { TableModel, TableColumn } from "../Data";
import { lorem } from "./Lorem";

//
// Generate a random TableModel with a specified number of rows and columns. The column
// names and types are chosen from a map of common attribute names with simple types. These are
// then used to create string, numeric, date, and boolean columns with a few different flavors.
//

const loremColumns = new Map([
  ["string", ["name", "address", "city", "type", "model", "title", "label"]],
  ["number", ["size", "length", "height"]],
  ["integer", ["count", "amount", "quantity"]],
  ["currency", ["cost", "price", "balance"]],
  ["boolean", ["active", "enabled"]],
  ["datetime", ["timestamp"]],
  ["time", ["endTime", "startTime"]],
  ["date", ["endDate", "startDate", "expDate"]],
]);
const loremColumnTypes = ["string", "number", "integer", "currency", "boolean", "datetime", "time", "date"] as const;
type LoremColumnType = (typeof loremColumnTypes)[number];

type TRow = (string | number | boolean | Date | undefined)[];
type TC = TableColumnBuilder<TRow, unknown>;

const makeColumn = (index: number, title: string, type: LoremColumnType): TC => {
  switch (type) {
    case "number":
      return numberColumn<TRow>(title, (row) => <number>row[index]).formatter(NumericFormatter({ fixed: 2 })) as TC;
    case "currency":
      return currencyColumn<TRow>(title, (row) => <number>row[index]) as TC;
    case "integer":
      return integerColumn<TRow>(title, (row) => <number>row[index]) as TC;
    case "boolean":
      return booleanColumn<TRow>(title, (row) => <boolean>row[index]) as TC;
    case "datetime":
      return datetimeColumn<TRow>(title, (row) => <Date>row[index]) as TC;
    case "time":
      return timeColumn<TRow>(title, (row) => <Date>row[index]) as TC;
    case "date":
      return dateColumn<TRow>(title, (row) => <Date>row[index]) as TC;
    default:
      return stringColumn<TRow>(title, (row) => <string>row[index]) as TC;
  }
};

export const loremTable = {
  tableColumns: (ncolumns: number): TableColumnBuilder<TRow, unknown>[] => {
    const colTitles = zutil.randomSubset(Array.from(loremColumns.values()).flat(), ncolumns);
    return colTitles.map((title, index) => {
      const type = loremColumnTypes.find((t) => loremColumns.get(t)!.includes(title))!;
      return makeColumn(index, zutil.camelCaseToWords(title), type);
    });
  },
  tableRow: (columns: TableColumnList<TRow>): TRow => {
    return zutil.sequence(0, columns.length).map((i) => {
      const type = columns.at(i)?.subtype;
      if (type === "boolean") {
        return zutil.randomInt(0, 1) === 1;
      } else if (type === "time") {
        return lorem.time();
      } else if (type === "date" || type === "datetime") {
        return lorem.date();
      } else if (type === "number" || type === "integer" || type === "currency") {
        const val = Math.random() * 1000;
        return type === "integer" ? Math.round(val) : type === "currency" ? zutil.roundTo(val, 2) : val;
      } else {
        return lorem.words(1);
      }
    });
  },
  tableModel: (nrows: number, ncolumns: number, options: TableModelOptions = {}): TableModel<TRow> => {
    const columns = loremTable.tableColumns(ncolumns);
    const cols = columns.map((c) => c.build());
    const rows = zutil.sequence(0, nrows).map((_index) => loremTable.tableRow(cols));
    return new TableModel(arrayAtom(rows), columns, options);
  },
};
