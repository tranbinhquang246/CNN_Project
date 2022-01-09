const Jimp = require('jimp');
const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');

async function predict(){
    const IMAGE_FILE_PATH = `${__dirname}/image/image.jpg`;
    const MODEL_DIR_PATH = `${__dirname}`;
    var max_predict = 0;
    var predict_label;
    var index;
    labels = ['cardboard', 'glass', 'metal', 'paper', 'plastic', 'trash']
  
    const model = await tf.loadLayersModel(`file://${MODEL_DIR_PATH}/public/model/model.json`);
    model.summary();
 
    const image = await Jimp.read(IMAGE_FILE_PATH);
        image.cover(150, 200, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE );
  
    const NUM_OF_CHANNELS = 3;
    let values = new Float32Array(150 * 200 * NUM_OF_CHANNELS);
  
    let i = 0;
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
        const pixel = Jimp.intToRGBA(image.getPixelColor(x, y));
        pixel.r = pixel.r / 127.5 - 1;
        pixel.g = pixel.g / 127.5 - 1;
        pixel.b = pixel.b / 127.5 - 1;
        pixel.a = pixel.a / 127.5 - 1;
        values[i * NUM_OF_CHANNELS + 0] = pixel.r;
        values[i * NUM_OF_CHANNELS + 1] = pixel.g;
        values[i * NUM_OF_CHANNELS + 2] = pixel.b;
        i++;
        });


    const outShape = [150, 200, NUM_OF_CHANNELS];
    let img_tensor = tf.tensor3d(values, outShape, 'float32');
    img_tensor = img_tensor.expandDims(0);
  
    const predictions = await model.predict(img_tensor).dataSync();
    //console.log(predictions)
  
    for (let i = 0; i < predictions.length; i++){
        const label = labels[i];
        const probability = predictions[i];
        if(max_predict < predictions[i]){
            max_predict = predictions[i]
            index = i
            predict_label = await labels[i];
        }
            console.log(`${label}: ${probability}`);
    }
        
    //console.log(predict_label);    
    return await predict_label;
}

module.exports = { predict};