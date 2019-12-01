require('./peer1/index.js')
var DBcontact = require('./peer1/db.js')
myName =null
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const Index = require('./peer1/index.js')
DBcontact.getListContacts(function (contact) {
  for (var i = 0; i < contact.length; i++) {
    if (i === 0) {
      var li = '<li id="'+contact[i]._id+'" class="contact active">'+
                  '<p>'+contact[i].name+'</p>'+
               '</li>'
      $('ul.contacts').append(li)
    } else{
      var li = '<li id="'+contact[i]._id+'" class="contact">'+
                  '<p>'+contact[i].name+'</p>'+
               '</li>'
      $('ul.contacts').append(li)
    }
  }
DBcontact.getName(function (doc) {
    myName = doc.name
    $('.my-name h2').text(doc.name)
})
})


$('ul.contacts').on('click','li',function () {
  $('ul.contacts').find('li').attr('class','contact')
  $(this).attr('class','contact active')
  getDialogForContact($(this).attr('id'),DBcontact)
})

$('.input button').on('click',function (){
  let message = {
    timestamp: new Date().getTime() / 1000,
    text: textMessages = $('#textMessages').val(),
    recipient: $('li.contact.active').text(),
    sender: $('.my-name h2').text()
  }
  Index.sendMessage(message)
})


function getDialogForContact (id,DBContact) {
  DBContact.getDialog(id,function (dialog) {
    $('div.messages').find('div.message').remove()
    for (var i = 0; i < dialog.data.length; i++) {
      if (dialog.data[i].sender == myName) {
      let  message=  '<div class="message send">'+
                        '<div class="wrap">'+
                          '<p>'+dialog.data[i].text+'</p>'+
                          '<span>'+dialog.data[i].timestamp+'</span>'+
                        '</div>'+
                      '</div>'
        $('div.messages').append(message)
      } else {
      let  message=  '<div class="message replice">'+
                      '<div class="wrap">'+
                        '<p>'+dialog.data[i].text+'</p>'+
                        '<span>'+dialog.data[i].timestamp+'</span>'+
                      '</div>'+
                    '</div>'
            $('div.messages').append(message)
      }
    }
  })
}
