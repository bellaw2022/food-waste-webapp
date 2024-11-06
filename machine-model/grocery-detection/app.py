from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import io
import query_product
# import os
# import uuid

app = Flask(__name__)
CORS(app)  # allow cross origin request

@app.route('/scan', methods=['POST'])
def scan():
    if 'image' not in request.files:
        return jsonify({'error': 'No image part in the request'}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # file_path = os.path.join("upload_image", f"{uuid.uuid4()}_{file.filename}")
    # file.save(file_path)

    try:
        img_bytes = file.read()
        pil_image = Image.open(io.BytesIO(img_bytes)).convert("RGB")

        results = query_product.query_product(pil_image, top_k=6)

        return jsonify({
            'results': results
        }), 200
    except Exception as e:
        print(f"Error processing image: {e}")
        return jsonify({'error': 'Failed to process image'}), 500

@app.route('/')
def index():
    return "Pong"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
