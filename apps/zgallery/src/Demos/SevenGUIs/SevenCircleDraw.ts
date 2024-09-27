import { core, atom, pct, px, ch, VStack, LabelBox, Slider, em, SliderOptions, ButtonOptions, ViewList } from "zaffre";
import { View, CenterBox, HStack, Button, SVG, SVGCircle } from "zaffre";
import { GCircle, SevenCircleDrawModel } from "./SevenCircleDrawModel";

export function SevenCircleDraw(): View {
  const model = new SevenCircleDrawModel();

  function Circle(gcircle: GCircle): View {
    return SVGCircle({
      id: gcircle.id,
      cx: gcircle.x,
      cy: gcircle.y,
      r: gcircle.r,
      stroke: core.color.black,
      strokeWidth: 1,
      fill: atom(() => (model.selectedID.get() === gcircle.id ? core.color.gray : core.color.background)),
      clickAction: (e) => selectCircle(e, gcircle.id),
    });
  }

  function addCircle(evt: MouseEvent): void {
    if (evt.target instanceof Element) {
      const box = evt.target.getBoundingClientRect();
      model.addCircleWithUndo(evt.clientX - box.left, evt.clientY - box.top);
    }
  }
  function selectCircle(evt: MouseEvent, id: string): void {
    evt.stopPropagation();
    model.selectedID.set(id);
  }
  // group changes to the radius of a circle on slider drags
  const sliderOptions: SliderOptions = {
    width: em(8),
    minVal: 5,
    maxVal: 50,
    radiusRatio: 20,
    disabled: atom(() => !model.hasSelection()),
    onDragStart: () => model.beginUndoGroup(),
    onDragEnd: () => model.endUndoGroup(),
  };
  const commonButtonOptions: ButtonOptions = {
    width: ch(10),
    background: core.color.primaryContainer,
  };
  const buttonOptions: ButtonOptions[] = [
    { label: "Undo", action: () => model.undo(), disabled: atom(() => !model.canUndo()) },
    { label: "Redo", action: () => model.redo(), disabled: atom(() => !model.canRedo()) },
  ];

  return VStack({ gap: core.space.s4, justifyContent: "center" }).append(
    HStack({ width: pct(100), gap: core.space.s5, justifyContent: "center" }).append(
      ...buttonOptions.map((opts) => Button({ ...opts, ...commonButtonOptions })),
      LabelBox("Radius:").append(Slider(model.selectedRadius, sliderOptions))
    ),
    CenterBox({ padding: core.space.s4, border: core.border.thin }).append(
      SVG({ width: px(400), height: px(400), clickAction: (e) => addCircle(e) }).append(
        ViewList(
          model.circles,
          (circleSpec) => circleSpec.id,
          (circleSpec) => Circle(circleSpec)
        )
      )
    )
  );
}
