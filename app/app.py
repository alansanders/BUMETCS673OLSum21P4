from flask import Flask, json, render_template, url_for, jsonify, request, redirect
# from flask_cors import CORS
from datetime import datetime
from models import *
from dotenv import load_dotenv
import os

# JWT
from flask_jwt_extended import JWTManager

# instantiate a Flask application and store that in 'app'
app = Flask(__name__)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# JWT
# Setup the Flask-JWT-Extended extension
app.config['JWT_TOKEN_LOCATION'] = ['headers', 'cookies']
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")# protect the key

jwt = JWTManager(app)

app.secret_key = 'xf7\xc4\xfa\x91' # TODO put this key in the environment

# config the SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///../database/data.db'
app.config['SQLALCHEMY_BINDS'] = {'two': 'sqlite:///../database/meal.db'}
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


# Return validation errors via error page
@app.errorhandler(422)
@app.errorhandler(400)
def handle_error(err):
    headers = err.data.get("headers", None)
    messages = err.data.get("messages", ["Invalid request."])
    if headers:
        return jsonify({"h-errors": messages}), err.code, headers
    else:
        return render_template('validationError.html', message=messages)


user = UserModel()
admin = Admin()
db.init_app(app)  # initalize db

# import declared routes
import routes

if __name__ == "__main__":
    app.run(debug=True)
