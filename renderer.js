// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
var fs = require('fs');
function firtStart() {
  fs.readFile(__dirname+'/index.html', function(err, data){
    var fff = data.document.getElementById('jjj');
    console.log(fff);
    var frame =   document.getElementById('frame');
    frame.parentNode.removeChild(frame);

  });

///var index = require('.index.html')
}
