from flask import Flask, request, jsonify, session, render_template
from flask_socketio import SocketIO, join_room, leave_room, emit
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-change-this'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///chat.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app, supports_credentials=True)
db = SQLAlchemy(app)
socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000", manage_session=False)

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    room = db.Column(db.String(50), nullable=False)
    sender = db.Column(db.String(50), nullable=False)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

with app.app_context():
    db.create_all()



@app.route('/api/rooms')
def get_rooms():
    rooms = ['general', 'coding', 'chill', 'random']
    return jsonify({'rooms': rooms})

@app.route('/api/messages/<room>')
def get_messages(room):
    messages = Message.query.filter_by(room=room).order_by(Message.timestamp).limit(50).all()
    return jsonify([{
        'id': m.id, 'sender': m.sender, 'content': m.content, 
        'timestamp': m.timestamp.isoformat()
    } for m in messages])

@socketio.on('join_room')
def on_join(data):
    room = data['room']
    username = data['username']
    join_room(room)
    emit('user_joined', {'username': username}, to=room)
    save_message(room, 'System', f'{username} joined the room')

@socketio.on('leave_room')
def on_leave(data):
    room = data['room']
    username = data['username']
    leave_room(room)
    emit('user_left', {'username': username}, to=room)

@socketio.on('send_message')
def handle_message(data):
    room = data['room']
    username = data['username']
    message = data['message']
    
    msg_data = {'sender': username, 'content': message, 'timestamp': datetime.utcnow().isoformat()}
    emit('new_message', msg_data, to=room)
    save_message(room, username, message)

def save_message(room, sender, content):
    msg = Message(room=room, sender=sender, content=content)
    db.session.add(msg)
    db.session.commit()

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)
