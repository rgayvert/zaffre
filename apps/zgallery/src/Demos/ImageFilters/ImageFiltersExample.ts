import { CenterBox, Canvas, Slider, Spacer, VStack, View, core, FileInput } from "zaffre";
import { pct, ch, em, Grid, HStack, TextLabel } from "zaffre";
import { FilterSpec, ImageFiltersModel } from "./ImageFiltersModel";

export function ImageFiltersExample(): View {
  const model = new ImageFiltersModel();

  function FilterSlider(spec: FilterSpec): View {
    return Slider(spec.value, {
      minVal: 0,
      maxVal: spec.max,
      width: ch(10),
      radiusRatio: 15,
      alignSelf: "center",
    });
  }
  return HStack({ gap: core.space.s5 }).append(
    VStack({
      alignItems: "center",
      justifyContent: "start",
      gap: em(0.2),
      font: core.font.body_medium,
      padding: core.space.s5,
    }).append(
      FileInput(model.imageFiles, {
        multiple: false,
        showFiles: false,
        accept: ".jpg, .jpeg, .png",
        label: "Change image",
        font: core.font.label_medium,
      }),
      Spacer(core.space.s6),
      Grid({
        ncolumns: 2,
        nrows: 9,
        gridAutoFlow: "column",
        columnGap: ch(1),
        rowGap: core.space.s2,
      }).append(
        ...model.filters.map((spec) => TextLabel(spec.title)), 
        ...model.filters.map((spec) => FilterSlider(spec))
      )
    ),
    CenterBox({ maxWidth: pct(70) }).append(
      Canvas({
        padding: core.space.s3,
        imageSrc: model.imageSrc,
        width: pct(100),
        filter: model.filter,
      })
    )
  );
}
