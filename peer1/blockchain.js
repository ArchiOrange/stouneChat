const crypto = require('crypto');
var Datastore = require('nedb');
var db = new Datastore({filename : __dirname + '\\db\\blockchain.json', autoload: true});
var indexMes = 0;
var messages = [];
class Block {
    constructor(index, previousHash, timestamp, data,nonce=0, hash) {
        this.index = index;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
        this.nonce = nonce;
        this.hash = hash;
    }
}
exports.previousBlockAlpha = function (cb) {
  db.count({}, function (err, count) {
    db.findOne({ index: count-1 }, function (err, docs) {
    return cb(docs)
  })
});
}
var addBlockInDB = function (block,cb) {
  db.insert(block, function (err, newDoc) {   // Callback is optional
    //console.log(err);
    cb(newDoc)
});
}
var calculateHash = function ( index,previousHash,timestamp,data, cb) {
    for (var i = 0; i < 100000000; i++) {//////
      const hash = crypto.createHash('sha256');//
      dataForHash = index + previousHash + timestamp + data + i
      hash.update(dataForHash);
      var dataForHash = hash.digest('hex')
      var str = dataForHash.match(/^000/)
      if (str!= null) {
      return cb(dataForHash,data,i);
      }
    }
}
var checkHash = function ( index,previousHash,timestamp,data,i) {
      const hash = crypto.createHash('sha256');//
      dataForHash = index + previousHash + timestamp + data + i
      hash.update(dataForHash);
      var dataForHash = hash.digest('hex')
      return dataForHash
};
exports.deleteMessageAddInBlock = function (block) {
  for (var i = 0; i < block.data.length; i++) {
    for (var j = 0; j < messages.length; j++) {
      if(messages[j].index == block.data[i].index){
         messages.splice(j,1)
         break;
      }
    }
  }
}
exports.addMessage = function (message){
  messages[messages.length] = {index: new Date().getTime() / 1000, message: message }
  return true
}
exports.showMessages = function (cb) {
  return cb(messages)
}
exports.isValidNewBlock = function (newBlock,previousBlock,cb) {
      //console.log({err:'неверный индекс',previousBlock:previousBlock,newBlock:newBlock});
      if (previousBlock.index + 1 !== newBlock.index) {

          return cb(false);
      } else if (previousBlock.hash !== newBlock.previousHash) {
          console.log('неверный хеш предыдущего блока');
          return cb(false);
      } else if (checkHash(newBlock.index,newBlock.previousHash,newBlock.timestamp,newBlock.data,newBlock.nonce) !== newBlock.hash) {
          console.log('неверный хеш: ');
          return cb(false);
      }
      return cb(true);
};
exports.generateNextBlock = function (workerData,cb) { //передавать весь обект а не ссылку !wo
  var blockData = JSON.parse(JSON.stringify(workerData.messages))
    let nextIndex = workerData.blockchain.index + 1;
    var nextTimestamp = new Date().getTime() / 1000;
    var nextHash = calculateHash(nextIndex, workerData.blockchain.hash, nextTimestamp, blockData,function(hash,data,nonce) {
       block =  new Block(nextIndex, workerData.blockchain.hash, nextTimestamp, data,nonce, hash);
    return  cb(block)
    })
}
exports.upload =  function (newBlockchain) {
  previousBlockAlpha(function (docsPreviousBlock) {
    var previousBlock = blockchain[blockchain.length-1]
      if (exports.isValidNewBlock(previousBlock,newBlockchain[blockchain.length]) && newBlocks.length > blockchain.length) {
          for (var i = blockchain.length; i < newBlockchain.length; i++) {
            blockchain[i] = newBlockchain[i]
            addBlockInDB(newBlockchain[i],function (docs) {
            })
          }
      } else {
          console.log('Принятый блокчейн не является валидным');
      }
  })

}
exports.addFirstBlockchain = function (newBlockchain) {
  addBlockInDB(newBlockchain,function (docs) {
  })
}
exports.showBlockchain = function (cb) {
  db.find({}).sort({index:1}).exec( function (err, blockchain) {
    cb(blockchain)
});

}
exports.addNewBlockToBlockchain = function (block,cb) {
  db.insert(block, function (err, newDoc) {   // Callback is optional
    console.log(err);
    cb(newDoc)
});
}
