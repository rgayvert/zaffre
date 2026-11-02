Task from https://eugenkiss.github.io/7guis/tasks/#timer<br>
Challenges: concurrency, competing user/signal interactions, responsiveness.

This problem has a progress gauge where the duration can be changed on-the-fly by adjusting a slider. This is easy in Zaffre because there is nothing special about asynchronous reactive updates. We simply start/pause/resume the timer, and let the other reactive values update.