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
const ipcRenderer = require('electron').ipcRenderer;
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
const {createServer}= require('http')
var express = require("express");
var bodyParser = require('body-parser');
var WebSocket = require("ws");
var app = express();
const server = createServer(app)
const wsServer = new WebSocket.Server({server});
app.use(bodyParser.json());
var wss = null
firstConnection('localhost',9010)
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
  })
  wss.on('close',function () {
    newClient(myData,-1)
console.log('disconect',wss._connectionKey);
  })
})
var serverup = (ip) => {
   server.listen(myport,ip, () => {
     statusServer = true
     console.log('Listening http on pxort: ' + myport,'server port' + 9000)
   });
}

var sendMessageForAllConnectPeers = (dataSender,wsServer,poolServers) => {
  dataSender = JSON.stringify(dataSender)
  var i = 0;
  wsServer.clients.forEach(function each(client) {
      client.send(dataSender);
  });
    for (var i = 0; i < poolServers.length; i++) {
      //console.log(poolServers[i].url);
      poolServers[i].servers.send(dataSender)
    }
}
  //*********************KLIENT*********************//
  // var poolServers
  // var poolPorts = [{portserver:8080}]
  // for (var i = 0; i < portserver.length; i++) {
  //   console.log(1);
  //   opentConectionForPoolServers(8080,poolServers.portserver)
  // }

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
              //console.log(peers);
              poolServers[i] = opentConectionForPoolServers(data.peers[i].ip,data.peers[i].port)
              poolServers[i] = {servers:poolServers[i],url:poolServers[i].url}
            }
            serverup(data.ipClient)
            ApiBlockchain.showBlockchain(function (blockchain) {
              if(blockchain==0){
                lastblock = data.blockchain[0]
                //console.log(lastblock);
                ApiBlockchain.addFirstBlockchain(data.blockchain)
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
    //console.log('disconect',wsClient.url);
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
          //console.log(8);
          disconectPeerFromNetwork(data,wsServer,poolServers,wss)
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
exports.sendMessage = function (message) {
      var sendData = new DataSender()
      sendData.block = message
      sendData.init = 5
      sendMessageForAllConnectPeers(sendData,wsServer,poolServers)
}
  //*********************KLIENT*********************//
var sendDataNewClient = (data,wss,wsServer,poolServers) => {
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
    //console.log(dataNewPeer);
  sendMessageForAllConnectPeers(dataNewPeer,wsServer,poolServers)
}
var receptionAndBroadkastMessages = (wsServer,poolServers,wss,data) => {
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
      ApiBlockchain.showMessages(function (cashMes) {
          let priveteLastBlock = lastblock
          var dataThread = {
            path: __dirname+ '\\worker.js',
            messages: cashMes,
            lastblock:priveteLastBlock
          }
          ipcRenderer.invoke('genirateBLock', dataThread).then((result) => {
            dataSender = new DataSender ()
            dataSender.init = 6
            dataSender.newBlock = result.blockForBlockhain
            dataSender.newBlock.sign = myport
            console.log('dataSender',dataSender);
            sendMessageForAllConnectPeers(dataSender,wsServer,poolServers)
          })
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
           DBcontact.getListContacts(function (contact) {
             if(data.newBlock.data[0].recipient == myName || data.newBlock.data[0].sender == myName){
               for (var i = 0; i < contact.length; i++) {
                 if(contact[i].name == data.newBlock.data[0].recipient || contact[i].name == data.newBlock.data[0].sender){
                   DBcontact.addMessage(contact[i].name,data.newBlock.data[0], function () {
                     console.log('aaaaa');
                   })
                 }
               }
             }
           })
           if(doc != 0 ){
             console.log({status: 'ADD'});
           }
           sendMessageForAllConnectPeers(data,wsServer,poolServers)
           ApiBlockchain.deleteMessageAddInBlock(data.newBlock)
         })
       }
    }
  })

}


var sendDataAboutPeers = (data,wsServer,poolServers) => {
    DBapi.findPeer(data.peer.ip,data.peer.port,function(peer) {
      if(peer == null &&  data.peer.port != myData.myPort){
        DBapi.addDataPeer(data.peer.ip,data.peer.port,data.peer.count,function(newDoc) {
          //console.log('adding new Peer',newDoc);
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
  //console.log(8);
  DBapi.findPeer(data.peer.ip,+data.peer.port,function (peer) {
      if (peer != null) {
        DBapi.delPeer(data.peer.ip,+data.peer.port,function(err, numRemoved) {
          //console.log('rem',err,numRemoved,+data.peer.port);
          sendMessageForAllConnectPeers(data,wsServer,poolServers)
        })

      }
  })
}
