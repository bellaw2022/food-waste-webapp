import io
import query_product
from flask import request, jsonify, Blueprint
from PIL import Image

scan_routes = Blueprint('scan_routes', __name__)


@scan_routes.route('/api/scan', methods=['POST'])
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

        results = query_product.query_product(pil_image)

        return jsonify({
            "status": 200,
            "results": results
        })
    except Exception as e:
        print(f"Error processing image: {e}")
        return jsonify({'error': 'Failed to process image'}), 500
