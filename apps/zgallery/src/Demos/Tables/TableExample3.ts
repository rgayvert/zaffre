import { View, core, ScrollPaneOptions, ScrollPane } from "zaffre";
import { TableDataCell, Icon, CenterBox, pct, Table, TableOptions } from "zaffre";
import { ExampleTableModel3, Fruit } from "./ExampleTableModel3";

export function TableExample3(): View {
  const model = new ExampleTableModel3();

  const tableOptions: TableOptions = {
    sortable: true,
    headerCellViewOptions: {
      background: core.color.cyan,
      color: core.color.red,
    },
    dataCellComponent: CustomDataCell,
  };
  const topOptions: ScrollPaneOptions = {
    border: core.border.thin,
  };

  function CustomDataCell(cell: TableDataCell<unknown, unknown>): View | undefined {
    return cell.column.title === "On Sale" ? OnSaleIcon(<TableDataCell<Fruit, unknown>>cell) : undefined;
  }

  function OnSaleIcon(cell: TableDataCell<Fruit, unknown>): View | undefined {
    return CenterBox({ width: pct(100), height: pct(100), background: core.color.background }).append(
      Icon(cell.value ? "icon.check" : "icon.blank")
    );
  }

  return ScrollPane(topOptions).append(Table(model.tableModel3, tableOptions));
}
