const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
class DataSender {
  constructor(newBlock=0,init=0,blockchain=0,ipClient=0,peers=0,port=0) {
    this.newBlock = newBlock
    this.init = init
    this.blockchain = blockchain
    this.peers = peers
    this.ipClient = ipClient
    this.port = port
  }
}
class Block {
    constructor(index, previousHash, timestamp, block, hash,blockexist = myport) {
        this.index = index;
        this.previousHash = previousHash.toString();
        this.timestamp = timestamp;
        this.block = block;
        this.hash = hash.toString();
    }
}
var lastblock = 0
const DBapi = require('./db.js')
const ApiBlockchain = require('./blockchain');
const crypto = require('crypto');
var myData = {myIP:null,myPort:null,countClient:null}
var myport = __dirname.replace(/\D/g,'')
myport = +myport+ 9000
let w = null
var statusServer = false
//var peers = null
var poolServers = []
//***********************INIT****************************//
const {createServer} = require('http')
const express = require("express");
const bodyParser = require('body-parser');
const WebSocket = require("ws");
let  app = express();
let  server = createServer(app)
const wsServer = new WebSocket.Server({server});
app.use(bodyParser.json());
var wss = null
firstConnection('localhost',8080)
wsServer.on('connection',function (wss) {//событие соединющие всех
  newClient(myData,1)
  wss.on('message',function incoming(data) {//событие прослушивающие данные от клиентов
      data= JSON.parse(data)
      if (data.init==1) {//запрос данных при первом включении
        sendDataNewClient(data,wss,wsServer,poolServers)
      }

      else if (data.init == 3) {
        sendDataAboutPeers(data,wsServer,poolServers)
      }
      else if (data.init == 4) {
        handlerNewClient(data,wsServer,poolServers)
      }
      else if (data.init == 5) {//прием сообщения
        receptionAndBroadkastMessages(wsServer,poolServers,wss,data)
      }
      else if (data.init == 6) {
        receivedBlockProcessing(data,wsServer,poolServers,wss)
      }
      else if (data.init == 8){
        disconectPeerFromNetwork(data,wsServer,poolServers,wss)
      }
      else if (data.init == 7) {
       sendNewChain(wss,data)
      }
  })
  wss.on('close',function () {
    newClient(myData,-1)

      DBapi.findPeer(wss._socket.remoteAddress.replace(/::.+:/,''),wss.port,function (peer) {
          if(peer != null ){
            DBapi.delPeer(peer.ip,peer.port,function (err,log) {
            })
            let dataAbotDisconnectPeer = new DataSender()
            dataAbotDisconnectPeer.init = 8
            dataAbotDisconnectPeer.data = peer
            sendMessageForAllConnectPeers(dataAbotDisconnectPeer,wsServer,poolServers)
          }
      })
  })
})
var serverup = (ip) => {
   server.listen(myport,ip, () => {
     statusServer = true
     console.log('Listening http on pxort: ' + myport)
   });
}

var sendMessageForAllConnectPeers = (dataSender,wsServer,poolServers) => {
  dataSender = JSON.stringify(dataSender)
  var i = 0;
  wsServer.clients.forEach(function each(client) {
      client.send(dataSender);
  });
    for (var i = 0; i < poolServers.length; i++) {
      poolServers[i].servers.send(dataSender)
    }
}
  //*********************KLIENT*********************//

  function firstConnection(ip,portserver) {
    var WebSocket = require("ws");
    var wsClient = new WebSocket('ws://'+ip+':'+ portserver)
    wsClient.on('open',function open() {
      var data = new DataSender()
      data.init = 1
      data.port = myport
      data = JSON.stringify(data)
      wsClient.send(data)

    })
    wsClient.on('message',function incoming(data) {
          data= JSON.parse(data)
          if(data.init == 2 && !statusServer){
            statusServer = !statusServer
            myData.myIP = data.ipClient
            myData.myPort = myport
            peers = data.peers
            DBapi.addDataAboutPeers(peers,function (peers) {

            })
            //peers = data.peers
            for (var i = 0; i < data.peers.length; i++) {
              poolServers[i] = opentConectionForPoolServers(data.peers[i].ip,data.peers[i].port)
              poolServers[i] = {servers:poolServers[i],url:poolServers[i].url}
            }
            serverup(data.ipClient)
            ApiBlockchain.showBlockchain(function (blockchain) {
              if(blockchain == 0){
                lastblock = data.blockchain[0]
                ApiBlockchain.addFirstBlockchain(data.blockchain)
              }
              else{
                ApiBlockchain.getLastChain(function (lastBlock) {
                let requestNewChain = {
                  init: 7,
                  data: lastBlock.timestamp
                }
                  requestNewChain = JSON.stringify(requestNewChain)
                  poolServers[0].servers.send(requestNewChain)
                })

              }
            })
          }
    })
  }
