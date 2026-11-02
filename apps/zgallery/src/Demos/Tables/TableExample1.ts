import { Table, loremTable, em,zborder } from "zaffre";
import { ScrollPane, ScrollPaneOptions, TableOptions } from "zaffre";

export const TableExample1 = () => {
  const tableModel1 = loremTable.tableModel(10, 7);

  const scrollOptions: ScrollPaneOptions = {
    maxHeight: em(10),
    border: zborder.thin,
  };

  return ScrollPane(scrollOptions).append(
    Table(tableModel1)
  );
}
 