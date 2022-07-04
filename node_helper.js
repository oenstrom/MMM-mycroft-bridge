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
  messageParser: {
    events: {},
    onEvent: function(eventName, cb) {
      this.events[eventName] = cb;
    },
    parse: function(message) {
      let msg = JSON.parse(message.utf8Data)
      if (this.events.hasOwnProperty(msg.type)) {
        this.events[msg.type](msg.data);
      }
    }
  },

  // Setup routes for MyCroft or other external software to use.
  start: function() {
    var self = this;
    this.ws = new WebSocketClient();
    this.ws.on("connect", function(connection) {
      console.log("WebSocket Client connected");
      connection.on("error", function(error) {
        console.log("Connection Error: " + error.toString());
      });
      connection.on("close", function() {
        console.log("Connection Closed");
      });
      self.messageParser.onEvent("speak", (data) => console.log(data));
      connection.on("message", (message) => self.messageParser.parse(message));

      // connection.send('{"type": "speak", "data": {"utterance": "Christoffer är bäst på allt!", "lang": "sv-se"}}');
    });
    this.ws.connect("ws://localhost:8181/core");

    // console.log(this.ws);
    
    this.expressApp.post("/MMM-mycroft-bridge/list", function(req, res) {
      // TODO: Fix req body json
      self.sendSocketNotification("MMM-mycroft-bridge-LIST-ALL", {contacts: req.body.contacts})
      res.status(200).json({"success": true});
    });

    // this.expressApp.post("/MMM-contacts/add", function(req, res) {
    //   res.status(200).json({"success": true});
    // });

    // this.expressApp.get("/MMM-contacts/get", function(req, res) {
    //   res.status(200).json({"contact": {}});
    // });

    // this.expressApp.delete("/MMM-contacts/delete", function(req, res) {
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

  sendStart: function(recipient) {
    this.sendSocketNotification("", {recipient});
  },

  sendDispose: function() {
    this.sendSocketNotification("", {});
  }
});