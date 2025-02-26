"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  }
  // You can expose other APTs you need here.
  // ...
});
electron.contextBridge.exposeInMainWorld(`thiswindow`, {
  minimize: async () => {
    electron.ipcRenderer.invoke("minimize-window");
  },
  maximize: async () => {
    electron.ipcRenderer.invoke("maximize-window");
  },
  close: async () => {
    electron.ipcRenderer.invoke("close-window");
  }
});
electron.contextBridge.exposeInMainWorld("system", {
  getPath: async () => {
    let r = electron.ipcRenderer.invoke("get-path");
    electron.ipcRenderer.once("GET_PATH", (_, result) => {
    });
    return r;
  },
  openFolder: async (directory, master) => {
    electron.ipcRenderer.invoke("open-folder", directory, master);
    electron.ipcRenderer.once("OPEN_FOLDER", () => {
    });
  },
  saveSettings: async (text, setting) => {
    electron.ipcRenderer.invoke("save-settings", text, setting);
    electron.ipcRenderer.once("SAVED_SETTINGS", () => {
    });
  },
  readSettings: async () => {
    let r = electron.ipcRenderer.invoke("read-settings");
    electron.ipcRenderer.once("READ_SETTINGS", (_, result) => {
    });
    return r;
  },
  saveTasks: async (text, setting) => {
    electron.ipcRenderer.invoke("save-tasks", text, setting);
    electron.ipcRenderer.once("SAVED_TASKS", () => {
    });
  },
  readTasks: async () => {
    let r = electron.ipcRenderer.invoke("read-tasks");
    electron.ipcRenderer.once("READ_TASKS", (_, result) => {
    });
    return r;
  }
});
electron.contextBridge.exposeInMainWorld("tasks", {
  manualBrowser: async (url, browserPath, profilePath, profileNum) => {
    let r = electron.ipcRenderer.invoke("manual-browser", url, browserPath, profilePath, profileNum);
    electron.ipcRenderer.once("MANUAL_BROWSER ${}", async () => {
    });
    return r;
  },
  killBrowsers: async (pid) => {
    electron.ipcRenderer.invoke("kill-browsers", pid);
    electron.ipcRenderer.once("KILL_BROWSERS ${}", async () => {
    });
  },
  deleteProfile: async (folderPath) => {
    let r = electron.ipcRenderer.invoke("delete-profile", folderPath);
    electron.ipcRenderer.once("DELETE_PROFILE ${}", async () => {
    });
    return r;
  }
});
