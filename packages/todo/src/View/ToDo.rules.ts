import { ch, pct, PageOptions, zborder, zfont, zrounding } from "zaffre";
import { place, zspace, effectPair, transitions, calc, em } from "zaffre";
import { ToDoModel } from "../Model";

export interface ToDoOptions extends PageOptions {}

export const rules = (model: ToDoModel) => ({
  "ToDo": {
    maxWidth: ch(100),
    width: pct(100),
  },
  "ToDo>ToastStack": {
    placement: place.center,
    maxItems: 1,
    duration: 1500,
  },
  "ToDo_TopLabel": {
    font: zfont.display_medium,
  },
  "ToDo>ElevatedBox": {
    rounding: zrounding.r2,
  },
  "ToDo_Stack": {
    width: pct(100),
    rounding: "inherit",
    alignItems: "center",
    overflow: "hidden",
    border: zborder.thin,
  },

  "ToDoButtonBar": {
    hidden: () => model.itemCount() === 0,
    font: zfont.body_medium,
    width: pct(100),
    padding: zspace.s4,
  },
  "ToDoButtonBar>TextButton": {
    action: () => model.clearCompletedItems(),
    hidden: () => model.completedCount.get() === 0,
  },
  "ToDoButtonBar>TextLabel": {
    rounding: zrounding.none,
  },
  "ToDoButtonBar>SegmentedButton": {
    rounding: zrounding.none,
  },

  "ToDoInputRow": {
    width: pct(100),
    alignItems: "center",
    paddingBlockStart: zspace.s3,
  },
  "ToDoInputRow>Button": {
    action: () => model.toggleAllItems(),
    leadingIconURI: "icon.chevron-down",
    font: zfont.title_medium,
    title: "Toggle All",
    padding: zspace.s0,
    border: zborder.none,
  },
  "ToDoInputRow>TextInput": {
    font: zfont.title_medium,
    border: zborder.none,
    placeholder: "What needs to be done?",
    firstFocus: true,
    setOnInput: false,
    readOnly: false,
    width: pct(100),
  },

  "ToDoItemRow": {
    width: pct(100),
    padding: zspace.s0,
    alignItems: "center",
    justifyContent: "center",
    effects: {
      mounted: effectPair(transitions.fadeIn("in"), transitions.slide("out", "left", 0.3)),
    },
  },
  "ToDoItemRow>Checkbox": {
    font: zfont.headline_medium,
  },
  "ToDoItemRow>TextInput": {
    width: calc("100% - 5em"),
    outlineWhenEdited: true,
    editOnDoubleClick: true,
    setOnInput: false,
    border: zborder.none,
  },
  "ToDoItemRow>TextButton": {
    position: "absolute",
    right: em(0.1),
    font: zfont.title_medium,
  },
});
