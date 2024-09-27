This is an implementation of the well-known ToDo application (https://todomvc.com/). 

The UI components have been split across several files for discussion. Also, the source for this demo is in a separate package to make it available for a sample todo application. 

The top-level component (ToDo.ts) contains a VStack of 5 children: the top label, an input row, an item list, a button row, and an optional data store selector, if the application is configured for an external server. There is also a toast stack to display any data errors.

The data module (ToDoData.ts) is split out to illustrate typical partitioning. If you examine the todo-server app in the Zaffre monorepo, you will see that the description of this table corresponds to a Sequelize model for the ToDoRecord. A LocalPStore will be used by default, but you can switch to a FetchPStore if your application is configured for it.

Most of the logic in this demo is located in the model class (ToDoModel.ts). The model loads the items from the data store, filters the items according to the current filter, and provides reactive values for the UI components. The list of records is in a ToDoRecordList, which is responsible for the actual read, creation, and deletion operations with the data store. Updates are done by the individual ToDoRecord instances (see updateItem() in ToDoItemRow.ts). 

The input field (ToDoInputRow.ts) is a simple input with the reactive value 'model.newText', which has an action to create a new item when the value changes. For some reason the spec calls for an icon button to be placed to the left of this field that will toggle the completion status of all the items, so whatever.

The item list (ToDoItemList.ts) manages the list of visible records using a ViewList() on the reactive list 'model.filteredRecords'. Each visible record corresponds to a ToDoItemRow; each row is given effects to make it fade in when mounted and slide out when unmounted.

A ToDoItemRow has some interesting behavior. It's basically an HStack with a Checkbox to set the completion state, a TextInput to display and edit the contents, and a button to delete the record. To support editing, a row has a RecordEditor, which has an atom for each value in the record; when a value is changed, the record is automatically saved. The visibility of the delete button is unusual. To show it when the item row is hovered, we need to provide it with the (shared) interaction state of the row.