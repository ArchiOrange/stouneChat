var Datastore = require('nedb');
var db = new Datastore({filename : __dirname + '\\db\\mydata.json', autoload: true});
var dbContact = new Datastore({filename : __dirname + '\\db\\contact.json', autoload: true});
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
exports.getListContacts = function (cb) {
  dbContact.find({}, function (err, docs) {
  cb(docs,err)
});
}
exports.getDialog = function (id,cb) {
  dbContact.findOne({_id: id }, function (err, doc) {
  cb(doc,err)
});
}
exports.addMessage = function (name,message,cb) {
  dbContact.update({ name: name }, { $push: { data: message } }, {}, function () {
});
}
exports.getName = function(cb) {
  var dbmydata = new Datastore({filename : __dirname + '\\db\\datanode.json', autoload: true});
  dbmydata.findOne({id:0}, function (err, doc) {
  cb(doc)
});
}
