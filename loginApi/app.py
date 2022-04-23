# from crypt import methods
from re import template
from flask import Flask, render_template, url_for, redirect, flash, make_response, request
from facepy import SignedRequest
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

from flask.helpers import send_from_directory

app = Flask(__name__)
cors = CORS(app)
# app.config['CORS_HEADERS'] = 'Content-Type'

app.secret_key = os.environ.get("FLASK_SECRET_KEY", "scrfanfaklfetkey")

# Facebook API Data
app.config["FB_CLIENT_ID"] = os.environ.get("FB_CLIENT_ID")
app.config["FB_CLIENT_SECRET"] = os.environ.get("FB_CLIENT_SECRET")
FB_CLIENT_ID=os.environ.get("FB_CLIENT_ID")
FB_CLIENT_SECRET=os.environ.get("GOOGLE_CLIENT_SECRET")

# Google API Data
app.config["GOOGLE_CLIENT_ID"] = os.environ.get("GOOGLE_CLIENT_ID")
app.config["GOOGLE_CLIENT_SECRET"] = os.environ.get("GOOGLE_CLIENT_SECRET")
GOOGLE_CLIENT_ID=os.environ.get("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET=os.environ.get("GOOGLE_CLIENT_SECRET")


# set to 1 while still in development or else "insecure http message"
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
URI = os.environ.get("SQLALCHEMY_DATABASE_URI")
# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://wikiNew:wikipassword@localhost/newwikifamily_db'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://b2f8725312304e:0c26bf48@us-cdbr-east-05.cleardb.net/heroku_688d3d7a3cbb111'
app.config['SQLALCHEMY_POOL_RECYCLE'] = 299
app.config['SQLALCHEMY_POOL_TIMEOUT'] = 20
# mysql://b2f8725312304e:0c26bf48@us-cdbr-east-05.cleardb.net/heroku_688d3d7a3cbb111?reconnect=true

# for Facebook
facebook_blueprint = make_facebook_blueprint(client_id="1647653595405093", client_secret="7bad27c3dc273670e94b219ebd5accb6")
app.register_blueprint(facebook_blueprint, url_prefix="/auth/facebook/wikifam", scope=["id","name","email"])
# for Google
google_blueprint = make_google_blueprint(client_id="829398755356-9fsjod7oisuf8sn0rihoj30fk76mcfko.apps.googleusercontent.com",client_secret="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", scope=['https://www.googleapis.com/auth/userinfo.email', 'openid', 'https://www.googleapis.com/auth/userinfo.profile'])
app.register_blueprint(google_blueprint,url_prefix="/auth")


db = SQLAlchemy(app)

class User(UserMixin, db.Model):
    id = db.Column(db.String(250), primary_key=True)
    name = db.Column(db.String(250), unique=False)
    email = db.Column(db.String(250), unique=True)

class OAuth(OAuthConsumerMixin, db.Model):
    user_id = db.Column(db.String(250), db.ForeignKey(User.id), nullable=False)
    user = db.relationship(User)

login_manager = LoginManager(app)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get((user_id))

# For Facebook
facebook_blueprint.storage = SQLAlchemyStorage(OAuth, db.session, user=current_user)

@app.route('/facebook/login')
# @cross_origin()
def newLogin():
    return redirect(url_for('facebook.login'))

@oauth_authorized.connect_via(facebook_blueprint)
def facebookLoggedIn(blueprint, token):
    if not token:
        print("Failed to log in with FB")
        return False

    accInfo = blueprint.session.get('/me?fields=id,name,email')

    print("person info is: ")
    print(accInfo.json())

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

    return False

# notify on OAuth provider error
@oauth_error.connect_via(facebook_blueprint)
def facebook_error(blueprint, message, response):
    print("error oauth")

# For Google
google_blueprint.storage = SQLAlchemyStorage(OAuth, db.session, user=current_user)

@app.route('/google/login')
def newLoginGoogle():
    return redirect(url_for('google.login'))

@oauth_authorized.connect_via(google_blueprint)
def googleLoggedIn(blueprint, token):

    if not blueprint.authorized: 
        return redirect(url_for("google.login"))
    if not token:
        print("Failed to log in with Google")
        return False

    accInfo = blueprint.session.get('/oauth2/v1/userinfo')

    print("person info is: ")
    print(accInfo.json())

    # authorization went OK, no errors
    if not accInfo.ok:
        return False

    accInfoJson = accInfo.json()
    user_id = accInfoJson["id"]

    # find auth token in DBor create
    query = OAuth.query.filter_by(provider=blueprint.name, user_id=user_id)

    print(query)

    try:
        oauth = query.one()
    except NoResultFound:
        oauth = OAuth(provider=blueprint.name, user_id=accInfoJson["id"], token=token)

    if oauth.user:
        login_user(oauth.user)

    else:
        # create local user
        user = User(name = accInfoJson["name"], id=accInfoJson["id"], email=accInfoJson["email"])
        
        oauth.user = user
        
        db.session.add_all([user, oauth])
        db.session.commit()
        
        login_user(user)

    return False

# notify on OAuth provider error
@oauth_error.connect_via(facebook_blueprint)
def google_error(blueprint, message, response):
    print("error oauth")

# @login_required
@app.route("/")
def help():
    stringId = str(current_user.id)
    return redirect('http://localhost:3005/creator=' + stringId + '/works')

# @app.route("/")
# def idk():
#     # return redirect('http://localhost:3005')
#     return render_template('temp.html')

@app.route("/api2/isLoggedIn", methods=['GET','POST'])
def IsLoggedIn():
    if current_user.is_authenticated:
        print("true")
        return 'true'
    else:
        print("false")
        return 'false'

@app.route("/api2/info", methods=['GET','POST'])
def idx():
    userInfo = []
    if current_user.is_authenticated:
        userInfo = [{"name": current_user.name, "id": current_user.id, "email": current_user.email}]

    else:
        userInfo = [{"name": "NotLoggedIn", "id": "NotLoggedIn", "email": "NotLoggedIn"}]
    
    return json.dumps(userInfo)

@app.route("/api2/logout")
@login_required
def logout():
    logout_user()

    return 'loggedOut'

@app.route("/api2/getInfo/<id>")
@cross_origin(supports_credentials=True)
def getName(id):
    user = User.query.get((id))

    print(user)

    userInfo = []
    userInfo.append(user.name)
    userInfo.append(user.id)
    userInfo.append(user.email)

    return json.dumps(userInfo)


# def parseSignedReq(signedReq):
#     signedData = SignedRequest.parse(signedReq, "7bad27c3dc273670e94b219ebd5accb6")
#     return signedData

@app.route("/api2/deleteCallback", methods=['POST'])
def dataDelete(request, data):
    # will be called when the user wants to remove FB login info from our DB
    # necessary for facebook login to be made live

    try:
        # parse the response from FB for the user id
        signedReq = request.POST['signed_request']
        signedData = SignedRequest.parse(signedReq, "7bad27c3dc273670e94b219ebd5accb6")

        print("id to be deleted: {id}", id=signedData["user_id"])

        
        # # find it in the DB and remove it
        user = User.query.filter_by(id = signedData["user_id"])
        oauth = OAuth.query.filter_by(user_id=signedData["user_id"])
        user.delete()
        oauth.delete()
        responseCode = 200

    except Exception as e:
        responseCode = 403

    # response for FB should be --V
        # { url: '<url>', confirmation_code: '<code>' }

    # treat it like an account deletion -- would need to delete the DB info too
    return {
        'url': "http://localhost:3000/deletionStat/{confirmation_code}", 'confirmation_code': responseCode}

@app.route("/deletionStat/<response>")
def deleteStat(response):
    if (response == 200):
        return "sucessfully deleted user data"
    else:
        return "was unable to delete user data"

@app.route("/api2/emailExist", methods=['POST'])
@cross_origin(supports_credentials=True)
def checkExist():
    # msg = ''
    if request.method=='POST':
        json_data = []
        print("share individuals")
        theform = request.get_json(force=True)
        
        c = theform['email_share']

        print(c)

        if(c.isdigit() == True):
            print("is only decimal")
            user = User.query.filter_by(id=c).first() is not None
            print(user)
            json_data.append(user)
            if (user == True):
                user = User.query.filter_by(id=c).first()
                user = user.id
                print(user)
                json_data.append(user)

        else:
            print("is string")
            user = User.query.filter_by(email=c).first() is not None
            print(user)
            json_data.append(user)
            if (user == True):
                user = User.query.filter_by(email=c).first()
                user = user.id
                print(user)
                json_data.append(user)
    else:
        print( "Please fill out form")

    return json.dumps(json_data)

if __name__ == '__main__':
    db.create_all()
    db.session.commit()
    app.run(debug=True, host="localhost", port=3000)