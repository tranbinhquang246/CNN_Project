const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');

async function load_mode(){
    const model = await tf.loadLayersModel('file://D:/ki1nam4/Doan5/Node_Server/public/model/model.json');
    return model;
    }

module.exports = { load_mode };
    