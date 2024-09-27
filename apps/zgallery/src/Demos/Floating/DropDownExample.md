A floating component is a temporary view which is associated with another view (the *referenceView*), and is shown and hidden by a reactive trigger. Floating components are appended like other components, but are moved to a floating layer when rendered, and placed relative to the referenceView. Any HTML component can be made floating by wrapping it inside a Floating view. By default, floating components will appear in a view named "FloatingLayer" directly under the body element.

A DropDownButton is a button that contains a floating component with a SimpleMenu, which consists of a VStack of Text items. The menu is shown when the referenceView (the button) is clicked, and hides itself when a selection is made. The default placement of the menu is directly below the button.

A DropDownButton must be given a choice atom along with a list of string choices. The title of the button will be the value of the choice atom, or the first of the list of choices.
