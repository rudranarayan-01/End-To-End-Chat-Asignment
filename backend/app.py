import datetime
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_bcrypt import Bcrypt

app = Flask(__name__)
CORS(app) 
bcrypt = Bcrypt(app)

# Database Setup
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///nexus.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Database Table
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100))
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    # Default time is set to UTC
    timestamp = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "sender_id": self.sender_id,
            "receiver_id": self.receiver_id,
            "content": self.content,
            "timestamp": self.timestamp.isoformat()
        }

# Signup Route
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    # Check if user exists
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"error": "Username already taken"}), 400
    
    hashed_pw = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(full_name=data['fullName'], username=data['username'], password=hashed_pw)
    
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User created"}), 201

# Login Route
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    
    if user and bcrypt.check_password_hash(user.password, data['password']):
        return jsonify({
            "id": user.id,
            "username": user.username,
            "fullName": user.full_name
        }), 200
    
    return jsonify({"error": "Invalid username or password"}), 401


## Get all users for sidebar
@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    # We return the ID, username, and full_name for the sidebar
    return jsonify([{
        "id": u.id, 
        "username": u.username, 
        "full_name": u.full_name
    } for u in users]), 200
    

# app.py - Add these routes to your existing code

@app.route('/messages', methods=['POST'])
def send_message():
    data = request.json
    new_msg = Message(
        sender_id=data['sender_id'],
        receiver_id=data['receiver_id'],
        content=data['content']
    )
    db.session.add(new_msg)
    db.session.commit()
    
    return jsonify({
        "id": new_msg.id,
        "sender_id": new_msg.sender_id,
        "content": new_msg.content,
        "timestamp": new_msg.timestamp.isoformat()
    }), 201

@app.route('/messages/<int:user1>/<int:user2>', methods=['GET'])
def get_chat_history(user1, user2):
    # Fetch messages where (A sent to B) OR (B sent to A)
    messages = Message.query.filter(
        ((Message.sender_id == user1) & (Message.receiver_id == user2)) |
        ((Message.sender_id == user2) & (Message.receiver_id == user1))
    ).order_by(Message.timestamp.asc()).all()
    
    return jsonify([{
        "sender_id": m.sender_id,
        "content": m.content,
        "timestamp": m.timestamp.isoformat()
    } for m in messages]), 200


if __name__ == '__main__':
    with app.app_context():
        db.create_all() 
    app.run(debug=True)