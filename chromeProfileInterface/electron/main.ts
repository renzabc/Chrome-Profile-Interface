import { app, BrowserWindow, Menu, ipcMain } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { spawn } from 'node:child_process'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  // Menu.setApplicationMenu(null)

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)






async function writeTextToSpecificLine(fileName, lineNumber, text) {
  // Check if the file exists
  if (fs.existsSync(fileName)) {
    // Read the content of the file
    let data = fs.readFileSync(fileName, 'utf8').split('\n');

    // Add empty lines until the specified line number
    while (data.length <= lineNumber) {
      data.push('');
    }

    // Modify the specific line
    data[lineNumber] = text;

    // Write the modified content back to the file
    fs.writeFileSync(fileName, data.join('\n'));
  } else {
    // Create the file with empty lines until the specified line number, then write the text
    let lines = [];
    for (let i = 0; i <= lineNumber; i++) {
      lines.push((i === lineNumber) ? text : '');
    }
    fs.writeFileSync(fileName, lines.join('\n'));
  }
}


const readSettings = async (event) => {
  let text = undefined
  try {
    text = await fs.promises.readFile('settings.json', 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading the file', err);
        return;
      }
      try {
        const jsonData = data
      } catch (parseErr) {
        console.error('Error parsing JSON', parseErr);
      }
    });
  }
  catch (error) {
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
      }
      obj = JSON.stringify(obj, null, 2)

      fs.writeFile('settings.json', obj, (err) => {
      });
      event.sender.send(`READ_SETTINGS`, '0')
    }
    catch (error) { }
  }
  event.sender.send(`READ_SETTINGS`, text)
  return text
}
const readTasks = async (event) => {
  let text = undefined
  try {
    text = await fs.promises.readFile('tasks.json', 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading the file', err);
        return;
      }
      try {
        const jsonData = data
      } catch (parseErr) {
        console.error('Error parsing JSON', parseErr);
      }
    });
  }
  catch (error) {
    try {
      let obj = '[]'
      fs.writeFile('tasks.json', obj, (err) => {
      });
      event.sender.send(`READ_TASKS`, '0')
    }
    catch (error) { }
  }
  event.sender.send(`READ_TASKS`, text)
  return text
}

const saveSettings = async (event, text, settings) => {
  try {
    fs.writeFile('settings.json', JSON.stringify(text, null, 2), (err) => {
    });
  }
  catch (error) { console.log(error) }
  event.sender.send(`SAVED_SETTINGS`)
}

const saveTasks = async (event, text, settings) => {
  try {
    text = String(text)
    await fs.promises.writeFile('tasks.json', text, (err) => {
      if (err) {
        console.error('Error writing to file:', err);
      } else {
      }
    });
  }
  catch (error) {
    console.log('jhkggbhh: ', error)
  }
  event.sender.send(`SAVED_SETTINGS`)
}

const openFolder = async (event, directory, master) => {
  console.log('directory: ', directory)
  if (directory == '') {
    if (master == true) {
      directory = app.isPackaged
        ? path.join(process.resourcesPath, '..', 'bin', 'UserDataSaves', 'Masters')
        : path.join(__dirname, '../bin/UserDataSaves/Masters')
    }
    else {
      directory = app.isPackaged
        ? path.join(process.resourcesPath, '..', 'bin', 'UserDataSaves', 'Accounts')
        : path.join(__dirname, '../bin/UserDataSaves/Accounts')
    }
  }
  try {
    if (!fs.existsSync(directory)) {
      // Create the folder if it doesn't exist
      fs.mkdirSync(directory, { recursive: true });
    }

    const command = process.platform === 'win32' ? `explorer "${directory}"` : `open "${directory}"`;

    exec(command, (err) => {
      if (err) {
        console.error(`Error opening folder: ${err}`);
      }
    });
  }
  catch (error) { console.log('0000000000: ', error) }
  event.sender.send(`OPEN_FOLDER`)
}

