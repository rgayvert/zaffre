import { View, Table, loremTable, em, core } from "zaffre";
import { ScrollPane, ScrollPaneOptions, TableOptions } from "zaffre";

export function TableExample1(): View {
  const tableModel1 = loremTable.tableModel(10, 7);
  const scrollOptions: ScrollPaneOptions = {
    maxHeight: em(10),
    border: core.border.thin,
  };
  const tableOptions: TableOptions = {
    sortable: true
  }
  return ScrollPane(scrollOptions).append(
    Table(tableModel1, tableOptions)
  );
}
 