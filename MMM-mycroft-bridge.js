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

  defaults: {
    maxMessages: 3
  },

  getStyles: function() {
    return [this.file("style.css")];
  },

  getTranslations: function() {
    return {
      en: "translations/en.json",
      sv: "translations/sv.json"
    };
  },

  start: function () {
    var self = this;
    this.messages = [];
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
    if (notification.startsWith("MYCROFT_MSG_")) {
      this.show();
      if (this.messages.unshift(payload.translate ? this.translate(payload.translate) : payload.text) > this.config.maxMessages) {
        this.messages.pop();
      }
      this.updateDom(0);
    }
    if (notification === "MYCROFT_MSG_WAKEWORD") {
      // this.show();
      // if (this.messages.unshift(this.translate("WAKEWORD")) > this.config.maxMessages) {
      //   this.messages.pop();
      // }
      // this.updateDom(0);
    } else if (notification === "MYCROFT_HIDE") {
      this.hide(800);
    } else if (notification === "MMM_DISPLAY_CONTACTS") {
      console.log(payload);
      this.sendNotification("MMM_DISPLAY_CONTACTS", payload);
    } else if (notification === "MMM-mycroft-bridge-DELETE") {
      // Delete a user
    }
  },

  getDom: function () {
    var self = this;
    let wrapper = document.createElement("div");
    let img = document.createElement("img");
    img.src = this.file("wakeword.png");
    img.height = 128;
    img.width = 128;
    wrapper.appendChild(img);
    // let h1 = document.createElement("h1");
    // h1.append(self.translate("MYCROFT"));
    // wrapper.appendChild(h1);
    let ul = document.createElement("ul");
    ul.className = "messages";
    ul.style.height = this.messages.length < 3 ? "85px" : (this.messages.length*35) + "px";
    this.messages.forEach(msg => {
      let li = document.createElement("li");
      li.className = "normal dimmed";
      li.innerText = msg;
      ul.appendChild(li);
    });
    wrapper.appendChild(ul);
    return wrapper;
  },
});