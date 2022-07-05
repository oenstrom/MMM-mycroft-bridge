/* Magic Mirror
 * Node Helper: MMM-contacts
 *
 * By Olof Enström
 * 
 * 
 * Copyright (C) 2022  Olof Enström
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

var NodeHelper = require("node_helper");

var WebSocketClient = require("websocket").client;

module.exports = NodeHelper.create({
  timerId: null,


  Message: {
    events: {},
    onEvent: function(eventName, cb) {
      this.events[eventName] = cb;
    },
    parse: function(that, message) {
      let msg = JSON.parse(message.utf8Data)
      if (this.events.hasOwnProperty(msg.type)) {
        this.events[msg.type](msg.data);
        clearTimeout(that.timerId);
        console.log("TIMEOUT CLEARED!!!!");
        that.timerId = setTimeout(() => that.sendSocketNotification("MYCROFT_HIDE"), 10000);
      }
    }
  },

  // Setup routes for MyCroft or other external software to use.
  start: function() {
    var self = this;
    this.timerId = null;
    this.ws = new WebSocketClient();
    this.ws.on("connect", function(connection) {
      console.log("WebSocket Client connected");

      connection.on("error", err => console.log("Error connecting to MyCroft: " + error.toString()));
      connection.on("close", () => console.log("Connection Closed"));
      connection.on("message", msg => self.Message.parse(self, msg));
      // connection.on("message", msg => console.log(msg));
      
      self.Message.onEvent("speak", data => self.sendSocketNotification("MYCROFT_MSG_SPEAK", {text: data.utterance, data: data}));
      self.Message.onEvent("recognizer_loop:wakeword", data => self.sendSocketNotification("MYCROFT_MSG_WAKEWORD", {translate: "WAKEWORD"}));
      // self.Message.onEvent("recognizer_loop:utterance", data => console.log(data));
      self.Message.onEvent("MMM_DISPLAY_CONTACTS", data => {console.log(data);self.sendSocketNotification("MMM_DISPLAY_CONTACTS", data)});
      self.Message.onEvent("recognizer_loop:audio_output_end", data => {
        clearTimeout(self.timerId);
        self.timerId = setTimeout(() => self.sendSocketNotification("MYCROFT_HIDE"), 3000);
      });

      // connection.send('{"type": "speak", "data": {"utterance": "Christoffer är bäst på allt!", "lang": "sv-se"}}');
    });
    this.ws.connect("ws://localhost:8181/core");

    
    // this.expressApp.post("/MMM-mycroft-bridge/list", function(req, res) {
    //   // TODO: Fix req body json
    //   self.sendSocketNotification("MMM-mycroft-bridge-LIST-ALL", {contacts: req.body.contacts})
    //   res.status(200).json({"success": true});
    // });
  },

  // Override socketNotificationReceived method.

  /* socketNotificationReceived(notification, payload)
    * This method is called when a socket notification arrives.
    *
    * argument notification string - The identifier of the notification.
    * argument payload mixed - The payload of the notification.
    */
  socketNotificationReceived: function(notification, payload) {
    if (notification === "INIT") {
      // self.config.apiKey = payload
      console.log("INIT");
    }
  },

  // sendStart: function(recipient) {
  //   this.sendSocketNotification("", {recipient});
  // },

  // sendDispose: function() {
  //   this.sendSocketNotification("", {});
  // }
});