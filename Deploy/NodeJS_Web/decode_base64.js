var fs = require("fs")
const path = require('path');

function decode_base64(base64str, filename) {
    let buf = Buffer.from(base64str, 'base64');
  
    fs.writeFile(path.join(__dirname, '/image/', filename), buf, function(error) {
      if (error) {
        throw error;
      } else {
        console.log('File created from base64 string!');
        return true;
      }
    });
  }

  module.exports = { decode_base64 };