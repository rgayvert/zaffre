import { ArrayAtom, simpleTableModel, TableColumn, TableColumnList, TableModel, zutil } from "zaffre";
import { stringColumn, SimpleTableModel, TableColumns } from "zaffre";

export function tableModel(cols: string[]): SimpleTableModel<string[]> {
  const rows = zutil.sequence(0, 7).map((_row) => cols.map((_col) => ""));
  rows[1][0] = "23";
  rows[2][0] = "10";
  rows[1][1] = "14";
  rows[3][3] = "=A1+B1";
  rows[4][3] = "=A1-B1";
  rows[3][4] = "=A1*A2";
  rows[5][5] = "=A1";
  const columns = cols.map((col, index) =>
    stringColumn({
      title: col,
      value: (r) => r[index],
      setter: (r, v) => (r[index] = v),
    })) as TableColumnList<string[]>;
  const model = simpleTableModel(rows, columns);
  model.updateAllOnChange = true;
  return model;
}

export class SevenCellsModel {
  cols = [..."ABCDEF"];
  tableModel7: TableModel<string[]>;
  rows: ArrayAtom<string[]>;
  columns: ArrayAtom<TableColumn<string[], unknown>>;

  constructor() {
    this.tableModel7 = tableModel(this.cols);
    this.rows = this.tableModel7.rows;
    this.columns = this.tableModel7.columns;
  }
}
