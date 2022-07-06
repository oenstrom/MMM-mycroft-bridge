# MMM-contacts

A [MagicMirror](https://magicmirror.builders/) module to bridge between MagicMirror and MyCroft.

## Installation

Navigate to the `modules` folder and clone the repository:

`git clone git@github.com:oenstrom/MMM-mycroft-bridge.git`

## Dependencies
`npm install websocket`

## Configuration

Navigate to the `config/config.js` file and add a new entry in `modules` (see [MagicMirror Module Configuration documentation](https://docs.magicmirror.builders/modules/configuration.html)).

A possible configuration could be:

```js
{
  module: "MMM-mycroft-bridge",
  position: "lower_third",
  hiddenOnStartup: true,
  config: {
    maxMessages: 3,
    mycroftPath: "ws://localhost:8181/core",
  },
},
```
## Config
| Key           | Example                      | Description                       |
|---------------|------------------------------|-----------------------------------|
| `maxMessages` | `3`                          | The number of messages to display |
| `mycroftPath` | `"ws://localhost:8181/core"` | The path to Mycroft messagebus    |

## More documentation to come