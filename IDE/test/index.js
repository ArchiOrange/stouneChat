const DBcontacts = require('../../peer1/contacts')




// let q =  async () =>  {
//   let a = await DBcontacts.getListContacts()
//   console.log(a);
// }()
let e = async function () {
    let a = await DBcontacts.getListContacts()
    console.log(a);
}()

// function () {
//   console.log('dsdsdsdsdsd');
// }();
