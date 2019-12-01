const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const ipcMain = require('electron').ipcMain;





ipcMain.handle('genirateBLock', async (event, dataThread) => {
  let promise = new Promise((resolve, reject) => {
    w = new Worker(dataThread.path, {workerData: {blockchain: dataThread.lastblock, messages: dataThread.messages}});
     w.on('message', (msg) => {
       resolve(msg)
     })
});
    let result = await promise
    return result
})
