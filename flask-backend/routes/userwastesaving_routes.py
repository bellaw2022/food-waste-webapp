from sqlalchemy import func
from flask import Blueprint, jsonify, request, send_from_directory
from datetime import datetime, timedelta
from models import db, UserWasteSaving
import cv2
import numpy as np
import uuid
import base64
import io
import os

userwastesaving_routes = Blueprint('userwastesaving_routes', __name__)

@userwastesaving_routes.route('/api/user/<int:user_id>/wastesaving', methods=['GET'])
def get_weekly_waste_saving(user_id):
    try:
        today = datetime.now().date()
        four_weeks_ago = today - timedelta(weeks=4)

        weekly_savings = db.session.query(
            func.date_trunc('week', UserWasteSaving.date).label('week'),
            func.sum(UserWasteSaving.co2_saved).label('total_saved')
        ).filter(
            UserWasteSaving.date >= four_weeks_ago,
            UserWasteSaving.user_id == user_id
        ).group_by(
            func.date_trunc('week', UserWasteSaving.date)
        ).order_by(
            func.date_trunc('week', UserWasteSaving.date).desc()
        ).all()

        result = {str(i): -1 for i in range(1, 5)}

        for i, (week, total) in enumerate(weekly_savings, 1):
            if i <= 4:
                result[str(i)] = float(total) if total else -1

        return jsonify({"status": 200, "data": result})
    except Exception as e:
        return jsonify({"status": 202, "data": str(e)})

@userwastesaving_routes.route('/api/user/<int:user_id>/video', methods=['POST'])
def get_video(user_id):
    try:
        image_blobs = request.json

        output_path = blobs_to_video(image_blobs)
        if os.path.exists(output_path):
            os.remove(output_path)

        return send_from_directory("./tmp", output_path)
    except Exception as e:
        return jsonify({"status": 202, "data": str(e)})

def blobs_to_video(image_blobs, fps=12, codec='mp4v'):
    """Converts a list of image blobs to a video file."""
    
    # Strip the "data:image/jpeg;base64," prefix before passing to the function:
    base64_blobs = [blob.split(",")[1] for blob in image_blobs]

    tmp_dir = "./tmp"
    if not os.path.exists(tmp_dir):
        os.makedirs(tmp_dir)

    # Generate a unique output path
    output_file = f"{uuid.uuid4()}.mp4"
    output_path = f"./tmp/{output_file}"

    # Decode the first image blob to get the video dimensions
    first_blob = base64.b64decode(base64_blobs[0])
    first_image = cv2.imdecode(np.frombuffer(first_blob, np.uint8), cv2.IMREAD_COLOR)
    height, width, _ = first_image.shape

    # Define the video writer
    fourcc = cv2.VideoWriter_fourcc(*codec)
    video_writer = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

    # Write each image blob to the video
    for i, base64_blob in enumerate(base64_blobs):
        blob = base64.b64decode(base64_blob)
        image = cv2.imdecode(np.frombuffer(blob, np.uint8), cv2.IMREAD_COLOR)
        video_writer.write(image)

    # Release the video writer
    video_writer.release()

    return output_file