from flask import Blueprint, jsonify, request
from models import User, db
import requests

user_routes = Blueprint('user_routes', __name__)

@user_routes.route('/api/users', methods=['GET'])
def get_all_users():
    users = User.query.all()
    result = [
        {
            "user_id": user.user_id,
            "username": user.username,
            "email": user.email,
            "badge": user.badge
        } for user in users
    ]
    return jsonify(result)

@user_routes.route('/api/users/<int:user_id>', methods=['GET'])
def get_user_by_id(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"status": 404, "error": "User not found"}), 404

    result = {
        "user_id": user.user_id,
        "username": user.username,
        "email": user.email,
        "badge": user.badge  # Include badge count
    }
    return jsonify(result)

@user_routes.route('/api/auth/login', methods=['POST'])
def user_login():
    try:
        print("Received request for /api/auth/login") 
        data = request.json
        print(f"Request JSON data: {data}")
        access_token = data.get('access_token')

        if not access_token:
            return jsonify({
                'success': False,
                'error': 'No access token provided'
            }), 400

        google_user_info_url = f'https://www.googleapis.com/oauth2/v1/userinfo'
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Accept': 'application/json'
        }

        response = requests.get(google_user_info_url, headers=headers)
        if response.status_code != 200:
            return jsonify({
                'success': False,
                'error': 'Failed to verify Google token'
            }), 401

        user_info = response.json()
        print(user_info)   
        email = user_info.get('email')
        name = user_info.get('name')
        profile_pic_url = user_info.get('picture')  
        
        user = User.query.filter_by(email=email).first()
        if not user:
            user = User(email=email, username=name)  
            db.session.add(user)
            db.session.commit()

        return jsonify({
            'success': True,
            'user_id': user.user_id,
            'email': user.email,
            'profile': {
                'name': user.username,
                'email': user.email,
                'profile_pic_url': profile_pic_url 
            }
        }), 200

    except Exception as e:
        print(f"Error during login: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

