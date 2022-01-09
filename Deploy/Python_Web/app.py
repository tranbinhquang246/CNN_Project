from flask import Flask, flash, request, redirect, url_for, render_template
from werkzeug.utils import secure_filename
from tensorflow.keras.models import load_model
from keras.preprocessing import image
import numpy as np
import os



# Creating a Flask Instance
app = Flask(__name__)

labels = ['cardboard', 'glass', 'metal', 'paper', 'plastic', 'trash']

IMAGE_SIZE = (148, 198)
UPLOAD_FOLDER = 'static\\uploads'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])
app.config.from_object(__name__)
app.config['SECRET_KEY'] = '7d441f27d441f27567d441f2b6176a'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

print("Loading Pre-trained Model ...")
model = load_model('model_train_v2.h5')

def image_preprocessor(img_path):
    img = image.load_img(img_path, target_size=(148, 198))
    img_tensor = image.img_to_array(img)
    img_tensor = np.expand_dims(img_tensor,
                                axis=0)
    img_tensor /= 255.
    return img_tensor


def model_pred(image):
    print("Image_shape", image.shape)
    print("Image_dimension", image.ndim)
    prediction = model.predict(image)[0]
    return (prediction)


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/', methods=['GET', 'POST'])
def home():
    return render_template('index.html')


@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    # Checks if post request was submitted
    if request.method == 'POST':
        # check if the post request has the file part
        if 'imageFile' not in request.files:
            flash('No file part')
            return redirect(request.url)
        # check if filename is an empty string
        file = request.files['imageFile']
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)

        # if file is uploaded
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            imgPath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(imgPath)
            print(f"Image saved at {imgPath}")
            # Preprocessing Image
            image = image_preprocessor(imgPath)
            # Perfroming Prediction
            pred = model.predict(image)
            predict = labels[np.argmax(pred)]
            return render_template('upload.html', name=filename, result=predict)
    return redirect(url_for('home'))


if __name__ == '__main__':
    app.run(debug=True)