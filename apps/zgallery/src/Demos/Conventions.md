Conventions and Terminology

To follow the source code, it's helpful to know some of the naming conventions that are used, along with the intended meanings of common terms (whether you like them or not).

**Naming conventions:**

- Uppercase function = Component
  - ex: Box, Button, Stack
- Uppercase in type context = Class | Interface | Type | Enum
  - ex: Token, ViewOptions, BasicAction
- Lowercase noun = create instance of some class
  - ex: atom, point2D, colorToken
- Lowercase verb = general function
  - ex: convertColor
- Lowercase noun starting with 'z' = ZType\<type\>
  - ex: znumber, zboolean, zstring
- Lowercase verb starting with 'z' = function on a ZType
  - ex: zget
- SimpleXXX = string version of generic

**Terminology:**

- ZType\<T\> = T | Atom\<T\>
  - that is, a value which is either a simple type or a reactive type
  - ex: ZType\<string\> is either a number or an Atom\<string\> (aka zstring)
- action = closure, often used when reactive values change
- animation = CSS or Zaffre animation
- atom = reactive value
- attribute = CSS/HTML/SVG property
- control = interactive component with a user-modifiable value
- content = component that has innerHTML/innerText, value, url, or source
- derived atom = reactive value defined as a function of other reactive values
- disclosure = component that contains a title and toggling detail
- effect = animation or transition
- floating = temporary view that appears in the floating layer
- foundation = core non-UI classes/functions
- handler = object that manages a set of event types
- input = interactive component that allows a simple value to be edited
- layers = top-level, full-window containers for floating views, dialogs, toast
- layout = component whose purpose is to arrange and manage other components
- lorem = testing data generator
- model = object which controls one or more components via reactive values
- option = optional value passed to component; may be attribute or other value
- option bundle = named collection of non-reactive component options; analogous to css class
- placement = specification of relative arrangement of two components
- routing = navigation within the app in conjunction with browser history
- service = external package encapsulated in a well-defined API
- theme = collection of mappings of tokens to attribute values
- token = object which is converted into attributes by a theme
- view = object containing an HTML or SVG element
- viewlist = pseudocomponent that manages reactive lists of components

**Monorepo Organization:**

- vite/rollup, pnpm
- top-level
  - package.json, tsconfig-base.json, tsconfig.json, vite.config.ts
  - tsconfig-base.json is referenced in each subfolder tsconfig.json
- apps
  - each app has index.html, package.json, tsconfig.json, vite.config.js
  - public contains assets
  - src contains entry point \<app\>.ts
  - each src subfolder has index.ts
- packages
  - each package has index.ts, package.json, tsconfig.json
  - each src subfolder has index.ts
- external dependencies
  - limited to services
- internal dependencies
  - folders are arranged to avoid circular dependencies (checked with dpdm)
  - only a few class interfaces (ITheme, IToken) are currently required
- tsconfig-base includes paths to important source folders
  - import from "zaffre" is all that is necessary from an application
  - inside components, ":core" should be used
- imports
  - in source files, arranged from top to bottom
  - ex: Form.ts has :core -> ../Layout -> ./ValidationBox

**VS Code settings:**

- auto-import is essential, but doesn't always pick up the best path/alias
- prettier line width set to 120
- eslint set to defaults

**Testing:**

- set up for vitest
- used for some foundation testing
- need lots more
