Color tokens in standard themes

Zaffres uses a color scheme that is based on the general apprach of Material Design 3. Rather than using specific RGB values, color are usually specified with tokens that express the intended use. These values are typically derived from a set of key colors: primary, secondary, and tertiary.

Each token has a coresponding CSS properties, which change when the theme changes. For example, the token core.color.primary indicates a color derived from the primary key color, and whose value is defined by the CSS property --color-primary. 

The key colors are used to general tonal palettes, which allow you to specify different tones/shades ranging from black (0) to white (100).

Rather than using "on" tokens to specify contrasting colors, Zaffre allows the contrast level for a theme to be defined dynamically. See the [Contrast](<<LINK_PREFIX>>/demos/contrast)  demo for more details.

Finally, note that a theme may be located at any point in the DOM, as well as at the root level. In this example, the theme changes apply only to the demo component and its descendants.