This example shows how you can create a custom video player using the YouTube IFrame API. A instance of YTPlayerAtom (the "player") handles all of the initialization of the frame, and provides access to the underlying YT Player.

Here we hide the standard controls and add buttons for scrolling backwards and forwards by increments of 1, 5, or 10 seconds. Note that these buttons are DownButtons, so they will repeat while the mouse is held down. The space bar is also configured to act as a play/pause toggle.

See the YouTube IFrame API at https://developers.google.com/youtube/iframe_api_reference.
