import { ScrollPaneOptions, em, ScrollPane, zborder } from "zaffre";
import {Table } from "zaffre";
import { ExampleTableModel2 } from "./ExampleTableModel2";

export const TableExample2 = () => {
  const model = new ExampleTableModel2();
  const scrollOptions: ScrollPaneOptions = {
    maxHeight: em(10),
    border: zborder.thin,
  };

  return ScrollPane(scrollOptions).append(Table(model.tableModel2));
}
