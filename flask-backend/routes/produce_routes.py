from flask import Blueprint, jsonify, request
from models import db, Produce

produce_routes = Blueprint('produce_routes', __name__)

@produce_routes.route('/api/produce', methods=['GET', 'POST'])
def get_produce_info():
    try:
        data = request.get_json()
        produces = data.get('produces', [])

        result = {}
        for produce_name in produces:
            produce = Produce.query.filter_by(produce_name=produce_name).first()
            if produce:
                result[produce_name] = {
                    "product_id": produce.produce_id,
                    "common_expdate": produce.common_expdate,
                    "unit": produce.unit
                }

        return jsonify({
            "status": 200,
            "data": result
        })
    except Exception as e:
        return jsonify({
            "status": 202,
            "data": str(e)
        })


@produce_routes.route('/api/all_produces', methods=['GET'])
def get_all_produces():
    try:
        produces = Produce.query.all()
        result = [p.produce_name for p in produces]
        return jsonify({"status": 200, "data": result})
    except Exception as e:
        return jsonify({"status": 202, "data": str(e)})