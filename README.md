# MMM-contacts

A [MagicMirror](https://magicmirror.builders/) module to bridge between MagicMirror and MyCroft.

## Installation

Navigate to the `modules` folder and clone the repository:

`git clone git@github.com:oenstrom/MMM-mycroft-bridge.git`

## Configuration

Navigate to the `config/config.js` file and add a new entry in `modules` (see [MagicMirror Module Configuration documentation](https://docs.magicmirror.builders/modules/configuration.html)).

The `config` parameter has __X__ optional arguments.
* `config` which is an object...

A possible configuration could be:

```js
{
  module: "MMM-mycroft-bridge",
  position: "top_right",
  config: {},
},
```

## API

The module exposes the following routes:

| Method    | Path                       | Params                 | Description                                               |
|-----------|----------------------------|------------------------|-----------------------------------------------------------|
| POST      | `/MMM-mycroft-bridge/list` | `body: {contacts: []}` | List all contacts.                                        |
<!-- | POST      | `/MMM-contacts/add`    | `body: {something}` | Add a new contact.                                        |
| GET       | `/MMM-contacts/get`    | `query: {?}`        | Get a specific contact, based on name? or something else? |
| DELETE    | `/MMM-contacts/delete` | `body: {something}` | Delete a contact.                                         | -->

## Nice to have

Remove contact through MagicMirror. Answer MyCroft through MagicMirror.