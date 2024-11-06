import os
import sys
import pickle
import numpy as np
import torch
import faiss
import clip
from PIL import Image

print("Python executable:", sys.executable)
print("NumPy version:", np.__version__)
print("NumPy file location:", np.__file__)

# Load CLIP model
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {device}")
model, preprocess = clip.load("ViT-B/32", device=device)

# images_dir = "images"
images_dir = "./archive/train"

# Paths to existing data
product_names_path = "product_names.pkl"
faiss_index_path = "faiss_index.index"

product_names_path_v2 = "product_names_v2.pkl"
faiss_index_path_v2 = "faiss_index_v2.index"

# Load existing product names
if os.path.exists(product_names_path):
    with open(product_names_path, 'rb') as f:
        product_names = pickle.load(f)
    print(f"Loaded {len(product_names)} product names.")
else:
    raise Exception("No existing product_names.pkl found. Initialized empty list.")
    # product_names = []
    # print("No existing product_names.pkl found. Initialized empty list.")

# Load existing FAISS index or create a new one
if os.path.exists(faiss_index_path):
    index = faiss.read_index(faiss_index_path)
    print(f"Loaded FAISS index with {index.ntotal} entries.")
else:
    raise Exception("No existing FAISS index found. Initializing a new index.")
    # # Initialize a new FAISS index if none exists
    # print("No existing FAISS index found. Initializing a new index.")
    # # Assuming CLIP ViT-B/32 embeddings are 512-dimensional
    # dimension = 512
    # index = faiss.IndexFlatL2(dimension)
    # print("Initialized new FAISS index.")

# Prepare to collect new embeddings and product names
new_product_names = []
new_image_embeddings = []
total_product_count = len(os.listdir(images_dir))

# Iterate through the images directory to process new images
for product_id, product_name in enumerate(os.listdir(images_dir)):
    product_path = os.path.join(images_dir, product_name)
    print(f"{'-' * 15} Start process for {product_name}, {product_id}/{total_product_count} {'-' * 15}")
    if os.path.isdir(product_path):
        total_img_count = len(os.listdir(product_path))

        for img_idx, img_file in enumerate(os.listdir(product_path)):
            print(f"{img_idx}/{total_img_count} for {product_name}")
            # if img_idx == 10:
            #     # Test on small set
            #     break

            if img_file.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.gif')):
                img_path = os.path.join(product_path, img_file)
                new_product_names.append(product_name)
                try:
                    # Preprocess the image and generate embedding
                    image = preprocess(Image.open(img_path).convert("RGB")).unsqueeze(0).to(device)
                    with torch.no_grad():
                        embedding = model.encode_image(image).cpu().numpy()
                        new_image_embeddings.append(embedding)
                except Exception as e:
                    print(f"Error processing image {img_path}: {e}")

print(f"Prepared {len(new_image_embeddings)} new image embeddings.")

if new_image_embeddings:
    # Convert list of embeddings to a NumPy array
    new_image_embeddings = np.vstack(new_image_embeddings).astype('float32')
    
    # Add new embeddings to FAISS index
    index.add(new_image_embeddings)
    print(f"Added {new_image_embeddings.shape[0]} new embeddings to FAISS index.")
    
    # Update the product names list
    product_names.extend(new_product_names)
    print(f"Updated product names list to {len(product_names)} entries.")
    
    # Save the updated FAISS index
    faiss.write_index(index, faiss_index_path_v2)
    print(f"Saved updated FAISS index to {faiss_index_path_v2}.")
    
    # Save the updated product names list
    with open(product_names_path_v2, 'wb') as f:
        pickle.dump(product_names, f)
    print(f"Saved updated product names to {product_names_path_v2}.")
else:
    print("No new embeddings to add.")
