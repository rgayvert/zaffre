import { atom, PaginatedArrayAtom, pickList } from ":foundation";
import { addClass } from ":view";
import { HStack, StackOptions } from "../Layout";
import { LabelBox } from "../ControlGroups";
import { DropDownButton, simpleMenuItemList } from "../Floating";
import { TextLabel } from "../Content";
import { Button, TextButton } from "../Controls";
import { simpleInteractionEffects } from ":effect";
import { zspace, zspaceKeys } from ":theme";

//
// PaginationBar
//

export interface PaginationBarOptions<T> extends StackOptions {}

export const PaginationBar = <T>(array: PaginatedArrayAtom<T>, inOptions: PaginationBarOptions<T> = {}) => {
  const options = addClass(inOptions, "PaginationBar");
  options.model = array;

  const rowsPerPage = atom(array.pagination.pageSize, { action: (sz) => array.setPageSize(sz) });
  const rowsPerPagePickList = simpleMenuItemList([10, 20, 50, 100], rowsPerPage, (n) => n?.toString() || "" );

  return HStack(options).append(
    LabelBox("Rows per page:", { cls: "PaginationBar.TextLabel" }).append(
      DropDownButton(rowsPerPagePickList, { cls: "PaginationBar.PageSize" }),
    ),
    TextLabel(array.range, { cls: "PaginationBar.RangeText" }),
    //Button({ cls: "PaginationBar.FirstButton", action: () => array.firstPage(), disabled: atom(() => array.firstPageDisabled()) }),
    HStack({ gap: zspace.s2 }).append(
      TextButton("<", {
        cls: "PaginationBar.PreviousButtonX",
        disabled: () => array.previousDisabled(),
        action: () => array.previousPage(),
      }),
      TextButton(">", {
        cls: "PaginationBar.NextButtonX",
        disabled: () => array.nextDisabled(),
        action: () => array.nextPage(),
      }),
    ),
    //Button({ cls: "PaginationBar.LastButton", disabled: () => array.lastPage(), action: () => array.nextPage() }),
  );
};
