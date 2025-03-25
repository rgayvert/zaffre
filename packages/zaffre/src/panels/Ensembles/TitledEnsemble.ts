import { ch, em, pct } from ":attributes";
import { Button, Ensemble, EnsembleOptions, Floating, HStack, ListBox, StringListBox } from ":components";
import { SimpleMenu, StackOptions, TextLabel, VStack } from ":components";
import { atom, Atom, ZArray } from ":foundation";
import { core } from ":theme";
import { BV, ChildCreator, defineComponentBundle, mergeComponentOptions, View } from ":view";

export interface TitledEnsembleOptions extends StackOptions {
  menuIconName?: string;
  ensembleOptions?: EnsembleOptions;
  titleFn?: (childName: string) => string;
  listCollapsed?: Atom<boolean>;
}
defineComponentBundle<TitledEnsembleOptions>("TitledEnsemble", "Stack", {
  flexDirection: "row",
  justifyContent: "start",
  height: em(1.5),
  alignItems: "center",
  borderBottom: core.border.thin,
  padding: core.space.s2,
  menuIconName: "icon.show-menu",
  overflow: "hidden",
});

export function TitledEnsemble(
  currentChildName: Atom<string>,
  labels: ZArray<string>,
  values: ZArray<string>,
  childCreator: ChildCreator<string>,
  inOptions: BV<TitledEnsembleOptions> = {}
): View {
  const options = mergeComponentOptions("TitledEnsemble", inOptions);
  options.model = [currentChildName, labels, values];

  function ChildMenu(): View {
    return Button({
      font: core.font.title_medium,
      border: core.border.none,
      leadingIconURI: "icon.show-menu",
      hidden: options.listCollapsed ? atom(() => !options.listCollapsed?.get()) : atom(true),
    }).append(
      Floating(
        SimpleMenu(currentChildName, values, (v, index) => labels.at(index || 0) || ""),
        {
          placement: {
            referencePt: "xstart-yend",
            viewPt: "xstart-ystart",
          },
          font: core.font.body_large,
        }
      )
    );
  }

  function ChildList(): View {
    return ListBox(values, currentChildName, (v, index) => labels.at(index || 0) || "", {
      alignItems: "start",
      hidden: options.listCollapsed,
      height: pct(100),
      marginRight: ch(2),
      border: core.border.none,
      borderRight: core.border.thin,
      borderBottom: core.border.thin,
      font: core.font.label_medium,
      padding: core.space.s2,
    });
  }

  return VStack({
    alignItems: "stretch",
    justifyContent: "start",
    width: pct(100),
    height: pct(100),
  }).append(
    HStack({
      padding: core.space.s3,
      //marginBottom: core.space.s3,
      width: pct(100),
      gap: core.space.s3,
      borderBottom: core.border.thin,
    }).append(
      ChildMenu(),
      TextLabel(
        atom(() => options.titleFn?.(currentChildName.get()) || ""),
        {
          width: pct(100),
          font: core.font.label_medium.bold(),
          textAlign: "center",
        }
      )
    ),
    HStack({ alignItems: "center", justifyContent: "center" }).append(
      ChildList(),
      Ensemble(currentChildName, (key, index) => childCreator(key, index), {
        ...options.ensembleOptions,
        background: core.color.background,
        display: "flex",
        justifyContent: "center",
        height: pct(100),
        alignItems: "center",
      })
    )
  );
}
