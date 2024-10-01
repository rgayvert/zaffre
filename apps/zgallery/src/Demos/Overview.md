Creating a web application using current development tools can be complicated. The process typically involves multiple technologies (HTML/CSS/JS/SVG), a myriad of APIs and dependencies, and a complex workflow. Zaffre is an experimental webapp framework which attempts to reduce this complexity by using a single language (Typescript) together with a reactive mechanism that encourages building higher-level abstractions via declarative composition. There are no required runtime dependencies, and the build process is simplified with vite and rollup. The result is that you effectively get reactive CSS, HTML, and SVG without having to code in those languages.

In Zaffre you use Typescript to create a model containing reactive values, along with a view hierarchy defined declaratively. The views then create a parallel hierarchy in the DOM (HTML/SVG elements). Reactive values in the model are tied to attributes in the views, which are passed along to the DOM in the form of HTML/CSS/SVG attributes. When a reactive value changes, it triggers actions (closures) which produces changes to view attributes, which in turn yield changes in the DOM.

<p align="center"><img src='./assets/DOM<<DARK_MODE_SUFFIX>>.png' width="40%"></p>

 
Here's a basic example of a Zaffre component that uses reactive content and styling.

```js
  function HelloWorld1(): View {
    // a reactive value
    const text = atom("Hello World");      
    return VStack({
      padding: core.space.s6,
      maxWidth: ch(120),
    }).append(
      // text input with reactive update on any input
      TextInput(text, {
        rounding: core.rounding.pill,      
        border: core.border.thin,
        textAlign: "center",
        font: core.font.display_medium,
        placeholder: "Enter some text",
      }),
      // text label with reactive content and style
      TextLabel(text, {                    
        color: core.color.primary,
        opacity: atom(() => zutil.clamp(text.get().length / 20, 0, 1)), 
        font: core.font.headline_medium,
      })
    );
  }
```

This produces the following result:
<p align="center"><img src='./assets/HelloWorld1<<DARK_MODE_SUFFIX>>.png' width="40%"></p>

<details>
  <summary>
See this in action
</summary>
<p align="center"><video src='./assets/HelloWorld1.mp4' controls width="40%" ></p>
</details>

<br/>
<br/>

A Zaffre *component* is just a function which returns an opaque View object. In this sample, the HelloWorld1 component is defined as a composition of three other components: VStack, TextInput, and TextLabel. The Zaffre rendering process builds the HTML elements and CSS styles dynamically, so no external HTML or CSS files are needed. The reactive text value (an "atom") is shared by the input and label components. When this value is changed by the user in the input field, the label will be updated automatically. This is an example of reactive content. The opacity of the label is specified as a *derived atom*, which in this case is a function of the text atom. This yields a reactive CSS attribute; that is, the opacity will automatically change when the length of the text value changes.

#### Some notes:

  - Composition is done with the *append()* method.
  - Each component typically takes a list of *options* which result in CSS/HTML/SVG attributes being set on the underlying DOM element.
  - CSS styles are generated automatically from component options. Reactive CSS values are translated into element-level CSS variables.
  - This example uses inline options. Non-reactive options may be grouped into reusable *fashions*, which are analogous to CSS stylesheets.
  - A component may have one or more required arguments if they are always needed; for example, a TextLabel requires a label (a literal or reactive string).
  - Attributes are often specified using *tokens*. A token is an object that combines with the current *theme* to construct HTML/CSS attributes. 
  - The *core* object contains a collection of predefined tokens for color, font, borders, space, and rounding. These are generally turned into CSS properties when rendered.
  - Components are never manipulated directly once they are created. Any varying aspect of a component should be represented in terms of reactive values in the model. User interaction with a component typically produces changes in the model, which in turn causes changes to other components.
  - HTML and SVG are treated as near equals. Some components may be built almost entirely in SVG (e.g., sliders).

DOM structure can also be reactive. Below is a simple example.  

```js
  class HelloModel4 {
    counter = 3;
    values = arrayAtom([1, 2, 3]);
    disabled = atom(() => this.values.length === 1);
    addValue(): void {
      this.values.push(++this.counter);
    }
    removeValue(): void {
      this.values.pop();
    }
  }

 function HelloWorld4(): View {
   const model = new HelloModel4();
   function ValueLabel(value: number): View {
     return TextLabel(`${value}`, {
       font: core.font.title_medium,
       border: core.border.thin,
        padding: core.space.s2,
    });
  }
  return VStack({ gap: core.space.s5 }).append(
    HStack({ gap: core.space.s4, padding: core.space.s4 }).append(
      ViewList(
        model.values,
        (val) => val,
        (val) => ValueLabel(val)
      )
    ),
    HStack({ gap: core.space.s5 }).append(
      Button({ label: "Add", action: () => model.addValue() }),
      Button({ 
        label: "Remove", 
        disabled: atom(() => model.values.length === 1),
        action: () => model.removeValue() 
      }))
    );
  }
```

This produces the following result:

