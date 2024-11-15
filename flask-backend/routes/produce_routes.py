from flask import Blueprint, jsonify, request
from models import db, Produce

produce_routes = Blueprint('produce_routes', __name__)

@produce_routes.route('/api/produce', methods=['GET'])
def get_produce_info():
    try:
        data = request.get_json()
        produces = data.get('produces', [])

        result = fetch_produce_info(produces)
        
        return jsonify({
            "status": 200,
            "data": result
        })
    except Exception as e:
        return jsonify({
            "status": 202,
            "data": str(e)
        })

# helper function so I can reuse this function for another function  
def fetch_produce_info(produces):
    print("fetch_produce_info: ", produces)
    result = {}
    for produce_name in produces:
        if(len(produce_name) < 2):
            continue
        produce = Produce.query.filter_by(produce_name=produce_name).first()
        if produce:
            result[produce_name] = {
                "product_id": produce.produce_id,
                "common_expdate": produce.common_expdate,
                "unit": produce.unit
            }
        # to account for plurals
        else: 
            produce = Produce.query.filter_by(produce_name=produce_name[0:-1]).first()
            if produce:
                result[produce_name] = {
                    "product_id": produce.produce_id,
                    "common_expdate": produce.common_expdate,
                    "unit": produce.unit
                }
            else:
                produce = Produce.query.filter_by(produce_name=produce_name[0:-2]).first()
                if produce:
                    result[produce_name] = {
                        "product_id": produce.produce_id,
                        "common_expdate": produce.common_expdate,
                        "unit": produce.unit
                    }
   
    return result

'''
@produce_routes.route('/api/produces', methods=['GET'])
def print_all_produce():
    # Query all entries in the produce table
    all_produce = Produce.query.filter_by(produce_name = 'tomato').first()
    
    produce_list = [
        {
            "produce_id": all_produce.produce_id,
            "produce_name": all_produce.produce_name,
            "common_expdate": all_produce.common_expdate,
            "unit": all_produce.unit
        }
        #for produce in all_produce
    ]
    return jsonify({"data": produce_list, "status": 200})
'''

@produce_routes.route('/api/all_produces', methods=['GET'])
def get_all_produces():
    try:
        produces = Produce.query.order_by(Produce.category, Produce.produce_name).all()

        result = {}

        for p in produces:
            if p.category not in result:
                result[p.category] = []
            result[p.category].append(p.produce_name)

        return jsonify({
            "status": 200,
            "data": result
        })

    except Exception as e:
        return jsonify({
            "status": 202,
            "data": str(e)
        })