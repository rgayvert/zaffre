import { Box, Table, zborder } from "zaffre";
import { ExampleTableModel5 } from "./ExampleTableModel5";

export const TableExample5 = () => {
  const model = new ExampleTableModel5();

  return Box({ border: zborder.thin }).append(Table(model.tableModel5));
}
