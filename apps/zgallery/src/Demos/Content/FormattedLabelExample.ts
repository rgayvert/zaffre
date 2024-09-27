import { core, View, pct, LabelBox, FormattedLabel, evaluateWithLocalDefaults } from "zaffre";
import { NumericFormatter, DateTimeFormatter, Grid, GridOptions } from "zaffre";

export function FormattedLabelExample(options: GridOptions = {}): View {
  const numericValue = 12345.6789;
  const dateValue = new Date();

  function FormattedLabels(): View {
    const intl = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
    return Grid({ ...options, width: pct(100), gap: core.space.s5, ncolumns: 4 }).append(
      LabelBox("Plain:").append(FormattedLabel(numericValue, NumericFormatter({}))),
      LabelBox("Fixed(2):").append(FormattedLabel(numericValue, NumericFormatter({ fixed: 2 }))),
      LabelBox("Precision(4):").append(FormattedLabel(numericValue, NumericFormatter({ precision: 4 }))),
      LabelBox("Exponential(5):").append(FormattedLabel(numericValue, NumericFormatter({ exponential: 5 }))),
      LabelBox("Round:").append(FormattedLabel(numericValue, NumericFormatter({ round: "round" }))),
      LabelBox("Floor:").append(FormattedLabel(numericValue, NumericFormatter({ round: "floor" }))),
      LabelBox("Ceiling:").append(FormattedLabel(numericValue, NumericFormatter({ round: "ceiling" }))),
      LabelBox("DE-Currency:").append(FormattedLabel(numericValue, NumericFormatter({ intl: intl }))),
      LabelBox("DD-MM-YYYY").append(FormattedLabel(dateValue, DateTimeFormatter("DD-MM-YYYY"))),
      LabelBox("HH:mm:ss").append(FormattedLabel(dateValue, DateTimeFormatter("HH:mm:ss"))),
      LabelBox("ddd MMM D").append(FormattedLabel(dateValue, DateTimeFormatter("ddd MMM D"))),
      LabelBox("MMM D, YYYY").append(FormattedLabel(dateValue, DateTimeFormatter("MMM D, YYYY")))
    );
  }

  const localDefaults = {
    "LabelBox": {
      placementPt: "xstart-ystart",
      labelOptions: {
        font: core.font.label_large.bold(),
        color: core.color.secondary,
      },
    },
    "FormattedLabel": {
      border: core.border.thin,
      padding: core.space.s2,
      color: core.color.red,
    },
  };
  return evaluateWithLocalDefaults(localDefaults, () => FormattedLabels());
}
