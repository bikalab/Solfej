"use strict";

const {webFrame, remote, ipcRenderer} = require("electron");
const fs = require("fs");
let MimeTypeUtils = require("mime-types");
module.exports = {
  init() {
    webFrame.setZoomLevelLimits(1, 1);
    document.documentElement.classList.add("electron");

    let isMac = navigator.platform.includes("Mac");
    document.documentElement.classList.toggle("osx", isMac);
    if (!isMac) {
      this.initWindowControls();
    }

    ipcRenderer.on("request-video-action", this.handleVideoAction);
    ipcRenderer.on("file-found", (event, path) => {
      Solfej.playlist.element.classList.add("loading");

      this.handleFileFound(path).then(() => {
        Solfej.playlist.element.classList.remove("loading");
      }).catch((e) => {
        console.error("FS handler - Failed to load media:" + e);
        Solfej.playlist.element.classList.remove("loading");
      });
    });

    Solfej.videoEl.addEventListener("playing", this.notifyVideoStateChange);
    Solfej.videoEl.addEventListener("pause", this.notifyVideoStateChange);
    Solfej.videoEl.addEventListener("ended", this.notifyVideoStateChange);
    Solfej.videoEl.addEventListener("emptied", this.notifyVideoStateChange);

    // Debug
    document.addEventListener("keydown", function(e) {
      if (e.which === 123) {
        remote.getCurrentWindow().toggleDevTools();
      } else if (e.which === 116) {
        location.reload();
      }
    });
  },

  initWindowControls() {
    let header = Element("div", {
      class: "caption-buttons",
      parent: document.getElementById("header-container")
    });

    Element("button", {
      class: "caption-button minimize",
      parent: header,
      onclick() {
        remote.BrowserWindow.getFocusedWindow().minimize();
      }
    });

    let maximizeBtn = Element("button", {
      class: "caption-button maximize",
      parent: header,
      onclick() {
        let focusedWindow = remote.BrowserWindow.getFocusedWindow();
        if (focusedWindow.isMaximized()) {
          focusedWindow.unmaximize();
        } else {
          focusedWindow.maximize();
        }
      }
    });

    Element("button", {
      class: "caption-button close",
      parent: header,
      onclick() {
        window.close();
      }
    });

    let focusedWindow = remote.BrowserWindow.getFocusedWindow();
    focusedWindow.on("unmaximize", () => {
      maximizeBtn.className = "caption-button maximize";
    });
    focusedWindow.on("maximize", () => {
      maximizeBtn.className = "caption-button restore";
    });
  },

  handleVideoAction(event, action) {
    switch (action) {
      case "play":
        Solfej.videoEl.play();
        break;
      case "pause":
        Solfej.videoEl.pause();
        break;
      case "previous-song":
        Solfej.killContext();
        Solfej.playlist.selectPrevious();
        break;
      case "next-song":
        Solfej.killContext();
        Solfej.playlist.selectNext();
        break;
    }
  },

  handleFileFound(path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, null, (err, file) => {
        if (err) {
          return reject(err);
        }
        try {
          let name = this.getFileNameFromPath(path);
          let type = MimeTypeUtils.lookup(name);
          if (!type) {
            return reject("No type");
          }
          let blob = new Blob([file.buffer], {type});
          blob.name = name;
          ipcRenderer.send("add-recent-file", path);
          return Solfej.playlist.add(blob);
        } catch (e) {
          reject(e);
          alert("Could not read audio/video file");
        }
        return reject("Unknown error");
      });
    });
  },

  notifyVideoStateChange() {
    if (Solfej.videoEl.ended || isNaN(Solfej.videoEl.duration)) {
      ipcRenderer.send("media-state-change", "ended");
    } else if (Solfej.videoEl.paused) {
      ipcRenderer.send("media-state-change", "pause");
    } else {
      ipcRenderer.send("media-state-change", "play");
    }
  },

  getFileNameFromPath(filePath) {
    let fileName = filePath.split("/").pop();
    if (fileName == filePath) {
      fileName = filePath.split("\\").pop();
    }
    return fileName;
  }
};
