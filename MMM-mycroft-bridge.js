/* global Module */

/* Magic Mirror
 * Module: MMM-mycroft-bridge
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


Module.register("MMM-mycroft-bridge", {
  requiresVersion: "2.1.0", // Required version of MagicMirror

  // defaults: {
  // },

  // getScripts: function () {
  //   return [
  //     this.file("../node_modules/socket.io/client-dist/socket.io.min.js")
  //   ];
  // },

  // getStyles: function() {
  //   return [];
  // },

  getTranslations: function() {
    return {
      en: "translations/en.json",
      sv: "translations/sv.json"
    };
  },

  start: function () {
    var self = this;
    self.sendSocketNotification("INIT", {}); // Here we can pass config to the node_helper if needed.
  },

  notificationReceived: function (notification, payload, sender) {
    if (notification === "MMM-mycroft-bridge-LIST") {
      // Get all contacts
    } else if (notification === "MMM-mycroft-bridge-GET") {
      // Get a single contact
    } else if (notification === "MMM-mycroft-bridge-ADD") {
      // Add a user
    } else if (notification === "MMM-mycroft-bridge-DELETE") {
      // Delete a user
    }
  },

  // socketNotificationReceived from node_helper
  socketNotificationReceived: function (notification, payload) {
    if (notification === "MMM-mycroft-bridge-LIST-ALL") {
      this.contacts = payload.contacts;
      this.updateDom(0);
    } else if (notification === "MMM-mycroft-bridge-GET") {
      // Get a single contact
    } else if (notification === "MMM-mycroft-bridge-ADD") {
      // Add a user
    } else if (notification === "MMM-mycroft-bridge-DELETE") {
      // Delete a user
    }
  },

  getDom: function () {
    var self = this;
    let wrapper = document.createElement("div");
    wrapper.innerHTML = self.translate("MYCROFT");
    return wrapper;
  },
});