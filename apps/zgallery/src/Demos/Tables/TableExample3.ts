import { ScrollPaneOptions, ScrollPane, zcolor, zborder, AnyTableDataCell, HeaderCellViewOptions, View } from "zaffre";
import { Icon, CenterBox, pct, Table, TableCellViewCreator } from "zaffre";
import { ExampleTableModel3 } from "./ExampleTableModel3";

const OnSaleIcon = <R extends {}>(cell: AnyTableDataCell<R>) => {
  return CenterBox({ width: pct(100), height: pct(100), background: zcolor.background }).append(
    Icon(cell.value.get() ? "icon.check" : "icon.blank")
  );
};

class CellViewCreator3<R extends {}> extends TableCellViewCreator<R> {
  headerCellOptions(): HeaderCellViewOptions {
    return {
      background: zcolor.cyan,
      color: zcolor.red,
    };
  }

  viewForDataCell(cell: AnyTableDataCell<R>): View {
    return cell.column.title === "On Sale" ? OnSaleIcon(cell) : super.viewForDataCell(cell);
  }
}

export const TableExample3 = () => {
  const model = new ExampleTableModel3();

  const topOptions: ScrollPaneOptions = {
    border: zborder.thin,
  };

  const viewCreator = new CellViewCreator3(model.tableModel3);

  return ScrollPane(topOptions).append(Table(model.tableModel3, { viewCreator: viewCreator }));
};
