# query_product.py
import clip
import torch
import faiss
import numpy as np
from PIL import Image
import pickle
import sys
from collections import defaultdict
import ssl
import urllib.request


print("Python executable:", sys.executable)
print("NumPy version:", np.__version__)
print("NumPy file location:", np.__file__)
ssl._create_default_https_context = ssl._create_unverified_context
print("Testing for SSH Verification")
# Load CLIP model
device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)

# Load FAISS Index
faiss_index_path = "faiss_index_v2.index"
index = faiss.read_index(faiss_index_path)
print(f"Loaded FAISS index, including {index.ntotal} indexes")

# Load product names
product_names_path = "product_names_v2.pkl"
with open(product_names_path, 'rb') as f:
    product_names = pickle.load(f)
print(f"Loaded {len(product_names)} product names")


def query_product(pil_image, top_k=1):
    try:
        # Process image
        query_image = preprocess(pil_image).unsqueeze(0).to(device)
        with torch.no_grad():
            query_embedding = model.encode_image(query_image).cpu().numpy().astype('float32')
        
        # Search in FAISS 
        distances, indices = index.search(query_embedding, top_k)

        product_count = defaultdict(int)
        for i in range(top_k):
            idx = indices[0][i]
            distance = distances[0][i]
            if idx < len(product_names):
                product = product_names[idx]
                # if product in weighted_distances:
                #     weighted_distances[product] += distance
                # else:
                #     weighted_distances[product] = distance
                product_count[product] += 1
                print(f"{product}: {distance}")
        
        print(product_count)
        best_product = max(product_count, key=product_count.get)

        result = {
            'product_name': best_product
        }
        
        return result
    except Exception as e:
        print(f"Failed to query image: {e}")
        return []