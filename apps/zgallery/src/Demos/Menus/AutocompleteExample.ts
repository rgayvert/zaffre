import { Autocomplete, atom, pickList, lorem } from "zaffre";

export const AutocompleteExample = () => {
  const movies = lorem.movies(20).sort((a, b) => a.title.localeCompare(b.title));
  const input = atom("");
  const list = pickList([], movies, {
    labelFn: (movie) => movie?.title || "",
    action: (val) => console.log(JSON.stringify(val)),
  });

  return Autocomplete(input, list);
};
