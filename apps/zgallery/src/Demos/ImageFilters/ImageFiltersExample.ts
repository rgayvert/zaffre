import { CenterBox, Canvas, Slider, Spacer, VStack, FileInput, zfont, zspace } from "zaffre";
import { pct, ch, em, Grid, HStack, TextLabel } from "zaffre";
import { FilterSpec, ImageFiltersModel } from "./ImageFiltersModel";

export const ImageFiltersExample = () => {
  const model = new ImageFiltersModel();

  const FilterSlider = (spec: FilterSpec) => {
    return Slider(spec.value, {
      minVal: 0,
      maxVal: spec.max,
      width: ch(10),
      radiusRatio: 15,
      alignSelf: "center",
    });
  }
  return HStack({ gap: zspace.s5 }).append(
    VStack({
      alignItems: "center",
      justifyContent: "start",
      gap: em(0.2),
      font: zfont.body_medium,
      padding: zspace.s5,
    }).append(
      FileInput(model.imageFiles, {
        multiple: false,
        showFiles: false,
        accept: ".jpg, .jpeg, .png",
        label: "Change image",
        font: zfont.label_large,
      }),
      Spacer("s6"),
      Grid({
        ncolumns: 2,
        nrows: 9,
        gridAutoFlow: "column",
        columnGap: ch(1),
        rowGap: zspace.s2,
      }).append(
        ...model.filters.map((spec) => TextLabel(spec.title)), 
        ...model.filters.map((spec) => FilterSlider(spec))
      )
    ),
    CenterBox({ maxWidth: pct(70) }).append(
      Canvas({
        padding: zspace.s3,
        imageSrc: model.imageSrc,
        width: pct(100),
        filter: model.filter,
      })
    )
  );
}
