class DataSender {
  constructor(newBlock=0,init=0,blockchain=0,ipClient=0,peers=0,iam = 'server') {
    this.newBlock = newBlock
    this.init = init
    this.blockchain = blockchain
    this.peers = peers
    this.ipClient = ipClient
    this.iam = iam
  }
}
class Block {
    constructor(index, previousHash, timestamp, data, hash) {
        this.index = index;
        this.previousHash = previousHash.toString();
        this.timestamp = timestamp;
        this.data = data;
        this.hash = hash.toString();
    }
}
var getGenesisBlock = () => {
    return new Block(0, "0", 1465154705, {index: 1569875278.027,message: "it is Genesis Block!"}, "816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7");
};
var messages = [{
index: 1569871054.813,
message: "sadasdsadasd444444as"
}]
var blockchain = [getGenesisBlock()];
var peers = []


//***********************SERVER****************************//

const {createServer}= require('http')
var express = require("express");
var bodyParser = require('body-parser');
var WebSocket = require("ws");
var app = express();
const server = createServer(app)
const ws = new WebSocket.Server({server});
app.use(bodyParser.json());

ws.on('connection',function (wss) {
      //get(wss)
  wss.on('message',function incoming(data) {
      data= JSON.parse(data)
      if (data.init==1) {
        var dataSendToClient = new DataSender()
        dataSendToClient.ipClient = wss._socket.remoteAddress.replace(/::.+:/,'')
        dataSendToClient.blockchain = blockchain;
        dataSendToClient.peers = peers
        dataSendToClient.init = 2;
        dataSendToClient = JSON.stringify(dataSendToClient)
        wss.send(dataSendToClient);
        peers[peers.length] = {ip:wss._socket.remoteAddress.replace(/::.+:/,''),port: data.port,count: 0}
        var dataNewPeer = new DataSender()
        dataNewPeer.init = 3
        dataNewPeer.peers = peers[peers.length-1]
        dataNewPeer = JSON.stringify(dataNewPeer)
        ws.clients.forEach(function each(client) {
            if(wss!= client && client.readyState == WebSocket.OPEN){
              client.send(dataNewPeer);
            }
        });

      }
      else if (data.init == 8) {
        for (var i = 0; i < peers.length; i++) {
          if (peers[i].ip == data.peer.ip && peers[i].port == data.peer.port){
            peers[i].splice(i,1)
            if(wss!= client && client.readyState == WebSocket.OPEN){
              client.send(dataNewPeer);
            }
          }
        }
      }
  })
  wss.on('close',function () {
    console.log('disconect');
  })

})

app.get('/blockchain',function (req,res) {
  res.json({peers})

})
app.get('/sendmes',function (req,res) {
    var sendData = new DataSender()
    sendData.block = {index: new Date().getTime() / 1000, message: req.query.mes };
    sendData.init = 5
    ws.clients.forEach(function each(client) {
        if(client.readyState == WebSocket.OPEN){
          sendData = JSON.stringify(sendData)
          console.log(sendData);
          client.send(sendData);
        }
    });
    res.json(blockchain)
})
server.listen(8080, () => console.log('Listening http on port: ' + '8080'));
//***********************SERVER****************************//
