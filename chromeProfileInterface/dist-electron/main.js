var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { app, BrowserWindow, ipcMain } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { spawn } from "node:child_process";
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
const readProxyList = async (event) => {
  let text = void 0;
  try {
    text = await fs.promises.readFile("proxies.txt", "utf8");
  } catch (error) {
    try {
      fs.writeFile("proxies.txt", "", (err) => {
      });
      event.sender.send(`READ_PROXY_LIST`, "0");
    } catch (error2) {
    }
  }
  event.sender.send(`READ_PROXY_LIST`, text);
  return text;
};
const saveProxyList = async (event, text) => {
  try {
    fs.writeFile("proxies.txt", text, (err) => {
    });
  } catch (error) {
  }
  event.sender.send(`SAVED_PROXY_LIST`);
};
const readAccountList = async (event, directory) => {
  try {
    if (directory == "" || !directory) {
      directory = app.isPackaged ? path.join(process.resourcesPath, "..", "bin", "UserDataSaves", "Accounts") : path.join(__dirname, "../bin/UserDataSaves/Accounts");
    }
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    let fileList = await fs.promises.readdir(directory);
    fileList.sort((a, b) => {
      const numA = parseInt(a, 10) || 0;
      const numB = parseInt(b, 10) || 0;
      return numA - numB;
    });
    let str = fileList.join(",");
    await fs.promises.writeFile("accounts.txt", str);
    let result = await fs.promises.readFile("accounts.txt", "utf8");
    event.sender.send(`READ_ACCOUNT_LIST`, result);
    return result;
  } catch (err) {
    console.error("Error: ", err);
  }
};
const saveAccountList = async (event, directory, text) => {
  if (directory == "") {
    directory = app.isPackaged ? path.join(process.resourcesPath, "..", "bin", "UserDataSaves", "Accounts") : path.join(__dirname, "../bin/UserDataSaves/Accounts");
  }
  directory = join(directory, text);
  try {
    fs.mkdirSync(directory, { recursive: true });
  } catch (error) {
    console.log(error);
  }
  event.sender.send(`SAVED_ACCOUNT_LIST`);
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
  console.log("browserPath: ", browserPath);
  let flags = [
    `--user-data-dir=${profilePath}\\${name}\\Default`,
    //NIKE,
    "--disable-popup-blocking",
    "--no-first-run",
    "--hide-crash-restore-bubble",
    "--disable-sync",
    `--no-default-browser-check`,
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
const killBrowsers = async (_event, taskId) => {
  try {
    process.kill(taskId);
  } catch (error) {
  }
};
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
ipcMain.handle("save-proxy-list", async (event, text) => {
  await saveProxyList(event, text);
});
ipcMain.handle("read-proxy-list", async (event, result) => {
  result = await readProxyList(event);
  return result;
});
ipcMain.handle("save-profile-list", async (event, text) => {
  await saveProfileList(event, text);
});
ipcMain.handle("read-profile-list", async (event, result) => {
  result = await readProfileList(event);
  return result;
});
ipcMain.handle("save-account-list", async (event, path2, text) => {
  await saveAccountList(event, path2, text);
});
ipcMain.handle("read-account-list", async (event, path2) => {
  let result = await readAccountList(event, path2);
  return result;
});
ipcMain.handle("save-masteraccount-list", async (event, path2, text) => {
  await saveMasterAccountList(event, path2, text);
});
ipcMain.handle("read-masteraccount-list", async (event, path2) => {
  let result = await readMasterAccountList(event, path2);
  return result;
});
ipcMain.handle("get-product", async (event, num, sku, url) => {
  let r = await getProduct(event, num, sku, url);
  return r;
});
ipcMain.handle("get-feed", async (event) => {
  let r = await getFeed(event);
  return r;
});
ipcMain.handle("check-stock", async (event, sku, channelId, size, loop) => {
  let r = await checkStock(event, sku, channelId, size, loop);
  return r;
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
ipcMain.handle("kill-browsers", async (event, pid, autoEnabled) => {
  let r = await killBrowsers(event, pid);
  return r;
});
ipcMain.handle("master-browser", async (event, cpd, index, browserWidth, browserHeight, browserPath) => {
  let r = await masterBrowser(event, cpd, index, browserWidth, browserHeight, browserPath);
  return r;
});
ipcMain.handle("get-status", async (event, pid, oldStatus) => {
  let r = await getStatus(event, pid, oldStatus);
  return r;
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
