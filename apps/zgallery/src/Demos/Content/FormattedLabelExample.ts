import { pct, LabelBox, FormattedText, zspace } from "zaffre";
import { Formatter, LabelBoxOptions } from "zaffre";
import { NumericFormatter, DateTimeFormatter, Grid, GridOptions } from "zaffre";

export const FormattedLabelExample = (options: GridOptions = {}) => {
  const num = 12345.6789;
  const date = new Date();
  const intl = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
  const opts1: LabelBoxOptions = {
    placementPt: "xcenter-ystart",
  };
  const opts2: LabelBoxOptions = {
    placementPt: "xcenter-yend",
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

  return Grid({ ...options, width: pct(100), gap: zspace.s5, ncolumns: 4 }).append(
    ...numEntries.map(([label, val, formatter]) => LabelBox(label, { ...opts1 }).append(FormattedText(val, formatter))),
    ...dateEntries.map(([label, val, formatter]) => LabelBox(label, { ...opts2 }).append(FormattedText(val, formatter)))
  );
};
