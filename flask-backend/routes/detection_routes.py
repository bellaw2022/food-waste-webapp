from flask import Blueprint, request, Response
import requests
from openai import AsyncOpenAI
import os
import base64
import json
import asyncio

detection_routes = Blueprint('detection_routes', __name__)

client = AsyncOpenAI(
    api_key=os.getenv('OPENAI_API_KEY')
)

RECEIPT_PROMPT = """
    Does this image contain a receipt?

    Format your response as a JSON object as such:
    {
        "description": "<description of the image>",
        "has_receipt": true/false,
        "reasoning": "<your reasoning>"
    }

    If the image contains a receipt, set "has_receipt" to 'true' ONLY if you are able to make out words on the receipt. Otherwise, set it to 'false'.
"""

DETECT_PRODUCE_PROMPT = """
    Does this image contain produce or meals?

    Format your response as a JSON object as such:
    {
        "description": "<description of the image>",
        "has_produce": true/false,
        "reasoning": "<your reasoning>",
        "items": [
            {
                "name": "<name of the item>",
                "is_meal": true/false,
                "meal_id": "<id of the meal parent>",
                "reasoning": "<your reasoning>"
                "ingredients": "<comma separated list of ingredients>"
            }
        ]
    }

    If the image contains produce or meals, add each item to the description of the image.
    If the image contains produce or meals, set "has_produce" to 'true'. Otherwise, set it to 'false'.
    If you are able to identify any items in the image, list them in the "items" array, and be as specific as possible (example, different colored bell peppers go in separate lines).
    If the image contains a meal, set "is_meal" to 'true'. Otherwise, set it to 'false'.
    If is_meal is set to 'true', list the ingredients in the "ingredients" string instead of the "items" array.
    If is_meal is set to 'true', include the "meal_id" string (starting at 0) to indicate the id of the meal (useful if the meal item is part of a larger meal).
    if is_meal is set to 'false', don't include the "ingredients" string or the "meal_parent" string.
    If you are unable to identify any items, leave the "items" array empty.
"""

def response_to_json(data):
    try:
        data = data.split('```json')[-1].split('```')[0]
        data = json.loads(data)
        return data
    except Exception:
        return None

async def query_image(image_base64, img_type, prompt, max_retries=3, backoff_delay=0):
    for i in range(max_retries):
        try:
            response = await client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt},
                            {
                                "type": "image_url",
                                "image_url": {"url": f"data:{img_type};base64,{image_base64}"},
                            },
                        ]
                    }
                ],
                timeout=60
            )
            content = response.choices[0].message.content
            json_content = response_to_json(content)
            return json_content
        except Exception as e:
            print(f'Error in query_image: {e}')
            if 'Invalid MIME type' in str(e):
                print('Invalid MIME type. Cannot process image.')
                return {"error": "Invalid MIME type. Cannot process image.", "status": "critical"}
            print(f'Retrying... ({i+1}/{max_retries})')
            await asyncio.sleep(2**i * backoff_delay)
    return {"error": "Could not process image.", "status": "ignore"}

async def veryfi():
    NotImplementedError

@detection_routes.route('/api/detect_produce', methods=['GET'])
async def detect_produce():
    image_url = request.args.get('image_url')
    if not image_url:
        return {"error": "image_url parameter is required"}, 400

    image_url = image_url.strip('"')
    image = requests.get(image_url)
    image_base64 = base64.b64encode(image.content).decode('utf-8')
    img_type = image.headers['Content-Type']

    data = await query_image(image_base64, img_type, RECEIPT_PROMPT)
    if data.get('status') == 'critical':
        return Response(json.dumps(data), mimetype='application/json'), 400
    elif data.get('status') == 'ignore' or not data.get('has_receipt'):
        data = await query_image(image_base64, img_type, DETECT_PRODUCE_PROMPT)
        return Response(json.dumps(data), mimetype='application/json')
    else:
        return Response(f"Contact receipt reader api\n\n{json.dumps(data)}", mimetype='application/json')
