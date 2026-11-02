import { buttonColumn, integerColumn, simpleTableModel, stringColumn, TableModel } from "zaffre";

export interface DummyRecord {
  name: string;
  age: number;
  city: string;
  state: string;
}

export class ExampleTableModel2 {
  columns = [
    buttonColumn<DummyRecord>("icon.search", (r) => console.log(r)),
    stringColumn<DummyRecord>("Name", (r) => r.name),
    integerColumn<DummyRecord>("Age", (r) => r.age),
    stringColumn<DummyRecord>("Location", (r) => [r.city, r.state].join(","))
  ];

  rows: DummyRecord[] = [
    { name: "Joe", age: 23, city: "Toledo", state: "OH" },
    { name: "Sue", age: 41.6, city: "Reno", state: "NV" },
    { name: "Mary", age: 25, city: "Omaha", state: "NE" },
  ];
  tableModel2: TableModel<DummyRecord>;

  constructor() {
    this.tableModel2 = simpleTableModel(this.rows, this.columns, { 
      includeRowNumbers: true,
      includeRowSelectors: true
    });
  }
}
