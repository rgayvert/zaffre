import { atom, closestCardinalPoint, point2D, Rect2D } from ":foundation";
import { Placement } from ":uifoundation";
import { View } from ":view";

export class CardinalPointsModel {
  view = atom<View | null>(null);
  mousePt = atom(point2D(0, 0));
  refPt = atom(() => closestCardinalPoint(this.view.get()?.clientRect() || Rect2D.emptyRect, this.mousePt.get()));
  boxPlace = atom<Placement>(() => ({ referencePt: this.refPt.get(), viewPt: "xcenter-ycenter" }));
}