function opentConectionForPoolServers(ip,portserver) {
  var WebSocket = require("ws");
  var wsClient = new WebSocket('ws://'+ip+':'+ portserver)
  wsClient.on('open',function open() {
    var data = new DataSender()
    data.init = 1
    data.port = myport
    data = JSON.stringify(data)
    wsClient.send(data)

  })
  wsClient.on('close',function () {
    for (var i = 0; i < poolServers.length; i++) {
      if (poolServers[i].url ==wsClient.url) {
        poolServers.splice(i,1)
      }
    }
        var peerIP = wsClient.url.replace('ws://','')
        peerIP = peerIP.replace(/:.+/,'')
        peerPort = wsClient.url.replace(/ws:[//].+:/,'')
        data = new DataSender()
        data.peer = {ip: peerIP,port: peerPort}
        data.init = 8
        sendMessageForAllConnectPeers(data,wsServer,poolServers)
  })
  wsClient.on('error',function () {
  })
  wsClient.on('message',function incoming(data) {
        data = JSON.parse(data)
        if (data.init==3) {
          sendDataAboutPeers(data,wsServer,poolServers)
        }
        else if (data.init == 4) {
          handlerNewClient(data,wsServer,poolServers)
        }
        else if (data.init == 5) {
          receptionAndBroadkastMessages(wsServer,poolServers,wss,data);
        }
        else if (data.init == 6) {
          receivedBlockProcessing(data,wsServer,poolServers,wss)
        }
        else if (data.init == 8){
          disconectPeerFromNetwork(data,wsServer,poolServers,wss)
        }
        else if (data.init == 9){
            checkNewChain(data)
        }
  })
  return wsClient
}




app.get('/blockchain',function (req,res) {
  ApiBlockchain.showBlockchain(function (blockchain) {
  res.json({peers,blockchain})
  })
})
app.get('/messages',function (req,res) {
  ApiBlockchain.showMessages(function (messages) {
  res.json(messages)
  })
})
app.get('/peers',function (req,res) {
  DBapi.getMapNetwork(function (peers) {
    res.json(peers)
  })
})
app.get('/send',function (req,res) {
    ApiBlockchain.showMessages(function (messages) {
      var sendData = new DataSender()
      sendData.block = {
        index: new Date().getTime() / 1000,
        id:req.query.id,
        message: req.query.m
      }
      sendData.init = 5
      sendMessageForAllConnectPeers(sendData,wsServer,poolServers)
    res.sendStatus(200)
    })
})
  //*********************KLIENT*********************//
var sendDataNewClient = (data,wss,wsServer,poolServers) => {
  wss.port = data.port
  ApiBlockchain.showBlockchain(function (blockchain) {
    var dataSendToClient = new DataSender()
    dataSendToClient.ipClient = wss._socket.remoteAddress
    //dataSendToClient.peers = peers
    dataSendToClient.blockchain = blockchain
    dataSendToClient.init = 2;
    dataSendToClient = JSON.stringify(dataSendToClient)
    wss.send(dataSendToClient);
  })

  //peers[peers.length] = wss._socket.remoteAddress
  var dataNewPeer = new DataSender()
  dataNewPeer.init = 3
  dataNewPeer.peer = {
    ip:wss._socket.remoteAddress.replace(/::.+:/,''),
    port: data.port,
    count: 0
    }
  sendMessageForAllConnectPeers(dataNewPeer,wsServer,poolServers)
}
var receptionAndBroadkastMessages = (wsServer,poolServers,wss,data) => {
            console.log("messageOK");
  var k = 1 ;
  ApiBlockchain.showMessages(function (cashMes) {
    for (var i = 0; i < cashMes.length; i++) {
      if(cashMes[i].index == data.block.index){
        k = 0
        break
      }
    }
    if(k==1){
      cashMes[cashMes.length] = data.block
      sendMessageForAllConnectPeers(data,wsServer,poolServers)
      let myWorker = startWorker(__dirname + '/worker.js', (err, result) => {
          if(err) return console.error(err);
          dataSender = new DataSender ()
          dataSender.init = 6
          dataSender.newBlock = result.blockForBlockhain
          dataSender.newBlock.sign = myport
          sendMessageForAllConnectPeers(dataSender,wsServer,poolServers)
      })
    }
  })
}
var   receivedBlockProcessing = (data,wsServer,poolServers,wss) => {
  ApiBlockchain.isValidNewBlock(data.newBlock,lastblock,function(bool) {
    if(bool){
      if(lastblock.previousHash != data.newBlock.previousHash && lastblock.index != data.newBlock.index){
        lastblock = data.newBlock
         ApiBlockchain.addNewBlockToBlockchain(data.newBlock,function(doc) {
           if(doc != 0 ){
             console.log({status: 'ADDblock'});
           }
           sendMessageForAllConnectPeers(data,wsServer,poolServers)
           ApiBlockchain.deleteMessageAddInBlock(data.newBlock)
         })
       }
    }
  })

}
var  startWorker = (path, cb) => {
      blockchain = lastblock
      ApiBlockchain.showMessages(function (cashMes) {
       w = new Worker(path, {workerData: {blockchain: blockchain,messages: cashMes}});
        w.on('message', (msg) => {
            cb(null, msg)
        })
        w.on('error', cb);
        w.on('exit', (code) => {
            if(code != 0)
                console.error(new Error(`Worker stopped with exit code ${code}`))
       });
       return w;
     })


  }
var sendDataAboutPeers = (data,wsServer,poolServers) => {
    DBapi.findPeer(data.peer.ip,data.peer.port,function(peer) {
      if(peer == null &&  data.peer.port != myData.myPort){
        DBapi.addDataPeer(data.peer.ip,data.peer.port,data.peer.count,function(newDoc) {
          sendMessageForAllConnectPeers(data,wsServer,poolServers)
        })

      }
    })
}
function newClient(myData,i) {
  var data = new DataSender()
  data.init = 4
  myData.countClient = myData.countClient+i
  data.peer = {ip: myData.myIP,port: myData.myPort,count: myData.countClient }
  sendMessageForAllConnectPeers(data,wsServer,poolServers)

}
function handlerNewClient(data,wsServer,poolServers) {
  if ( data.peer.port != myData.myPort ) { //добавить айпи для реальных машин
    DBapi.findPeer(data.peer.ip,data.peer.port,function (peer) {
    if (peer != null && peer.count != data.peer.count ) {
      DBapi.updatePeer(data.peer.ip,data.peer.port,data.peer.count)
      sendMessageForAllConnectPeers(data,wsServer,poolServers)
    }
    })
  }
}
function disconectPeerFromNetwork(data,wsServer,poolServers,wss) {
  DBapi.findPeer(data.ip,+data.port,function (peer) {
      if (peer != null) {
        DBapi.delPeer(data.peer.ip,+data.peer.port,function(err, numRemoved) {
          sendMessageForAllConnectPeers(data,wsServer,poolServers)
        })

      }
  })
}

function checkNewChain(data) {
  let chain = data.data
    if(data.data.length){
      ApiBlockchain.getLastChain(function (lastBlock) {
        ApiBlockchain.upload(chain,lastBlock,function (status) {
          if(status){
            console.log(360,status);
            lastBlock = chain[chain.length-1]
          }
        })
      })
    }

}

function sendNewChain(wss,data) {
  let index = data.data
   ApiBlockchain.getNewChain(index,function (chain) {
     dataNewChain = {
       init: 9,
       data: chain
     }
     dataNewChain = JSON.stringify(dataNewChain)
     wss.send(dataNewChain)
   })
}
