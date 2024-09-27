import { isSVGView, SVG, SVGDelegate } from "./SVG";
import { Effect, EffectTarget, EffectDirection, EffectPromise } from ":effect";
import { css_color } from ":attributes";
import { core } from ":theme";
import { View } from ":view";
import { SVGCircle } from "./SVGShape";

//
//
//

export class SVGEffect extends Effect {

    public static ripple(duration = 0.3, maxDiameter = 0, color: css_color = core.color.gray): SVGEffect {
      return new SVGEffect(duration, maxDiameter, color);
    }
  
    constructor(public duration: number, public maxDiameter = 0, public color: css_color) {
      super("in", { name: "ripple" });
    }
    async applyToTarget(target: EffectTarget, direction: EffectDirection): EffectPromise {
      if (!target.clickPoint) {
        // too early to apply (e.g., route expansion)
        return Promise.resolve(true);
      }
      const rect = target.clientRect();
      const pt = target.clickPoint.subtract(rect.origin);
      let diameter = Math.max(rect.width, rect.height);
      if (this.maxDiameter) {
        diameter = Math.min(this.maxDiameter, diameter);
      }
      //zlog.debug("pt="+pt);
  
      const svg = SVG({ bounds: rect });   // is this right?
      const circle = SVGCircle({ cx: pt.x, cy: pt.y, fill: this.color });
      svg.elt.style.position = "absolute";
      svg.append(circle);

      let overflow;
  
      if (target instanceof View && isSVGView(target)) {
        const delegate = <SVGDelegate>(<View>target).delegate;
        if (delegate.isContainer()) {
          delegate.view.append(svg);
          delegate.view.renderChild(svg);
        } else {
          delegate.container()?.append(svg);
          delegate.container()?.renderChild(svg);
        }
      } else if (target instanceof View) {
        target.append(svg);
        target.renderChild(svg);
        overflow = target.elt.style.overflow;
        target.elt.style.overflow = "hidden";
      }
  
      const keyFrames = [{ r: 0 }, { r: diameter, opacity: 0 }];
      const options: KeyframeAnimationOptions = {
        duration: this.duration * 1000,
        fill: "none",
      };
      await circle.elt.animate(keyFrames, options).finished;
      svg.remove();
      if (target instanceof View) {
        target.elt.style.overflow = overflow || "";
      }
  
      return Promise.resolve(true);
    }
  }
  