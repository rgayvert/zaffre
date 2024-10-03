import { zboolean, TableModel, TableHeaderCell } from ":foundation";
import { px, View, core, defineBaseOptions, mergeComponentOptions, BV } from ":core";
import { CenteredTextLabel, TextLabelOptions } from "../Content";

//
// A HeaderCellView displays the contents of a header cell, which will be the title of a 
// table column. When clicked, it may trigger a sort and/or the selection of the associated column.
//

export interface TableHeaderCellViewOptions extends TextLabelOptions {
  sortable?: zboolean;
}
defineBaseOptions<TableHeaderCellViewOptions>("HeaderCellView", "TextLabel", {
  padding: core.space.s2,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  color: core.color.primary,
  background: core.color.tertiaryContainer,
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
  }
  options.model = cell;

  function handleClick(): void {
    if (options.sortable) {
      tableModel.sortOnColumn(cell.column);
    }
    if (tableModel.maySelectColumns) {
      tableModel.selectedColumn.set(cell.column);
    }
  }

  return CenteredTextLabel(cell.column.title, options);
}
