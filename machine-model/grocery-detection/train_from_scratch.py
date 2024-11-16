import os
import clip
import torch
import faiss
import numpy as np
from PIL import Image
import pickle

import sys
import numpy as np

print("Python executable:", sys.executable)
print("NumPy version:", np.__version__)
print("NumPy file location:", np.__file__)

# Load CLIP model
device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)

images_dir = "./archive/train"

product_names = []
product_images = []


# Load on each kind of product images
for product_name in os.listdir(images_dir):
    product_path = os.path.join(images_dir, product_name)
    if os.path.isdir(product_path):
        # i = 10  # train on small sets for demo
        for img_file in os.listdir(product_path):
            # if i == 0:
            #     break
            if img_file.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.gif')):
                img_path = os.path.join(product_path, img_file)
                product_images.append(img_path)
                product_names.append(product_name)
                # i -= 1

print(f"Suc to load {len(product_images)} images，including {len(set(product_names))} product types")

# Get embedding of images
image_embeddings = []
for idx, img_path in enumerate(product_images):
    print(f"Processing {idx + 1}/{len(product_images)}: {img_path}")
    try:
        image = preprocess(Image.open(img_path).convert("RGB")).unsqueeze(0).to(device)
        with torch.no_grad():
            embedding = model.encode_image(image).cpu().numpy()
            image_embeddings.append(embedding)
    except Exception as e:
        print(f"Failed to process {img_path}: {e}")

# Convert to NumPy 
image_embeddings = np.vstack(image_embeddings).astype('float32')

# Build FAISS index
dimension = image_embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(image_embeddings)
print(f"Suc to build FAISS index，including {index.ntotal} indexes.")

# Save FAISS index to local
faiss_index_path = "faiss_index.index"
faiss.write_index(index, faiss_index_path)
print(f"Suc to save FAISS index to {faiss_index_path}.")

# Save product name to local
product_names_path = "product_names.pkl"
with open(product_names_path, 'wb') as f:
    pickle.dump(product_names, f)
print(f"Save product name to {product_names_path}")