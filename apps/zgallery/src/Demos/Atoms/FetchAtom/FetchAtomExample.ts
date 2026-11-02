import { TextLabel, fetchTextAtom, resolveURI } from "zaffre";

export const FetchAtomExample = () => {
  const url = resolveURI("info.sample");
  const fetchAtom = fetchTextAtom(url);
  return TextLabel(fetchAtom);
}
