A Dialog is a modal floating component. Dialogs will appear in a view named "DialogLayer" directly under the body element. The dialog layer has a non-zero opacity, and intercepts any clicks that are not on the current dialog, which results in a modal behavior: no other component will responds until the dialog is hidden.

In this example, we have three types of AlertDialogs that are commonly used:

  - a simple alert, which display a message with an OK button;
  - a yes/no which allows a yes/no decision to be made; and 
  - a save changes dialog with save/discard/cancel options.

Each of these sets a reactive response value, which can have an action attached to perform some function based on the response.