const readSkuList = async (event) => {
  let text = undefined
  try {
    text = await fs.promises.readFile('sku.txt', 'utf8');
  }
  catch (error) {
    try {
      fs.writeFile('sku.txt', '', (err) => {
      });
      event.sender.send(`READ_SKU_LIST`, '0')
    }
    catch (error) { }
  }
  event.sender.send(`READ_SKU_LIST`, text)
  return text
}
const saveSkuList = async (event, text, line) => {
  if (line != -100) {

    try {
      await writeTextToSpecificLine('sku.txt', line, text)
    }
    catch (error) { console.log(error) }
  }
  else {
    console.log('text: ', text)
    fs.writeFile('sku.txt', text, (err) => {
    });
  }
  event.sender.send(`SAVED_SKU_LIST`)
}
const readMonitorArray = async (event) => {
  let text = undefined
  try {
    text = await fs.promises.readFile('monitor.txt', 'utf8');
  }
  catch (error) {
    try {
      fs.writeFile('monitor.txt', '', (err) => {
      });
      event.sender.send(`READ_MONITOR_LIST`, '0')
    }
    catch (error) { }
  }
  event.sender.send(`READ_MONITOR_LIST`, text)
  return text
}
const saveMonitorArray = async (event, text, line) => {
  try {
    await writeTextToSpecificLine('monitor.txt', line, text)
  }
  catch (error) { }
  event.sender.send(`SAVED_MONITOR_LIST`)
}

const readProxyList = async (event) => {
  let text = undefined
  try {
    text = await fs.promises.readFile('proxies.txt', 'utf8');
  }
  catch (error) {
    try {
      fs.writeFile('proxies.txt', '', (err) => {
      });
      event.sender.send(`READ_PROXY_LIST`, '0')
    }
    catch (error) { }
  }
  event.sender.send(`READ_PROXY_LIST`, text)
  return text
}
const saveProxyList = async (event, text) => {
  try {
    fs.writeFile('proxies.txt', text, (err) => {
    });
  }
  catch (error) { }
  event.sender.send(`SAVED_PROXY_LIST`)
}


const readAccountList = async (event, directory) => {
  try {

    if (directory == "" || !directory) {
      directory = app.isPackaged
        ? path.join(process.resourcesPath, '..', 'bin', 'UserDataSaves', 'Accounts')
        : path.join(__dirname, '../bin/UserDataSaves/Accounts')
    }

    if (!fs.existsSync(directory)) {
      // Create the folder if it doesn't exist
      fs.mkdirSync(directory, { recursive: true });
    }

    let fileList = await fs.promises.readdir(directory);

    fileList.sort((a, b) => {
      const numA = parseInt(a, 10) || 0;
      const numB = parseInt(b, 10) || 0;
      return numA - numB;
    });

    let str = fileList.join(',')

    await fs.promises.writeFile('accounts.txt', str);

    let result = await fs.promises.readFile('accounts.txt', 'utf8');

    event.sender.send(`READ_ACCOUNT_LIST`, result)
    return result

  } catch (err) {
    console.error('Error: ', err)
  }
}

const saveAccountList = async (event, directory, text) => {
  if (directory == "") {
    directory = app.isPackaged
      ? path.join(process.resourcesPath, '..', 'bin', 'UserDataSaves', 'Accounts')
      : path.join(__dirname, '../bin/UserDataSaves/Accounts')
  }
  directory = join(directory, text)
  try {
    fs.mkdirSync(directory, { recursive: true });
  }
  catch (error) { console.log(error) }
  event.sender.send(`SAVED_ACCOUNT_LIST`)
}



































class launchBrowser {
  name: string
  browserPath: string
  profilePath: string
  url: string
  constructor(name: string, browserPath: string, profilePath: string, url: string) {
    this.name = name
    this.browserPath = browserPath
    this.profilePath = profilePath
    this.url = url
  }

  async initManual() {
    let pid = spawnBrowser(this.name, this.browserPath, this.profilePath, this.url)
    return pid
  }
}



let spawnBrowser = (name: string, browserPath: string, profilePath: string, url: string) => {
  // let browserPathArray = browserPath.split("\")
  console.log('browserPath: ', browserPath)
  let flags = [
    `--user-data-dir=${profilePath}\\${name}\\Default`, //NIKE,
    '--disable-popup-blocking',
    '--no-first-run',
    '--hide-crash-restore-bubble',
    '--disable-sync',
    `--no-default-browser-check`,
  ]

  let chrome = spawn(
    path.join(browserPath),
    flags,
    { detached: true, stdio: 'ignore' }
  );
  chrome.unref();
  return chrome.pid
}










// For "ACCOUNTS" Section only. Use to launch single browsers to Feed, Settings, Profile, Orders
const manualBrowser = async (_event: Electron.IpcMainInvokeEvent, url: string, browserPath: string, profilePath: string, name: string) => {

  let groupSize = 1

  let currentTasks = []
  let allTaskArray = []

  let s = parseInt(name)
  let f = parseInt(name)

  // build an array that contains all task numbers
  for (let i = s; i <= f; i++) {
    allTaskArray.push(i)
  }
  // if there are less tasks than selected grouping size, then ignore groups
  if (allTaskArray.length < groupSize) {
    groupSize = allTaskArray.length
  }

  let launchArray = new launchBrowser(name, browserPath, profilePath, url)
  currentTasks.push(launchArray.initManual())

  // }

  let slaveCDP = [] // v2: contains [WS Port, pid]
  slaveCDP = await Promise.all(currentTasks)

  return slaveCDP[0]
}

