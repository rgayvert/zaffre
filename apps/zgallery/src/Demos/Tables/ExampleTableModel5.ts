import { simpleTableModel, stringColumn, SimpleTableModel, TableColumns } from "zaffre";

export class ExampleTableModel5 {
  tableModel5: SimpleTableModel<string[]>;
  constructor() {
    this.tableModel5 = this.tableModel();
  }

  tableModel(): SimpleTableModel<string[]> {
    const rows = [
      ["AA", "BB", "CC"],
      ["DD", "EE", "FF"],
      ["GG", "HH", "II"],
    ];
    const columns = [
      stringColumn({ title: "Col1", value: (r) => r[0], setter: (r, v) => (r[0] = v) }),
      stringColumn({ title: "Col2", value: (r) => r[1], setter: (r, v) => (r[1] = v) }),
      stringColumn({ title: "Col3", value: (r) => r[2], setter: (r, v) => (r[2] = v) }),
    ] as TableColumns<string[]>;

    return simpleTableModel(rows, columns);
  }
}
