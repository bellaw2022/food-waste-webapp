from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from config import Config
from models import db
from routes.user_routes import user_routes
from routes.userwastesaving_routes import userwastesaving_routes
from routes.produce_routes import produce_routes

app = Flask(__name__)

app.config.from_object(Config)
CORS(app)

db.init_app(app)
migrate = Migrate(app, db)

# routes
app.register_blueprint(user_routes)
app.register_blueprint(userwastesaving_routes)
app.register_blueprint(produce_routes)


@app.route('/')
def index():
    return "Hello, Fridgify is running!"

if __name__ == '__main__':
    app.run(debug=True)
