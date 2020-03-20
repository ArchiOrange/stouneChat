require('./peer1/index.js');

var DBcontact = require('./peer1/db.js');
var DBcontacs = require('./peer1/contacts.js');

myName =null
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const Index = require('./peer1/index.js')
DBcontacs.getListContacts(function (contacts) {
  for (var i = 0; i < contacts.length; i++) {
    Index.GlobListContact[i] = {
      id: contacts[i].id,
      name: contacts[i].name
    }
        if (i === 0) {
          var li = `<li id="${contacts[i].id}" class="contact active">
                      <p>${contacts[i].name}</p>
                   </li>`
          $('ul.contacts').append(li)
        } else{
          var li = '<li id="'+contacts[i].id+'" class="contact">'+
                      '<p>'+contacts[i].name+'</p>'+
                   '</li>'
          $('ul.contacts').append(li)
        }
  }
})


$('ul.contacts').on('click','li',function () {
  let selector = $(this)
  DBcontacs.getDialog($(this).attr('id'),function (contact) {
    selectContact(selector,contact.messages)
  })
})

$('.input button').on('click',function (){
    let dataSendMessage = {
      id: $('[class = "contact active"]').attr('id'),
      index: new Date().getTime() / 1000,
      text: $('#textMessages').val()
    }
    DBcontacs.addMessages(dataSendMessage.id,1,dataSendMessage.text,dataSendMessage.index ,function() {

    })
    $('#textMessages').val('')
  Index.sendMessage(dataSendMessage.id,dataSendMessage.index,dataSendMessage.text)
})

$('.showBlockchain button').on('click',function (){
    let nameContact = $('#nameNewContact').val()

    let idConatact = Index.creatIdRoom()
    DBcontacs.addContact(idConatact,nameContact,function (doc) {
      var li = `<li id="${doc.id}" class="contact active">
                  <p>${doc.name}</p>
               </li>`
      $('[class = "contact active"]').attr('class','contact')
      $('ul.contacts').append(li)
      alert(`Идентификатор диалога для ${doc.name} \n ${doc.id}`)
      let nameContact = $('#nameNewContact').val('')
    })
})
function selectContact(selector,messages) {
  $('[class = "contact active"]').attr('class','contact')
  $('div.messages').find('div.message').remove()
  for (var i = 0; i < messages.length; i++) {
    let dateUNIX = new Date(messages[i].date *1000)
    let dateConvert = `${dateUNIX.getHours()}:${dateUNIX.getMinutes()} ${dateUNIX.getDate()}/${dateUNIX.getMonth()}/${dateUNIX.getFullYear()}`
    console.log(dateUNIX.getDate());
    if (messages[i].id == 1) {
    let  message  =  `<div class="message send">
                      <div class="wrap">
                        <p>${messages[i].message}</p>
                        <span>${dateConvert}</span>
                      </div>
                    </div>`
      $('div.messages').append(message)
    } else {
    let  message=  `<div class="message replice">
                      <div class="wrap">
                      <p>${messages[i].message}</p>
                      <span>${dateConvert}</span>
                      </div>
                    </div>`
          $('div.messages').append(message)
    }
  }
  selector.attr('class','contact active')
}
