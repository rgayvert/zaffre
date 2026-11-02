import { AnyTableDataCell, atom, BasicAction, size2D, TableModel } from ":foundation";
import { CenterBox } from "../Layout";
import { addClass } from ":view";
import { CenteredImageBox, ImageBoxOptions } from "../Content";
import { zcolor } from ":theme";
import { px } from ":attributes";

export interface ImageDataCellViewOptions extends ImageBoxOptions {
  doubleClickAction?: BasicAction;
}

export const imageDataCellRules1 = <R extends {}>(cell: AnyTableDataCell<R>) => {
  const sz = cell.column.size || size2D(120, 80);
  const w = sz.x >= sz.y ? sz.x : undefined;
  const h = sz.y >= sz.x ? sz.y : undefined;

  return {
    ImageBox: {
      width: w ? px(w) : undefined,
      height: h ? px(h) : undefined,
      clipPath: "rect(15px 120px 80px 0px round 5%)",
    },
  };
};

export const ImageDataCellView = <R extends {}>(tableModel: TableModel<R>, cell: AnyTableDataCell<R>, inOptions: ImageDataCellViewOptions = {}) => {
  const options = addClass(inOptions, "ImageDataCellView", imageDataCellRules1(cell));

  options.background = atom(() => (cell.row === tableModel.selectedRow.get() ? zcolor.secondaryContainer : zcolor.background));

  // TODO: this doesn't work
  options.events = {
    dblClick: () => tableModel.options.doubleClickAction?.(),
  };

  return CenterBox(options).append(
    CenteredImageBox(cell.value.get(), {
      background: options.background,
    }),
  );
};
