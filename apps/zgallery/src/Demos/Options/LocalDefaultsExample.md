The standard set of component defaults is intended to provide a baseline which yields a reasonable styles with nothing added. You can change these defaults globally in your application initialization, or change them for a subtree of the DOM with local defaults. 

In this example we create three TextLabel components with no options, and get different results based on the state of the defaults for TextLabel. Note that the view must be created inside a call to evaluateWithLocalDefaults(), which applies the change to the defaults and then restores the defaults to the previous state.
