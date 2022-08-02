/* Magic Mirror
 * Node Helper: MMM-mycroft-bridge
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
  start: function() {
    const self = this;
    self.config = {};
    self.timerId = null;
    self.reconnectId = null;
    self.reconnectTime = 1000;
    self.ws = new WebSocketClient();  
  },

  Message: {
    events: {},

    /**
     * Add the event to accepted events with a callback to be executed when a matching event is found.
     * @param {string} eventName The accepted event name
     * @param {function} cb The callback to be executed
     */
    onEvent: function(eventName, cb) {
      this.events[eventName] = cb;
    },

    /**
     * Parse the Mycroft message and relay it or execute the matching callback function.
     * @param {NodeHelper} that The node_helper instance
     * @param {mycroft.messagebus.Message} message The mycroft message
     */
    parse: function(that, message) {
      let msg = JSON.parse(message.utf8Data)

      if (msg.type.startsWith("RELAY:")) {
        const [_, nsps, notification] = msg.type.split(":", 3);
        nsps === "*"
          ? that.io._nsps.forEach(n => that.io.of(n.name).emit(notification, msg.data))
          : that.io.of(nsps).emit(notification, msg.data);

      } else if (this.events.hasOwnProperty(msg.type)) {
        this.events[msg.type](msg.data);
        clearTimeout(that.timerId);
        that.timerId = setTimeout(() => that.sendSocketNotification("MYCROFT_HIDE"), that.config.hideTime || 15000);
      }
    }
  },
  
  /**
   * Connect to Mycrofts messagebus.
   */
  connectMycroft: function() {
    const self = this;

    self.ws.on("connect", connection => {
      self.connection = connection;
      clearTimeout(self.reconnectId);
      console.log("MagicMirror connected to Mycroft messagebus");
      self.eventSetup();
      self.sendSocketNotification("MYCROFT_CONNECTED");
      self.connection.send(`{"type": "magicmirror.connected"}`);
    });

    self.ws.on("connectFailed", error => {
      console.log("Could not connect to Mycroft messagebus. Reconnecting in " + self.reconnectTime + " ms");
      self.reconnectId = setTimeout(() => self.ws.connect(self.config.mycroftPath), self.reconnectTime);
      self.reconnectTime *= 2;
    });
    self.ws.connect(self.config.mycroftPath);
  },
  
  /**
   * Set up events for parsing messages and displaying Mycroft on the mirror.
   */
  eventSetup: function() {
    const self = this;
    self.connection.on("message", msg  => self.Message.parse(self, msg));
    self.connection.on("error", err    => console.log("Error connecting to Mycroft: " + err.toString()));
    self.connection.on("close", ()     => {
      console.log("Disonnected from Mycroft");
      self.sendSocketNotification("MYCROFT_DISCONNECTED");
      self.ws.connect(self.config.mycroftPath);
    });

    self.Message.onEvent("speak", data =>
      self.sendSocketNotification("MYCROFT_MSG_SPEAK", {text: data.utterance, data: data}));
  
    self.Message.onEvent("recognizer_loop:wakeword", _ =>
      self.sendSocketNotification("MYCROFT_MSG_WAKEWORD", {translate: "WAKEWORD"}));
  },

  /**
   * A socket notification is received.
   * @param {string} notification The notification name 
   * @param {*} payload The data sent
   */
  socketNotificationReceived: function(notification, payload) {
    const self = this;
  
    if (notification === "INIT") {
      self.config.mycroftPath = payload.mycroftPath;
      self.config.hideTime = payload.hideTime;
      self.connectMycroft();
    } else if (notification === "MYCROFT_COMMAND") {
      self.connection.send(`{"type": "${payload.eventName}", "data": ${JSON.stringify(payload.data)}}`);
    }
  },
});