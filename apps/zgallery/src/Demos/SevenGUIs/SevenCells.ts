import { View, Table, core, TableOptions, Box, ch } from "zaffre";
import { SevenCellsModel } from "./SevenCellsModel";

export function SevenCells(): View {
  const model = new SevenCellsModel();

  model.columns.forEach((col) => {
    const f = col.formatter!;
    col.formatter = (r) => expandValue(<string>f(r));
  });

  const opts: TableOptions = {
    editable: true,
    dataCellViewOptions: {
      minWidth: ch(7),
    },
  };

  function valueOfCell(result: RegExpExecArray, colName: string, rowName: string): string {
    const groups = result.groups;
    if (groups && groups[colName] && groups[rowName]) {
      const c = model.cols.indexOf(groups[colName]);
      const r = parseInt(groups[rowName]);
      const row = model.rows.at(r) || [];
      return row[c]?.toString() || "";
    } else {
      return "";
    }
  }
  function evaluate(expr: string): string {
    const res2 = /(?<col1>[A-G])(?<row1>[0-9])(?<op>[+\-*])(?<col2>[A-G])(?<row2>[0-9])/.exec(expr);
    if (res2) {
      const val1 = parseInt(valueOfCell(res2, "col1", "row1"));
      const val2 = parseInt(valueOfCell(res2, "col2", "row2"));
      const op = res2.groups!["op"];
      return (op === "+" ? val1 + val2 : op === "-" ? val1 - val2 : val1 * val2).toString();
    }
    const res1 = /(?<col1>[A-G])(?<row1>[0-9])/.exec(expr);
    if (res1) {
      return valueOfCell(res1, "col1", "row1");
    }
    return "!!";
  }

  function expandValue(value: string): string {
    return value.startsWith("=") ? evaluate(value.slice(1)) : value;
  }

  return Box({ border: core.border.thin }).append(Table(model.tableModel7, opts));
}
