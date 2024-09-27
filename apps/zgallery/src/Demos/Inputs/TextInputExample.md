Zaffre includes wrapper components for most of the standard input types. The idea is to encapsulate the formatting, parsing and validation required to use them effectively in a reactive fashion. Each of these components takes an atom of some type; in some cases this is a string, but in others it may be a Color, number, or other suitable type. 

Input components may be used in isolation, but more options are available when they are used inside a Form (see the [Form demo](/demos/forms)).

In this example we have a text input that must be a word with length between 3 and 7 characters. A boolean atom is passed to capture the validity state of the input. This value is referenced in the borderColor option, so when the length is invalid, the border is red.