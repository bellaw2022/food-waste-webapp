"""summary_
Routes for generating recipes based on user preferences and ingredients.

Attributes:
    recipe_routes (Blueprint): The recipe routes blueprint
    client (AsyncOpenAI): The OpenAI client
"""

from flask import Blueprint, jsonify, request, Response
import requests
from openai import AsyncOpenAI
import os
import asyncio
from models import UserAndProduce, Produce
import json

recipe_routes = Blueprint('recipe_routes', __name__)

client = AsyncOpenAI(
    api_key=os.getenv('OPENAI_API_KEY')
)

if not client.api_key:
    raise ValueError("API key is required to run this script, create one at https://platform.openai.com/api-keys")

@recipe_routes.route('/api/get-recipe', methods=['GET'])
def get_recipe():
    """summary_
    """
    NotImplementedError


def response_to_json(data):
    try:
        data = data.split('```json')[-1].split('```')[0]
        data = json.loads(data)
        return data
    except Exception:
        return None


async def query(prompt, max_retries=3):
    """summary_
    Query the OpenAI API to generate a recipe based on the user's preferences
    and ingredients.

    Args:
        prompt (str): The prompt to send to the OpenAI API
        max_retries (int): The maximum number of retries to attempt

    Returns:
        str: The generated recipe

    Raises:
        Exception: If the API request fails
    """
    for i in range(max_retries):
        try:
            response = await client.chat.completions.create(
                model='gpt-4o',
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                timeout=60
            )
            content = response.choices[0].message.content
            content = response_to_json(content)
            if content:
                return content
            await asyncio.sleep(2**i * 0.1)
        except Exception as e:
            print(e)
            await asyncio.sleep(2**i * 0.1)
    return {"error": "Failed to generate recipe"}


@recipe_routes.route('/api/generate-recipe/<int:user_id>', methods=['POST'])
async def generate_recipe(user_id):
    """summary_
    Generate a recipe based on user selected ingredients.
    If no ingredients are selected, generate recipe based on user preferences
    and user inventory.

    Args:
        user_id (int): The id of the user
        ingredients (list): A list of ingredients selected by the user
        preferences (dict): A dictionary of user preferences

    Returns:
        Response: A response object with the generated recipe
    """

    if request.content_type != 'application/json':
        return jsonify({"error": "Unsupported Media Type"}), 415
    
    data = request.get_json()
    ingredient_ids = data.get('ingredients', [])
    user_preferences = data.get('preferences', {})

    # Gather data
    inventory = UserAndProduce.query.filter_by(user_id=user_id).all()
    if not inventory:
        return jsonify({"error": "User has no ingredients"}), 404
    if not ingredient_ids:
        # Get list of all Produce from user inventory
        produce = [Produce.query.get(produce.produce_id) for produce in inventory]
        counts = [produce.quantity for produce in inventory]
    else:
        # Get list of Produce based on ingredient_ids
        produce = [Produce.query.get(produce_id) for produce_id in ingredient_ids]
        counts = [inventory.quantity for inventory in inventory if inventory.produce_id in ingredient_ids]
    produce_name = [produce.produce_name for produce in produce]
    units = [produce.unit for produce in produce]

    # ingredients = list(zip(produce_name, counts, units))
    ingredients = ""
    for i in range(len(produce)):
        ingredients += f'{produce_name[i]}: {counts[i]} {units[i]}\n'

    # Generate recipe based on user preferences and ingredients
    recipe_prompt = """
        User preferences: {user_preferences}
        User ingredients: {ingredients}

        Please create a recipe based on the user preferences and ingredients.
        Please ensure that the recipe is safe for the user to consume.

        Format your response as a json object as such:
        {{
            "recipe": "<Recipe name>",
            "ingredients": [
                ["Ingredient 1", "<quantity>", "<unit>"],
                ["Ingredient 2", "<quantity>", "<unit>"]
            ],
            "instructions": ["Step 1", "Step 2", ...],
        }}

        IF the recipe is unsafe for the user to consume format your response as such:
        {{
            "error": "Recipe is unsafe for user because ..."
        }}

        If you are unable to generate a recipe, please provide a reason, otherwise don't add the reason key.
        Ensure that the recipe is safe for the user to consume.
        Unless the ingredient unit is specified above, use traditional units of measurement.
        Don't number the steps, just list them in order.
        Don't use more of an ingredient than the user has in their inventory.

    """.format(user_preferences=user_preferences, ingredients=ingredients)

    data = await query(recipe_prompt)
    return Response(json.dumps(data), mimetype='application/json')
