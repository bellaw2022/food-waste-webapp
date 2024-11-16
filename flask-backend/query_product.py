# query_product.py
import clip
import torch
import faiss
import numpy as np
from PIL import Image
import pickle
import sys
import ssl
import urllib.request
from collections import defaultdict, OrderedDict


print("Python executable:", sys.executable)
print("NumPy version:", np.__version__)
print("NumPy file location:", np.__file__)
ssl._create_default_https_context = ssl._create_unverified_context
print("Testing for SSH Verification")
# Load CLIP model
device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)

# Load FAISS Index
faiss_index_path = "faiss_index.index"
index = faiss.read_index(faiss_index_path)
print(f"Loaded FAISS index, including {index.ntotal} indexes")

# Load product names
product_names_path = "product_names.pkl"
with open(product_names_path, 'rb') as f:
    product_names = pickle.load(f)
print(f"Loaded {len(product_names)} product names")


def query_product(query_image_path, top_k=5):
    """
    Query and return top-k different products

    Args:
        query_image_path: Path to image or PIL Image object
        top_k: Number of different products to return

    Returns:
        dict containing:
        - predictions: list of top-k different products with their distances
        - best_match: the closest matching product
    """
    try:
        # Handle both PIL Image and path input
        if isinstance(query_image_path, str):
            image = Image.open(query_image_path).convert("RGB")
        else:
            image = query_image_path

        # Process image
        query_image = preprocess(image).unsqueeze(0).to(device)
        with torch.no_grad():
            query_embedding = model.encode_image(query_image).cpu().numpy().astype('float32')

        # Search in FAISS with a larger k to ensure we get enough unique products
        search_k = min(top_k * 3, index.ntotal)  # Search more to ensure enough unique products
        distances, indices = index.search(query_embedding, search_k)

        # Collect unique products while maintaining order
        unique_products = OrderedDict()

        for i in range(len(indices[0])):
            idx = indices[0][i]
            distance = float(distances[0][i])

            if idx < len(product_names):
                product = product_names[idx]
                if product not in unique_products:
                    unique_products[product] = distance
                    if len(unique_products) == top_k:
                        break

        # Convert to list of predictions
        predictions = [ product for product, _ in unique_products.items()]

        result = {
            'best_match': predictions[0],  # First product has smallest distance
            'predictions': predictions
        }

        return result

    except Exception as e:
        print(f"Failed to query image: {e}")
        return None