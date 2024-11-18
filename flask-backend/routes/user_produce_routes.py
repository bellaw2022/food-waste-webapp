from flask import Blueprint, jsonify, request
from datetime import datetime, timedelta
from sqlalchemy import text
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
            "category": produce.category,
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
        max_id = db.session.query(db.func.max(UserAndProduce.userproduce_id)).scalar() or 0

        db.session.execute(
            text("SELECT setval('userandproduce_userproduce_id_seq', :max_id)")
            .bindparams(max_id=max_id)
        )

        produces_data = request.json
        added_produces = []

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
            added_produces.append(produce_data['produce_name'])

        db.session.commit()
        return jsonify({
            "status": 200,
            "data": f"Successfully added produces!"
        })

    except Exception as e:
        db.session.rollback()
        error_message = str(e)
        if "UniqueViolation" in error_message:
            error_message = "Database sequence error: Please contact administrator"
        return jsonify({
            "status": 202,
            "error": error_message
        })

@user_produce_routes.route('/api/user/<int:user_id>/produce', methods=['PUT'])
def update_user_produce(user_id):
    try:
        # Reset the sequence for UserWasteSaving table to prevent unique key violations
        max_waste_id = db.session.query(db.func.max(UserWasteSaving.user_waste_id)).scalar() or 0
        db.session.execute(
            text("SELECT setval('userwastesaving_user_waste_id_seq', :max_id)")
            .bindparams(max_id=max_waste_id)
        )

        data = request.get_json()
        today = datetime.now().date()
        total_co2_saved = 0

        # Process each produce update
        for userproduce_id, new_quantity in data.items():
            # Convert userproduce_id to integer
            userproduce_id = int(userproduce_id)

            # Get the user produce record and verify ownership
            user_produce = UserAndProduce.query.filter_by(
                userproduce_id=userproduce_id,
                user_id=user_id
            ).first()

            if not user_produce:
                raise ValueError(
                    f"UserAndProduce record {userproduce_id} not found or doesn't belong to user {user_id}")

            # Fetch produce information to calculate CO2 savings
            produce = Produce.query.get(user_produce.produce_id)
            if not produce:
                raise ValueError(f"Produce not found for UserAndProduce record {userproduce_id}")

            # Calculate CO2 savings based on quantity difference
            used_quantity = user_produce.quantity - float(new_quantity)
            co2_saved = used_quantity * produce.co2
            total_co2_saved += co2_saved

            # Update the produce quantity
            user_produce.quantity = float(new_quantity)

        # Update or create waste saving record for today
        waste_saving = UserWasteSaving.query.filter_by(
            user_id=user_id,
            date=today
        ).first()

        if waste_saving:
            # Add new CO2 savings to existing record
            waste_saving.co2_saved += total_co2_saved
        else:
            # Create new waste saving record for today
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
        # Improve error handling with more specific status codes
        error_message = str(e)
        if "UniqueViolation" in error_message:
            error_message = "Database sequence error: Please contact administrator"
        return jsonify({
            "status": 202,
            "error": error_message
        })

@user_produce_routes.route('/api/user/<int:user_id>/produce/trashall', methods=['PUT'])
def trash_user_all_produce(user_id):
    try:
        data = request.get_json()  # Expect a dictionary of userproduce_id to trash request

        for userproduce_id in data.keys():
            # Convert userproduce_id to integer
            userproduce_id = int(userproduce_id)

            # Fetch the UserAndProduce record and verify ownership
            user_produce = UserAndProduce.query.filter_by(
                userproduce_id=userproduce_id,
                user_id=user_id
            ).first()

            if not user_produce:
                raise ValueError(
                    f"UserAndProduce record {userproduce_id} not found or doesn't belong to user {user_id}")

            # Reset quantity to 0 to indicate it has been trashed
            user_produce.quantity = 0

        # Commit changes to the database
        db.session.commit()
        return jsonify({
            "status": 200,
            "data": "Successfully trashed the specified produces"
        })
    except Exception as e:
        db.session.rollback()
        # Return a detailed error message if an exception occurs
        return jsonify({
            "status": 202,
            "error": str(e)
        })

@user_produce_routes.route('/api/user/<int:user_id>/produce/trash', methods=['PUT'])
def trash_user_produce(user_id):
    try:
        data = request.get_json()  # Expect a dictionary of userproduce_id to new_quantity

        # Process each produce to trash
        for userproduce_id, new_quantity in data.items():
            # Convert userproduce_id to integer
            userproduce_id = int(userproduce_id)

            user_produce = UserAndProduce.query.filter_by(
                userproduce_id=userproduce_id,
                user_id=user_id
            ).first()

            if not user_produce:
                raise ValueError(
                    f"UserAndProduce record {userproduce_id} not found or doesn't belong to user {user_id}")

            user_produce.quantity = float(new_quantity)

        # Commit changes to the database
        db.session.commit()
        return jsonify({
            "status": 200,
            "data": "Successfully trashed or updated the specified produces"
        })
    except Exception as e:
        db.session.rollback()
        error_message = str(e)
        if "UniqueViolation" in error_message:
            error_message = "Database sequence error: Please contact administrator"
        return jsonify({
            "status": 202,
            "error": error_message
        })
