import { TableModel, AnyTableHeaderCell, atom, zboolean } from ":foundation";
import { CenteredText, LabelOptions } from "../Content";
import { addClass } from ":view";

//
// A HeaderCellView displays the contents of a header cell, which will be the title of a
// table column. When clicked, it may trigger a sort and/or the selection of the associated column.
//

export interface HeaderCellViewOptions extends LabelOptions {
  sortable?: zboolean;
  //selectionColor?: css_color;
}

export const HeaderCellView = <R extends {}>(tableModel: TableModel<R>, cell: AnyTableHeaderCell<R>, inOptions: HeaderCellViewOptions = {}) => {
  const options = addClass(inOptions, "HeaderCellView");
  options.model = tableModel;
  options.hidden = cell.column.hidden;
  options.selected ??= atom(() => tableModel.selectedHeaderColumn.get() == cell.column);
  options.clickAction = () => tableModel.toggleColumn(cell.column);
  return CenteredText(cell.column.title, options);
};
