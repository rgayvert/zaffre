The examples in this demo were taken from the 7GUIs benchmark by Eugen Kiss at 
```
              https://eugenkiss.github.io/7guis/tasks
```
The idea is to see how well a framework can handle some common UI scenarios; that is, how much code is required, and how clear is the solution. More detailed criteria are discussed at https://eugenkiss.github.io/7guis/dimensions.


Each of these problems is addressed in this demo with the usual model-view approach.

We start with a trivial counter problem. The model contains a single counter atom, along with a string representation of the counter value. The UI contains an HStack with a TextLabel, which gets its value from the model, and a Button which increments the counter.

Note that you can take away all of the attributes to the TextLabel and still have a reasonable result.