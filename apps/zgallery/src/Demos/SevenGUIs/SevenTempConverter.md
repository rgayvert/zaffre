Task from https://eugenkiss.github.io/7guis/tasks/#temp.<br>
Challenges: bidirectional data flow, user-provided text input.

Here we have a pair of related numeric values. In this situation, it is usually best to introduce a third reactive value (in this case, temperature), to act as a sole-source-of-truth. This avoids any possible circular updates, which can sometimes happen with rounding.

The UI consists of an HStack with two labeled numeric inputs separated by an equals sign. The inputs are tied to reactive values in the model, so when one is changed, the other is updated.