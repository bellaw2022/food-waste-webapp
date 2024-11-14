from flask import Blueprint, jsonify, request
from datetime import datetime, timedelta
from models import db, UserAndProduce, Produce, UserWasteSaving

user_produce_routes = Blueprint('user_produce_routes', __name__)


@user_produce_routes.route('/api/user/<int:user_id>/produce', methods=['GET'])
def get_user_inventory(user_id):
    try:
        inventory = db.session.query(
            UserAndProduce, Produce
        ).join(
            Produce
        ).filter(
            UserAndProduce.user_id == user_id,
            UserAndProduce.quantity > 0
        ).all()

        result = [{
            "userproduce_id": user_produce.userproduce_id,
            "produce_name": produce.produce_name,
            "quantity": user_produce.quantity,
            "unit": produce.unit,
            "purchase_date": user_produce.purchase_date.strftime('%Y-%m-%d'),
            "expiration_date": user_produce.expiration_date.strftime('%Y-%m-%d')
        } for user_produce, produce in inventory]

        return jsonify({"status": 200, "data": result})
    except Exception as e:
        return jsonify({"status": 202, "data": str(e)})


# Add entry to UserAndProduce table of user_id
@user_produce_routes.route('/api/user/<int:user_id>/produce', methods=['POST'])
def add_user_produce(user_id):
    try:
        produces_data = request.json
        for produce_data in produces_data:
            produce = Produce.query.filter_by(produce_name=produce_data['produce_name']).first()
            if not produce:
                raise ValueError(f"Produce {produce_data['produce_name']} not found")

            user_produce = UserAndProduce(
                user_id=user_id,
                produce_id=produce.produce_id,
                quantity=produce_data['quantity'],
                purchase_date=datetime.strptime(produce_data['purchase_date'], '%Y-%m-%d'),
                expiration_date=datetime.strptime(produce_data['expiration_date'], '%Y-%m-%d')
            )
            db.session.add(user_produce)

        db.session.commit()
        return jsonify({"status": 200, "data": "Success to add produces!"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"status": 202, "data": str(e)})


@user_produce_routes.route('/api/user/<int:user_id>/produce', methods=['PUT'])
def update_user_produce(user_id):
    try:
        data = request.get_json()
        today = datetime.now().date()

        total_co2_saved = 0

        for userproduce_id, new_quantity in data.items():
            # Convert userproduce_id to integer
            userproduce_id = int(userproduce_id)

            # Get the user produce record
            user_produce = UserAndProduce.query.filter_by(
                userproduce_id=userproduce_id,
                user_id=user_id
            ).first()

            if not user_produce:
                raise ValueError(
                    f"UserAndProduce record {userproduce_id} not found or doesn't belong to user {user_id}")

            # Get the associated produce record to get co2 value
            produce = Produce.query.get(user_produce.produce_id)
            if not produce:
                raise ValueError(f"Produce not found for UserAndProduce record {userproduce_id}")

            # Calculate used quantity and co2 saved
            used_quantity = user_produce.quantity - float(new_quantity)
            co2_saved = used_quantity * produce.co2
            total_co2_saved += co2_saved

            # Update the quantity
            user_produce.quantity = float(new_quantity)
            # Note: We keep the record even if quantity becomes 0

        # Update or create waste saving record for today
        waste_saving = UserWasteSaving.query.filter_by(
            user_id=user_id,
            date=today
        ).first()

        if waste_saving:
            waste_saving.co2_saved += total_co2_saved
        else:
            new_waste_saving = UserWasteSaving(
                user_id=user_id,
                date=today,
                co2_saved=total_co2_saved
            )
            db.session.add(new_waste_saving)

        db.session.commit()
        return jsonify({
            "status": 200,
            "data": "Successfully updated produces"
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "status": 202,
            "data": str(e)
        })