const killBrowsers = async (_event: Electron.IpcMainInvokeEvent, taskId: number) => {
  try {
    process.kill(taskId)
  } catch (error) { }
}

































// OPEN FOLDER
ipcMain.handle('open-folder', async (event, directory, master) => {
  await openFolder(event, directory, master)
})

// SAVE SETTINGS
ipcMain.handle('save-settings', async (event, text, line) => {
  await saveSettings(event, text, line)
})
ipcMain.handle('read-settings', async (event, result) => {
  result = await readSettings(event)
  return result
})

ipcMain.handle('save-tasks', async (event, text, line) => {
  await saveTasks(event, text, line)
})
ipcMain.handle('read-tasks', async (event, result) => {
  result = await readTasks(event)
  return result
})

// SAVE PROXY LIST
ipcMain.handle('save-proxy-list', async (event, text) => {
  await saveProxyList(event, text)
})
ipcMain.handle('read-proxy-list', async (event, result) => {
  result = await readProxyList(event)
  return result
})

// SAVE PROFILE LIST
ipcMain.handle('save-profile-list', async (event, text) => {
  await saveProfileList(event, text)
})
ipcMain.handle('read-profile-list', async (event, result) => {
  result = await readProfileList(event)
  return result
})

// SAVE ACCOUNT LIST
ipcMain.handle('save-account-list', async (event, path, text) => {
  await saveAccountList(event, path, text)
})
ipcMain.handle('read-account-list', async (event, path) => {
  let result = await readAccountList(event, path)
  return result
})

// SAVE MASTER ACCOUNT LIST
ipcMain.handle('save-masteraccount-list', async (event, path, text) => {
  await saveMasterAccountList(event, path, text)
})
ipcMain.handle('read-masteraccount-list', async (event, path) => {
  let result = await readMasterAccountList(event, path)
  return result
})

// GET PRODUCT
ipcMain.handle('get-product', async (event, num, sku, url) => {
  let r = await getProduct(event, num, sku, url)
  return r
})

// GET FEED
ipcMain.handle('get-feed', async (event) => {
  let r = await getFeed(event)
  return r
})


// CHECK PRODUCT STOCK
ipcMain.handle('check-stock', async (event, sku, channelId, size, loop) => {
  let r = await checkStock(event, sku, channelId, size, loop)
  return r
});




// BROWSER TASKS
ipcMain.handle('manual-browser', async (event, url, browserPath, profilePath, name) => {
  console.log('manual-browser: ', browserPath)
  let r = await manualBrowser(event, url, browserPath, profilePath, name)
  return r
})

ipcMain.handle('semi-browser', async (event, taskId, autoEnabled, singleIPEnabled, index, browserPath, profilePath, masterProfilePath, begin, end, launchWindowTime, groupSize, screenWidth, screenHeight, colDivision, rowDivision, browserWidth, browserHeight, shock, productSize, productSku, productId, threadId) => {
  let r = await semiBrowser(event, taskId, autoEnabled, singleIPEnabled, index, browserPath, profilePath, masterProfilePath, begin, end, launchWindowTime, groupSize, screenWidth, screenHeight, colDivision, rowDivision, browserWidth, browserHeight, shock, productSize, productSku, productId, threadId)
  return r
})

ipcMain.handle('automated-browser', async (event, url, browserPath, taskNumber, screenWidth, screenHeight, colDivision, rowDivision, browserWidth, browserHeight) => {
  let r = await automatedBrowser(event, url, browserPath, taskNumber, screenWidth, screenHeight, colDivision, rowDivision, browserWidth, browserHeight)
  return r
})

ipcMain.handle('kill-browsers', async (event, pid, autoEnabled) => {
  let r = await killBrowsers(event, pid, autoEnabled)
  return r
})

ipcMain.handle('master-browser', async (event, cpd, index, browserWidth, browserHeight, browserPath) => {
  let r = await masterBrowser(event, cpd, index, browserWidth, browserHeight, browserPath)
  return r
})

ipcMain.handle('get-status', async (event, pid, oldStatus) => {
  let r = await getStatus(event, pid, oldStatus)
  return r
})
