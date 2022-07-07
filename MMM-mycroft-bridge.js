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
    maxMessages: 3,
    mycroftPath: "ws://localhost:8181/core",
  },
  
  start: function() {
    this.messages = [];
    this.sendSocketNotification("INIT", {mycroftPath: this.config.mycroftPath});
  },

  /**
   * A socket notification is received. 
   * @param {string} notification The notification name 
   * @param {*} payload The data sent
   */
  socketNotificationReceived: function (notification, payload) {
    if (notification.startsWith("MYCROFT_MSG_")) {
      this.show();
      if (this.messages.unshift(payload.translate ? this.translate(payload.translate) : payload.text) > this.config.maxMessages) {
        this.messages.pop();
      }
      this.updateDom(0);
    }
    switch (notification) {
      case "MYCROFT_MSG_WAKEWORD":
        break;

      case "MYCROFT_HIDE":
        this.hide(800);
        break;

      default: break;
    }
  },

  /**
   * Notification recevied from some other module.
   * @param {string} notification The notification identifier.
   * @param {*} payload The sent payload
   * @param {Module} sender The sender
   */
  notificationReceived: function(notification, payload, sender) {
    const self = this;
    if (notification === "MYCROFT_COMMAND") {
      self.sendSocketNotification(notification, payload);
    }
  },

  getDom: function () {
    var self = this;
    let wrapper = document.createElement("div");
    let img = document.createElement("img");
    img.src = this.file("wakeword.png");
    img.style.height = "128px";
    img.style.width = "128px";
    wrapper.appendChild(img);
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

  getStyles: function() {
    return [this.file("style.css")];
  },

  getTranslations: function() {
    return {
      en: "translations/en.json",
      sv: "translations/sv.json"
    };
  },
});