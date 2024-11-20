from flask import Blueprint, jsonify, request, Response
import requests  
import os, json
import asyncio
from routes.user_produce_routes import get_user_inventory
from routes.produce_routes import fetch_produce_info
from difflib import get_close_matches
from models import UserAndProduce, Produce
from openai import AsyncOpenAI

recipes_routes = Blueprint('recipes_routes', __name__)

# minimize ingredients we don't have - no selection just generate recipe
# maximize ingredients we chose - typical
# sort by max ingredients used
# sort by least ingredients needed
# NEED TO UPDATE WITH USER ID
@recipes_routes.route('/api/recipe/recipes_by_ingredients', methods=['POST'])
def search_recipes_by_ingredients():
    ingredients = request.get_json().get("ingredients") 
    #ingredients = request.args.getlist('ingredients')
    user_id = request.get_json().get("userId") 
    option = request.get_json().get('option')
    api = 'https://api.spoonacular.com/recipes/findByIngredients?apiKey='+os.getenv('RECIPE_API_KEY')
    if len(ingredients) > 0:
        api += '&ingredients='
        for i in ingredients:
            api+=i+',+'
        api = api[0:-2]
    
    print("ingredients: ", ingredients)
    print("user id ", user_id)
    print("option: ", option)
    
    # maximize used ingredients
    if(option == 1):
        api += '&ranking=1'
    else:
        api += '&ranking=2'
    print("api: ", api)

    try:

        # Make a GET request to the external API with the query parameter
        response = requests.get(api).json()
        #response.raise_for_status()  # Raise an exception for HTTP errors
        # Parse and return the data from the external API
        #external_data = response.json()
        external_data = response

        response_data = {
        "recipes": [
            {
                "id": recipe["id"],
                "title": recipe["title"],
                "missedIngredientCount": 0,
                "usedIngredientCount": 0,
                "image": recipe["image"],
                "missedIngredients": [
                    ingredient["name"]
                    #{"name": ingredient["name"]
                     #, "unit": ingredient["unit"], "amount": ingredient["amount"]
                     #}
                    for ingredient in recipe["missedIngredients"]
                ],
                "usedIngredients": [
                    ingredient["name"]
                    #{"name": ingredient["name"]
                     #, "unit": ingredient["unit"], "amount": ingredient["amount"]
                    # }
                    for ingredient in recipe["usedIngredients"]
                ]
            }
            for recipe in external_data
        ]
        }
        print("retrieved recipes: ", response_data)

        response_data = update_ingredients_with_inventory(user_id, response_data)
        print("updated with inventory: ", response_data)
        
        return jsonify(response_data)
    except requests.exceptions.RequestException as e:
        print(f"Error querying external API: {e}")
        return jsonify({"error": "Failed to query external API"}), 500
    

def update_ingredients_with_inventory(user_id, response_data):
    inventory_data = json.loads(get_user_inventory(user_id).data.decode("utf-8"))
    
    inventory = inventory_data.get("data", [])
    
    for recipe in response_data["recipes"]:
        # Set to store matched ingredients from missedIngredients
        matched_ingredients = set()
        
        for ingredient in recipe["missedIngredients"]:
            # Try to match ingredient with inventory items by produce_name
            matched_item = get_close_matches(ingredient, [item["produce_name"] for item in inventory], n=1, cutoff=0.6)
            
            if matched_item:
                # If a close match is found, move it to usedIngredients
                matched_ingredients.add(ingredient)
                recipe["usedIngredients"].append(ingredient)
        
        # Filter out matched ingredients from missedIngredients
        recipe["missedIngredients"] = [
            ingredient for ingredient in recipe["missedIngredients"]
            if ingredient not in matched_ingredients
        ]
        
        recipe["missedIngredientCount"] = len(recipe["missedIngredients"])
        recipe["usedIngredientCount"] = len(recipe["usedIngredients"])

    return response_data
    
