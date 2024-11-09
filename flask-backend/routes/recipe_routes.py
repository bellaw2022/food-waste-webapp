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
                timeout=30
            )
            content = response.choices[0].message.content
            return content
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
    preferences = data.get('preferences', {})

    ingredients = get_user_ingredients(user_id, ingredient_ids)
    if not ingredients:
        return jsonify({"error": "No ingredients found"}), 404
    ingredients = [produce.produce_name for produce in ingredients]

    # Generate recipe based on user preferences and ingredients
    recipe_prompt = """
        User preferences: {preferences}
        User ingredients: {ingredients}

        Please create a recipe based on the user preferences and ingredients.
        Please ensure that the recipe is safe for the user to consume.

    """.format(preferences=preferences, ingredients=ingredients)

    recipe = await query(recipe_prompt)
    return jsonify({"recipe": recipe})


def get_user_ingredients(user_id, ingredient_ids):
    """summary_
    Get the user's ingredients based on the selected ingredient ids.
    If no ingredient ids are provided, get the user's inventory.

    Args:
        user_id (int): The id of the user
        ingredient_ids (list): A list of ingredient ids

    Returns:
        list: A list of Produce objects
    """
    if ingredient_ids:
        produce = [Produce.query.get(produce_id) for produce_id in ingredient_ids]
        produce = [produce for produce in produce if produce] # Remove None values
        return produce
    user_inventory = UserAndProduce.query.filter_by(user_id=user_id).all()
    produce = [Produce.query.get(produce.produce_id) for produce in user_inventory]
    return produce
