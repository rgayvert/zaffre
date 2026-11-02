By default, font sizes are responsive based on a set of window width breakpoints defined by the application (typically something like 600px and 1200px). This is implemented by applying a step function to the font size. That is, when the window size is below the first breakpoint, a scale of 1 is applied to the font size, and when the window size exceeds the first breakpoint, a new scale factor is applied. 


With fluid font sizing, this discrete step function is replaced by a continuous mapping which varies continously with the window width.