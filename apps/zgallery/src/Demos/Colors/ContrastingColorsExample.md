Automatic computation of contrast color 

Current web guidelines recommend particular contrast ratios between foreground and background colors to ensure that 
text is sufficiently readable. In this example we show how color contrast can be calculated.

Each theme has a contrast level, which can be changed dynamically. 

Given a color token T, you can request an appropriate contrasting color with T.contrast. For example, if the contrast ratio
for the current theme is 7.0, the token color.black.contrast will yield a gray value which has a contrast ratio of at least 7.0.

If a color is not specified for a TextLabel, a contrasting value will be calculated automatically.

