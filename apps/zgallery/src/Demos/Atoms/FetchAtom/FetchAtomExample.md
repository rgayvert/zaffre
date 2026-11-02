An *Atom* is a generic reactive value. For example you can have
```js
  const num: Atom<number> = atom(42);
```
or
```js
  const arr: Atom<string[]> = atom(["abc", def""]);
```
To access the value of an atom you need to use the *get()* method, and to change the value you must use *set()*. The primary utility of atoms comes from the *actions* that are attached. An action associated with an atom will be evaluated whenever its value changes.


When an atom that is referenced in a component content or attribute option, the framework will automatically give the atom an action (a *reactive action*) that will update the component whenever the value of the atom changes.


Atoms can be extended to encapsulate a variety of common patterns. In this first example, we have a kind of FetchAtom, which handles the interactions involved in retrieving a value through the Fetch API. This particular case is a FetchTextAtom, which takes a URL and sets its value when the data arrives. This in turn causes the TextLabel to be updated.


Notes:
  - External resources, URLs, and literals are always stored in public/assets/resource.json, and are referenced symbolically with keys like info.sample, icon.copy, and so on.
  - The function resolveURI looks up a resource in this file, and takes care of any asset path issues. 