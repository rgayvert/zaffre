import { AnyTableCell, AnyTableDataCell, AnyTableHeaderCell, RowSelectTableColumn, TableDataCell, TableHeaderCell } from ":foundation";
import { atom, Atom, TableModel, zboolean } from ":foundation";
import { View } from ":view";
import { Box } from "../HTML";
import { HeaderCellView } from "./HeaderCellView";
import { StringDataCellView } from "./StringDataCellView";
import { HeaderCellViewOptions } from "./HeaderCellView";
import { StringDataCellViewOptions } from "./StringDataCellView";
import { ImageDataCellView } from "./ImageDataCellView";
import { CenterBox } from "../Layout";
import { Button, Checkbox } from "../Controls";
import { ch, pct, px } from ":attributes";
import { zborder, zcolor } from ":theme";
import { DropDownButton, MenuButton } from "../Floating";
import { SimpleTextInput, TextInput } from "../Inputs";

export interface TableCellViewCreatorOptions {
  editable: zboolean;
}

export class TableCellViewCreator<R extends {}> {
  editedCell: Atom<TableDataCell<R, string> | undefined>;

  constructor(public tableModel: TableModel<R>) {
    this.editedCell = atom(undefined);
  }

  stringDataCellOptions(): StringDataCellViewOptions {
    return {};
  }
  headerCellOptions(): HeaderCellViewOptions {
    return {};
  }

  viewForCell(cell: AnyTableCell<R>): View {
    return cell instanceof TableHeaderCell
      ? this.viewForHeaderCell(cell)
      : this.viewForDataCell(cell as AnyTableDataCell<R>);
  }

  viewForHeaderCell(cell: AnyTableHeaderCell<R>): View {
    return HeaderCellView(this.tableModel, cell, this.headerCellOptions());
  }

  stringDataCellView(cell: AnyTableDataCell<R>): View {
    return StringDataCellView(this.tableModel, cell, this.editedCell);
  }

  imageDataCellView = (cell: AnyTableDataCell<R>) => {
    return ImageDataCellView(this.tableModel, cell);
  };
  buttonCellView = (cell: AnyTableDataCell<R>) => {
    return CenterBox({ background: zcolor.background, width: pct(100), height: pct(100) }).append(
      Button({
        leadingIconURI: cell.column.icon,
        action: () => cell.column.action?.(cell.row),
        border: zborder.none,
        padding: px(2),
        //fontSize: px(24),
        background: zcolor.background,
        //style: cell.column.style,
      }),
    );
  };

  menuButtonCellView = (cell: AnyTableDataCell<R>) => {
    const background = atom(() =>
      cell.row === this.tableModel.selectedRow.get() ? zcolor.secondaryContainer : zcolor.background,
    );
    const pickList = cell.column.pickListFn!(cell.row);
    return CenterBox({ background: background, width: pct(100), height: pct(100) }).append(
      MenuButton(pickList, {
        leadingIconURI: cell.column.icon,
        //action: () => cell.column._action?.(cell.row),
        border: zborder.none,
        padding: px(2),
        //fontSize: px(24),
        background: background,
        //style: cell.column.style,
      }),
    );
  };

  selectCellView = (cell: AnyTableDataCell<R>) => {
    const background = atom(() =>
      cell.row === this.tableModel.selectedRow.get() ? zcolor.secondaryContainer : zcolor.background,
    );
    const pickList = cell.column.pickListFn!(cell.row);
    return CenterBox({ background: background, width: pct(100), height: pct(100) }).append(
      DropDownButton(pickList, {
        border: zborder.none,
        padding: px(2),
        background: background,
        //style: cell.column.cls,
      }),
    );
  };

  checkboxCellView = (cell: AnyTableDataCell<R>) => {
    const background = atom(() =>
      cell.row === this.tableModel.selectedRow.get() ? zcolor.secondaryContainer : zcolor.background,
    );
    const col = <RowSelectTableColumn<R>>cell.column;
    const value = atom(false, { action: () => this.tableModel.toggleRow(cell.row) });
    return CenterBox({ background: background, width: pct(100), height: pct(100) }).append(
      Checkbox(value, {
        cls: cell.column.cls,
      }),
    );
  };

  inputCellView = (cell: AnyTableDataCell<R>) => {
    const value = atom(cell.value);
    const setter = cell.column.setter!;
    const width = cell.column.width;
    value.addAction((v) => setter(cell.row, v));
    return CenterBox({ background: zcolor.background, width: pct(100), height: pct(100) }).append(
      SimpleTextInput(value, {
        inputType: cell.column.inputType!,
        border: zborder.none,
        width: width ? ch(width) : undefined,
      }),
    );
  };

  // new attributes for column: link (modify string view)
  // new column types: action, actionMap
  // new view types: icon with action, icon with menu
  // table model provides action mapping + which actions are available for specific row

  viewForDataCell(cell: AnyTableDataCell<R>): View {
    const columnType = cell.column.type;
    if (columnType === "image") {
      return this.imageDataCellView(cell);
    } else if (columnType === "button") {
      return this.buttonCellView(cell);
    } else if (columnType === "menu") {
      return this.menuButtonCellView(cell);
    } else if (columnType === "input") {
      return this.inputCellView(cell);
    } else if (columnType === "select") {
      return this.selectCellView(cell);
    } else if (columnType === "checkbox") {
      return this.checkboxCellView(cell);
    } else {
      return this.stringDataCellView(cell);
    }
    return Box();
  }
}
