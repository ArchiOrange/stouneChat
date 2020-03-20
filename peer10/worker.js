const ApiBlockchain = require('./blockchain');
const {  parentPort ,workerData} = require('worker_threads');

    ApiBlockchain.generateNextBlock(workerData,function (block) {
      parentPort.postMessage({ blockForBlockhain: block})
    })
