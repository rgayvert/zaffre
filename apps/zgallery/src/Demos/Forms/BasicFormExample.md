A Zaffre Form consists of a collection of input fields that are associated with a data record. Each field is contained within a validation component which provides feedback when the value entered is invalid. A Form also typically has buttons to reset, clear and submit all of the fields.

The layout of a Form is specified in a declarative manner using by a list of FormFieldSpecs. Each FormSpec defines the label, input type, validators and grid area of a field. There are default sets of input components and validators, which a Form can override or extend.

In this example, we have a record type defined in DemoUserRecord.ts. This happens to extend PRecord since we'll use it with a persistent store in the next example, but here we use it without a data store. 

The fields to include in the form are listed in DemoUserFields.ts.  If you enter a few values in the demo view and hit Submit, you will see how the validators and validation boxes come into play. 

The action performed when the Submit button is clicked is defined by the submitAction option to the form. This will get invoked only if all of the input values are valid. In this case, a simple alert is presented.