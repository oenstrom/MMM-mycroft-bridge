# MMM-mycroft-bridge

A [MagicMirror](https://magicmirror.builders/) module to bridge between MagicMirror and MyCroft.

## Installation

Navigate to the `modules` folder and clone the repository:

`git clone git@github.com:oenstrom/MMM-mycroft-bridge.git`

## Dependencies
- [Mycroft AI](https://mycroft.ai/)
- `npm install websocket`

## Configuration

Navigate to the `config/config.js` file and add a new entry in `modules` (see [MagicMirror Module Configuration documentation](https://docs.magicmirror.builders/modules/configuration.html)).

A possible configuration could be:

```js
{
  module: "MMM-mycroft-bridge",
  position: "fullscreen_above",
  hiddenOnStartup: true,
  config: {
    maxMessages: 3,
    mycroftPath: "ws://localhost:8181/core",
  },
},
```
## Config
| Key           | Example                      | Description                            |
|---------------|------------------------------|----------------------------------------|
| `maxMessages` | `3`                          | The number of messages to display      |
| `hideTime`    | `15000`                      | Time in ms before hiding the module    |
| `fadeTime`    | `500`                        | Time in ms it takes to fade the module |
| `mycroftPath` | `"ws://localhost:8181/core"` | The path to Mycroft messagebus         |

The module will try to connect to Mycroft on the URL specified in `mycroftPath`. Once connected the module will emit to Mycroft that it has connected. You can subscribe to that event in any skill: `self.add_event("magicmirror.connected", self.handle_magicmirror_connected)`

## Status notifications
The module currently sends two notifications to all modules about Mycroft's connection status:
- `MYCROFT_CONNECTED`
- `MYCROFT_DISCONNECTED`

The `MYCROFT_CONNECTED` notification will be sent every time it connects to Mycroft, so usually only once at the start of the MagicMirror. It will resend it once it reconnects after a lost connection.

The `MYCROFT_DISCONNECTED` notification will be sent if the module is disconnected from the Mycroft messagebus.

Example, I want to retreive all contacts from Mycroft at the start:
```js
notificationReceived: function(notification, payload, sender) {
  if (notification === "MYCROFT_CONNECTED") {
    this.sendNotification("MYCROFT_COMMAND", {eventName: "contacts-skill:get_contacts", data: {sender: self.name}});
  }
}
```
So, I wait for the `MYCROFT_CONNECTED` notification before sending the initial command to get the contacts.

## Relay messages from Mycroft to your MagicMirror module
In the following example I'm relaying to the module `MMM-contacts` with the notification `LIST-ALL`. The data I'm sending is a list of contacts.

`__init__.py` in Mycroft skill:
```python
self.bus.emit(Message("RELAY:MMM-contacts:LIST-ALL", {"contacts": contacts}))
```
The message type in `Message` needs to start with `RELAY`. The part between the colons is which MagicMirror to relay it to. Use `*` to send it to all modules. The last part is the notification, `LIST-ALL`. This is the notification that your module will receive.
```js
socketNotificationReceived: function (notification, payload) {
    if (notification === "LIST-ALL") {
      this.contacts = payload.contacts;
      this.updateDom(0);
    }
}
```

## Sending data to Mycroft
To send data from your module to Mycroft you must send a notification using `this.sendNotification(notification, payload)`. The `notification` has to be the string `MYCROFT_COMMAND` and the payload has to be an object containing the keys `eventName` and `data`.

The `eventName` has to be a string. This string should match a Mycroft Message Type ([https://mycroft-ai.gitbook.io/docs/mycroft-technologies/mycroft-core/message-types](https://mycroft-ai.gitbook.io/docs/mycroft-technologies/mycroft-core/message-types)) or a custom one that you have subscribed to in your Mycroft skill. The `data` has to be an object containing the data you want to send. `JSON.stringify()` will be performed on the `data` object, so check your `data` object if your message isn't received properly.

### Example:
```js
self.sendNotification("MYCROFT_COMMAND", {
  eventName: "contacts-skill:delete_contact",
  data: {name: self.selectedContact[0], email: self.selectedContact[1], phone: self.selectedContact[2]}
});
```

## Receiving data in Mycroft
In Mycroft you simply subscribe to the event as you normally do.
```python
def initialize(self):
    """Setup event listeners."""
    self.add_event("contacts-skill:delete_contact", self.handle_delete_contact_event)
    self.add_event("contacts-skill:get_contacts", self.handle_get_contacts_event)
```

## More documentation to come