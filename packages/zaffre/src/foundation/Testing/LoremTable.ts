import { arrayAtom } from "../Atom";
import { DateTimeFormatter } from "../Services";
import { BooleanFormatter, NumericFormatter } from "../Support";
import { zutil } from "../Util";
import { booleanColumn, dateColumn, numericColumn, stringColumn, TableColumnList, TableModelOptions } from "../Data";
import { TableModel, TableColumn, TableColumns } from "../Data";
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
const loremColumnTypes = Array.from(loremColumns.keys());

type TRow = (string | number | boolean | Date | undefined)[];
type TC = TableColumn<TRow, unknown>;

const dollars = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

function makeColumn(index: number, title: string, type: string): TC {
  switch (type) {
    case "number":
      return numericColumn({
        title: title,
        value: (row) => <number>row[index],
        formatter: NumericFormatter({ fixed: 2 }),
        subtype: "number",
      }) as TC;
    case "currency":
      return numericColumn({
        title: title,
        value: (row) => <number>row[index],
        formatter: NumericFormatter({ intl: dollars }),
        subtype: "currency",
      }) as TC;
    case "integer":
      return numericColumn({
        title: title,
        value: (row) => <number>row[index],
        formatter: NumericFormatter({ round: "round" }),
        subtype: "integer",
      }) as TC;
    case "boolean":
      return booleanColumn({
        title: title,
        value: (row) => <boolean>row[index],
        formatter: BooleanFormatter("yes/no"),
        subtype: "boolean",
      }) as TC;
    case "datetime":
      return dateColumn({
        title: title,
        value: (row) => <Date>row[index],
        formatter: DateTimeFormatter("DD-MM-YYYY HH:mm"),
        subtype: "datetime",
      }) as TC;
    case "time":
      return dateColumn({
        title: title,
        value: (row) => <Date>row[index],
        formatter: DateTimeFormatter("HH:mm"),
        subtype: "time",
      }) as TC;
    case "date":
      return dateColumn({
        title: title,
        value: (row) => <Date>row[index],
        formatter: DateTimeFormatter("DD-MM-YYYY"),
        subtype: "date",
      }) as TC;
    default:
      return stringColumn({ title: title, value: (row) => <string>row[index] }) as TC;
  }
}

export const loremTable = {
  tableColumns: (ncolumns: number): TableColumn<TRow, unknown>[] => {
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
        const t = lorem.time();
        return t;
        //return lorem.time();
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
    const rows = zutil.sequence(0, nrows).map((_index) => loremTable.tableRow(columns));
    return new TableModel(arrayAtom(rows), columns, options);
  },
};
