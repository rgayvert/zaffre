import { SimpleAnimationItem, SVG, View, core, px, rect2D, SVGCircle, SVGRectangle, pct } from "zaffre";
import { counterAtom, atom, Atom, zutil, point2D, Point2D, AnimationModel } from "zaffre";
import { em, Switch, VStack, filterToken } from "zaffre";

//
// Adapted from https://codepen.io/manifestinteractive/pen/azdGyv
//

// Configuration options for pendulum waves
const config = {
  nballs: 75,
  height: 300,
  shift: 0.02,
  radius: 5,
  period: 2,
  maxBlur: 2,
  maxBrightness: 5,
};

// A pendulum ball just moves vertically according to a sinusoidal formula, and varies
// its brightness and blur as a function of y
class Ball extends SimpleAnimationItem {
  count = counterAtom(0);
  brightness: Atom<number>;
  blur: Atom<number>;
  constructor(public index: number, public initialLocation: Point2D) {
    super(initialLocation);
    const k = this.index / (2 * config.radius * config.nballs) + config.shift;
    const y = atom(() => 0.9 * (config.height / 2) * Math.sin(this.count.get() * k));
    this.location = atom(() => point2D(initialLocation.x, y.get()));
    this.brightness = atom(() => config.maxBrightness * (y.get() / config.height + 0.5) + 1);
    this.blur = atom(() => config.maxBlur * (y.get() / config.height + 0.5));
  }
  step(_deltaT: number): void {
    this.count.increment();
  }
}
class PendulumWavesModel extends AnimationModel {
  balls: Ball[];
  constructor() {
    super();
    this.balls = zutil.sequence(0, config.nballs).map((index) => this.createBall(index));
    this.add(...this.balls);
  }
  createBall(index: number): Ball {
    const initialLocation = point2D((index + 0.5) * config.radius * 2, (config.height - config.radius) / 2);
    return new Ball(index, initialLocation);
  }
}

// An animation of a collection of balls that individually move vertically but create
// varying sinusoidal patterns over time.
export function PendulumWavesExample(): View {
  const model = new PendulumWavesModel();
  const width = config.nballs * config.radius * 2;
  const r = rect2D(0, -config.height / 2, width, config.height);
  return VStack({ width: pct(90), gap: core.space.s5, marginTop: em(4) }).append(
    SVG({ bounds: r, width: pct(100), height: px(config.height) }).append(
      SVGRectangle({ rect: r, fill: core.color.black }),
      ...model.balls.map((ball) =>
        SVGCircle({
          id: `ball-${ball.index}`,
          r: config.radius,
          c: ball.location,
          fill: core.color.primary,
          filter: filterToken(ball.brightness, ball.blur),
          model: ball,
        })
      )
    ),
    Switch(model.running)
  );
}
