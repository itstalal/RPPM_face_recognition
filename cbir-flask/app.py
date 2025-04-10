from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import uuid
from cbir.traitement import traiter_image_requete 
import numpy as np

app = Flask(__name__,
            static_folder=os.path.join('cbir', 'animalsCbir'),
            static_url_path='/static')
CORS(app)

UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
ALLOWED_EXTENSIONS = {'.png', '.jpg', '.jpeg', '.bmp'}

@app.route('/api/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No file found'}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'Empty filename'}), 400

    ext = os.path.splitext(file.filename)[1]
    if ext.lower() not in ALLOWED_EXTENSIONS:
        return jsonify({'error': 'Invalid file type'}), 400


    distance = request.form.get('distance', 'canberra')
    descripteur = request.form.get('descripteur', 'glcm_haralik_bit')

    filename = f"{uuid.uuid4()}{ext}"
    path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(path)

    try:
        result = traiter_image_requete(path, distance=distance, descripteur=descripteur)
        return jsonify({'resultat': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    static_path = os.path.abspath(app.static_folder)
    print(f"!!! Serving static files from: {static_path}")
    app.run(debug=True)
