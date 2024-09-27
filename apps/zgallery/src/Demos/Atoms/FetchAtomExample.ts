import { View, core, TextLabel, fetchTextAtom, resolveURI } from "zaffre";

export function FetchAtomExample(): View {
    const url = resolveURI("info.sample");
    const fetchAtom = fetchTextAtom(url);

  return TextLabel(fetchAtom, {
    font: core.font.body_large,
  });
}
