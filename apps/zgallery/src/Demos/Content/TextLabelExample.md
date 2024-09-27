Zaffre has a relatively small number of components which can contain content; that is, elements with innerHTML/innerText, value, url, or source attribute. All other components are built from these building blocks; they may add layout, event handlers, effects, and other behaviors, but not content.

A TextLabel is the simplest content component. The rendering process yelds a \<div> with non-wrapping, non-selectable innerHTML. The value provided may be a literal string or a string atom (a zstring). A variety of styles can be applied through the options passed in. 