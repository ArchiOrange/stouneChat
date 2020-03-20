var Datastore = require('nedb');
var db = new Datastore({filename : __dirname + '/db/mydata.json', autoload: true});
exports.addDataPeer = function (ip,port) {
  db.insert({ip: ip,port: +port,count: 0}), function (err, newDoc) {   // Callback is optional
    cb(newDoc)
  }
}
db.remove({}, {}, function (err, numRemoved) {
});
exports.addDataAboutPeers = function (peers,cb) {
  db.insert(peers), function (err, newDoc) {   // Callback is optional
    cb(newDoc,err)
  }
}
exports.findPeer = function (ip,port,cb) {
  db.findOne({ ip: ip,port: +port }, function (err, doc) {
    cb(doc)
});
}
exports.updatePeer = function (ip,port,countClient) {
  db.update({ ip: ip,port: +port }, { $set:  { count: countClient }  }, {}, function (err,ff) {
  });
}
exports.delPeer = function (ip,port,cb) {
  db.remove({ip: ip,port: +port}, {}, function (err, numRemoved) {
    cb(err,numRemoved)
  });
}
exports.getMapNetwork = function (cb) {
  db.find({}, function (err, docs) {
  cb(docs,err)
});
}
