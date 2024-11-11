from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from config import Config
from models import db
from routes.user_routes import user_routes
from routes.userwastesaving_routes import userwastesaving_routes
from routes.user_produce_routes import user_produce_routes
from routes.recipes_routes import recipes_routes

app = Flask(__name__)

app.config.from_object(Config)
CORS(app)

db.init_app(app)
migrate = Migrate(app, db)

# routes
app.register_blueprint(user_routes)
app.register_blueprint(userwastesaving_routes)
app.register_blueprint(user_produce_routes)
app.register_blueprint(recipes_routes)


@app.route('/')
def index():
    return "Hello, Fridgify is running!"

if __name__ == '__main__':
    app.run(debug=True)
