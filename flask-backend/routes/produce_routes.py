from flask import Blueprint, jsonify, request
from models import db, Produce

produce_routes = Blueprint('produce_routes', __name__)

@produce_routes.route('/api/produce', methods=['GET'])
def get_all_produce():
    produces = Produce.query.all()
    result = [
        {
            "produce_id": produce.produce_id,
            "produce_name": produce.produce_name,
            "unit": produce.unit,
            "common_expdate": produce.common_expdate,
            "co2": produce.co2
        } for produce in produces
    ]
    return jsonify(result), 200

@produce_routes.route('/api/produce/<int:produce_id>', methods=['GET'])
def get_produce(produce_id):
    produce = Produce.query.get(produce_id)
    if produce is None:
        return jsonify({"error": "Produce not found"}), 404
    result = {
        "produce_id": produce.produce_id,
        "produce_name": produce.produce_name,
        "unit": produce.unit,
        "common_expdate": produce.common_expdate,
        "co2": produce.co2
    }
    return jsonify(result), 200

@produce_routes.route('/api/produce', methods=['POST'])
def add_produce():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    try:
        produce_name = data['produce_name']
        unit = data.get('unit')
        common_expdate = data.get('common_expdate')
        co2 = data.get('co2')

        # Input Validation
        if not produce_name or not isinstance(produce_name, str):
            return jsonify({"error": "Valid 'produce_name' is required."}), 400

        if unit and not isinstance(unit, str):
            return jsonify({"error": "'unit' must be a string."}), 400

        if common_expdate is not None:
            if not isinstance(common_expdate, int) or common_expdate < 0:
                return jsonify({"error": "'common_expdate' must be a non-negative integer."}), 400

        if co2 is not None:
            if not isinstance(co2, (int, float)) or co2 < 0:
                return jsonify({"error": "'co2' must be a non-negative number."}), 400

        # Check for Duplicate Produce Name
        existing_produce = Produce.query.filter_by(produce_name=produce_name).first()
        if existing_produce:
            return jsonify({"error": "Produce with this name already exists."}), 409

        # Create New Produce Instance
        new_produce = Produce(
            produce_name=produce_name,
            unit=unit,
            common_expdate=common_expdate,
            co2=co2
        )

        # Add to Database
        db.session.add(new_produce)
        db.session.commit()

        result = {
            "produce_id": new_produce.produce_id,
            "produce_name": new_produce.produce_name,
            "unit": new_produce.unit,
            "common_expdate": new_produce.common_expdate,
            "co2": new_produce.co2
        }

        return jsonify(result), 201

    except KeyError as e:
        return jsonify({"error": f"Missing key: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

