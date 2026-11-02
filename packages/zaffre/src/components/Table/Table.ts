import { atom, BasicAction, TableColumn, TableDataCell, TableModel, zboolean } from ":foundation";
import { addClass, px, View } from ":core";
import { Grid, GridOptions, ViewList } from "../Layout";
import { TableCellViewCreator } from "./TableCellViewCreator";
import { LabelOptions } from "../Content";
import { StringDataCellViewOptions } from "./StringDataCellView";

//
// A Table is a grid-based component backed by a table model with reactive rows and columns.
// The table model provides a list of header and data cells, which are mapped here into cell views.
//
// TODO:
//   - lots of features to add
//   - more types of data cell views (currently limited to string views)
//

export type TableGridLines = "none" | "row" | "column" | "both";

export type DataCellComponent<R extends {}> = (cell: TableDataCell<R, unknown>) => View | undefined;

export interface TableOptions<R extends {}> extends GridOptions {
  gridLines?: TableGridLines;
  headerCellViewOptions?: LabelOptions;
  dataCellViewOptions?: StringDataCellViewOptions;
  dataCellComponent?: DataCellComponent<any>;
  editable?: boolean;
  sortable?: boolean;
  doubleClickAction?: BasicAction;
  selectableColumns?: zboolean;
  viewCreator?: TableCellViewCreator<R>;
  minColumnWidth?: number;
}

const tableRules = (doubleClickAction?: BasicAction) => {
  return {
    StringDataCellView: {
      doubleClickAction: () => doubleClickAction?.(),
    },
  };
};

export const Table = <R extends {}>(tableModel: TableModel<R>, inOptions: TableOptions<R> = {}) => {
  const options = addClass(inOptions, "Table", tableRules(inOptions.doubleClickAction));
  options.model = tableModel;

  // TODO: these belong in initializeTable
  options.model = tableModel;
  options.alignItems = "start";
  const minColWidth = options.minColumnWidth || 3;

  options.gridTemplateRows ??= atom(() => `${tableModel.includeHeader ? "auto" : ""}repeat(${options.nrows}, 1fr)`);
  options.templateColumns ??= atom(() => `repeat(${tableModel.numVisibleColumns}, minmax(${minColWidth}ch, auto))`);

  options.columnGap = options.gridLines === "column" || options.gridLines === "both" ? px(1) : undefined;
  options.rowGap = options.gridLines === "row" || options.gridLines === "both" ? px(1) : undefined;
  tableModel.options.selectableColumns = options.selectableColumns;
  options.breakpoints = tableModel.breakpoints;

  const viewCreator = options.viewCreator || new TableCellViewCreator(tableModel);

  return Grid(options).append(
    ViewList(
      tableModel.cells,
      (cell) => cell,
      (cell) => viewCreator.viewForCell(cell), // TableCellView(cell)
    ),
  );
};
