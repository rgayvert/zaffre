import { expect, test, describe } from "vitest";
import { backgroundToken, boxShadowToken, colorToken, imageToken, px, vmin } from ":attributes";
import { gradientAngle, gradientX, gradientY } from ":attributes";
import { lorem } from ":foundation";
import { Color } from ":uifoundation";
import { core, Theme, CoreKeyColors, coreTheme } from ":theme";

const greenKeyColors: CoreKeyColors = new Map([
  ["primary", Color.fromHex("#386a20")],
  ["secondary", Color.fromHex("#87957c")],
  ["tertiary", Color.fromHex("#6b9999")],
]);

const theme = coreTheme("green", greenKeyColors);
//const cp = core.color.primary;

const tk1 = boxShadowToken({
  color: core.color.primary,
  offsetX: px(2), 
  offsetY: px(3), 
  blurRadius: px(4), 
  spreadRadius: px(5),
  inset: true,
});

const s1 = tk1.formatWithTheme(theme);

describe("boxshadow1", () => {
  test("basic", () => {
    expect(s1).toBe("inset #2f541cff 2px 3px 4px 5px");
  });
});

const grX = gradientX(colorToken({ rgba: "ff0000" }), colorToken({ rgba: "0" }));
const s2 = grX.formatWithTheme(theme);

describe("gradientX", () => {
  test("basic", () => {
    expect(s2).toBe("linear-gradient(to right #ff0000ff #0000ffff)");
  });
});

const grY = gradientY(colorToken({ rgba: "ff0000" }), colorToken({ rgba: "0" }));
const s3 = grY.formatWithTheme(theme);

describe("gradientY", () => {
  test("basic", () => {
    expect(s3).toBe("linear-gradient(to bottom #ff0000ff #0000ffff)");
  });
});

const grA = gradientAngle(colorToken({ rgba: "ff0000" }), colorToken({ rgba: "0" }), 45);
const s4 = grA.formatWithTheme(theme);

describe("gradientA", () => {
  test("basic", () => {
    expect(s4).toBe("linear-gradient(45deg #ff0000ff #0000ffff)");
  });
});

const imageSrc = lorem.image(100, 100);
const im1 = imageToken({ src: imageSrc });
const s5 = im1.formatWithTheme(theme);

describe("image1", () => {
  test("basic", () => {
    expect(s5).toBe(`image(${imageSrc})`);
  });
});

const bk1 = backgroundToken({ image: im1 });
const s6 = bk1.formatWithTheme(theme);

describe("background1", () => {
  test("basic", () => {
    expect(s6).toBe(s5);
  });
});

const bk2 = backgroundToken({ image: grA });
const s7 = bk2.formatWithTheme(theme);

describe("background2", () => {
  test("basic", () => {
    expect(s7).toBe(s4);
  });
});


test("vmin(10)", () => {
  expect(vmin(10).formatWithTheme(Theme.default)).toBe("10vmin");
});
