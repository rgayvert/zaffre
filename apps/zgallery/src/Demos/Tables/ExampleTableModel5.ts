import { simpleTableModel, TableModel, stringColumn } from "zaffre";


export class ExampleTableModel5 {
  tableModel5: TableModel<string[]>;
  constructor() {
    this.tableModel5 = this.tableModel();
  }
  
  tableModel(): TableModel<string[]> {
    const rows = [
      ["AA", "BB", "CC"],
      ["DD", "EE", "FF"],
      ["GG", "HH", "II"],
    ];
    const columns = [
      stringColumn<string[]>("Col1", (r) => r[0]).setter((r, v) => (r[0] = v)),
      stringColumn<string[]>("Col2", (r) => r[1]).setter((r, v) => (r[1] = v)),
      stringColumn<string[]>("Col3", (r) => r[2]).setter((r, v) => (r[2] = v)),
    ];

    return simpleTableModel(rows, columns, { editable: true });
  }
}
