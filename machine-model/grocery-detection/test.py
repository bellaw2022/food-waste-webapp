import clip
import torch
import faiss
import numpy as np
import time
from PIL import Image
import pickle
from pathlib import Path
from collections import defaultdict
import csv
from datetime import datetime

print("Loading required components...")
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

        if idx < len(product_names):
            return {
                'product_name': product_names[idx],
                'distance': float(distance)
            }
        return None
    except Exception as e:
        print(f"Failed to query {query_image_path}: {e}")
        return None


def evaluate_test_set(test_dir):
    """
    Evaluate all images in test directory and calculate accuracy metrics

    Args:
        test_dir: Path to test directory containing product subdirectories
    """
    test_path = Path(test_dir)
    total_images = 0
    correct_predictions = 0
    processing_times = []
    errors = []

    # Create results directory if it doesn't exist
    results_dir = Path("test_results")
    results_dir.mkdir(exist_ok=True)

    # Prepare CSV file for errors
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    error_csv_path = results_dir / f"errors_{timestamp}.csv"

    with open(error_csv_path, 'w', newline='') as error_file:
        error_writer = csv.writer(error_file)
        error_writer.writerow(['True Label', 'Predicted Label', 'Image Path', 'Distance'])

        # Process each product directory
        class_metrics = defaultdict(lambda: {'total': 0, 'correct': 0})

        for product_dir in test_path.iterdir():
            if not product_dir.is_dir():
                continue

            true_label = product_dir.name
            print(f"\nProcessing {true_label}...")

            # Process each image in the product directory
            for image_path in product_dir.glob('*'):
                if not image_path.is_file():
                    continue

                start_time = time.time()
                result = query_product(str(image_path))
                processing_time = time.time() - start_time
                processing_times.append(processing_time)

                if result:
                    predicted_label = result['product_name']
                    total_images += 1
                    class_metrics[true_label]['total'] += 1

                    if predicted_label.lower() == true_label.lower():
                        correct_predictions += 1
                        class_metrics[true_label]['correct'] += 1
                    else:
                        # Record error
                        error_writer.writerow([
                            true_label,
                            predicted_label,
                            str(image_path),
                            result['distance']
                        ])
                        errors.append({
                            'true_label': true_label,
                            'predicted_label': predicted_label,
                            'image_path': str(image_path),
                            'distance': result['distance']
                        })

    # Calculate and save metrics
    accuracy = correct_predictions / total_images if total_images > 0 else 0
    avg_processing_time = np.mean(processing_times)

    # Save detailed results
    results_file = results_dir / f"test_results_{timestamp}.txt"
    with open(results_file, 'w') as f:
        f.write("Test Results Summary\n")
        f.write("===================\n\n")
        f.write(f"Total images tested: {total_images}\n")
        f.write(f"Correct predictions: {correct_predictions}\n")
        f.write(f"Overall accuracy: {accuracy:.2%}\n")
        f.write(f"Average processing time per image: {avg_processing_time:.4f} seconds\n\n")

        f.write("Per-Class Performance\n")
        f.write("====================\n")
        for class_name, metrics in class_metrics.items():
            class_accuracy = metrics['correct'] / metrics['total'] if metrics['total'] > 0 else 0
            f.write(f"{class_name}:\n")
            f.write(f"  Total: {metrics['total']}\n")
            f.write(f"  Correct: {metrics['correct']}\n")
            f.write(f"  Accuracy: {class_accuracy:.2%}\n\n")

    return {
        'total_images': total_images,
        'correct_predictions': correct_predictions,
        'accuracy': accuracy,
        'avg_processing_time': avg_processing_time,
        'errors': errors,
        'class_metrics': dict(class_metrics)
    }


if __name__ == "__main__":
    test_dir = "./archive/test"
    print(f"Starting evaluation of test set in {test_dir}...")
    results = evaluate_test_set(test_dir)

    print("\nEvaluation Complete!")
    print(f"Total images tested: {results['total_images']}")
    print(f"Overall accuracy: {results['accuracy']:.2%}")
    print(f"Average processing time: {results['avg_processing_time']:.4f} seconds")
    print(f"Number of errors: {len(results['errors'])}")
    print(f"\nDetailed results and error log have been saved to the 'test_results' directory.")