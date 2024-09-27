
Zaffre fonts follow the general approach of Material Design 3. The default set of font tokens contain 15 fonts consisting of 5 usage types (display, headline, title, body, label) and 3 sizes (large, medium, small). These tokens are converted into CSS variables by the current theme. For example, you may see a CSS variable of the form:

    --font-label-medium: normal 500 13.83px / 1.33 'Roboto Regular', sans-serif;

A theme may be configured to provide responsive scaling based on window size, either
using breakpoints or with a fluid scale.

By default, the App instance sets up Google fonts and uses a variation of the Roboto font for all of the tokens. Your App class can be easily modified to use other fonts.