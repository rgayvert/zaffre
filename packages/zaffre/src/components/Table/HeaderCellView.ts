import { zboolean, atom, TableModel, TableHeaderCell, AnyTableHeaderCell } from ":foundation";
import { px, View, core, defineComponentBundle, mergeComponentOptions, BV, restoreOptions } from ":core";
import { CenteredTextLabel, TextLabelOptions } from "../Content";

//
// A HeaderCellView displays the contents of a header cell, which will be the title of a
// table column. When clicked, it may trigger a sort and/or the selection of the associated column.
//

export interface TableHeaderCellViewOptions extends TextLabelOptions {
  sortable?: zboolean;
}
defineComponentBundle<TableHeaderCellViewOptions>("HeaderCellView", "TextLabel", {
  padding: core.space.s3,
  font: core.font.label_medium,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  color: core.color.primary,
  background: core.color.primaryContainer,
  position: "sticky",
  top: px(0),
  zIndex: 1,
  emptyValue: "&nbsp;",
});

export function HeaderCellView<R>(
  tableModel: TableModel<R>,
  cell: TableHeaderCell<R, unknown>,
  inOptions: BV<TableHeaderCellViewOptions> = {}
): View {
  const options = mergeComponentOptions("HeaderCellView", inOptions);
  if (tableModel.maySelectColumns || options.sortable) {
    options.clickAction = () => handleClick();
  } else if (tableModel.options.headerSelectionColor) {
    options.clickAction = () => tableModel.options.headerClickAction?.(<AnyTableHeaderCell>cell);
  }
  options.model = cell;
  options.hidden = cell.column.hidden;
  options.selectionColor ??= tableModel.options.headerSelectionColor;
  options.selected ??= atom(() => tableModel.selectedHeaderColumn.get() == cell.column);

  function handleClick(): void {
    if (options.sortable) {
      tableModel.sortOnColumn(cell.column, true);
    }
    if (tableModel.maySelectColumns) {
      tableModel.selectedColumn.set(cell.column);
    }
  }

  return restoreOptions(CenteredTextLabel(cell.column.title, options));
}
