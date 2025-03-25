import { numericColumn, simpleTableModel, stringColumn, TableColumnList } from "zaffre";
import { NumericFormatter, TableColumns, TableModel } from "zaffre";

interface DummyRecord {
  name: string;
  age: number;
  city: string;
  state: string;
}
export class ExampleTableModel2 {
  columns = [
    stringColumn({
      title: "Name",
      value: (r) => r.name,
    }),
    numericColumn({
      title: "Age",
      value: (r) => r.age,
      formatter: NumericFormatter({ round: "round" }),
    }),
    stringColumn({
      title: "Location",
      value: (r) => [r.city, r.state].join(",")
    }),
  ] as TableColumnList<DummyRecord>;

  rows: DummyRecord[] = [
    { name: "Joe", age: 23, city: "Toledo", state: "OH" },
    { name: "Sue", age: 41.6, city: "Reno", state: "NV" },
    { name: "Mary", age: 25, city: "Omaha", state: "NE" },
  ];
  tableModel2: TableModel<DummyRecord>;

  constructor() {
    this.tableModel2 = simpleTableModel(this.rows, this.columns);
  }
}
