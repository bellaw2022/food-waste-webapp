from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'app_user'
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    badge = db.Column(db.Integer, nullable=False, default=0)  # New badge column
    
    produce = db.relationship('UserAndProduce', backref='user', lazy=True)
    waste_savings = db.relationship('UserWasteSaving', backref='user', lazy=True)



class Produce(db.Model):
    __tablename__ = 'produce'
    produce_id = db.Column(db.Integer, primary_key=True)
    produce_name = db.Column(db.String(50), nullable=False)
    unit = db.Column(db.String(20))
    common_expdate = db.Column(db.Integer)
    co2 = db.Column(db.Float, nullable=False, default=0.0)
    category = db.Column(db.String(20))


class UserAndProduce(db.Model):
    __tablename__ = 'userandproduce'
    userproduce_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('app_user.user_id'), nullable=False)
    produce_id = db.Column(db.Integer, db.ForeignKey('produce.produce_id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    purchase_date = db.Column(db.Date, nullable=False)
    expiration_date = db.Column(db.Date, nullable=False)


class UserWasteSaving(db.Model):
    __tablename__ = 'userwastesaving'
    user_waste_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('app_user.user_id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    co2_saved = db.Column(db.Float, nullable=False)
