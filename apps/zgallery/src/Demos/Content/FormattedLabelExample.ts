import { core, View, pct, LabelBox, FormattedLabel, Formatter, LabelBoxOptions } from "zaffre";
import { NumericFormatter, DateTimeFormatter, Grid, GridOptions } from "zaffre";

export function FormattedLabelExample(options: GridOptions = {}): View {
  const num = 12345.6789;
  const date = new Date();
  const intl = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
  const labelOptions: LabelBoxOptions = {
    placementPt: "xstart-ystart",
    labelOptions: {
      font: core.font.label_large.bold(),
      color: core.color.tertiary,
    },
  };

  const numEntries: [string, number, Formatter<number>][] = [
    ["Plain:", num, NumericFormatter({})],
    ["Fixed(2):", num, NumericFormatter({ fixed: 2 })],
    ["Precision(4):", num, NumericFormatter({ precision: 4 })],
    ["Exponential(5):", num, NumericFormatter({ exponential: 5 })],
    ["Round:", num, NumericFormatter({ round: "round" })],
    ["Floor:", num, NumericFormatter({ round: "floor" })],
    ["Ceiling:", num, NumericFormatter({ round: "ceiling" })],
    ["DE-Currency:", num, NumericFormatter({ intl: intl })],
  ];
  const dateEntries: [string, Date, Formatter<Date>][] = [
    ["DD-MM-YYYY", date, DateTimeFormatter("DD-MM-YYYY")],
    ["HH:mm:ss", date, DateTimeFormatter("HH:mm:ss")],
    ["ddd MMM D", date, DateTimeFormatter("ddd MMM D")],
    ["MMM D, YYYY", date, DateTimeFormatter("MMM D, YYYY")],
  ];

  function FormattedLabels(): View {
    return Grid({ ...options, width: pct(100), gap: core.space.s5, ncolumns: 4 }).append(
      ...numEntries.map(([label, val, formatter]) => LabelBox(label, labelOptions).append(FormattedLabel(val, formatter))),
      ...dateEntries.map(([label, val, formatter]) => LabelBox(label, labelOptions).append(FormattedLabel(val, formatter))),
      );
  }
  return FormattedLabels();
}
