from flask import Blueprint, jsonify, request, Flask
import requests  
import os

recipes_routes = Blueprint('recipes_routes', __name__)

'''
@recipes_routes.route('/api/recipes', methods=['POST'])
def generate_recipes():
    ingredients = request.json 
    result = [{
        "title": "example recipe",
        "number": 0,
        "pictureUrl": "https://github.com/yuqian-cao-19/Cloud_Project3/raw/main/pexels-ella-olsson-572949-1640777.jpg",
        "ingredients": ["carrots", "onions", "beef", "bread", "lettuce", "pickles"],
        "instructions": ["Cook beef patty", "sautee onion and carrots", "assemble burger with bread, carrots, onions, beef, lettuce, and pickles"]
    },
    {
        "title": "example recipe 2",
        "number": 1,
        "pictureUrl": "https://github.com/yuqian-cao-19/Cloud_Project3/raw/main/pexels-ella-olsson-572949-1640777.jpg",
        "ingredients": ["carrots", "onions", "beef", "bread", "lettuce", "pickles"],
        "instructions": ["Cook beef patty", "sautee onion and carrots", "assemble burger with bread, carrots, onions, beef, lettuce, and pickles"]
    },
    {
        "title": "example recipe 3",
        "number": 2,
        "pictureUrl": "https://github.com/yuqian-cao-19/Cloud_Project3/raw/main/pexels-ella-olsson-572949-1640777.jpg",
        "ingredients": ["carrots", "onions", "beef", "bread", "lettuce", "pickles"],
        "instructions": ["Cook beef patty", "sautee onion and carrots", "assemble burger with bread, carrots, onions, beef, lettuce, and pickles"]
    },
    {
        "title": "example recipe 4",
        "number": 3,
        "pictureUrl": "https://github.com/yuqian-cao-19/Cloud_Project3/raw/main/pexels-ella-olsson-572949-1640777.jpg",
        "ingredients": ["carrots", "onions", "beef", "bread", "lettuce", "pickles"],
        "instructions": ["Cook beef patty", "sautee onion and carrots", "assemble burger with bread, carrots, onions, beef, lettuce, and pickles"]
    },
    {
        "title": "example recipe 5",
        "number": 4,
        "pictureUrl": "https://github.com/yuqian-cao-19/Cloud_Project3/raw/main/pexels-ella-olsson-572949-1640777.jpg",
        "ingredients": ["carrots", "onions", "beef", "bread", "lettuce", "pickles"],
        "instructions": ["Cook beef patty", "sautee onion and carrots", "assemble burger with bread, carrots, onions, beef, lettuce, and pickles"]
    },
    {
        "title": "example recipe 6",
        "number": 4,
        "pictureUrl": "https://github.com/yuqian-cao-19/Cloud_Project3/raw/main/pexels-ella-olsson-572949-1640777.jpg",
        "ingredients": ["carrots", "onions", "beef", "bread", "lettuce", "pickles"],
        "instructions": ["Cook beef patty", "sautee onion and carrots", "assemble burger with bread, carrots, onions, beef, lettuce, and pickles"]
    }]
    '''
    
    

