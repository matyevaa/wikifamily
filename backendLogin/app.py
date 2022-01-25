from re import template
from flask import Flask, render_template, url_for, redirect, flash, make_response
import os
from flask_dance.contrib.facebook import make_facebook_blueprint, facebook
from flask_dance.contrib.google import make_google_blueprint

from flask_dance.consumer import oauth_authorized, oauth_error
from flask_login import (UserMixin, login_required, logout_user, LoginManager, login_user, current_user)

from flask_sqlalchemy import SQLAlchemy
from flask_dance.consumer.storage.sqla import OAuthConsumerMixin, SQLAlchemyStorage
from sqlalchemy.orm.exc import NoResultFound

import json
import hashlib
from flask_cors import CORS, cross_origin


app = Flask(__name__)
cors = CORS(app)
# app.config['CORS_HEADERS'] = 'Content-Type'

app.secret_key = os.environ.get("FLASK_SECRET_KEY", "scrfanfaklfetkey")

app.config["FB_CLIENT_ID"] = os.environ.get("FB_CLIENT_ID")
app.config["FB_CLIENT_SECRET"] = os.environ.get("FB_CLIENT_SECRET")
FB_CLIENT_ID=os.environ.get("FB_CLIENT_ID")
FB_CLIENT_SECRET=os.environ.get("GOOGLE_CLIENT_SECRET")

app.config["GOOGLE_CLIENT_ID"] = os.environ.get("GOOGLE_CLIENT_ID")
app.config["GOOGLE_CLIENT_SECRET"] = os.environ.get("GOOGLE_CLIENT_SECRET")
GOOGLE_CLIENT_ID=os.environ.get("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET=os.environ.get("GOOGLE_CLIENT_SECRET")


# set to 1 while still in development or else "insecure http message"
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("SQLALCHEMY_DATABASE_URI")

# for Facebook
facebook_blueprint = make_facebook_blueprint(client_id=FB_CLIENT_ID, client_secret=FB_CLIENT_SECRET)
app.register_blueprint(facebook_blueprint, url_prefix="/auth")
# for Google
google_blueprint = make_google_blueprint(client_id=GOOGLE_CLIENT_ID, client_secret=GOOGLE_CLIENT_SECRET, scope=['https://www.googleapis.com/auth/userinfo.email', 'openid', 'https://www.googleapis.com/auth/userinfo.profile'])
app.register_blueprint(google_blueprint,url_prefix="/auth")

db = SQLAlchemy(app)

class User(UserMixin, db.Model):
    id = db.Column(db.String(250), primary_key=True)
    name = db.Column(db.String(250), unique=False)
    email = db.Column(db.String(250), unique=True)

class OAuth(OAuthConsumerMixin, db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)
    user = db.relationship(User)

login_manager = LoginManager(app)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get((user_id))

# For Facebook
facebook_blueprint.storage = SQLAlchemyStorage(OAuth, db.session, user=current_user)

@app.route('/facebook/login')
@app.route('/api2/facebook/login')
# @cross_origin()
def newLogin():
    # print((url_for('facebook.login')))
    return redirect(url_for('facebook.login'))

@oauth_authorized.connect_via(facebook_blueprint)
def facebookLoggedIn(blueprint, token):
    # print("once you are logged in")
    if not token:
        print("Failed to log in with FB")
        return False

    accInfo = blueprint.session.get('/me?fields=id,name,email')
    # print(accInfo.json())

    # authorization went OK, no errors
    if not accInfo.ok:
        return False

    accInfoJson = accInfo.json()
    user_id = accInfoJson["id"]

    # find auth token in DBor create
    query = OAuth.query.filter_by(provider=blueprint.name, user_id=user_id)

    try:
        oauth = query.one()
        print(oauth)
    except NoResultFound:
        oauth = OAuth(provider=blueprint.name, user_id=user_id, token=token)

    if oauth.user:
        login_user(oauth.user)

    else:
        # create local user
        user = User(name=accInfoJson["name"], id=accInfoJson["id"], email=accInfoJson["email"])
        
        oauth.user = user
        
        db.session.add_all([user, oauth])
        db.session.commit()
        
        login_user(user)
        # print("success logged in")

    # print("curr user is ")
    # print(current_user)

    return False

# notify on OAuth provider error
@oauth_error.connect_via(facebook_blueprint)
def facebook_error(blueprint, message, response):
    print("error oauth")

# For Google
google_blueprint.storage = SQLAlchemyStorage(OAuth, db.session, user=current_user)

@app.route('/api2/google/login')
def newLoginGoogle():
    return redirect(url_for('google.login'))

@oauth_authorized.connect_via(google_blueprint)
def googleLoggedIn(blueprint, token):
    # print("google login stuff")
    # print(url_for("google.login"))

    if not blueprint.authorized: 
        return redirect(url_for("google.login"))
    if not token:
        print("Failed to log in with Google")
        return False

    accInfo = blueprint.session.get('/oauth2/v1/userinfo')

    # print("person info is: ")
    # print(accInfo.json())

    # authorization went OK, no errors
    if not accInfo.ok:
        return False

    accInfoJson = accInfo.json()
    user_id = accInfoJson["id"]

    # find auth token in DBor create
    query = OAuth.query.filter_by(provider=blueprint.name, user_id=user_id)

    try:
        oauth = query.one()
        print("in the try : ")
        print(oauth)
    except NoResultFound:
        oauth = OAuth(provider=blueprint.name, user_id=accInfoJson["id"], token=token)
        print(oauth)

    if oauth.user:
        print("User existed in the database")
        login_user(oauth.user)

    else:
        # create local user
        print("created account for user")
        user = User(name = accInfoJson["name"], id=accInfoJson["id"], email=accInfoJson["email"])
        
        oauth.user = user
        
        db.session.add_all([user, oauth])
        db.session.commit()
        
        login_user(user)
        # print("success logged in")

    print("curr user is ")
    print(current_user)

    return False

# notify on OAuth provider error
@oauth_error.connect_via(facebook_blueprint)
def google_error(blueprint, message, response):
    print("error oauth")

# @login_required
@app.route("/api2", methods=['GET','POST'])
def help():
    return redirect('http://localhost:3000/auth/facebook')

@app.route("/")
def idk():
    # return redirect('http://localhost:3005')
    return render_template('temp.html')

@app.route("/api2/isLoggedIn", methods=['GET','POST'])
def IsLoggedIn():
    if current_user.is_authenticated:
        # print("true")
        return 'true'
    else:
        # print("false")
        return 'false'

@app.route("/api2/info", methods=['GET','POST'])
def idx():
    userInfo = []
    if current_user.is_authenticated:
        userInfo = [{"name": current_user.name, "id": current_user.id, "email": current_user.email}]

        
    else:
        userInfo = [{"name": "NotLoggedIn", "id": "NotLoggedIn", "email": "NotLoggedIn"}]
    
    # print(userInfo)    
    return json.dumps(userInfo)

@app.route("/api2/logout")
@login_required
def logout():
    logout_user()
    # print("logged out")

    return 'loggedOut'

if __name__ == '__main__':
    db.create_all()
    db.session.commit()
    app.run(debug=True, host="localhost", port=3000)