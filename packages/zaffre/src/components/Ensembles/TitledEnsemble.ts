import { addClass } from ":view";
import { ch } from ":attributes";
import { atom, Atom } from ":foundation";
import { Ensemble, HStack, Spacer, StackOptions, VStack } from "../Layout";
import { MenuButton } from "../Floating";
import { TitledEnsembleModel } from "./TitledEnsembleModel";
import { TextLabel } from "../Content";

export interface TitledEnsembleOptions extends StackOptions {
  menuIconName?: string;
  titleFn?: (childName: string) => string;
  listCollapsed?: Atom<boolean>;
}

export const TitledEnsemble = <T extends string>(model: TitledEnsembleModel<T>, inOptions: TitledEnsembleOptions = {}
) => {
  const options = addClass(inOptions, "TitledEnsemble");
  options.model = model;

  const ChildMenu = () => {
    return MenuButton(model.childList, {
      cls: "TitledEnsemble.MenuButton",
      leadingIconURI: options.menuIconName,
      menuPlacement: { referencePt: "xstart-yend", viewPt: "xstart-ystart" },
    });
  };

  const selection = atom(() => model.childList.lastSelection?.get()?.value || "");

  return VStack(options).append(
    HStack({ cls: "TitledEnsemble.TitleRow", gap: ch(1), model: [model.childList, options.titleFn] }).append(
      Spacer(1),
      ChildMenu(),
      TextLabel(() => model.childList.selectedLabel(), { cls: "TitledEnsemble.Title" }),
      Spacer(1)
    ),
    HStack({ alignItems: "center", justifyContent: "center" }).append(
      Ensemble(selection, (key, index) => model.childCreator(<T>key, index), { cls: "TitledEnsemble.Ensemble" })
    )
  );
};

////////////////////////////////////////////////////////////////////////////////////////////////////////

// export const FixedTitledEnsemble = <T extends string>(
//   currentKey: Atom<T>,
//   labels: ZArray<string>,
//   values: ZArray<string>,
//   creators: EnsembleViewCreators<T>,
//   options: TitledEnsembleOptions = {}
// ) => {

//   return TitledEnsemble(currentKey, labels, values, (key) => creators[key as T]() , options);
// }