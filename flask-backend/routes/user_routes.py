from flask import Blueprint, jsonify
from models import User

user_routes = Blueprint('user_routes', __name__)

@user_routes.route('/api/users', methods=['GET'])
def get_all_users():
    users = User.query.all()
    result = [
        {
            "user_id": user.user_id,
            "username": user.username,
            "email": user.email
        } for user in users
    ]
    return jsonify(result)