# minimize ingredients we don't have - no selection just generate recipe
# maximize ingredients we chose - typical
# sort by max ingredients used
# sort by least ingredients needed
@recipes_routes.route('/api/recipe/recipes_by_ingredients', methods=['POST', 'GET'])
def search_recipes_by_ingredients():
    ingredients = request.json 
    print("searching for recipes with ingredients: ", ingredients)
    api = 'https://api.spoonacular.com/recipes/findByIngredients?apiKey='+os.getenv('RECIPE_API_KEY')
    if len(ingredients) > 0:
        api += '&ingredients='
        for i in ingredients:
            api+=i+',+'
        api = api[0:-2]
    
    print("api: ", api)
    # maximize used ingredients
    api += '&ranking=1'
    print("api: ", api)

    try:
        # Make a GET request to the external API with the query parameter
        #response = requests.get(api)
        ##response.raise_for_status()  # Raise an exception for HTTP errors

        response = [
    {
        "id": 660273,
        "title": "Slow Cooked Beef Chili",
        "image": "https://img.spoonacular.com/recipes/660273-312x231.jpg",
        "imageType": "jpg",
        "usedIngredientCount": 4,
        "missedIngredientCount": 7,
        "missedIngredients": [
            {
                "id": 2009,
                "amount": 2.0,
                "unit": "tablespoons",
                "unitLong": "tablespoons",
                "unitShort": "Tbsp",
                "aisle": "Spices and Seasonings",
                "name": "chili powder",
                "original": "2 tablespoons chili powder",
                "originalName": "chili powder",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/chili-powder.jpg"
            },
            {
                "id": 1012014,
                "amount": 1.0,
                "unit": "tablespoon",
                "unitLong": "tablespoon",
                "unitShort": "Tbsp",
                "aisle": "Spices and Seasonings",
                "name": "ground cumin",
                "original": "1 tablespoon ground cumin",
                "originalName": "ground cumin",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/ground-cumin.jpg"
            },
            {
                "id": 1012028,
                "amount": 2.0,
                "unit": "teaspoons",
                "unitLong": "teaspoons",
                "unitShort": "tsp",
                "aisle": "Spices and Seasonings",
                "name": "paprika",
                "original": "2 teaspoons smoked paprika",
                "originalName": "smoked paprika",
                "meta": [
                    "smoked"
                ],
                "extendedName": "smoked paprika",
                "image": "https://img.spoonacular.com/ingredients_100x100/paprika.jpg"
            },
            {
                "id": 11282,
                "amount": 1.0,
                "unit": "medium",
                "unitLong": "medium",
                "unitShort": "medium",
                "aisle": "Produce",
                "name": "onion",
                "original": "1 medium onion, coarsely chopped",
                "originalName": "onion, coarsely chopped",
                "meta": [
                    "coarsely chopped"
                ],
                "image": "https://img.spoonacular.com/ingredients_100x100/brown-onion.png"
            },
            {
                "id": 11215,
                "amount": 2.0,
                "unit": "cloves",
                "unitLong": "cloves",
                "unitShort": "cloves",
                "aisle": "Produce",
                "name": "garlic",
                "original": "2 cloves garlic, minced",
                "originalName": "garlic, minced",
                "meta": [
                    "minced"
                ],
                "image": "https://img.spoonacular.com/ingredients_100x100/garlic.png"
            },
            {
                "id": 23557,
                "amount": 1.0,
                "unit": "pound",
                "unitLong": "pound",
                "unitShort": "lb",
                "aisle": "Meat",
                "name": "beef chuck",
                "original": "1 pound beef chuck, trimmed and cut into 1\" pieces",
                "originalName": "beef chuck, trimmed and cut into 1\" pieces",
                "meta": [
                    "trimmed",
                    "cut into 1\" pieces"
                ],
                "extendedName": "lean beef chuck",
                "image": "https://img.spoonacular.com/ingredients_100x100/fresh-ground-beef.jpg"
            },
            {
                "id": 16034,
                "amount": 15.0,
                "unit": "ounces",
                "unitLong": "ounces",
                "unitShort": "oz",
                "aisle": "Canned and Jarred",
                "name": "kidney beans",
                "original": "15 ounces can kidney beans",
                "originalName": "kidney beans",
                "meta": [
                    "canned"
                ],
                "extendedName": "canned kidney beans",
                "image": "https://img.spoonacular.com/ingredients_100x100/kidney-beans.jpg"
            }
        ],
        "usedIngredients": [
            {
                "id": 11693,
                "amount": 28.0,
                "unit": "ounces",
                "unitLong": "ounces",
                "unitShort": "oz",
                "aisle": "Canned and Jarred",
                "name": "canned tomatoes",
                "original": "28 ounces can crushed tomatoes",
                "originalName": "crushed tomatoes",
                "meta": [
                    "crushed",
                    "canned"
                ],
                "image": "https://img.spoonacular.com/ingredients_100x100/tomatoes-canned.png"
            },
            {
                "id": 10011693,
                "amount": 14.0,
                "unit": "ounces",
                "unitLong": "ounces",
                "unitShort": "oz",
                "aisle": "Canned and Jarred",
                "name": "canned tomatoes",
                "original": "14 ounces can diced tomatoes",
                "originalName": "diced tomatoes",
                "meta": [
                    "diced",
                    "canned"
                ],
                "extendedName": "diced canned tomatoes",
                "image": "https://img.spoonacular.com/ingredients_100x100/tomatoes-canned.png"
            },
            {
                "id": 11124,
                "amount": 3.0,
                "unit": "",
                "unitLong": "",
                "unitShort": "",
                "aisle": "Produce",
                "name": "carrots",
                "original": "3 carrots, coarsely chopped",
                "originalName": "carrots, coarsely chopped",
                "meta": [
                    "coarsely chopped"
                ],
                "image": "https://img.spoonacular.com/ingredients_100x100/sliced-carrot.png"
            },
            {
                "id": 11143,
                "amount": 4.0,
                "unit": "stalks",
                "unitLong": "stalks",
                "unitShort": "stalks",
                "aisle": "Produce",
                "name": "celery",
                "original": "4 stalks celery, coarsely chopped",
                "originalName": "celery, coarsely chopped",
                "meta": [
                    "coarsely chopped"
                ],
                "image": "https://img.spoonacular.com/ingredients_100x100/celery.jpg"
            }
        ],
        "unusedIngredients": [
            {
                "id": 9003,
                "amount": 1.0,
                "unit": "serving",
                "unitLong": "serving",
                "unitShort": "serving",
                "aisle": "Produce",
                "name": "apples",
                "original": "apples",
                "originalName": "apples",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/apple.jpg"
            },
            {
                "id": 1077,
                "amount": 1.0,
                "unit": "serving",
                "unitLong": "serving",
                "unitShort": "serving",
                "aisle": "Milk, Eggs, Other Dairy",
                "name": "milk",
                "original": "milk",
                "originalName": "milk",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/milk.png"
            }
        ],
        "likes": 1
    },
    {
        "id": 632449,
        "title": "Appetizing Apple and Almond Soup",
        "image": "https://img.spoonacular.com/recipes/632449-312x231.jpg",
        "imageType": "jpg",
        "usedIngredientCount": 3,
        "missedIngredientCount": 4,
        "missedIngredients": [
            {
                "id": 12061,
                "amount": 8.0,
                "unit": "",
                "unitLong": "",
                "unitShort": "",
                "aisle": "Nuts",
                "name": "almonds",
                "original": "8 Almonds",
                "originalName": "Almonds",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/almonds.jpg"
            },
            {
                "id": 2010,
                "amount": 0.5,
                "unit": "teaspoon",
                "unitLong": "teaspoons",
                "unitShort": "tsp",
                "aisle": "Spices and Seasonings",
                "name": "cinnamon",
                "original": "1/2 teaspoon cinnamon",
                "originalName": "cinnamon",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/cinnamon.jpg"
            },
            {
                "id": 9107,
                "amount": 1.0,
                "unit": "",
                "unitLong": "",
                "unitShort": "",
                "aisle": "Produce",
                "name": "gooseberry",
                "original": "1 Gooseberry",
                "originalName": "Gooseberry",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/gooseberries.jpg"
            },
            {
                "id": 1053,
                "amount": 0.25,
                "unit": "cup",
                "unitLong": "cups",
                "unitShort": "cup",
                "aisle": "Milk, Eggs, Other Dairy",
                "name": "heavy cream",
                "original": "1/4 cup heavy Cream",
                "originalName": "heavy Cream",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/fluid-cream.jpg"
            }
        ],
        "usedIngredients": [
            {
                "id": 9003,
                "amount": 2.0,
                "unit": "",
                "unitLong": "",
                "unitShort": "",
                "aisle": "Produce",
                "name": "apples",
                "original": "2 Apples",
                "originalName": "Apples",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/apple.jpg"
            },
            {
                "id": 11124,
                "amount": 0.5,
                "unit": "cup",
                "unitLong": "cups",
                "unitShort": "cup",
                "aisle": "Produce",
                "name": "carrots",
                "original": "1/2 cup Carrots",
                "originalName": "Carrots",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/sliced-carrot.png"
            },
            {
                "id": 11529,
                "amount": 2.0,
                "unit": "",
                "unitLong": "",
                "unitShort": "",
                "aisle": "Produce",
                "name": "tomatoes",
                "original": "2 Tomatoes",
                "originalName": "Tomatoes",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/tomato.png"
            }
        ],
        "unusedIngredients": [
            {
                "id": 1077,
                "amount": 1.0,
                "unit": "serving",
                "unitLong": "serving",
                "unitShort": "serving",
                "aisle": "Milk, Eggs, Other Dairy",
                "name": "milk",
                "original": "milk",
                "originalName": "milk",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/milk.png"
            },
            {
                "id": 11143,
                "amount": 1.0,
                "unit": "serving",
                "unitLong": "serving",
                "unitShort": "serving",
                "aisle": "Produce",
                "name": "celery",
                "original": "celery",
                "originalName": "celery",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/celery.jpg"
            }
        ],
        "likes": 4
    },
    {
        "id": 648287,
        "title": "Italian Vegetable Soup",
        "image": "https://img.spoonacular.com/recipes/648287-312x231.jpg",
        "imageType": "jpg",
        "usedIngredientCount": 3,
        "missedIngredientCount": 4,
        "missedIngredients": [
            {
                "id": 1001,
                "amount": 3.0,
                "unit": "tablespoons",
                "unitLong": "tablespoons",
                "unitShort": "Tbsp",
                "aisle": "Milk, Eggs, Other Dairy",
                "name": "butter",
                "original": "3 tablespoons melted butter",
                "originalName": "melted butter",
                "meta": [
                    "melted"
                ],
                "image": "https://img.spoonacular.com/ingredients_100x100/butter-sliced.jpg"
            },
            {
                "id": 1002044,
                "amount": 1.5,
                "unit": "teaspoons",
                "unitLong": "teaspoons",
                "unitShort": "tsp",
                "aisle": "Produce",
                "name": "herbs",
                "original": "1 1/2 teaspoons mixed herbs",
                "originalName": "mixed herbs",
                "meta": [
                    "mixed"
                ],
                "extendedName": "mixed herbs",
                "image": "https://img.spoonacular.com/ingredients_100x100/lemon-basil.jpg"
            },
            {
                "id": 11420420,
                "amount": 125.0,
                "unit": "grams",
                "unitLong": "grams",
                "unitShort": "g",
                "aisle": "Pasta and Rice",
                "name": "spaghetti in 3cm lengths",
                "original": "125 grams spaghetti in 3cm lengths",
                "originalName": "spaghetti in 3cm lengths",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/spaghetti.jpg"
            },
            {
                "id": 10611282,
                "amount": 1.0,
                "unit": "large",
                "unitLong": "large",
                "unitShort": "large",
                "aisle": "Produce",
                "name": "onion",
                "original": "1 large white onion",
                "originalName": "white onion",
                "meta": [
                    "white"
                ],
                "extendedName": "white onion",
                "image": "https://img.spoonacular.com/ingredients_100x100/white-onion.png"
            }
        ],
        "usedIngredients": [
            {
                "id": 10011693,
                "amount": 1.0,
                "unit": "can",
                "unitLong": "can",
                "unitShort": "can",
                "aisle": "Canned and Jarred",
                "name": "tomatoes",
                "original": "1 tin tomatoes",
                "originalName": "tinned tomatoes",
                "meta": [],
                "extendedName": "canned tomatoes",
                "image": "https://img.spoonacular.com/ingredients_100x100/tomatoes-canned.png"
            },
            {
                "id": 11124,
                "amount": 3.0,
                "unit": "medium",
                "unitLong": "mediums",
                "unitShort": "medium",
                "aisle": "Produce",
                "name": "carrots",
                "original": "3 mediums carrots, sliced",
                "originalName": "s carrots, sliced",
                "meta": [
                    "sliced"
                ],
                "image": "https://img.spoonacular.com/ingredients_100x100/sliced-carrot.png"
            },
            {
                "id": 11143,
                "amount": 2.0,
                "unit": "",
                "unitLong": "",
                "unitShort": "",
                "aisle": "Produce",
                "name": "stk celery",
                "original": "2 stk celery",
                "originalName": "stk celery",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/celery.jpg"
            }
        ],
        "unusedIngredients": [
            {
                "id": 9003,
                "amount": 1.0,
                "unit": "serving",
                "unitLong": "serving",
                "unitShort": "serving",
                "aisle": "Produce",
                "name": "apples",
                "original": "apples",
                "originalName": "apples",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/apple.jpg"
            },
            {
                "id": 1077,
                "amount": 1.0,
                "unit": "serving",
                "unitLong": "serving",
                "unitShort": "serving",
                "aisle": "Milk, Eggs, Other Dairy",
                "name": "milk",
                "original": "milk",
                "originalName": "milk",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/milk.png"
            }
        ],
        "likes": 1
    },
    {
        "id": 645514,
        "title": "Green Salad With Fresh Orange Juice Dressing",
        "image": "https://img.spoonacular.com/recipes/645514-312x231.jpg",
        "imageType": "jpg",
        "usedIngredientCount": 3,
        "missedIngredientCount": 5,
        "missedIngredients": [
            {
                "id": 1129,
                "amount": 2.0,
                "unit": "",
                "unitLong": "",
                "unitShort": "",
                "aisle": "Milk, Eggs, Other Dairy",
                "name": "hardboiled eggs",
                "original": "2 hard boiled eggs",
                "originalName": "hard boiled eggs",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/hard-boiled-egg.png"
            },
            {
                "id": 11603,
                "amount": 0.5,
                "unit": "cup",
                "unitLong": "cups",
                "unitShort": "cup",
                "aisle": "Produce",
                "name": "jicama",
                "original": "1/2 cup jicama",
                "originalName": "jicama",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/jicama.jpg"
            },
            {
                "id": 9159,
                "amount": 1.0,
                "unit": "",
                "unitLong": "",
                "unitShort": "",
                "aisle": "Produce",
                "name": "lime",
                "original": "1 lime",
                "originalName": "lime",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/lime.jpg"
            },
            {
                "id": 9200,
                "amount": 2.0,
                "unit": "",
                "unitLong": "",
                "unitShort": "",
                "aisle": "Produce",
                "name": "oranges",
                "original": "2 fresh oranges",
                "originalName": "fresh oranges",
                "meta": [
                    "fresh"
                ],
                "extendedName": "fresh oranges",
                "image": "https://img.spoonacular.com/ingredients_100x100/orange.png"
            },
            {
                "id": 10111251,
                "amount": 1.0,
                "unit": "head",
                "unitLong": "head",
                "unitShort": "head",
                "aisle": "Produce",
                "name": "romaine lettuce",
                "original": "1 head romaine lettuce",
                "originalName": "romaine lettuce",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/img.spoonacular."
            }
        ],
        "usedIngredients": [
            {
                "id": 11124,
                "amount": 0.5,
                "unit": "cup",
                "unitLong": "cups",
                "unitShort": "cup",
                "aisle": "Produce",
                "name": "carrot",
                "original": "1/2 cup shredded carrot",
                "originalName": "shredded carrot",
                "meta": [
                    "shredded"
                ],
                "extendedName": "shredded carrot",
                "image": "https://img.spoonacular.com/ingredients_100x100/sliced-carrot.png"
            },
            {
                "id": 1069003,
                "amount": 1.0,
                "unit": "",
                "unitLong": "",
                "unitShort": "",
                "aisle": "Produce",
                "name": "apple",
                "original": "1 green apple,wash and diced",
                "originalName": "green apple,wash and diced",
                "meta": [
                    "diced",
                    "green"
                ],
                "extendedName": "green diced apple",
                "image": "https://img.spoonacular.com/ingredients_100x100/grannysmith-apple.png"
            },
            {
                "id": 11529,
                "amount": 1.0,
                "unit": "",
                "unitLong": "",
                "unitShort": "",
                "aisle": "Produce",
                "name": "tomato",
                "original": "1 tomato",
                "originalName": "tomato",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/tomato.png"
            }
        ],
        "unusedIngredients": [
            {
                "id": 1077,
                "amount": 1.0,
                "unit": "serving",
                "unitLong": "serving",
                "unitShort": "serving",
                "aisle": "Milk, Eggs, Other Dairy",
                "name": "milk",
                "original": "milk",
                "originalName": "milk",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/milk.png"
            },
            {
                "id": 11143,
                "amount": 1.0,
                "unit": "serving",
                "unitLong": "serving",
                "unitShort": "serving",
                "aisle": "Produce",
                "name": "celery",
                "original": "celery",
                "originalName": "celery",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/celery.jpg"
            }
        ],
        "likes": 1
    },
    {
        "id": 635846,
        "title": "Braised Oxtail",
        "image": "https://img.spoonacular.com/recipes/635846-312x231.jpg",
        "imageType": "jpg",
        "usedIngredientCount": 3,
        "missedIngredientCount": 6,
        "missedIngredients": [
            {
                "id": 2004,
                "amount": 3.0,
                "unit": "",
                "unitLong": "",
                "unitShort": "",
                "aisle": "Spices and Seasonings",
                "name": "bay leaves",
                "original": "3 bay leaves",
                "originalName": "bay leaves",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/bay-leaves.jpg"
            },
            {
                "id": 20421,
                "amount": 2.0,
                "unit": "servings",
                "unitLong": "servings",
                "unitShort": "servings",
                "aisle": "Pasta and Rice",
                "name": "noodles",
                "original": "Cooked noodles",
                "originalName": "Cooked noodles",
                "meta": [
                    "cooked"
                ],
                "extendedName": "cooked noodles",
                "image": "https://img.spoonacular.com/ingredients_100x100/fusilli.jpg"
            },
            {
                "id": 4002,
                "amount": 2.0,
                "unit": "tablespoons",
                "unitLong": "tablespoons",
                "unitShort": "Tbsp",
                "aisle": "Meat",
                "name": "fat",
                "original": "2 tablespoons fat",
                "originalName": "fat",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/pork-fat-or-lard.jpg"
            },
            {
                "id": 11282,
                "amount": 2.0,
                "unit": "",
                "unitLong": "",
                "unitShort": "",
                "aisle": "Produce",
                "name": "onions",
                "original": "2 onions, sliced",
                "originalName": "onions, sliced",
                "meta": [
                    "sliced"
                ],
                "image": "https://img.spoonacular.com/ingredients_100x100/brown-onion.png"
            },
            {
                "id": 93778,
                "amount": 1.0,
                "unit": "",
                "unitLong": "",
                "unitShort": "",
                "aisle": "Meat",
                "name": "oxtail",
                "original": "1 oxtail, cut in 2\" pieces",
                "originalName": "oxtail, cut in 2\" pieces",
                "meta": [
                    "cut in 2\" pieces"
                ],
                "image": "https://img.spoonacular.com/ingredients_100x100/ox-tail.png"
            },
            {
                "id": 10211821,
                "amount": 2.0,
                "unit": "servings",
                "unitLong": "servings",
                "unitShort": "servings",
                "aisle": "Produce",
                "name": "bell pepper",
                "original": "pepper",
                "originalName": "pepper",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/bell-pepper-orange.png"
            }
        ],
        "usedIngredients": [
            {
                "id": 11124,
                "amount": 1.0,
                "unit": "",
                "unitLong": "",
                "unitShort": "",
                "aisle": "Produce",
                "name": "carrot",
                "original": "1 carrot, chopped",
                "originalName": "carrot, chopped",
                "meta": [
                    "chopped"
                ],
                "image": "https://img.spoonacular.com/ingredients_100x100/sliced-carrot.png"
            },
            {
                "id": 11143,
                "amount": 1.0,
                "unit": "tablespoon",
                "unitLong": "tablespoon",
                "unitShort": "Tbsp",
                "aisle": "Produce",
                "name": "celery",
                "original": "1 tablespoon chopped celery",
                "originalName": "chopped celery",
                "meta": [
                    "chopped"
                ],
                "image": "https://img.spoonacular.com/ingredients_100x100/celery.jpg"
            },
            {
                "id": 11529,
                "amount": 1.0,
                "unit": "cup",
                "unitLong": "cup",
                "unitShort": "cup",
                "aisle": "Produce",
                "name": "tomatoes",
                "original": "1 cup tomatoes",
                "originalName": "tomatoes",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/tomato.png"
            }
        ],
        "unusedIngredients": [
            {
                "id": 9003,
                "amount": 1.0,
                "unit": "serving",
                "unitLong": "serving",
                "unitShort": "serving",
                "aisle": "Produce",
                "name": "apples",
                "original": "apples",
                "originalName": "apples",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/apple.jpg"
            },
            {
                "id": 1077,
                "amount": 1.0,
                "unit": "serving",
                "unitLong": "serving",
                "unitShort": "serving",
                "aisle": "Milk, Eggs, Other Dairy",
                "name": "milk",
                "original": "milk",
                "originalName": "milk",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/milk.png"
            }
        ],
        "likes": 2
    },
    {
        "id": 657379,
        "title": "Pumpkin Soup",
        "image": "https://img.spoonacular.com/recipes/657379-312x231.jpg",
        "imageType": "jpg",
        "usedIngredientCount": 3,
        "missedIngredientCount": 6,
        "missedIngredients": [
            {
                "id": 11422,
                "amount": 4.0,
                "unit": "cups",
                "unitLong": "cups",
                "unitShort": "cup",
                "aisle": "Produce",
                "name": "pumpkin pulp",
                "original": "4 cups diced peeled pumpkin pulp",
                "originalName": "diced peeled pumpkin pulp",
                "meta": [
                    "diced",
                    "peeled"
                ],
                "extendedName": "diced pumpkin pulp",
                "image": "https://img.spoonacular.com/ingredients_100x100/pumpkin.png"
            },
            {
                "id": 11282,
                "amount": 1.0,
                "unit": "",
                "unitLong": "",
                "unitShort": "",
                "aisle": "Produce",
                "name": "onion",
                "original": "1 onion, finely chopped",
                "originalName": "onion, finely chopped",
                "meta": [
                    "finely chopped"
                ],
                "image": "https://img.spoonacular.com/ingredients_100x100/brown-onion.png"
            },
            {
                "id": 2004,
                "amount": 1.0,
                "unit": "",
                "unitLong": "",
                "unitShort": "",
                "aisle": "Spices and Seasonings",
                "name": "bay leaf",
                "original": "1 bay leaf",
                "originalName": "bay leaf",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/bay-leaves.jpg"
            },
            {
                "id": 6194,
                "amount": 6.0,
                "unit": "cups",
                "unitLong": "cups",
                "unitShort": "cup",
                "aisle": "Canned and Jarred",
                "name": "chicken broth",
                "original": "6 cups chicken broth",
                "originalName": "chicken broth",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/chicken-broth.png"
            },
            {
                "id": 1053,
                "amount": 1.0,
                "unit": "cup",
                "unitLong": "cup",
                "unitShort": "cup",
                "aisle": "Milk, Eggs, Other Dairy",
                "name": "heavy cream",
                "original": "1 cup heavy cream",
                "originalName": "heavy cream",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/fluid-cream.jpg"
            },
            {
                "id": 2025,
                "amount": 0.5,
                "unit": "teaspoon",
                "unitLong": "teaspoons",
                "unitShort": "tsp",
                "aisle": "Spices and Seasonings",
                "name": "nutmeg",
                "original": "1/2 teaspoon nutmeg",
                "originalName": "nutmeg",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/ground-nutmeg.jpg"
            }
        ],
        "usedIngredients": [
            {
                "id": 1077,
                "amount": 4.0,
                "unit": "servings",
                "unitLong": "servings",
                "unitShort": "servings",
                "aisle": "Milk, Eggs, Other Dairy",
                "name": "milk",
                "original": "Boiling milk",
                "originalName": "Boiling milk",
                "meta": [
                    "boiling"
                ],
                "image": "https://img.spoonacular.com/ingredients_100x100/milk.png"
            },
            {
                "id": 11124,
                "amount": 3.0,
                "unit": "",
                "unitLong": "",
                "unitShort": "",
                "aisle": "Produce",
                "name": "carrots",
                "original": "3 carrots, diced",
                "originalName": "carrots, diced",
                "meta": [
                    "diced"
                ],
                "extendedName": "diced carrots",
                "image": "https://img.spoonacular.com/ingredients_100x100/sliced-carrot.png"
            },
            {
                "id": 11143,
                "amount": 3.0,
                "unit": "ribs",
                "unitLong": "ribs",
                "unitShort": "ribs",
                "aisle": "Produce",
                "name": "celery",
                "original": "3 ribs celery, diced",
                "originalName": "celery, diced",
                "meta": [
                    "diced"
                ],
                "extendedName": "diced celery",
                "image": "https://img.spoonacular.com/ingredients_100x100/celery.jpg"
            }
        ],
        "unusedIngredients": [
            {
                "id": 9003,
                "amount": 1.0,
                "unit": "serving",
                "unitLong": "serving",
                "unitShort": "serving",
                "aisle": "Produce",
                "name": "apples",
                "original": "apples",
                "originalName": "apples",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/apple.jpg"
            },
            {
                "id": 11529,
                "amount": 1.0,
                "unit": "serving",
                "unitLong": "serving",
                "unitShort": "serving",
                "aisle": "Produce",
                "name": "tomatoes",
                "original": "tomatoes",
                "originalName": "tomatoes",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/tomato.png"
            }
        ],
        "likes": 1
    },
    {
        "id": 664058,
        "title": "Turkey Pot Pie With Cornbread Crust",
        "image": "https://img.spoonacular.com/recipes/664058-312x231.jpg",
        "imageType": "jpg",
        "usedIngredientCount": 3,
        "missedIngredientCount": 10,
        "missedIngredients": [
            {
                "id": 18369,
                "amount": 1.0,
                "unit": "tablespoon",
                "unitLong": "tablespoon",
                "unitShort": "Tbsp",
                "aisle": "Baking",
                "name": "baking powder",
                "original": "1 tablespoon baking powder",
                "originalName": "baking powder",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/white-powder.jpg"
            },
            {
                "id": 6172,
                "amount": 2.0,
                "unit": "cups",
                "unitLong": "cups",
                "unitShort": "cup",
                "aisle": "Canned and Jarred",
                "name": "chicken stock",
                "original": "2 cups turkey or chicken stock",
                "originalName": "turkey or chicken stock",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/chicken-broth.png"
            },
            {
                "id": 1123,
                "amount": 1.0,
                "unit": "large",
                "unitLong": "large",
                "unitShort": "large",
                "aisle": "Milk, Eggs, Other Dairy",
                "name": "egg",
                "original": "1 large egg",
                "originalName": "egg",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/egg.png"
            },
            {
                "id": 11215,
                "amount": 2.0,
                "unit": "cloves",
                "unitLong": "cloves",
                "unitShort": "cloves",
                "aisle": "Produce",
                "name": "garlic",
                "original": "2 cloves garlic, minced",
                "originalName": "garlic, minced",
                "meta": [
                    "minced"
                ],
                "image": "https://img.spoonacular.com/ingredients_100x100/garlic.png"
            },
            {
                "id": 11052,
                "amount": 0.5,
                "unit": "cup",
                "unitLong": "cups",
                "unitShort": "cup",
                "aisle": "Produce",
                "name": "green beans",
                "original": "1/2 cup green beans, trimmed and chopped",
                "originalName": "green beans, trimmed and chopped",
                "meta": [
                    "trimmed",
                    "chopped"
                ],
                "extendedName": "trimmed green beans",
                "image": "https://img.spoonacular.com/ingredients_100x100/green-beans-or-string-beans.jpg"
            },
            {
                "id": 1012038,
                "amount": 2.0,
                "unit": "teaspoons",
                "unitLong": "teaspoons",
                "unitShort": "tsp",
                "aisle": "Spices and Seasonings",
                "name": "ground sage",
                "original": "2 teaspoons ground sage",
                "originalName": "ground sage",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/dried-sage.png"
            },
            {
                "id": 1032042,
                "amount": 2.0,
                "unit": "teaspoons",
                "unitLong": "teaspoons",
                "unitShort": "tsp",
                "aisle": "Spices and Seasonings",
                "name": "ground thyme",
                "original": "2 teaspoons ground thyme",
                "originalName": "ground thyme",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/thyme.jpg"
            },
            {
                "id": 11282,
                "amount": 1.0,
                "unit": "medium",
                "unitLong": "medium",
                "unitShort": "medium",
                "aisle": "Produce",
                "name": "onion",
                "original": "1 medium onion, chopped",
                "originalName": "onion, chopped",
                "meta": [
                    "chopped"
                ],
                "image": "https://img.spoonacular.com/ingredients_100x100/brown-onion.png"
            },
            {
                "id": 5165,
                "amount": 3.0,
                "unit": "cups",
                "unitLong": "cups",
                "unitShort": "cup",
                "aisle": "Meat",
                "name": "turkey",
                "original": "3 cups chopped, cooked turkey",
                "originalName": "chopped, cooked turkey",
                "meta": [
                    "cooked",
                    "chopped"
                ],
                "extendedName": "cooked turkey",
                "image": "https://img.spoonacular.com/ingredients_100x100/turkey-raw-whole.jpg"
            },
            {
                "id": 35137,
                "amount": 0.75,
                "unit": "cup",
                "unitLong": "cups",
                "unitShort": "cup",
                "aisle": "Baking",
                "name": "cornmeal",
                "original": "3/4 cup white or yellow cornmeal",
                "originalName": "white or yellow cornmeal",
                "meta": [
                    "white",
                    "yellow"
                ],
                "extendedName": "yellow white cornmeal",
                "image": "https://img.spoonacular.com/ingredients_100x100/cornmeal.png"
            }
        ],
        "usedIngredients": [
            {
                "id": 11124,
                "amount": 2.0,
                "unit": "large",
                "unitLong": "larges",
                "unitShort": "large",
                "aisle": "Produce",
                "name": "carrots",
                "original": "2 large carrots, chopped",
                "originalName": "carrots, chopped",
                "meta": [
                    "chopped"
                ],
                "image": "https://img.spoonacular.com/ingredients_100x100/sliced-carrot.png"
            },
            {
                "id": 11143,
                "amount": 3.0,
                "unit": "stalks",
                "unitLong": "stalks",
                "unitShort": "stalks",
                "aisle": "Produce",
                "name": "celery",
                "original": "3 stalks celery, chopped",
                "originalName": "celery, chopped",
                "meta": [
                    "chopped"
                ],
                "image": "https://img.spoonacular.com/ingredients_100x100/celery.jpg"
            },
            {
                "id": 1077,
                "amount": 0.75,
                "unit": "cup",
                "unitLong": "cups",
                "unitShort": "cup",
                "aisle": "Milk, Eggs, Other Dairy",
                "name": "milk",
                "original": "3/4 cup milk",
                "originalName": "milk",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/milk.png"
            }
        ],
        "unusedIngredients": [
            {
                "id": 9003,
                "amount": 1.0,
                "unit": "serving",
                "unitLong": "serving",
                "unitShort": "serving",
                "aisle": "Produce",
                "name": "apples",
                "original": "apples",
                "originalName": "apples",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/apple.jpg"
            },
            {
                "id": 11529,
                "amount": 1.0,
                "unit": "serving",
                "unitLong": "serving",
                "unitShort": "serving",
                "aisle": "Produce",
                "name": "tomatoes",
                "original": "tomatoes",
                "originalName": "tomatoes",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/tomato.png"
            }
        ],
        "likes": 2
    },
    {
        "id": 775666,
        "title": "Easy Homemade Apple Fritters",
        "image": "https://img.spoonacular.com/recipes/775666-312x231.jpg",
        "imageType": "jpg",
        "usedIngredientCount": 2,
        "missedIngredientCount": 3,
        "missedIngredients": [
            {
                "id": 18369,
                "amount": 1.5,
                "unit": "teaspoons",
                "unitLong": "teaspoons",
                "unitShort": "tsp",
                "aisle": "Baking",
                "name": "baking powder",
                "original": "1 1/2 teaspoons baking powder",
                "originalName": "baking powder",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/white-powder.jpg"
            },
            {
                "id": 2010,
                "amount": 1.0,
                "unit": "teaspoon",
                "unitLong": "teaspoon",
                "unitShort": "tsp",
                "aisle": "Spices and Seasonings",
                "name": "cinnamon",
                "original": "1 teaspoon cinnamon",
                "originalName": "cinnamon",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/cinnamon.jpg"
            },
            {
                "id": 1123,
                "amount": 1.0,
                "unit": "",
                "unitLong": "",
                "unitShort": "",
                "aisle": "Milk, Eggs, Other Dairy",
                "name": "egg",
                "original": "1 egg",
                "originalName": "egg",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/egg.png"
            }
        ],
        "usedIngredients": [
            {
                "id": 9003,
                "amount": 1.0,
                "unit": "cup",
                "unitLong": "cup",
                "unitShort": "cup",
                "aisle": "Produce",
                "name": "apple",
                "original": "1 cup chopped apple",
                "originalName": "chopped apple",
                "meta": [
                    "chopped"
                ],
                "image": "https://img.spoonacular.com/ingredients_100x100/apple.jpg"
            },
            {
                "id": 1077,
                "amount": 0.33333334,
                "unit": "cup",
                "unitLong": "cups",
                "unitShort": "cup",
                "aisle": "Milk, Eggs, Other Dairy",
                "name": "milk",
                "original": "1/3 cup milk",
                "originalName": "milk",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/milk.png"
            }
        ],
        "unusedIngredients": [
            {
                "id": 11124,
                "amount": 1.0,
                "unit": "serving",
                "unitLong": "serving",
                "unitShort": "serving",
                "aisle": "Produce",
                "name": "carrots",
                "original": "carrots",
                "originalName": "carrots",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/sliced-carrot.png"
            },
            {
                "id": 11143,
                "amount": 1.0,
                "unit": "serving",
                "unitLong": "serving",
                "unitShort": "serving",
                "aisle": "Produce",
                "name": "celery",
                "original": "celery",
                "originalName": "celery",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/celery.jpg"
            },
            {
                "id": 11529,
                "amount": 1.0,
                "unit": "serving",
                "unitLong": "serving",
                "unitShort": "serving",
                "aisle": "Produce",
                "name": "tomatoes",
                "original": "tomatoes",
                "originalName": "tomatoes",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/tomato.png"
            }
        ],
        "likes": 1334
    },
    {
        "id": 674272,
        "title": "Grand Apple and Cinnamon Biscuits",
        "image": "https://img.spoonacular.com/recipes/674272-312x231.jpg",
        "imageType": "jpg",
        "usedIngredientCount": 2,
        "missedIngredientCount": 3,
        "missedIngredients": [
            {
                "id": 18369,
                "amount": 1.0,
                "unit": "Tbsp",
                "unitLong": "Tbsp",
                "unitShort": "Tbsp",
                "aisle": "Baking",
                "name": "baking powder",
                "original": "1 Tbsp baking powder",
                "originalName": "baking powder",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/white-powder.jpg"
            },
            {
                "id": 1001,
                "amount": 0.33333334,
                "unit": "cup",
                "unitLong": "cups",
                "unitShort": "cup",
                "aisle": "Milk, Eggs, Other Dairy",
                "name": "butter",
                "original": "1/3 cup softened butter",
                "originalName": "softened butter",
                "meta": [
                    "softened"
                ],
                "image": "https://img.spoonacular.com/ingredients_100x100/butter-sliced.jpg"
            },
            {
                "id": 93784,
                "amount": 4.0,
                "unit": "servings",
                "unitLong": "servings",
                "unitShort": "servings",
                "aisle": "Baking",
                "name": "syrup",
                "original": "Syrup",
                "originalName": "Syrup",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/corn-syrup.png"
            }
        ],
        "usedIngredients": [
            {
                "id": 1089003,
                "amount": 2.0,
                "unit": "",
                "unitLong": "",
                "unitShort": "",
                "aisle": "Produce",
                "name": "granny smith apples",
                "original": "2 Granny Smith Apples (or your favorite type of apple)",
                "originalName": "Granny Smith Apples (or your favorite type of apple)",
                "meta": [
                    "your favorite",
                    "(or type of apple)"
                ],
                "image": "https://img.spoonacular.com/ingredients_100x100/grannysmith-apple.png"
            },
            {
                "id": 1077,
                "amount": 1.0,
                "unit": "cup",
                "unitLong": "cup",
                "unitShort": "cup",
                "aisle": "Milk, Eggs, Other Dairy",
                "name": "milk",
                "original": "1 cup milk",
                "originalName": "milk",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/milk.png"
            }
        ],
        "unusedIngredients": [
            {
                "id": 11124,
                "amount": 1.0,
                "unit": "serving",
                "unitLong": "serving",
                "unitShort": "serving",
                "aisle": "Produce",
                "name": "carrots",
                "original": "carrots",
                "originalName": "carrots",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/sliced-carrot.png"
            },
            {
                "id": 11143,
                "amount": 1.0,
                "unit": "serving",
                "unitLong": "serving",
                "unitShort": "serving",
                "aisle": "Produce",
                "name": "celery",
                "original": "celery",
                "originalName": "celery",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/celery.jpg"
            },
            {
                "id": 11529,
                "amount": 1.0,
                "unit": "serving",
                "unitLong": "serving",
                "unitShort": "serving",
                "aisle": "Produce",
                "name": "tomatoes",
                "original": "tomatoes",
                "originalName": "tomatoes",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/tomato.png"
            }
        ],
        "likes": 0
    },
    {
        "id": 633428,
        "title": "Baked Apple Pancake",
        "image": "https://img.spoonacular.com/recipes/633428-312x231.jpg",
        "imageType": "jpg",
        "usedIngredientCount": 2,
        "missedIngredientCount": 4,
        "missedIngredients": [
            {
                "id": 4073,
                "amount": 0.5,
                "unit": "cup",
                "unitLong": "cups",
                "unitShort": "cup",
                "aisle": "Milk, Eggs, Other Dairy",
                "name": "butter",
                "original": "1/2 cup Butter or margarine",
                "originalName": "Butter or margarine",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/butter-sliced.jpg"
            },
            {
                "id": 2010,
                "amount": 1.0,
                "unit": "tablespoon",
                "unitLong": "tablespoon",
                "unitShort": "Tbsp",
                "aisle": "Spices and Seasonings",
                "name": "cinnamon",
                "original": "1 tablespoon Cinnamon",
                "originalName": "Cinnamon",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/cinnamon.jpg"
            },
            {
                "id": 1123,
                "amount": 3.0,
                "unit": "",
                "unitLong": "",
                "unitShort": "",
                "aisle": "Milk, Eggs, Other Dairy",
                "name": "whl eggs",
                "original": "3 whl eggs",
                "originalName": "whl eggs",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/egg.png"
            },
            {
                "id": 12135,
                "amount": 4.0,
                "unit": "servings",
                "unitLong": "servings",
                "unitShort": "servings",
                "aisle": "Nuts",
                "name": "nuts and raisins",
                "original": "Nuts and raisins, chopped",
                "originalName": "Nuts and raisins, chopped",
                "meta": [
                    "chopped"
                ],
                "image": "https://img.spoonacular.com/ingredients_100x100/nuts-mixed.jpg"
            }
        ],
        "usedIngredients": [
            {
                "id": 9003,
                "amount": 1.0,
                "unit": "",
                "unitLong": "",
                "unitShort": "",
                "aisle": "Produce",
                "name": "whl apple",
                "original": "1 whl apple peeled, thinly sliced",
                "originalName": "whl apple peeled, thinly sliced",
                "meta": [
                    "peeled",
                    "thinly sliced"
                ],
                "image": "https://img.spoonacular.com/ingredients_100x100/apple.jpg"
            },
            {
                "id": 1077,
                "amount": 0.5,
                "unit": "cup",
                "unitLong": "cups",
                "unitShort": "cup",
                "aisle": "Milk, Eggs, Other Dairy",
                "name": "milk",
                "original": "1/2 cup Milk",
                "originalName": "Milk",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/milk.png"
            }
        ],
        "unusedIngredients": [
            {
                "id": 11124,
                "amount": 1.0,
                "unit": "serving",
                "unitLong": "serving",
                "unitShort": "serving",
                "aisle": "Produce",
                "name": "carrots",
                "original": "carrots",
                "originalName": "carrots",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/sliced-carrot.png"
            },
            {
                "id": 11143,
                "amount": 1.0,
                "unit": "serving",
                "unitLong": "serving",
                "unitShort": "serving",
                "aisle": "Produce",
                "name": "celery",
                "original": "celery",
                "originalName": "celery",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/celery.jpg"
            },
            {
                "id": 11529,
                "amount": 1.0,
                "unit": "serving",
                "unitLong": "serving",
                "unitShort": "serving",
                "aisle": "Produce",
                "name": "tomatoes",
                "original": "tomatoes",
                "originalName": "tomatoes",
                "meta": [],
                "image": "https://img.spoonacular.com/ingredients_100x100/tomato.png"
            }
        ],
        "likes": 3
    }
]
        
        # Parse and return the data from the external API
        #external_data = response.json()
        external_data = response
        print(external_data)

        responsen_data = {
        "recipes": [
            {
                "id": recipe["id"],
                "title": recipe["title"],
                "missedIngredientCount": recipe["missedIngredientCount"],
                "usedIngredientCount": recipe["usedIngredientCount"],
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
        
        return jsonify(responsen_data)
    except requests.exceptions.RequestException as e:
        print(f"Error querying external API: {e}")
        return jsonify({"error": "Failed to query external API"}), 500
    

    
@recipes_routes.route('/api/recipe/recipe_by_id', methods=['POST'])
def get_recipe_info():
    id = request.json 
    print("searching for recipe with id: ", id)
    api = 'https://api.spoonacular.com/recipes/'+id+'/information?apiKey='+os.getenv('RECIPE_API_KEY')

    try:
        # Make a GET request to the external API with the query parameter
        #response = requests.get(api)
        #response.raise_for_status()  # Raise an exception for HTTP errors

        response = {
    "vegetarian": true,
    "vegan": false,
    "glutenFree": false,
    "dairyFree": false,
    "veryHealthy": false,
    "cheap": false,
    "veryPopular": false,
    "sustainable": false,
    "lowFodmap": false,
    "weightWatcherSmartPoints": 77,
    "gaps": "no",
    "preparationMinutes": null,
    "cookingMinutes": null,
    "aggregateLikes": 1,
    "healthScore": 40,
    "creditsText": "Foodista.com – The Cooking Encyclopedia Everyone Can Edit",
    "license": "CC BY 3.0",
    "sourceName": "Foodista",
    "pricePerServing": 274.21,
    "extendedIngredients": [
        {
            "id": 1001,
            "aisle": "Milk, Eggs, Other Dairy",
            "image": "butter-sliced.jpg",
            "consistency": "SOLID",
            "name": "butter",
            "nameClean": "butter",
            "original": "3 tablespoons melted butter",
            "originalName": "melted butter",
            "amount": 3.0,
            "unit": "tablespoons",
            "meta": [
                "melted"
            ],
            "measures": {
                "us": {
                    "amount": 3.0,
                    "unitShort": "Tbsps",
                    "unitLong": "Tbsps"
                },
                "metric": {
                    "amount": 3.0,
                    "unitShort": "Tbsps",
                    "unitLong": "Tbsps"
                }
            }
        },
        {
            "id": 10011693,
            "aisle": "Canned and Jarred",
            "image": "tomatoes-canned.png",
            "consistency": "SOLID",
            "name": "tomatoes",
            "nameClean": "canned tomatoes",
            "original": "1 tin tomatoes",
            "originalName": "tinned tomatoes",
            "amount": 1.0,
            "unit": "can",
            "meta": [],
            "measures": {
                "us": {
                    "amount": 1.0,
                    "unitShort": "can",
                    "unitLong": "can"
                },
                "metric": {
                    "amount": 1.0,
                    "unitShort": "can",
                    "unitLong": "can"
                }
            }
        },
        {
            "id": 11124,
            "aisle": "Produce",
            "image": "sliced-carrot.png",
            "consistency": "SOLID",
            "name": "carrots",
            "nameClean": "carrot",
            "original": "3 mediums carrots, sliced",
            "originalName": "s carrots, sliced",
            "amount": 3.0,
            "unit": "medium",
            "meta": [
                "sliced"
            ],
            "measures": {
                "us": {
                    "amount": 3.0,
                    "unitShort": "medium",
                    "unitLong": "mediums"
                },
                "metric": {
                    "amount": 3.0,
                    "unitShort": "medium",
                    "unitLong": "mediums"
                }
            }
        },
        {
            "id": 11143,
            "aisle": "Produce",
            "image": "celery.jpg",
            "consistency": "SOLID",
            "name": "stk celery",
            "nameClean": "celery",
            "original": "2 stk celery",
            "originalName": "stk celery",
            "amount": 2.0,
            "unit": "",
            "meta": [],
            "measures": {
                "us": {
                    "amount": 2.0,
                    "unitShort": "",
                    "unitLong": ""
                },
                "metric": {
                    "amount": 2.0,
                    "unitShort": "",
                    "unitLong": ""
                }
            }
        },
        {
            "id": 1002044,
            "aisle": "Produce",
            "image": "lemon-basil.jpg",
            "consistency": "SOLID",
            "name": "herbs",
            "nameClean": "lemon basil",
            "original": "1 1/2 teaspoons mixed herbs",
            "originalName": "mixed herbs",
            "amount": 1.5,
            "unit": "teaspoons",
            "meta": [
                "mixed"
            ],
            "measures": {
                "us": {
                    "amount": 1.5,
                    "unitShort": "tsps",
                    "unitLong": "teaspoons"
                },
                "metric": {
                    "amount": 1.5,
                    "unitShort": "tsps",
                    "unitLong": "teaspoons"
                }
            }
        },
        {
            "id": 1102047,
            "aisle": "Spices and Seasonings",
            "image": "salt-and-pepper.jpg",
            "consistency": "SOLID",
            "name": "salt & pepper",
            "nameClean": "salt and pepper",
            "original": "1 salt & pepper",
            "originalName": "salt & pepper",
            "amount": 1.0,
            "unit": "",
            "meta": [],
            "measures": {
                "us": {
                    "amount": 1.0,
                    "unitShort": "",
                    "unitLong": ""
                },
                "metric": {
                    "amount": 1.0,
                    "unitShort": "",
                    "unitLong": ""
                }
            }
        },
        {
            "id": 11420420,
            "aisle": "Pasta and Rice",
            "image": "spaghetti.jpg",
            "consistency": "SOLID",
            "name": "spaghetti in 3cm lengths",
            "nameClean": "spaghetti",
            "original": "125 grams spaghetti in 3cm lengths",
            "originalName": "spaghetti in 3cm lengths",
            "amount": 125.0,
            "unit": "grams",
            "meta": [],
            "measures": {
                "us": {
                    "amount": 4.409,
                    "unitShort": "oz",
                    "unitLong": "ounces"
                },
                "metric": {
                    "amount": 125.0,
                    "unitShort": "g",
                    "unitLong": "grams"
                }
            }
        },
        {
            "id": 19335,
            "aisle": "Baking",
            "image": "sugar-in-bowl.png",
            "consistency": "SOLID",
            "name": "sugar",
            "nameClean": "sugar",
            "original": "1 cup sugar",
            "originalName": "sugar",
            "amount": 1.0,
            "unit": "cup",
            "meta": [],
            "measures": {
                "us": {
                    "amount": 1.0,
                    "unitShort": "cup",
                    "unitLong": "cup"
                },
                "metric": {
                    "amount": 200.0,
                    "unitShort": "g",
                    "unitLong": "grams"
                }
            }
        },
        {
            "id": 10611282,
            "aisle": "Produce",
            "image": "white-onion.png",
            "consistency": "SOLID",
            "name": "onion",
            "nameClean": "white onion",
            "original": "1 large white onion",
            "originalName": "white onion",
            "amount": 1.0,
            "unit": "large",
            "meta": [
                "white"
            ],
            "measures": {
                "us": {
                    "amount": 1.0,
                    "unitShort": "large",
                    "unitLong": "large"
                },
                "metric": {
                    "amount": 1.0,
                    "unitShort": "large",
                    "unitLong": "large"
                }
            }
        }
    ],
    "id": 648287,
    "title": "Italian Vegetable Soup",
    "readyInMinutes": 45,
    "servings": 1,
    "sourceUrl": "http://www.foodista.com/recipe/CQ73WMTP/italian-vegetable-soup",
    "image": "https://img.spoonacular.com/recipes/648287-556x370.jpg",
    "imageType": "jpg",
    "summary": "The recipe Italian Vegetable Soup could satisfy your Mediterranean craving in approximately <b>45 minutes</b>. This recipe serves 1 and costs $2.74 per serving. Watching your figure? This lacto ovo vegetarian recipe has <b>1813 calories</b>, <b>27g of protein</b>, and <b>38g of fat</b> per serving. 1 person has tried and liked this recipe. This recipe from Foodista requires onion, tomatoes, sugar, and stk celery. It works well as a rather inexpensive main course for <b>Autumn</b>. All things considered, we decided this recipe <b>deserves a spoonacular score of 79%</b>. This score is solid. Users who liked this recipe also liked <a href=\"https://spoonacular.com/recipes/italian-vegetable-soup-367562\">Italian Vegetable Soup</a>, <a href=\"https://spoonacular.com/recipes/homemade-italian-vegetable-soup-367334\">Homemade Italian Vegetable Soup</a>, and <a href=\"https://spoonacular.com/recipes/italian-chicken-and-vegetable-soup-105300\">Italian Chicken and Vegetable Soup</a>.",
    "cuisines": [
        "Mediterranean",
        "Italian",
        "European"
    ],
    "dishTypes": [
        "lunch",
        "soup",
        "main course",
        "main dish",
        "dinner"
    ],
    "diets": [
        "lacto ovo vegetarian"
    ],
    "occasions": [
        "fall",
        "winter"
    ],
    "instructions": "<ol><li>Cut up vegetables. Cook 15 mins in butter without burning with lid on pan. Add herbs, pour in stock. Add tomatoes, bring to boil. Add spaghetti, simmer 20 mins. Add sugar & season to taste.</li></ol>",
    "analyzedInstructions": [
        {
            "name": "",
            "steps": [
                {
                    "number": 1,
                    "step": "Cut up vegetables. Cook 15 mins in butter without burning with lid on pan.",
                    "ingredients": [
                        {
                            "id": 11583,
                            "name": "vegetable",
                            "localizedName": "vegetable",
                            "image": "https://spoonacular.com/cdn/ingredients_100x100/mixed-vegetables.png"
                        },
                        {
                            "id": 1001,
                            "name": "butter",
                            "localizedName": "butter",
                            "image": "butter-sliced.jpg"
                        }
                    ],
                    "equipment": [
                        {
                            "id": 404645,
                            "name": "frying pan",
                            "localizedName": "frying pan",
                            "image": "https://spoonacular.com/cdn/equipment_100x100/pan.png"
                        }
                    ],
                    "length": {
                        "number": 15,
                        "unit": "minutes"
                    }
                },
                {
                    "number": 2,
                    "step": "Add herbs, pour in stock.",
                    "ingredients": [
                        {
                            "id": 1002044,
                            "name": "herbs",
                            "localizedName": "herbs",
                            "image": "mixed-fresh-herbs.jpg"
                        },
                        {
                            "id": 1006615,
                            "name": "stock",
                            "localizedName": "stock",
                            "image": "chicken-broth.png"
                        }
                    ],
                    "equipment": []
                },
                {
                    "number": 3,
                    "step": "Add tomatoes, bring to boil.",
                    "ingredients": [
                        {
                            "id": 11529,
                            "name": "tomato",
                            "localizedName": "tomato",
                            "image": "tomato.png"
                        }
                    ],
                    "equipment": []
                },
                {
                    "number": 4,
                    "step": "Add spaghetti, simmer 20 mins.",
                    "ingredients": [
                        {
                            "id": 11420420,
                            "name": "spaghetti",
                            "localizedName": "spaghetti",
                            "image": "spaghetti.jpg"
                        }
                    ],
                    "equipment": [],
                    "length": {
                        "number": 20,
                        "unit": "minutes"
                    }
                },
                {
                    "number": 5,
                    "step": "Add sugar & season to taste.",
                    "ingredients": [
                        {
                            "id": 19335,
                            "name": "sugar",
                            "localizedName": "sugar",
                            "image": "sugar-in-bowl.png"
                        }
                    ],
                    "equipment": []
                }
            ]
        }
    ],
    "originalId": null,
    "spoonacularScore": 19.9471492767334,
    "spoonacularSourceUrl": "https://spoonacular.com/italian-vegetable-soup-648287"
}
        
        # Parse and return the data from the external API
        #external_data = response.json()
        external_data = response
        print(external_data)

         # title, image, servings, cookingMinutes, preparationMinutes, extendedIngredients.name, extendedIngredients.measures.us.amount, extendedIngredients.measures.us.unitLong
        response_data = {
        "recipe":[
            {
            "title": external_data["title"],
            "image": external_data["image"],
            "servings": external_data["servings"],
            "cookingMinutes": external_data["cookingMinutes"],
            "prepMinutes" : external_data["preparationMinutes"],
            "ingredients": [
                {"name": ingredient["name"], "unit": ingredient["measures"]["us"]["unitLong"], "amount": ingredient["measures"]["us"]["amount"]}
                for ingredient in external_data["extendedIngredients"]
            ],
            "sourceURL" : external_data["sourceUrl"]}
            ]
        }
        return jsonify(response_data)
    except requests.exceptions.RequestException as e:
        print(f"Error querying external API: {e}")
        return jsonify({"error": "Failed to query external API"}), 500
    
   