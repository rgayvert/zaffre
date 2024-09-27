import { expect, test, describe } from "vitest";
import { atom, Atom, DerivedAtom, carouselAtom } from ":foundation";

const derivedNames = (a: Atom<unknown>): string => a.derivedAtoms.map((da) => da.options.name).join(",");
const referencedNames = (da: DerivedAtom<unknown>): string => Array.from(da.referencedAtoms).map((a) => a.options.name).join(",");

describe("atom", () => {
  const A = atom(1, { name: "A" });
  const B = atom(10, { name: "B" });
  const C = <DerivedAtom<number>>atom(() => A.get() + 1, { name: "C" });
  const D = <DerivedAtom<number>>atom(() => A.get() + C.get(), { name: "D" }); 

  test("A", () => {
    expect(A.get()).toBe(1);
    expect(A.toString()).toBe("Atom[id=0,name=A]");
    expect(derivedNames(A)).toBe("C,D");
  });
  test("B", () => {
    expect(B.get()).toBe(10);
  });
  test("C", () => {
    expect(C.get()).toBe(2);
    expect(referencedNames(C)).toBe("A");
    A.set(A.get() + 1);
    expect(A.get()).toBe(2);
    expect(C.get()).toBe(3);
  });
  test("D", () => {
    expect(D.get()).toBe(5);
    expect(referencedNames(D)).toBe("A,C");
  });

});

describe("carouselAtom", () => {
  const atom1 = carouselAtom(["abc", "def", "ghi", "jkl"], "ghi", { circular: true });

  test("first value", () => {
    expect(atom1.get()).toBe("ghi");
  });
  test("second value", () => {
    atom1.next();
    expect(atom1.get()).toBe("jkl");
  });
});
