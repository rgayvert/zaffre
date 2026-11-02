import { coreColorEffect, zborder, zcolor, zfont, zrounding, zspace } from ":theme";
import { calc, calcSub, ch, css, em, flexToken, pct, px, rem, vh, vw } from ":attributes";
import { simpleEffect, simpleInteractionEffects, transitions } from ":effect";

import { place } from ":uifoundation";
import { rect2D, zutil } from ":foundation";
import {
  ButtonOptions,
  ContainerOptions,
  defaultTextButtonInteractionEffects,
  EnsembleOptions,
  GridOptions,
  GridSidebarOptions,
  HDividerOptions,
  HeaderCellViewOptions,
  LabelOptions,
  ListBoxOptions,
  MenuButtonOptions,
  ScrollPaneOptions,
  SidebarOptions,
  SoftGridOptions,
  SplitGridOptions,
  StackOptions,
  TableOptions,
  TitledEnsembleOptions,
  ToastOptions,
  ToastStackOptions,
  TooltipOptions,
  ValidationBoxOptions,
  VDividerOptions,
  ZStackOptions,
} from ":components";
import { HTMLOptions } from ":corehtml";
import { SVGGroupOptions } from ":core";

const paginationBarButtonOptions = {
  border: zborder.none,
  font: zfont.body_medium,
  effects: defaultTextButtonInteractionEffects(),
};

const carouselButtonOptions = {
  color: zcolor.primaryContainer,
  font: zfont.display_medium,
  border: zborder.none,
  effects: {
    hovered: coreColorEffect(zcolor.primary),
  },
};

