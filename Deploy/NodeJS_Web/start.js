const express = require("express");
const app = express();
const port = 3000;
const Cors = require('cors');
const bodyParser = require("body-parser");
var fs = require("fs")
const path = require('path');
const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');
const Jimp = require('jimp');
const lib_decode = require("./decode_base64");
const lib_predict = require("./predict");

app.use(bodyParser.urlencoded({extended:true,limit:'50mb',parameterLimit:50000}));
app.use(Cors())


app.post('/', Cors(), async(req, res) => {
  const getdata = await req.body.img;
  await lib_decode.decode_base64(getdata, 'image.jpg')
  var predict_label = await lib_predict.predict()
  await console.log(predict_label)
  res.send(predict_label)
})



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})