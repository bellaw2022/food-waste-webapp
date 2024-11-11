from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from config import Config
from models import db
from routes.user_routes import user_routes
from routes.userwastesaving_routes import userwastesaving_routes
from routes.produce_routes import produce_routes
from routes.user_produce_routes import user_produce_routes
from routes.scan_routes import scan_routes
import os

os.environ['KMP_DUPLICATE_LIB_OK'] = 'TRUE'
os.environ['DATABASE_URL'] = 'postgresql://u1918j60ppob87:p02d261c522b0470df0fb0436896a979290bb230d174839d6b54fad0eb37cb9b2@cfls9h51f4i86c.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com:5432/dd1ihmcjpvu36e'

app = Flask(__name__)

app.config.from_object(Config)
CORS(app)

db.init_app(app)
migrate = Migrate(app, db)

# routes
app.register_blueprint(user_routes)
app.register_blueprint(userwastesaving_routes)
app.register_blueprint(produce_routes)
app.register_blueprint(user_produce_routes)
app.register_blueprint(scan_routes)


@app.route('/')
def index():
    return "Hello, Fridgify is running!"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000, debug=True)
