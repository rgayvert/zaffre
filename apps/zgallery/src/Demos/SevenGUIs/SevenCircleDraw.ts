import { atom, pct, px, ch, VStack, LabelBox, Slider } from "zaffre";
import { em, SliderOptions, ButtonOptions, ViewList, zcolor, zborder, zspace } from "zaffre";
import { CenterBox, HStack, Button, SVG, SVGCircle } from "zaffre";
import { GCircle, SevenCircleDrawModel } from "./SevenCircleDrawModel";

export const SevenCircleDraw = () => {
  const model = new SevenCircleDrawModel();

  const Circle = (gcircle: GCircle) => {
    return SVGCircle({
      id: gcircle.id,
      cx: gcircle.x,
      cy: gcircle.y,
      r: gcircle.r,
      stroke: zcolor.black,
      strokeWidth: 1,
      fill: () => (model.selectedID.get() === gcircle.id ? zcolor.gray : zcolor.background),
      clickAction: (e: MouseEvent) => selectCircle(e, gcircle.id),
    });
  }

  const addCircle = (evt: MouseEvent) => {
    if (evt.target instanceof Element) {
      const box = evt.target.getBoundingClientRect();
      model.addCircleWithUndo(evt.clientX - box.left, evt.clientY - box.top);
    }
  };
  const selectCircle = (evt: MouseEvent, id: string) => {
    evt.stopPropagation();
    model.selectedID.set(id);
  };
  // group changes to the radius of a circle on slider drags
  const sliderOptions: SliderOptions = {
    width: em(8),
    minVal: 5,
    maxVal: 50,
    radiusRatio: 20,
    disabled: () => !model.hasSelection(),
    onDragStart: () => model.beginUndoGroup(),
    onDragEnd: () => model.endUndoGroup(),
  };
  const commonButtonOptions: ButtonOptions = {
    width: ch(10),
    background: zcolor.primaryContainer,
  };
  const buttonOptions: ButtonOptions[] = [
    { label: "Undo", action: () => model.undo(), disabled: () => !model.canUndo() },
    { label: "Redo", action: () => model.redo(), disabled: () => !model.canRedo() },
  ];

  return VStack({ gap: zspace.s4, justifyContent: "center", model: model }).append(
    HStack({ width: pct(100), gap: zspace.s5, justifyContent: "center" }).append(
      ...buttonOptions.map((opts) => Button({ ...opts, ...commonButtonOptions })),
      LabelBox("Radius:").append(Slider(model.selectedRadius, sliderOptions))
    ),
    CenterBox({ padding: zspace.s4, border: zborder.thin }).append(
      SVG({ width: px(400), height: px(400), clickAction: (e: MouseEvent) => addCircle(e) }).append(
        ViewList(
          model.circles,
          (circleSpec) => circleSpec.id,
          (circleSpec) => Circle(circleSpec)
        )
      )
    )
  );
};
