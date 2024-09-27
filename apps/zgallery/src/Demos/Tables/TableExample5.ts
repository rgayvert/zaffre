import { View, core, Box, TableOptions, Table } from "zaffre";
import { ExampleTableModel5 } from "./ExampleTableModel5";

export function TableExample5(): View {
  const model = new ExampleTableModel5();
  const tableOptions: TableOptions = {
    editable: true,
  };

  return Box({ border: core.border.thin }).append(Table(model.tableModel5, tableOptions));
}
