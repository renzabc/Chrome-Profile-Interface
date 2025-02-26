var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { app, BrowserWindow, ipcMain } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { execSync, spawn } from "node:child_process";
import fs from "fs";
createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    minHeight: 256,
    minWidth: 390,
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.mjs")
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(createWindow);
ipcMain.handle("minimize-window", () => {
  if (win) {
    win.minimize();
  }
});
ipcMain.handle("maximize-window", () => {
  if (win) {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  }
});
ipcMain.handle("close-window", () => {
  if (win) {
    win.close();
  }
});
const readSettings = async (event) => {
  let text = void 0;
  try {
    text = await fs.promises.readFile("settings.json", "utf8", (err, data) => {
      if (err) {
        console.error("Error reading the file", err);
        return;
      }
      try {
        const jsonData = data;
      } catch (parseErr) {
        console.error("Error parsing JSON", parseErr);
      }
    });
  } catch (error) {
    try {
      let obj = {
        "browserPath": [""],
        "profilePath": "",
        "masterProfilePath": "",
        "screenSize": {
          "screenWidth": "1280",
          "screenHeight": "720"
        },
        "browserSize": {
          "browserWidth": "160",
          "browserHeight": "700"
        },
        "areaDivision": {
          "colDiv": "160",
          "rowDiv": "1080"
        }
      };
      obj = JSON.stringify(obj, null, 2);
      fs.writeFile("settings.json", obj, (err) => {
      });
      event.sender.send(`READ_SETTINGS`, "0");
    } catch (error2) {
    }
  }
  event.sender.send(`READ_SETTINGS`, text);
  return text;
};
const readTasks = async (event) => {
  let text = void 0;
  try {
    text = await fs.promises.readFile("tasks.json", "utf8", (err, data) => {
      if (err) {
        console.error("Error reading the file", err);
        return;
      }
      try {
        const jsonData = data;
      } catch (parseErr) {
        console.error("Error parsing JSON", parseErr);
      }
    });
  } catch (error) {
    try {
      let obj = "[]";
      fs.writeFile("tasks.json", obj, (err) => {
      });
      event.sender.send(`READ_TASKS`, "0");
    } catch (error2) {
    }
  }
  event.sender.send(`READ_TASKS`, text);
  return text;
};
const saveSettings = async (event, text, settings) => {
  try {
    fs.writeFile("settings.json", JSON.stringify(text, null, 2), (err) => {
    });
  } catch (error) {
    console.log(error);
  }
  event.sender.send(`SAVED_SETTINGS`);
};
const saveTasks = async (event, text, settings) => {
  try {
    text = String(text);
    await fs.promises.writeFile("tasks.json", text, (err) => {
      if (err) {
        console.error("Error writing to file:", err);
      } else {
      }
    });
  } catch (error) {
    console.log("jhkggbhh: ", error);
  }
  event.sender.send(`SAVED_SETTINGS`);
};
const openFolder = async (event, directory, master) => {
  console.log("directory: ", directory);
  if (directory == "") {
    if (master == true) {
      directory = app.isPackaged ? path.join(process.resourcesPath, "..", "bin", "UserDataSaves", "Masters") : path.join(__dirname, "../bin/UserDataSaves/Masters");
    } else {
      directory = app.isPackaged ? path.join(process.resourcesPath, "..", "bin", "UserDataSaves", "Accounts") : path.join(__dirname, "../bin/UserDataSaves/Accounts");
    }
  }
  try {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    const command = process.platform === "win32" ? `explorer "${directory}"` : `open "${directory}"`;
    exec(command, (err) => {
      if (err) {
        console.error(`Error opening folder: ${err}`);
      }
    });
  } catch (error) {
    console.log("0000000000: ", error);
  }
  event.sender.send(`OPEN_FOLDER`);
};
class launchBrowser {
  constructor(name, browserPath, profilePath, url) {
    __publicField(this, "name");
    __publicField(this, "browserPath");
    __publicField(this, "profilePath");
    __publicField(this, "url");
    this.name = name;
    this.browserPath = browserPath;
    this.profilePath = profilePath;
    this.url = url;
  }
  async initManual() {
    let pid = spawnBrowser(this.name, this.browserPath, this.profilePath, this.url);
    return pid;
  }
}
let spawnBrowser = (name, browserPath, profilePath, url) => {
  if (!url.includes(".")) {
    url = "chrome:newtab";
  }
  let flags = [
    `--user-data-dir=${profilePath}\\${name}\\Default`,
    //NIKE,
    "--disable-popup-blocking",
    "--no-first-run",
    "--hide-crash-restore-bubble",
    "--disable-sync",
    `--no-default-browser-check`,
    "--proxy-server=185.221.217.128:48365",
    `${url}`
  ];
  let chrome = spawn(
    path.join(browserPath),
    flags,
    { detached: true, stdio: "ignore" }
  );
  chrome.unref();
  return chrome.pid;
};
const manualBrowser = async (_event, url, browserPath, profilePath, name) => {
  let currentTasks = [];
  let launchArray = new launchBrowser(name, browserPath, profilePath, url);
  currentTasks.push(launchArray.initManual());
  let slaveCDP = [];
  slaveCDP = await Promise.all(currentTasks);
  return slaveCDP[0];
};
const killBrowsers = async (_event, pid) => {
  if (pid != 0) {
    try {
      await process.kill(pid);
      return true;
    } catch (error) {
      return true;
    }
  }
};
const getPath = () => {
  try {
    const commandChrome = `reg query "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\chrome.exe" /ve`;
    const commandEdge = `reg query "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\msedge.exe" /ve`;
    const commandBrave = `reg query "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\brave.exe" /ve`;
    const outputChrome = execSync(commandChrome, { encoding: "utf-8" });
    const outputEdge = execSync(commandEdge, { encoding: "utf-8" });
    const outputBrave = execSync(commandBrave, { encoding: "utf-8" });
    const matchChrome = outputChrome.match(/REG_SZ\s+([^\r\n]+)/);
    const matchEdge = outputEdge.match(/REG_SZ\s+([^\r\n]+)/);
    const matchBrave = outputBrave.match(/REG_SZ\s+([^\r\n]+)/);
    return [matchChrome ? matchChrome[1].trim() : null, matchEdge ? matchEdge[1].trim() : null, matchBrave ? matchBrave[1].trim() : null];
  } catch (error) {
    return [];
  }
};
const deleteProfile = async (_event, folderPath) => {
  try {
    fs.rmSync(folderPath, { recursive: true, force: true });
  } catch (error) {
  }
};
ipcMain.handle("get-path", async (event) => {
  let result = await getPath();
  return result;
});
ipcMain.handle("open-folder", async (event, directory, master) => {
  await openFolder(event, directory, master);
});
ipcMain.handle("save-settings", async (event, text, line) => {
  await saveSettings(event, text);
});
ipcMain.handle("read-settings", async (event, result) => {
  result = await readSettings(event);
  return result;
});
ipcMain.handle("save-tasks", async (event, text, line) => {
  await saveTasks(event, text);
});
ipcMain.handle("read-tasks", async (event, result) => {
  result = await readTasks(event);
  return result;
});
ipcMain.handle("manual-browser", async (event, url, browserPath, profilePath, name) => {
  console.log("manual-browser: ", browserPath);
  let r = await manualBrowser(event, url, browserPath, profilePath, name);
  return r;
});
ipcMain.handle("semi-browser", async (event, taskId, autoEnabled, singleIPEnabled, index, browserPath, profilePath, masterProfilePath, begin, end, launchWindowTime, groupSize, screenWidth, screenHeight, colDivision, rowDivision, browserWidth, browserHeight, shock, productSize, productSku, productId, threadId) => {
  let r = await semiBrowser(event, taskId, autoEnabled, singleIPEnabled, index, browserPath, profilePath, masterProfilePath, begin, end, launchWindowTime, groupSize, screenWidth, screenHeight, colDivision, rowDivision, browserWidth, browserHeight, shock, productSize, productSku, productId, threadId);
  return r;
});
ipcMain.handle("automated-browser", async (event, url, browserPath, taskNumber, screenWidth, screenHeight, colDivision, rowDivision, browserWidth, browserHeight) => {
  let r = await automatedBrowser(event, url, browserPath, taskNumber, screenWidth, screenHeight, colDivision, rowDivision, browserWidth, browserHeight);
  return r;
});
ipcMain.handle("kill-browsers", async (event, pid) => {
  let r = await killBrowsers(event, pid);
  return r;
});
ipcMain.handle("delete-profile", async (event, folderPath) => {
  let r = await deleteProfile(event, folderPath);
  return r;
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
