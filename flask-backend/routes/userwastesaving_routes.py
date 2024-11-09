from flask import Blueprint, jsonify
from models import UserWasteSaving

userwastesaving_routes = Blueprint('userwastesaving_routes', __name__)

@userwastesaving_routes.route('/api/user/<int:user_id>/wastesaving', methods=['GET'])
def get_user_waste_saving(user_id):
    waste_savings = UserWasteSaving.query.filter_by(user_id=user_id).all()
    result = [
        {
            "user_waste_id": record.user_waste_id,
            "date": record.date.strftime('%Y-%m-%d'),
            "co2_saved": record.co2_saved
        } for record in waste_savings
    ]
    return jsonify(result)
