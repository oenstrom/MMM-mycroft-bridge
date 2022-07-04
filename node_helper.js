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

module.exports = NodeHelper.create({
  // Setup routes for MyCroft or other external software to use.
  start: function() {
    var self = this;
    
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
      console.log("INIT NOTIFICATION!");
    }
  },

  sendStart: function(recipient) {
    this.sendSocketNotification("", {recipient});
  },

  sendDispose: function() {
    this.sendSocketNotification("", {});
  }
});