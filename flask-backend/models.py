from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'app_user'  # Update the table name
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)

    produce = db.relationship('UserAndProduce', backref='user', lazy=True)
    waste_savings = db.relationship('UserWasteSaving', backref='user', lazy=True)

class Produce(db.Model):
    __tablename__ = 'produce'
    produce_id = db.Column(db.Integer, primary_key=True)
    produce_name = db.Column(db.String(50), nullable=False)
    unit = db.Column(db.String(20))
    common_expdate = db.Column(db.Integer)  # Hardcoded average expiration days
    co2 = db.Column(db.Float)  # CO2 impact for this produce

class UserAndProduce(db.Model):
    __tablename__ = 'userandproduce'
    userproduce_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('app_user.user_id'), nullable=False)  # Update the foreign key
    produce_id = db.Column(db.Integer, db.ForeignKey('produce.produce_id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    purchase_date = db.Column(db.Date, nullable=False)
    expiration_date = db.Column(db.Date, nullable=False)
    image_url = db.Column(db.String(250))

class UserWasteSaving(db.Model):
    __tablename__ = 'userwastesaving'
    user_waste_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('app_user.user_id'), nullable=False)  # Update the foreign key
    date = db.Column(db.Date, nullable=False)
    amount_saved = db.Column(db.Float, nullable=False)  # Food saved
    co2_saved = db.Column(db.Float, nullable=False)  # CO2 saved

