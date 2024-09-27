A counter atom is a simple numeric atom which can be incremented and decremented. You can also specify options for upper and lower bounds.


This example also demonstrates a derived atom. In this case the value of N2 is defined as
```ts
    atom(() => N.get() * 2)   
```
This expression creates a DerivedAtom whose value is updated whenever the value of N changes.