export const zaffreDefaults = {
  Audio: {
    autoplay: true,
  },

  "Autocomplete": {
    border: zborder.thin,
    rounding: zrounding.r2,
    padding: zspace.s2,
  },
  "Autocomplete.Input": {
    border: zborder.none,
  },
  "Autocomplete.Close": {
    leadingIconURI: "icon.close",
    border: zborder.none,
    controlSize: "lg",
    preserveFocus: true,
  },
  "Autocomplete.Toggle": {
    leadingIconURI: "icon.chevron-down",
    border: zborder.none,
    controlSize: "lg",
  },
  "Autocomplete>ListBox": {
    background: zcolor.background,
  },

  "BasicDialog": {
    acceptLabel: "OK",
    rejectLabel: "No",
    cancelLabel: "Cancel",
    background: zcolor.background,
    color: zcolor.primary,
    pointerEvents: "auto",
    rounding: zrounding.r2,
    border: zborder.medium,
    padding: zspace.s6,
    elevation: 5,
    effects: { mounted: transitions.fadeIn() },
    placement: place.center,
  },
  "BasicDialog.Button": {
    color: zcolor.primary,
    background: zcolor.primaryContainer,
    rounding: zrounding.pill,
  },
  "BasicDialog.ButtonRow": {
    gap: zspace.s5,
    background: zcolor.background,
  },
  "BasicDialog.Subtitle": {
    background: zcolor.none,
    font: zfont.body_medium,
    color: zcolor.darkgray,
    paddingBlock: zspace.s3,
  },
  "BasicDialog.Title": {
    background: zcolor.none,
    font: zfont.title_medium.bold(),
    color: zcolor.primary,
  },

  "Box": {
    position: "relative",
  },

  "Breadcrumbs": {
    background: zcolor.none,
    border: zborder.none,
    margin: zspace.s3,
    gap: zspace.s2,
  },
  "Breadcrumbs.Link": {
    textDecoration: "none",
    padding: zspace.none,
    paddingInline: zspace.none,
  },
  "Breadcrumbs.Button": {
    font: "unset",
    fontSize: "unset",
    padding: zspace.none,
    paddingInline: zspace.none,
  },
  "Breadcrumbs.TextLabel": {
    padding: zspace.none,
  },
  "Breadcrumbs.Button>TextLabel": {
    padding: zspace.none,
  },
  "Breadcrumbs.Button>Button": {
    padding: zspace.none,
  },

  "BulletList": {
    bullets: "∙◦-+",
    showRoot: false,
    alignItems: "start",
    alwaysExpanded: true,
    padding: zspace.s3,
  },

  "Button": {
    //label: "xx",
    //font: zfont.body_small,
    //ripple: false,
    preserveFocus: true,
    border: zborder.thin,
    padding: zspace.s1,
    rounding: zrounding.r2,
    role: "button",
    disabledOpacity: 0.5,
  },
  "Button.TextLabel": {
    color: zcolor.inherit,
    border: zborder.none,
    //padding: zspace.s1,
    paddingInline: zspace.s2,
    font: zfont.inherit,
    //disabledOpacity: 0.5,
  },
  "Button.LeadingIcon": {
    alignSelf: "anchor-center",
  },
  "Button.TrailingIcon": {
    alignSelf: "anchor-center",
  },

  "ButtonChoicePanel": {
    padding: zspace.s0,
    border: zborder.thin,
    flexDirection: "column",
  },
  "ButtonChoicePanel.Title": {
    fontWeight: "bold",
    marginBottom: em(1),
  },

  "Canvas": {
    color: zcolor.primary,
    background: zcolor.background,
  },

  "Card": {
    //border: zborder.thin,
    overflow: "hidden",
  },
  "Card.Title": {
    font: zfont.title_medium,
    color: zcolor.primary,
    padding: zspace.s2,
  },
  "Card.Subtitle": {
    font: zfont.body_medium,
    color: zcolor.primary,
    padding: zspace.s2,
  },
  "Card.Body": {
    font: zfont.body_medium,
    color: zcolor.primary,
    padding: zspace.s2,
  },
  "Card.Image": {
    maxWidth: pct(100),
  },

  "Carousel": {
    flexDirection: "row",
    gap: zspace.s0,
    intervalMillis: 0,
  },
  "Carousel.LeftButton": {
    ...carouselButtonOptions,
    leadingIconURI: "icon.chevron-left",
  },
  "Carousel.RightButton": {
    ...carouselButtonOptions,
    leadingIconURI: "icon.chevron-right",
  },

  "CenteredImageBox": {
    background: zcolor.background,
    width: pct(100),
    height: pct(100),
  },
  "CenteredImageBox.Image": {
    backgroundSize: "contain",
    position: "absolute",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: pct(100),
    width: pct(100),
  },

  "Checkbox": {
    checkedIcon: "icon.checkbox-on",
    uncheckedIcon: "icon.checkbox-off",
    background: zcolor.none,
    border: zborder.none,
    controlSize: "lg",
  },

  "ChronoInput": {
    iconName: "icon.calendar",
    useNativePickerIcon: true,
    font: zfont.body_medium,
    padding: zspace.none,
    paddingLeft: zspace.s4,
    setOnInput: true,
  },

  "ComboBox": {
    //labelFn: zutil.genericLabelFn,
    border: zborder.thin,
    rounding: zrounding.r2,
    tabIndex: 0,
    alignItems: "stretch",
    paddingRight: ch(0.5),
  },
  "ComboBox.Input": {
    height: em(2),
    padding: zspace.s4,
    width: em(12),
    border: zborder.none,
  },
  "ComboBox.Icon": {
    fontSize: em(1.5),
    paddingTop: zspace.s1,
  },

  "Container": {
    display: "flex",
    flexWrap: "wrap",
  } satisfies ContainerOptions,

  "DialogLayer": {
    position: "absolute",
    left: px(0),
    top: px(0),
    width: vw(100),
    height: vh(100),
    pointerEvents: "none",
    overflow: "hidden",
    background: zcolor.transparent,
    zIndex: 98,
  } satisfies HTMLOptions,

  "Disclosure": {
    alignItems: "start",
    width: pct(100),
    outline: zborder.none,
    overflow: "hidden",
    initiallyExpanded: false,
    effectDuration: 0.2,
  },

  "DisclosureList": {
    background: zcolor.surface,
    alignItems: "stretch",
    justifyContent: "start",
    border: zborder.thin,
    allowMultipleExpansions: true,
  },

  "Dot": {
    width: em(0.5),
    height: em(0.5),
    color: zcolor.primary,
    border: zborder.thin,
    rounding: zrounding.circle,
  },

  "Dots": {
    flexDirection: "row",
    gap: ch(1),
  },

  "DownButton": {
    intervalMillis: 100,
  },
  "DropDownButton": {
    tabIndex: 0,
    alignItems: "stretch",
    paddingRight: ch(0.5),
  },

  "ElevatedBox": {
    width: pct(100),
    height: pct(100),
  },
  "ElevatedBox.Underlay": {
    width: pct(100),
    height: pct(100),
    background: zcolor.background,
    elevation: 3,
    borderRadius: "inherit",
  },

  "Ensemble": {
    mode: "lazy",
    width: pct(100),
  },

  "ExpansionLabel": {
    //background: zcolor.surface,
    rounding: zrounding.none,
    padding: zspace.s1,
    width: pct(100),
    //font: zfont.title_medium,
    selectionColor: zcolor.secondaryContainer,
    alignItems: "stretch",
    outline: zborder.none,
    iconOpacity: 1.0,
    iconName: "icon.chevron-down",
  },

  "ExpansionLabel.TextLabel": {
    color: zcolor.surface.contrast,
    background: zcolor.none,
    font: zfont.body_medium,
    overflow: "hidden",
  },

  "ExpansionLabel.Icon": {
    transition: "transform 0.3s",
    color: zcolor.surface.contrast,
    alignSelf: "anchor-center",
  },

  "FileInput": {
    label: "Choose file",
    leadingIconURI: "icon.folder",
    background: zcolor.primaryContainer,
    showFiles: true,
    noFilesLabel: "(no file)",
  },

  "FloatingContainer": {
    background: zcolor.transparent,
    useArrow: false,
    dismissOnOutsideClick: true,
    dismissOnEscape: true,
    clickThrough: false,
    //showOnReferenceClick: true, // TODO: turn this into a Handler on the reference
    //width: "fit-content",
    position: "absolute",
    content: css("_"),
    //floating: true,
    zIndex: 1000,
    hideOnWindowResize: false,
  },

  "FloatingLayer": {
    position: "absolute",
    left: px(0),
    top: px(0),
    width: vw(100),
    height: vh(100),
    pointerEvents: "none",
    overflow: "hidden",
    background: zcolor.transparent,
    zIndex: 99,
  } satisfies HTMLOptions,

  "Form": {
    gap: em(0.5),
  },
  "Form>LabelBox": {
    placementPt: "xstart-ystart",
  },
  "Form>ValidationBox": {
    //width: pct(100),
  },

  "Form>TextLabel": {
    font: zfont.body_small.weight(500),
    color: zcolor.rgb("0d0d0d"),
    fontSize: px(14),
  } satisfies LabelOptions,

  "Form>SegmentedButton": {
    rounding: zrounding.none,
    background: zcolor.primary,
  },
  "Form>SegmentedButton>Button": {
    background: zcolor.background,
  },
  "Form_ColumnLabel": {
    justifySelf: "start",
    //textPositionX: "end",
    //textPositionY: "center",
  },

  "Form>Input": {
    border: zborder.thin,
    rounding: zrounding.r1,
    //width: pct(100),
    padding: zspace.s1,
    font: zfont.body_medium,
    setOnInput: true,
  },
  "Form>TextArea": {
    border: zborder.thin,
    //width: pct(100),
    padding: zspace.s2,
    fluidHeight: true,
    rows: 3,
    font: zfont.body_medium,
    resize: "none",
  },
  "Form>DateInput": {
    border: zborder.thin,
  },
  "Form>Switch": {
    controlSize: "xs",
  },
  "Form>DropDownButton": {
    padding: zspace.s0,
    minHeight: em(1),
    minWidth: ch(10),
    rounding: zrounding.r1,
    //width: pct(100),
    font: zfont.body_medium,
  },

  "FormToolbar": {
    //marginTop: zspace.s8,
    gap: zspace.s5,
  },

  "Gauge": {
    background: zcolor.primaryContainer,
    padding: px(0),
    width: ch(20),
    height: em(1),
  },

  "Gauge.InnerBox": {
    background: zcolor.primary,
    rounding: "inherit",
    height: pct(100),
  },

  "GenericTextInput": {
    setOnInput: true,
    preserveCursorLocation: true,
  },

  "GraphPane": {
    bounds: rect2D(0, 0, 100, 100),
    textColor: zcolor.primary,
    userSelect: "none",
    fill: zcolor.background,
    vertexFillColor: zcolor.blue,
    edgeStrokeWidth: 0.5,
  },

  "GridSidebar": {
    gap: zspace.s3,
  } satisfies GridSidebarOptions,

  "HDivider": {
    background: zcolor.gray,
    thickness: zspace.s5,
    width: pct(90),
    height: px(1),
  } satisfies HDividerOptions,

  "HTML": {
    color: zcolor.primary,
    cursor: "default",
    userSelect: "none",
  } satisfies HTMLOptions,

  "HeaderCellView": {
    padding: zspace.s3,
    font: zfont.label_large,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    color: zcolor.primary,
    background: zcolor.primaryContainer,
    //position: "sticky",
    top: px(0),
    zIndex: 1,
    emptyValue: "&nbsp;",
  } satisfies HeaderCellViewOptions,

  "Icon": {
    color: zcolor.inherit,
    background: zcolor.inherit,
    lineHeight: em(1),
  },

  "IconLabel": {
    alignItems: "start",
  },
  "IconLabel.Icon": {
    alignSelf: "anchor-center",
  },
  "IconLabel.TextLabel": {
    font: zfont.inherit,
    color: zcolor.inherit,
    border: zborder.none,
    paddingInline: zspace.s2,
  },

  "IFrame": {},

  "ImageBox": {
    alt: "No image",
    fallbackURI: "image.fallback",
    background: zcolor.none,
    draggable: false,
    preload: false,
    useFetch: false,
  },

  "ImageDataCellView": {
    width: pct(100),
    height: pct(100),
    padding: px(3),
  },

  "ImageInput.container": {
    justifyContent: "center",
    width: px(150),
    height: px(150),
    border: zborder.thin,
  },
  "ImageInput": {
    accept: ".jpg, .jpeg, .png",
    maxWidth: pct(90),
    maxHeight: pct(90),
    height: "auto",
  },

  "ImportLoader": {
    timeout: 2000,
    width: pct(100),
    height: pct(100),
    background: zcolor.secondaryContainer,
  },

  "Input": {
    type: "text",
    maySetContent: true,
    color: zcolor.primary,
    background: zcolor.inherit,
    appearance: "none",
    font: zfont.body_medium,
    border: zborder.thin,
    outline: "none",
    textAlign: "start",
    tabIndex: 0,
    spellcheck: false,
  },

  "TextLabel": {
    userSelect: "none",
    whiteSpace: "nowrap",
    font: zfont.inherit,
    color: zcolor.inherit,
    background: zcolor.inherit,
    border: zborder.none,
    selectionColor: zcolor.secondaryContainer,
    emptyValue: "&nbsp;",
    disabledOpacity: 0.5,
  },

  "LabelBox": {
    side: "left",
    justifyContent: "unset",
    extendClick: true,
  },
  "LabelBox.TextLabel": {
    color: zcolor.primary,
    background: zcolor.inherit,
    padding: zspace.s1,
    border: zborder.none,
    selectionColor: zcolor.secondaryContainer,
  },

  "LabeledList": {
    alignItems: "stretch",
    justifyContent: "start",
    labelSide: "left",
    gap: em(0.5),
  },

  "LabeledList.TextLabel": {
    background: zcolor.inherit,
    font: zfont.body_medium,
    border: zborder.none,
    marginRight: ch(1),
  },

  "Link": {
    cursor: "pointer",
    textDecoration: "underline",
    target: "",
    effects: {
      hovered: simpleEffect({ textDecoration: "none", color: zcolor.secondaryContainer }),
    },
  },

  "ListBox": {
    alignItems: "stretch",
    justifyContent: "start",
    border: zborder.thin,
  },
  "ListBox>TextLabel": {
    paddingInline: zspace.s2,
    font: zfont.inherit,
    //selectionColor: zcolor.secondaryContainer,
    selectionColor: zcolor.red,
    border: zborder.none,
    rounding: zrounding.none,
  },

  "Loader": {
    timeout: 2000,
    width: pct(100),
    height: pct(100),
    background: zcolor.secondaryContainer,
    viewOptions: {},
    errorMessage: "Retrieval failed",
  },

  "LogBox": {
    autoScrollToBottom: true,
  },

  "Menu": {
    titleFn: zutil.genericLabelFn,
    outline: zborder.none,
    rounding: zrounding.none,
    gap: zspace.s2,
    //effects: { hidden: transitions.fadeIn("in", 0.1) },
    //elevation: 2,
    tabIndex: 0,
    zIndex: 999,
    paddingBlock: zspace.s3,
    alignItems: "start",
    border: zborder.thin,
    borderColor: zcolor.lightgray,
    background: zcolor.background,
  },

  "Menu.Separator": {
    height: px(1),
    background: zcolor.secondaryContainer,
    border: zborder.thin,
  },
  "Menu.Item": {
    font: zfont.inherit,
    //controlSize: "sm",
    justifyContent: "start",
    padding: zspace.s0,
    border: zborder.none,
    rounding: zrounding.none,
    width: pct(100),
    selectionColor: zcolor.secondary,
    effects: simpleInteractionEffects(),
  },

  "MenuButton": {
    //effects: simpleInteractionEffects(),
    //titleFn: zutil.genericLabelFn,
    menuPlacement: place.bottom,
  },

  "MenuButton.Menu": {
    //paddingInline: em(0.5),
    font: zfont.label_large,
    rounding: zrounding.r1,
  },

  "Meter": {
    boxSizing: "border-box",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gridRowGap: rem(0.5),
    width: rem(12),
  },
  "Meter.TextLabel": {
    fontSize: rem(0.875),
    lineHeight: rem(1.25),
    fontWeight: 400,
    color: zcolor.gray,
  },

  "Meter.Value": {
    gridColumnStart: 2,
    margin: 0,
    fontSize: rem(0.875),
    lineHeight: rem(1.25),
    color: zcolor.gray,
    textAlign: "right",
  },
  "Meter.Track": {
    gridColumn: "1 / 3",
    overflow: "hidden",
    background: zcolor.gray,
    //box-shadow: inset 0 0 0 1px var(--color-gray-200);
    height: rem(0.5),
  },
  "Meter.Indicator": {
    background: zcolor.red,
    transition: "width 500ms",
    height: pct(100),
  },

  "NumberInput": {
    decimalPlaces: 0,
    width: ch(10),
  },

  "NumericInput": {
    decimalPlaces: 0,
    border: zborder.thin,
    background: zcolor.background,
  },
  "NumericInput>GenericTextInput": {
    border: zborder.none,
    borderLeft: zborder.thin,
    borderRight: zborder.thin,
    rounding: zrounding.none,
    textAlign: "center",
    width: calcSub(pct(100), ch(3)),
  },
  "NumericInput>Button": {
    aspectRatio: 1.0,
    rounding: zrounding.none,
    border: zborder.none,
    padding: zspace.none,
    paddingTop: px(1),
  },
  "NumericInput>TextLabel": {
    padding: zspace.none,
  },

  "Page": {
    width: pct(100),
    height: pct(100),
    maxWidth: ch(100),
    margin: css("0 auto"),
  },

  "PaginationBar": {
    gap: zspace.s5,
  },
  "PaginationBar.PageSize": {
    border: zborder.none,
  },
  "PaginationBar.TextLabel": {
    font: zfont.body_medium,
  },
  "PaginationBar.RangeText": {
    font: zfont.body_medium,
  },
  "PaginationBar.DropDown": {
    font: zfont.body_medium,
  },
  "PaginationBar.FirstButton": {
    ...paginationBarButtonOptions,
    leadingIconURI: "icon.first-page",
  },
  "PaginationBar.PreviousButton": {
    ...paginationBarButtonOptions,
    leadingIconURI: "icon.chevron-backward",
  },
  "PaginationBar.NextButton": {
    ...paginationBarButtonOptions,
    leadingIconURI: "icon.chevron-forward",
  },
  "PaginationBar.LastButton": {
    ...paginationBarButtonOptions,
    leadingIconURI: "icon.last-page",
  },

  "RadioButton": {
    onIcon: "icon.radio-button-on",
    offIcon: "icon.radio-button-off",
    background: zcolor.none,
    border: zborder.none,
  },

  "RadioGroup": {
    flexDirection: "column",
    background: zcolor.none,
    border: zborder.none,
  },

  "ScrollPane": {
    overflow: "auto",
  } satisfies ScrollPaneOptions,

  "SearchBox": {
    background: zcolor.none,
    border: zborder.thin,
    rounding: zrounding.r1,
    padding: zspace.s2,
    gap: zspace.none,
    width: ch(30),
  },
  "SearchBox>TextInput": {
    border: zborder.none,
    placeholder: "Search",
    flex: flexToken({ grow: 1 }),
    font: zfont.inherit,
    setOnInput: false,
  },
  "SearchBox>Icon": {
    alignSelf: "anchor-center",
    paddingRight: zspace.s3,
  },
  "SearchBox.ClearButton": {
    leadingIconURI: "icon.close",
    padding: zspace.none,
    border: zborder.none,
  },
  "SearchBox>MenuButton": {
    leadingIconURI: "icon.chevron-down",
    border: zborder.none,
    font: zfont.body_large,
  },
  "SearchBox>MenuButton>TextLabel": {
    font: zfont.body_medium,
  },

  "SegmentedButton": {
    //padding: zspace.s2,
    border: zborder.thin,
    rounding: zrounding.pill,
    background: zcolor.primary,
    //ripple: false,
    gap: px(1),
    overflow: "hidden",
    flexDirection: "row",
    backgroundClip: "padding-box",
  },

  "SegmentedButton>Button": {
    selectionColor: zcolor.primary.opacity(0.7),
    tooltipPlacement: place.bottom,
    ripple: false,
    background: zcolor.primaryContainer,
    border: zborder.none,
    rounding: zrounding.none,
    //padding: zspace.s1,
  },

  "SegmentedTextButton": {
    background: zcolor.none,
    border: zborder.none,
    borderRadius: zrounding.none,
    gap: em(0.5),
    paddingBottom: px(5),
  },

  "SegmentedTextButton>TextButton": {
    background: zcolor.none,
    border: zborder.none,
    borderRadius: zrounding.none,
    //selectionTextColor: zcolor.primary,
    selectionColor: zcolor.none,
  },

  "SegmentedTextButton.SelectionSegment": {
    borderTop: zborder.thin.color(zcolor.primary),
    position: "absolute",
    //transition: "all 0.3s",
    height: px(1),
    zIndex: 2,
  },

  "SelectionList": {
    //background: zcolor.surface,
    alignItems: "stretch",
    justifyContent: "start",
    border: zborder.thin,
  },

  "Sidebar": {
    contentMinWidth: pct(50),
    display: "flex",
    flexWrap: "wrap",
  } satisfies SidebarOptions,

  "SimpleSettings": {
    background: zcolor.background,
    //background: zcolor.secondaryContainer,
    effects: { hidden: transitions.slide("in&out", "right") },
    //alignItems: "stretch",
    //justifyContent: "start",
    //name: "Settings",
    zIndex: 1,
    position: "absolute",
    top: px(10),
    right: px(10),
    padding: zspace.s4,
    rounding: zrounding.r2,
    //height: pct(100),
    elevation: 1,
    gap: em(1),
    //minWidth: ch(20),
  } satisfies GridOptions,

  "SimpleSettings.Bar": {
    width: pct(100),
    justifyContent: "end",
  },
  "SimpleSettings.Button": {
    leadingIconURI: "icon.close",
    //justifySelf: "end",
    background: zcolor.inherit,
    border: zborder.none,
    //font: zfont.title_large,
    //marginBottom: em(0.5),
  } satisfies ButtonOptions,

  SimpleTree: {},

  "SimpleTree>ExpansionLabel": {
    padding: zspace.s0,
    border: zborder.none,
    rounding: zrounding.none,
    background: zcolor.inherit,
    font: zfont.inherit,
  },

  "Slider": {
    minVal: 0,
    maxVal: 100,
    minWidth: ch(10),
    radiusRatio: 10,
    leftColor: zcolor.primary,
    rightColor: zcolor.secondary,
    knobColor: zcolor.primary,
  },

  "SoftGrid": {
    minColumnWidth: ch(60),
    width: pct(100),
    display: "grid",
  } satisfies SoftGridOptions,

  "SplitGrid": {
    rowMins: [1],
    rowMaxes: [1],
    columnMins: [1],
    columnMaxes: [1],
    threshold: 2,
    background: zcolor.gray,
  } satisfies SplitGridOptions,

  "Sprite": {
    lazy: false,
  },

  "Stack": {
    display: "flex",
    flexWrap: "nowrap",
    alignItems: "center",
    justifyContent: "center",
  },

  "StringCellEditor": {
    setOnInput: false,
    textAlign: "center",
    position: "absolute",
    top: px(0),
    left: px(0),
    height: pct(100),
    width: pct(100),
    zIndex: 2,
    background: zcolor.background,
    firstFocus: true,
    selectOnFocus: true,
    font: zfont.inherit,
  },

  "StringDataCellView": {
    padding: zspace.s2,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    //userSelect: "text",
    userSelect: "none",
    background: zcolor.background,
    color: zcolor.primary,
    emptyValue: "&nbsp;",
    height: pct(100),
  },

  "SVGAvatar": {
    circular: true,
    size: 64,
    bgColor: zcolor.red,
    textColor: zcolor.white,
    font: zfont.body_large,
  },

  "SVGGroup": {
    x: 0,
    y: 0,
  } satisfies SVGGroupOptions,

  "SVGLabel": {
    bounds: rect2D(0, 0, 100, 100),
    textColor: zcolor.primary,
    userSelect: "none",
  },

  "Switch": {
    widthInEm: 3,
    rounding: zrounding.r4,
    border: zborder.thin,
    padding: zspace.s0,
    font: zfont.label_large,
    backgroundOn: zcolor.primary,
    backgroundOff: zcolor.secondaryContainer,
    circleColor: zcolor.white,
  },
  "Switch_Box": {
    rounding: zrounding.circle,
    transition: "left 0.25s",
  },

  "Table": {
    gridLines: "both",
    gap: px(1),
    background: zcolor.primary,
  } satisfies TableOptions<any>,

  "TableHeaderCellView": {
    color: zcolor.primary,
  },

  "TextArea": {
    background: zcolor.background,
    spellcheck: true,
    resize: "auto",
    cursor: "auto",
    outline: zborder.none,
    userSelect: "auto",
    display: "block",
  },

  "TextBox": {
    font: zfont.body_medium,
    color: zcolor.primary,
    background: zcolor.inherit,
    contentEditable: true,
    spellcheck: true,
    pastePlainText: false,
    cursor: "auto",
    outline: zborder.none,
    userSelect: "text",
    display: "block",
    overflow: "auto",
  },

  "TextButton": {
    background: zcolor.transparent,
    textColor: zcolor.primary,
    border: zborder.none,
    effects: defaultTextButtonInteractionEffects(),
  },
  "TextButton>TextLabel": {
    padding: zspace.none,
  },

  "TextDisclosure": {
    border: zborder.thin,
    flexDirection: "column",
    alignItems: "stretch",
    iconName: "icon.chevron-right",
    iconSide: "right",
    width: pct(100),
    initiallyCollapsed: true,
    stayOpen: false,
    outline: zborder.none,
    collapseDuration: 0.2,
    toggleOnSummaryClick: true,
    selectOnDetailClick: true,
    overflow: "hidden",
  },
  "TextDisclosure>ExpansionLabel": {
    border: zborder.none,
    rounding: zrounding.none,
  },

  "TextDisclosureList": {
    background: zcolor.surface,
    alignItems: "stretch",
    justifyContent: "start",
    border: zborder.thin,
    allowMultipleExpansions: true,
  },

  "TitledEnsemble": {
    alignItems: "stretch",
    justifyContent: "start",
    width: pct(100),
    height: pct(100),
    flexDirection: "row",
    //height: em(1.5),
    //alignItems: "center",
    //borderBottom: zborder.thin,
    padding: zspace.s2,
    menuIconName: "icon.show-menu",
    overflow: "hidden",
  } satisfies TitledEnsembleOptions,

  "TitledEnsemble.Ensemble": {
    background: zcolor.background,
    display: "flex",
    justifyContent: "center",
    width: pct(100),
    height: pct(100),
    alignItems: "center",
    padding: em(1),
  } satisfies EnsembleOptions<string>,

  "TitledEnsemble.MenuItem": {
    alignItems: "start",
    height: pct(100),
    marginRight: ch(2),
    border: zborder.none,
    borderRight: zborder.thin,
    borderBottom: zborder.thin,
    font: zfont.label_large,
    padding: zspace.s2,
  } satisfies ListBoxOptions,

  "TitledEnsemble.Title": {
    //width: pct(100),
    font: zfont.label_large.bold(),
    textAlign: "center",
  } satisfies LabelOptions,

  "TitledEnsemble.MenuButton": {
    font: zfont.title_medium,
    leadingIconURI: "icon.show-menu",
    border: zborder.none,
  } satisfies MenuButtonOptions<any>,

  "TitledEnsemble.TitleRow": {
    padding: zspace.s3,
    width: pct(100),
    gap: zspace.s3,
    borderBottom: zborder.thin,
  } satisfies StackOptions,

  "Toast": {
    background: zcolor.primaryContainer,
    color: zcolor.primary,
    font: zfont.label_medium,
    rounding: zrounding.r1,
    initialDelay: 0,
    duration: 1500,
    elevation: 0,
    padding: zspace.s2,
    border: zborder.thin,
    effects: { mounted: transitions.fadeIn() },
  } satisfies ToastOptions,

  "ToastStack": {
    background: zcolor.transparent,
    placement: place.bottomRight,
    alignItems: "end",
    justifyContent: "end",
    pointerEvents: "none",
    position: "absolute",
    gap: zspace.s3,
    initialDelay: 0,
    duration: 2000,
    mountEffect: transitions.fadeIn("in&out"),
  } satisfies ToastStackOptions,

  // "ToastButton>toastButtonItem": {
  //   font: zfont.label_medium,
  //   padding: zspace.s1,
  //   background: zcolor.primary,
  //   color: zcolor.white,
  //   rounding: zrounding.none,
  // },

  "ToastLayer": {
    position: "absolute",
    left: px(0),
    top: px(0),
    width: vw(100),
    height: vh(100),
    pointerEvents: "none",
    overflow: "hidden",
    background: zcolor.transparent,
    zIndex: 100,
  } satisfies HTMLOptions,

  "ToggleBox": {
    mode: "lazy",
    width: "fit-content",
    height: "fit-content",
  },

  "Toolbar": {
    flexDirection: "row",
    justifyContent: "start",
    height: em(1.5),
    gap: px(4),
    alignItems: "center",
    borderBottom: zborder.thin,
    padding: zspace.s2,
    menuIconName: "icon.show-menu",
    overflow: "hidden",
  },
  "Toolbar.MenuButton": {
    font: zfont.label_large,
    border: zborder.none,
    leadingIconURI: "icon.show-menu",
    rounding: zrounding.none,
  },

  "Tooltip": {
    padding: zspace.s2,
    background: zcolor.tertiaryContainer,
    pointerEvents: "none",
    zIndex: 999,
    opacity: 0.9,
    elevation: 0,
  } satisfies TooltipOptions,
  "Tooltip>TextLabel": {
    color: zcolor.primary,
    font: zfont.label_medium,
    fontSize: px(10),
  } satisfies LabelOptions,

  "TransferList": {
    background: zcolor.surface,
    alignItems: "stretch",
    justifyContent: "start",
    gap: zspace.s4,
  },
  "TransferList>ListBox": {
    background: zcolor.surface,
    alignItems: "stretch",
    justifyContent: "start",
    border: zborder.thin,
    minWidth: ch(10),
    paddingInline: zspace.s2,
  },
  "TransferList_Label": {
    padding: zspace.s0,
    font: zfont.inherit,
    selectionColor: zcolor.secondaryContainer,
    border: zborder.none,
    rounding: zrounding.none,
  },
  "TransferList_LeftButton": {
    label: ">",
    rounding: zrounding.pill,
  },
  "TransferList_RightButton": {
    label: "<",
    rounding: zrounding.pill,
  },

  "Tree": {
    background: zcolor.background,
    //font: zfont.title_medium,
    allowMultipleExpanded: true,
    collapsedIconName: "icon.chevron-right",
    expandedIconName: "icon.chevron-down",
    iconSide: "left",
    toggleOnTitleClick: true,
    expandOnTitleClick: true,
    alignItems: "stretch",
    justifyContent: "start",
    border: zborder.thin,
    overflow: "auto",
    indent: ch(1),
    showRoot: true,
    alwaysExpanded: false,
    selectLeavesOnly: false,
  },

  "URLInputBox": {
    border: zborder.none,
    gap: zspace.s3,
  },
  "URLInputBox>URLInput": {
    width: calc("100% - 2ch"),
  },
  "URLInputBox>Button": {
    leadingIconURI: "icon.open-link",
    border: zborder.none,
    controlSize: "lg",
  },

  "URLText": {
    errorMessage: "Failed to retrieve file",
  },

  "ValidBox": {
    alignItems: "start",
    width: pct(100),
    background: undefined,
  },

  "ValidBox>TextLabel": {
    font: zfont.label_large,
    color: zcolor.error,
  },

  "ValidationBox.stack": {
    alignItems: "start",
    justifyContent: "start",
    width: "auto",
  },
  "ValidationBox.staticValue": {
    border: zborder.thin.color(zcolor.primary.opacity(0.1)),
    font: zfont.body_medium,
    width: "auto",
  },

  "ValidationBox>TextLabel": {
    font: zfont.label_medium,
    color: zcolor.error,
    fontSize: px(12),
  } satisfies LabelOptions,

  "VDivider": {
    color: zcolor.gray,
    marginInline: zspace.s5,
    width: px(1),
    height: pct(90),
  } satisfies VDividerOptions,

  "Video": {
    autoplay: true,
    controls: true,
  },

  "ViewOverlay": {
    background: zcolor.transparent,
    position: "absolute",
    left: px(0),
    top: px(0),
    width: pct(100),
    height: pct(100),
    pointerEvents: "none",
    zIndex: 1,
    borderRadius: "inherit",
  } satisfies HTMLOptions,

  "VideoPlayerOverlay": {
    background: zcolor.transparent,
    outline: "none",
    position: "absolute",
    top: px(0),
  },

  "VirtualList.Container": {
    alignItems: "start",
    justifyContent: "start",
    border: zborder.none,
    overflow: "hidden",
    overflowY: "hidden",
  },

  "YouTubeIFrame": {
    controls: true,
    disableKeyboard: true,
    allowFullscreen: false,
    border: zborder.thin,
  },

  "ZStack": {
    offsetX: "0",
    offsetY: "0",
  } satisfies ZStackOptions,
};