@recipes_routes.route('/api/recipe/recipe_by_id', methods=['GET'])
def get_recipe_info():
    #id = request.get_json().get("id") 
    id = request.args.get("id")

    api = 'https://api.spoonacular.com/recipes/'+id+'/information?apiKey='+os.getenv('RECIPE_API_KEY')

    try:
        # Make a GET request to the external API with the query parameter
        response = requests.get(api).json()
        
        # Parse and return the data from the external API
        #external_data = response.json()
        external_data = response
        steps = []

        if "analyzedInstructions" in external_data and len(external_data["analyzedInstructions"]) > 0:
            steps = [f"Step {step['number']}. {step['step']}" for step in external_data["analyzedInstructions"][0]["steps"]]

         # title, image, servings, cookingMinutes, preparationMinutes, extendedIngredients.name, extendedIngredients.measures.us.amount, extendedIngredients.measures.us.unitLong
        response_data = {
        
            "title": external_data["title"],
            "image": external_data["image"],
            "servings": external_data["servings"],
            "ingredients": [
                {"name": ingredient["name"], "unit": ingredient["measures"]["us"]["unitLong"], "amount": ingredient["measures"]["us"]["amount"]}
                for ingredient in external_data["extendedIngredients"]
            ],
            "sourceURL" : external_data["sourceUrl"],

            "instructions" : steps
        }
        
            
        
        return jsonify(response_data)
    except requests.exceptions.RequestException as e:
        print(f"Error querying external API: {e}")
        return jsonify({"error": "Failed to query external API"}), 500
    

#=====================================================#
#               [GPT Recipe Generation]               #
#=====================================================#

# Create OpenAI client
client = AsyncOpenAI(api_key=os.getenv('FRIDGIFY_OPENAI_API_KEY'))
if not client.api_key:
    raise ValueError("Error: 'FRIDGIFY_OPENAI_API_KEY' environment variable not set")


# Util functions
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



@recipes_routes.route('/api/recipe/ai/<int:user_id>', methods = ['POST'])
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
    ingredient_names = data.get('ingredients', [])
    user_preferences = data.get('preferences', {})
    print("user preferences: ", user_preferences)
    print("ingredient names: ", ingredient_names)

    # Gather data
    inventory = UserAndProduce.query.filter_by(user_id=user_id).all()

    # inventory:  [<UserAndProduce 101>, <UserAndProduce 102>,
    # for item in inventory:
    #     name = Produce.query.get(item.produce_id).produce_name
    #     quantity = item.quantity
    #     print(f"{name}: {quantity}")
    if not inventory:
        return jsonify({"error": "User has no ingredients"}), 404
    if not ingredient_names:
        # Get list of all Produce from user inventory
        produce = [Produce.query.get(produce.produce_id) for produce in inventory]
        counts = [produce.quantity for produce in inventory]
    else:
        # Get list of Produce based on ingredient_ids
        produce = [Produce.query.filter_by(produce_name=name).first() for name in ingredient_names]
        counts = [item.quantity for item in inventory if item.produce_id in [p.produce_id for p in produce]]
    produce_name = [produce.produce_name for produce in produce]
    units = [produce.unit for produce in produce]

    # ingredients = list(zip(produce_name, counts, units))
    ingredients = ""
    for i in range(len(produce)):
        print(produce_name[i], counts[i], units[i])
        ingredients += f'{produce_name[i]}: {counts[i]} {units[i]}\n'

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

    response_data = {
        "recipes": [
            {
                "title": data["recipe"] if "recipe" in data else "Recipe not found",
                "missedIngredientCount": 0,
                "usedIngredientCount": 0,
                "image": None,
                "servings": 1,
                "missedIngredients": [
                    ingredient[0]
                    for ingredient in data["ingredients"]
                ],
                "usedIngredients": [
                ],
                "ingredients": [{"name" : ingredient[0], "unit" : ingredient[2], "amount" : ingredient[1]}
                for ingredient in data["ingredients"]],
                "instructions" : data["instructions"],
            }
        ]
    }

    fetched_data = update_ingredients_with_inventory(user_id, response_data)["recipes"][0]

    print(fetched_data)
    return jsonify(fetched_data)

@recipes_routes.route('/api/recipe/ingredients', methods = ['POST'])
def get_ingredient_units():

    data = request.get_json()

    if data is None:
        return jsonify({"error": "Invalid JSON payload"}), 400
    
    # Extract 'ingredients' array from the JSON payload
    ingredients = data.get("ingredients", [])
    
    try:
        produce_data = fetch_produce_info(ingredients)

        result = []
        for key, values in produce_data.items():
            item = {
                "name" : key,
                "amount" : 1,
                "unit": values.get("unit", "")
            }
            result.append(item)

        return jsonify(result)

    except Exception as e:
        print(f"Error retrieving units: {e}")
        return None

    