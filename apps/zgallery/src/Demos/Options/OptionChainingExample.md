When a reusable component is a composition of of multiple subcomponents, it is often useful to be able to specify options for a subcomponent. The way this is done is by including an option for the component that contains options for the subcomponent.

In this example, a SampleBox contains a LabelBox, which in turn contains a TextLabel. We can specify attributes of the TextLabel when using a SampleBox by specifying the chained labelBox and textLabel options. Here we define the default options to yield a top green label, but we can also override these to produce a left red label.

For another example of option chaining, see the [Form demo](<<LINK_PREFIX>>/demos/forms).