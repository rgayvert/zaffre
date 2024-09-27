Panels are more complex components that build on top of the Components subpackage, and act like templates for common scenarios.

A common use of Forms is in conjunction with Tables. Here we have a TFEnsemble, which combines a Table and a Form in an Ensemble, so only one is visible at a given point in time. You switch from the table view to the form view by either   
  - double-clicking on a row;
  - selecting a row and hitting Edit; or
  - clicking on Add

Once you're in the form view, you can get back to the table view by either
  - hitting Cancel; or
  - supplying valid values for all the fields, and hitting Update/Create

If you clicked on Add and then Create, a new row should appear in the table.

Note that all you have to provide (TFEnsembleExample.ts) is a record class, a table model, and a list of form fields.


