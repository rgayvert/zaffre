A Tree component displays a list of items correspond to the visible descendants of a TreeNode object.

A TreeNode is a generic recursive structure defined by a root element wthat contains some type of data, along with a function that creates the children of a node as needed (i.e., when a node is first expanded). A TreeNode maintains a reactive list of visible dependents, which is used by a Tree component to create the visible item views.

A SimpleTree is a Tree whose item views are string labels. 

In the first tree in this example, a random TreeNode with string data is generated and shown in a SimpleTree component. The second Tree uses that same TreeNode used by the gallery navigation list on the left of the window. Note that the second Tree and gallery Tree will always show the same items, since they reference the same TreeNode.