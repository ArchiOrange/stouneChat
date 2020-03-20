var Datastore = require('nedb');
var db = new Datastore({filename : __dirname + '/db/contacts.json', autoload: true});


exports.addContact = function (id,name,cb) {
  db.insert({id:id,name:name,messages:[]},function (err, newDoc) {   // Callback is optional
    cb(newDoc,err)
  });
}
exports.addMessages = function (idRoom,id,message,date) {
  db.update({id: idRoom},{$push: {messages: {id: id,message:message, date: date }}},{},function () {
  });
}
exports.getDialog =  function (idRoom,cb) {
  db.findOne({id: idRoom},function (err,doc) {
    cb(doc);
  });
}

exports.findMessage = function (idRoom,id,message,date,cb) {
  db.findOne({id: idRoom, messages:  {id: id, message: message, date: date } },function (err,doc) {
    cb(doc);
  });
}
exports.getListContacts = function (cb) {
  db.find({ }, function (err,doc) {
    cb(doc)
  })
}
  // exports.getListContacts = async function () {
  //     db.find({ }, function (err,doc) {
  //       return doc
  //   })
  // }
