import { ScrollPaneOptions, View, em, ScrollPane } from "zaffre";
import { core, Table, TableOptions } from "zaffre";
import { ExampleTableModel2 } from "./ExampleTableModel2";

export function TableExample2(): View {
  const model = new ExampleTableModel2();
  const scrollOptions: ScrollPaneOptions = {
    maxHeight: em(10),
    border: core.border.thin,
  };
  const tableOptions: TableOptions = {
    sortable: true,
  };

  return ScrollPane(scrollOptions).append(Table(model.tableModel2, tableOptions));
}