<p align="center"><img src='./assets/HelloWorld4<<DARK_MODE_SUFFIX>>.png' width="40%"></p>

<details>
  <summary>
See this in action
</summary>
<p align="center"><video src='./assets/HelloWorld4.mp4' controls width="40%" ></p>
</details>

<br/>
<br/>

Each time the "Add" button is clicked, a new value is added to the values list (an *ArrayAtom*), which results in a new label being created and added to the DOM. Likewise, when the Remove button is clicked, a value is removed from the values list, and the label which corresponded to that value is removed because it is no longer in the list.

The key to reactive content is the *ViewList* pseudocomponent. A ViewList contains a reactive array along with a childID function and a childCreator function. As the array changes, the ViewList will update the list of children to match the array, preserving children with matching ids.

Note also that in this example, the key reactive values and associated logic are placed in a  model class (which is usually in a different file). This provides a clean model-view separation. Components are implemented as functions, and models as classes.

These two examples are intended to illustrate the key constructs in Zaffre. But the real advantage of using a declarative, reactive, compositional approach is more evident in higher-level abstractions. For example, a typical CRUD interface typically involves tables and forms.

A Zaffre Table is a grid-based component backed by a table model with reactive rows and columns. A Form is a grid-based component contains a collection of input fields wrapped in validation boxes. An Ensemble is a component that manages the visibility of two or more components. Combining these, we get a TableFormEnsemble that looks like this when the table is visible:

<p align="center"><img src='./assets/TFTable<<DARK_MODE_SUFFIX>>.png' width="90%"></p>

and this:

<p align="center"><img src='./assets/TFForm<<DARK_MODE_SUFFIX>>.png' width="90%"></p> 

when the form is visible. Switching between the two views is a simple matter of changing one reactive value in the ensemble. An outline of the code for this follows.

```js
  class User extends TableRecord {
    lastName: string,
    ... more properties
  }

  function UserTFEnsemble(store: TableStore<UserRecord>): View {
    const columns = { 
      stringColumn({ title: "Name", value: (r) => r.name, alignment: "left" }),
      ... more columns
    };
    const rows = store.getAllRecords();
    const fields = { 
      lastName: {
        label: "Last Name",
        type: "string",
        gridArea: { r1: 1, c1: 2, r2: 2, c2: 5 },
        validators: [defaultFormValidator.length(1, 20)],
      },
      ... more form fields
    },
    return TableFormEnsemble(User, store, tableModel(rows, column), fields);
  }
```

Both the table and the form are expressed in a declarative fashion, making it easy to modify and maintain.

<details>
  <summary>
See this in action
</summary>

<p align="center"><video src='./assets/TFDemo.mp4' controls width="80%" ></p>
</details>

<br/>
The Zaffre library is organized into three layered subpackages: Foundation, Core and Components. The layering helps with managing dependencies and understanding levels of abstraction. Foundation deals with strictly non-UI concepts, including atoms, geometry, and data. Core deals with lower-level UI building blocks and the internal mechanics of the UI, is primarily class-based, and depends on Foundation. The Components subpackage depends on Core, and is primarily functional in nature. 

<br/>
<p align="center"><img src='./assets/LibraryStacks<<DARK_MODE_SUFFIX>>.png' controls width="50%" ></p>
<br/>

The Zaffre [gallery](https://zaffre-io.github.io/zgallery) demonstrates that this approach works well with a variety of problems. What remains to be seen is how well this scales.

<br/>
<br/>

#### Some Caveats and Issues: 

- No npm package is available for the current (0.7) version of the Zaffre library. You'll need to download the monorepo to try it.
- The minimal bundle size is about 100k (see the Hello app in the Zaffre repository). However, you can add considerable functionality without increasing the size much because of rollup's tree shaking. The gallery app, which contains 100+ examples, is about 500k, spread over ~50 dynamic imports.
- Debugging can be challenging; in some cases it can be difficult to understand why particular actions are not triggered.
- Nesting derived actions, in particular, can result in complex dependencies.
- Reactive actions can produce redundant reactions in some cases; more work is needed to minimize this.
- Performance has not been properly evaluated. The gallery application is reasonably responsive, but no real stress testing has been done.
- Memory footprint also needs evaluation. For heavyweight components (e.g., a table with thousands of rows), the plan is to use virtualization to minimize the number of components that are necessary.

  
#### Availability

 - Full source for version 0.7 is available in a monorepo at https://github.com/rgayvert/zaffre.

 - A gallery of examples can be viewed at https://zaffre-io.github.io/zgallery.

#### Acknowledgments
 
 The development of Zaffre drew inspiration from a variety of sources, including:
  - React, for concepts of reactivity and DOM reconciliation;
  - Vue, for ideas on routing and dynamic imports;
  - MDN, for documentation and samples;
  - SwiftUI, for declarative UI syntax;
  - Material Design, for ideas on themes, tokens, fonts, and colors;
  - Every Layout, for layout examples and guidelines; and
  - Stack Overflow, for solutions to problems.

