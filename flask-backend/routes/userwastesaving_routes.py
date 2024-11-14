from sqlalchemy import func
from flask import Blueprint, jsonify
from datetime import datetime, timedelta
from models import db, UserWasteSaving

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
