from flask import Blueprint, jsonify, request
from datetime import datetime, timedelta
from models import db, UserAndProduce, Produce

user_produce_routes = Blueprint('user_produce_routes', __name__)

# Get all entries from UserAndProduce table of user_id
@user_produce_routes.route('/api/user/<int:user_id>/produce', methods=['GET'])
def get_user_produce(user_id):
    user_produce = UserAndProduce.query.filter_by(user_id=user_id).all()

    result = [
        {
            "user_produce_id": record.userproduce_id,
            "purchase_date": record.purchase_date.strftime('%Y-%m-%d'),
            "expiration_date": record.expiration_date.strftime('%Y-%m-%d'),
            "produce_id": record.produce_id,
            "quantity": record.quantity,
            "image_url" : record.image_url

        } for record in user_produce
    ]
    return jsonify(result)

# Add entry to UserAndProduce table of user_id
@user_produce_routes.route('/api/user/<int:user_id>/produce', methods=['POST'])
def add_user_produce(user_id):
    data = request.get_json()
    produce_name = data.get('produce_name')
    quantity = data.get('quantity')
    image_url = data.get('image_url')

    # Validate required data
    if not produce_name or not quantity:
        return jsonify({"error": "Produce name and quantity are required"}), 400
   
    # Fetch the produce details from the Produce table
    produce = Produce.query.filter_by(produce_name=produce_name).first()

    # Calculate the expiration date based on common_expdate and current date
    purchase_date = datetime.now().date()  # Assume purchase_date is the current date
    expiration_date = purchase_date + timedelta(days=produce.common_expdate)
    
    # Set expiration date to 1 day if produce not in database
    if not produce:
        expiration_date = purchase_date + timedelta(days=1)

    # Create a new UserAndProduce record
    new_user_produce = UserAndProduce(
        user_id=user_id,
        produce_id=produce.produce_id,
        quantity=quantity,
        purchase_date=purchase_date,
        expiration_date=expiration_date,
        image_url=image_url
    )

    # Add the record to the database
    db.session.add(new_user_produce)
    db.session.commit()

    # Return the created record as a response
    result = {
        "user_produce_id": new_user_produce.userproduce_id,
        "user_id": new_user_produce.user_id,
        "produce_id": new_user_produce.produce_id,
        "quantity": new_user_produce.quantity,
        "purchase_date": new_user_produce.purchase_date.strftime('%Y-%m-%d'),
        "expiration_date": new_user_produce.expiration_date.strftime('%Y-%m-%d'),
        "image_url": new_user_produce.image_url
    }
    
    return jsonify(result), 201
    
# Delete entry from UserAndProduce table of user_id and produce_id
@user_produce_routes.route('/api/user/<int:user_id>/produce/<int:produce_id>', methods=['DELETE'])
def delete_user_produce(user_id, produce_id):
    user_produce = UserAndProduce.query.filter_by(user_id=user_id, produce_id=produce_id).first()
    
    if user_produce:
        # If the record exists, delete it
        db.session.delete(user_produce)
        db.session.commit()  # Commit the change to the database
        return jsonify({"message": "Record deleted successfully"}), 200
    else:
        # If the record does not exist, return an error
        return jsonify({"message": "Record not found"}), 404

# Allows update to produce name, expiration date, and quantity (final quantity <= original quantity)
@user_produce_routes.route('/api/user/<int:user_id>/produce/<int:produce_id>', methods=['UPDATE'])
def update_user_produce(user_id, produce_id):
    user_produce = UserAndProduce.query.filter_by(user_id=user_id, produce_id=produce_id).first()
    if not user_produce:
        return jsonify({"message": "Record not found"}), 404
    
    data = request.get_json()

    if 'quantity' in data:
        new_quantity = data['quantity']
        if new_quantity > user_produce.quantity:
            return jsonify({"message": "New quantity cannot exceed original quantity"}), 400
        user_produce.quantity = new_quantity
    
    # Handle expiration_date update (if provided)
    if 'expiration_date' in data:
        try:
            user_produce.expiration_date = data['expiration_date']  # Assuming correct format (YYYY-MM-DD)
        except ValueError:
            return jsonify({"message": "Invalid expiration date format"}), 400
        
     # Handle produce_name update (if provided) by fetching the new produce_id from the Produce table
    if 'produce_name' in data:
        new_produce_name = data['produce_name']
        produce = Produce.query.filter_by(produce_name=new_produce_name).first()
        if produce:
            user_produce.produce_id = produce.produce_id
        else:
            return jsonify({"message": "Produce name not found"}), 404
        
     # Commit the updated information to the database
    db.session.commit()

    return jsonify({"message": "Record updated successfully"}), 200