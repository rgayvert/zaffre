import { Atom, atom, BasicAction, TableCell, zboolean, TableDataCell, TableModel, TableHeaderCell } from ":foundation";
import { View, px, core, defineComponentBundle, mergeComponentOptions, BV, restoreOptions } from ":core";
import { Grid, GridOptions, ViewList } from "../Layout";
import { TextLabelOptions } from "../Content";
import { Box } from "../HTML";
import { HeaderCellView } from "./HeaderCellView";
import { StringDataCellView, StringDataCellViewOptions } from "./StringDataCellView";

//
// A Table is a grid-based component backed by a table model with reactive rows and columns.
// The table model provides a list of header and data cells, which are mapped here into cell views.
//
// TODO:
//   - lots of features to add
//   - more types of data cell views (currently limited to string views)
//

export type TableGridLines = "none" | "row" | "column" | "both";

export type DataCellComponent<R> = (cell: TableDataCell<R, unknown>) => View | undefined;

export const DataCellComponentMap: Map<string, DataCellComponent<unknown>> = new Map();

export interface TableOptions extends GridOptions {
  gridLines?: TableGridLines;
  showRowNumbers?: zboolean;
  headerCellViewOptions?: TextLabelOptions;
  dataCellViewOptions?: StringDataCellViewOptions;
  dataCellComponent?: DataCellComponent<unknown>;
  editable?: boolean;
  sortable?: boolean;
  doubleClickAction?: BasicAction;
  selectableColumns?: zboolean;
}
defineComponentBundle<TableOptions>("Table", "Grid", {
  gridLines: "both",
  background: core.color.primary,
});

export function Table<R>(tableModel: TableModel<R>, inOptions: BV<TableOptions> = {}): View {
  const options = mergeComponentOptions("Table", inOptions);
  options.model = tableModel;
  options.alignItems = "start";
  options.nrows = atom(() => tableModel.numRows.get());
  options.templateColumns ??= atom(() => `repeat(${tableModel.numVisibleColumns}, minmax(3ch, auto))`);
  options.columnGap = options.gridLines === "column" || options.gridLines === "both" ? px(1) : undefined;
  options.rowGap = options.gridLines === "row" || options.gridLines === "both" ? px(1) : undefined;
  tableModel.options.selectableColumns = options.selectableColumns;

  const editedCell: Atom<TableDataCell<R, unknown> | undefined> = atom(undefined);

  const headerCellViewOptions = {
    ...options.headerCellViewOptions,
    sortable: options.sortable,
  };
  const dataCellViewOptions: StringDataCellViewOptions = {
    ...options.dataCellViewOptions,
    doubleClickAction: options.doubleClickAction,
    editable: options.editable,
  };

  // TODO:
  //  - check options first
  //  - next, go on column type, using DataCellComponentMap
  //  - default to StringDataCellView
  //
  function TableCellView(cell: TableCell): View {
    if (cell instanceof TableDataCell) {
      if (tableModel.options.colorOfDataCell) {
        dataCellViewOptions.color = tableModel.options.colorOfDataCell(cell);
      }
      if (tableModel.options.selectionTextColorOfDataCell) {
        dataCellViewOptions.selectionTextColor = tableModel.options.selectionTextColorOfDataCell(cell);
      }
      
      const fn = options.dataCellComponent;
      return (
        fn?.(cell) ||
        StringDataCellView(
          tableModel,
          cell,
          <Atom<TableDataCell<any, string> | undefined>>editedCell,
          dataCellViewOptions
        )
      );
    } else if (cell instanceof TableHeaderCell) {
      return HeaderCellView(tableModel, cell, headerCellViewOptions);
    } else {
      return Box();
    }
  }

  return restoreOptions(
    Grid(options).append(
      ViewList(
        tableModel.cells,
        (cell) => cell,
        (cell) => TableCellView(cell)
      )
    )
  );
}
