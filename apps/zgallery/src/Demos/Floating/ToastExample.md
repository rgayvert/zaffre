A Toast is a floating component that hides itself after some amount of time (default is 1500ms), and stacks up when multiple instances are created. A component that wants to use Toast must add a ToastStack, which is a VStack that contains a reactive list of Toast items. When a toast needs to be displayed, it is added to the list of toast items. ToastStacks will appear in a view named "ToastLayer" directly under the body element.

In this example we have two kinds of Toast items. The first one is a ToastButton, which displays a toast item when clicked. This is usually intended to indicate that some action has been performed. The second case is a more general toast stack, where once again a toast item is added each time a button is clicked. 

See the [Wordle demo](/demos/wordle) or the [ToDo demo](/demos/todo) for more examples of toast.

