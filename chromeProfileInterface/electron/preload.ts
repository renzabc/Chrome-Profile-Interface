import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },

  // You can expose other APTs you need here.
  // ...
})

// import { firefox } from 'playwright';
contextBridge.exposeInMainWorld(`thiswindow`, {
  minimize: async () => {
    ipcRenderer.invoke('minimize-window')
  },
  maximize: async () => {
    ipcRenderer.invoke('maximize-window')
  },
  close: async () => {
    ipcRenderer.invoke('close-window')
  }
})

contextBridge.exposeInMainWorld('system', {
  startCLKR: async () => {
    ipcRenderer.invoke('start-clkr')
    ipcRenderer.once('START_CLKR', () => {
    })
  },

  openFolder: async (directory: string, master: boolean) => {
    ipcRenderer.invoke('open-folder', directory, master)
    ipcRenderer.once('OPEN_FOLDER', () => {
    })
  },

  saveSettings: async (text: string, setting: string) => {
    ipcRenderer.invoke('save-settings', text, setting)
    ipcRenderer.once('SAVED_SETTINGS', () => {
    })
  },
  readSettings: async () => {
    let r = ipcRenderer.invoke('read-settings')
    ipcRenderer.once('READ_SETTINGS', (_, result) => {
    })
    return r
  },

  saveTasks: async (text: string, setting: string) => {
    ipcRenderer.invoke('save-tasks', text, setting)
    ipcRenderer.once('SAVED_TASKS', () => {
    })
  },
  readTasks: async () => {
    let r = ipcRenderer.invoke('read-tasks')
    ipcRenderer.once('READ_TASKS', (_, result) => {
    })
    return r
  }
})

contextBridge.exposeInMainWorld(`thiswindow`, {
  minimize: async () => {
    ipcRenderer.invoke('minimize-window')
  },
  maximize: async () => {
    ipcRenderer.invoke('maximize-window')
  },
  close: async () => {
    ipcRenderer.invoke('close-window')
  }
})

contextBridge.exposeInMainWorld('tasks', {
  manualBrowser: async (url: string, browserPath: string, profilePath: string, profileNum: string) => {
    let r = ipcRenderer.invoke('manual-browser', url, browserPath, profilePath, profileNum)
    ipcRenderer.once('MANUAL_BROWSER ${}', async () => {

    })
    return r;
  },

  killBrowsers: async (pid: number, autoEnabled: boolean) => {
    let r = ipcRenderer.invoke('kill-browsers', pid, autoEnabled)
    ipcRenderer.once('KILL_BROWSERS ${}', async () => {
    })
    return r;
  },


})

