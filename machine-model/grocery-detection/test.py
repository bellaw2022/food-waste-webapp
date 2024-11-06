import clip
import torch
import faiss
import numpy as np
import time
from PIL import Image
import pickle  # Load product name

import sys
import numpy as np

print("Python executable:", sys.executable)
print("NumPy version:", np.__version__)
print("NumPy file location:", np.__file__)

# Load CLIP model
device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)

# Load FAISS Index
faiss_index_path = "faiss_index_v2.index"
index = faiss.read_index(faiss_index_path)
print(f"Loaded FAISS index，including {index.ntotal} indexes")

# Load product names
product_names_path = "product_names_v2.pkl"
with open(product_names_path, 'rb') as f:
    product_names = pickle.load(f)
print(f"Loaded {len(product_names)} product names")


def query_product(query_image_path):
    try:
        # Process image
        query_image = preprocess(Image.open(query_image_path).convert("RGB")).unsqueeze(0).to(device)
        with torch.no_grad():
            query_embedding = model.encode_image(query_image).cpu().numpy().astype('float32')
        
        # Search in FAISS 
        distances, indices = index.search(query_embedding, 1)

        idx = indices[0][0]
        distance = distances[0][0]
        
        # # Get most top k similar products
        # results = []
        # for i in range(top_k):
        #     idx = indices[0][i]
        #     distance = distances[0][i]
        if idx < len(product_names):
            result = {
                'product_name': product_names[idx],
                'distance': float(distance)
            }
        return result
    except Exception as e:
        print(f"Filed to query {query_image_path}: {e}")
        return []


start_time = time.time()
# query_image_path = "./images/BEANS/BEANS0011.png"
query_image_path = "./archive/validation/banana/Image_8.jpg"
result = query_product(query_image_path)
end_time = time.time()
execution_time = end_time - start_time
print(f"Execution time: {execution_time} seconds")
if result:
    print("Most similar products:")
    print(f"Product: {result['product_name']}, distance: {result['distance']}")
else:
    print("Not found valid product.")

