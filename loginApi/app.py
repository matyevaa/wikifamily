################################################################################
# WikiFamily Capstone 2021-2022
# 
# Third Party Login API
################################################################################

from flask import Flask, url_for, redirect, request
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
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)

# Python Flask secret key
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

# URI for DB
URI = os.environ.get("SQLALCHEMY_DATABASE_URI")
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://b2f8725312304e:0c26bf48@us-cdbr-east-05.cleardb.net/heroku_688d3d7a3cbb111'
# updting timeout for DB
app.config['SQLALCHEMY_POOL_RECYCLE'] = 299
app.config['SQLALCHEMY_POOL_TIMEOUT'] = 20

# FOR THIRD PARTY LOGIN GETS --email, user id, and name
# for Facebook -- setting client ID and client secret for FB login
facebook_blueprint = make_facebook_blueprint(client_id="1647653595405093", client_secret="7bad27c3dc273670e94b219ebd5accb6")
app.register_blueprint(facebook_blueprint, url_prefix="/auth/facebook/wikifam", scope=["id","name","email"])

# for Google -- setting client ID and client secret for Google login
google_blueprint = make_google_blueprint(client_id="829398755356-9fsjod7oisuf8sn0rihoj30fk76mcfko.apps.googleusercontent.com",client_secret="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", scope=['https://www.googleapis.com/auth/userinfo.email', 'openid', 'https://www.googleapis.com/auth/userinfo.profile'])
app.register_blueprint(google_blueprint,url_prefix="/auth")

# setting DB
db = SQLAlchemy(app)

################################################################################
# class for storing user
#   ID    -- ID associated with FB/ Google/ email login
#   name  -- user's full name
#   email -- email associated with FB/Google/email account
#         -- can have accounts with the same mail but not same ID
################################################################################
class User(UserMixin, db.Model):
    id = db.Column(db.String(250), primary_key=True)
    name = db.Column(db.String(250), unique=False)
    email = db.Column(db.String(250), unique=False)

################################################################################
# class for storing user authentication info
#   user_id -- idx in the DB
#   user    -- stores oauth token and expiratioin date
################################################################################
class OAuth(OAuthConsumerMixin, db.Model):
    user_id = db.Column(db.String(250), db.ForeignKey(User.id), nullable=False)
    user = db.relationship(User)

# helps with sessions and keeping users logged in
login_manager = LoginManager(app)

################################################################################
# description:  Returns the user's full information given their user ID
# input:        user_id -- the user id associated with Google/ FB of the user 
# return:       User -- class User that stores the user's name, id, email
################################################################################
@login_manager.user_loader
def load_user(user_id):
    return User.query.get((user_id))

# FOR FACEBOOK LOGIN

# initiating the blueprint for FB
facebook_blueprint.storage = SQLAlchemyStorage(OAuth, db.session, user=current_user)

################################################################################
# Description:  Redirects the user to the Facebook login page
# 
# input:        NONE
# 
# return:       redirects user to FB login page
################################################################################
@app.route('/facebook/login')
def newLogin():
    return redirect(url_for('facebook.login'))

################################################################################
# Description:  Only enters function if a user is logged in
# 
# input:        blueprint -- facebook blueprint
#               token     -- user authorization token
# 
# return:       False -- prevents Flask Dance from automatically saving Oauth token
################################################################################
@oauth_authorized.connect_via(facebook_blueprint)
def facebookLoggedIn(blueprint, token):
    # ensuring that user is logged in
    if not token:
        print("Failed to log in with FB")
        return False

    # getting users ID, name, email
    accInfo = blueprint.session.get('/me?fields=id,name,email')

    # authorization went OK, no errors
    if not accInfo.ok:
        return False

    # parses for users ID
    accInfoJson = accInfo.json()
    user_id = accInfoJson["id"]

    # tries to find auth token in DB
    query = OAuth.query.filter_by(provider=blueprint.name, user_id=user_id)

    # if Oauth token existed set it to oauth, otherwise create it
    try:
        oauth = query.one()
    except NoResultFound:
        oauth = OAuth(provider=blueprint.name, user_id=user_id, token=token)

    # if Oauth existed, log the user in // otherwise create the user and insert
    # to the DB
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

# FOR GOOGLE LOGIN

# initiating blueprint for Google login
google_blueprint.storage = SQLAlchemyStorage(OAuth, db.session, user=current_user)

################################################################################
# Description:  Redirects the user to the Google login page
# 
# input:        NONE
# 
# return:       redirects user to Google login page
################################################################################
@app.route('/google/login')
def newLoginGoogle():
    return redirect(url_for('google.login'))

################################################################################
# Description:  Only enters function if a user is logged in
# 
# input:        blueprint -- Google blueprint
#               token     -- user authorization token
# 
# return:       False -- prevents Flask Dance from automatically saving Oauth token
################################################################################
@oauth_authorized.connect_via(google_blueprint)
def googleLoggedIn(blueprint, token):
    # ensuring that user is logged in
    if not token:
        print("Failed to log in with Google")
        return False

    # getting name,id,email from Google login
    accInfo = blueprint.session.get('/oauth2/v1/userinfo')

    # authorization went OK, no errors
    if not accInfo.ok:
        return False

    # parsing for user ID
    accInfoJson = accInfo.json()
    user_id = accInfoJson["id"]

    # try to find Google logged in user in DB
    query = OAuth.query.filter_by(provider=blueprint.name, user_id=user_id)

    # if Oauth token existed set it to oauth, otherwise create it
    try:
        oauth = query.one()
    except NoResultFound:
        oauth = OAuth(provider=blueprint.name, user_id=accInfoJson["id"], token=token)

    # if Oauth existed, log the user in // otherwise create the user and insert
    # to the DB
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

################################################################################
# Description:  Using Flask dance sessions confirming whether or not a user is
#               logged in
# 
# input:        NONE
# 
# return:       False -- There was no user logged in
#               True  -- User was logged in
################################################################################
@app.route("/api2/isLoggedIn", methods=['GET','POST'])
def IsLoggedIn():
    if current_user.is_authenticated:
        print("true")
        return 'true'
    else:
        print("false")
        return 'false'

################################################################################
# Description:  Returns the logged in users information otherwise returns dummy
#               not logged in data
# 
# input:        NONE
# 
# return:       If logged in  -- returns email, id, name of logged in user in json
#                               json format 
#               not logged in -- returns dummy data in json format
#               
#               json format: [{"name": [NAME], "id": [ID], "email": [EMAIL]}]
################################################################################
@app.route("/api2/info", methods=['GET','POST'])
def idx():
    userInfo = []
    if current_user.is_authenticated:
        userInfo = [{"name": current_user.name, "id": current_user.id, "email": current_user.email}]

    else:
        userInfo = [{"name": "NotLoggedIn", "id": "NotLoggedIn", "email": "NotLoggedIn"}]
    
    return json.dumps(userInfo)

################################################################################
# Description:  Logs out the user 
# 
# input:        NONE
# 
# return:       messaged that user was logged out
################################################################################
@app.route("/api2/logout")
@login_required
def logout():
    logout_user()

    return 'loggedOut'

################################################################################
# Description:  Returns user information (name, id, email) given user ID
# 
# input:        id -- the ID associated with Google/FB
# 
# return:       User data in json format
################################################################################
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

################################################################################
# Description:  FB callback url to remove user's account association with Wikifam 
# 
# input:        request -- FB json request to remove specific user from DB
# 
# return:       NONE
################################################################################
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

################################################################################
# Description:  Differentiates bt successful user data deleted or failure 
# 
# input:        reponse -- callback url response
# 
# return:       message whether user data was deleted or not
################################################################################
@app.route("/deletionStat/<response>")
def deleteStat(response):
    if (response == 200):
        return "sucessfully deleted user data"
    else:
        return "was unable to delete user data"

################################################################################
# Description:  Checks whether an email/ID exists in the DB. Email prefered for
#               Google and email login. ID prefered for Facebook login.
# 
# input:        email/ id -- in a request from from frontend 
# 
# return:       json list -- input existed   [True, user's ID]
#                         -- input not exist [False]
################################################################################
@app.route("/api2/emailExist", methods=['POST'])
@cross_origin(supports_credentials=True)
def checkExist():

    if request.method=='POST':
        json_data = []
        theform = request.get_json(force=True)
        
        # parses for email
        c = theform['email_share']

        # prints email to ensure correct email received
        print(c)

        # if input was all digits then assumes an ID was sent
        if(c.isdigit() == True):
            print("is only decimal")

            # queries for user ID sets user to True or False
            user = User.query.filter_by(id=c).first() is not None
            print(user)

            # inserts true/false to list
            json_data.append(user)

            # if user existed, finds ID and adds it to the list
            if (user == True):
                user = User.query.filter_by(id=c).first()
                user = user.id
                print(user)
                json_data.append(user)

        # otherwise assumes input was an email
        else:
            print("is string")

            # queries for email and sets user to True || False
            user = User.query.filter_by(email=c).first() is not None
            print(user)

            # adds True/False to list
            json_data.append(user)

            # if user existed gets user ID and adds it to the list
            if (user == True):
                user = User.query.filter_by(email=c).first()
                user = user.id
                print(user)
                json_data.append(user)
    else:
        print( "Please fill out form")

    return json.dumps(json_data)

################################################################################
# Description:  If the user logged in with the WikiFamily email login, checks
#               whether the user id exists in the DB if not then it adds the User.
# 
# input:        id -- user's id created with Oauth for react
#               email -- email user used to login
#               name -- Oauth uses the email without @COMAPNY.com as user's name 
# 
# return:       NONE
################################################################################
@app.route("/api2/addEmailLogin/<id>/<email>/<name>")
def addFromEmailLogin(id, email,name):

    # queries for id in DB and sets user to True/False
    user = User.query.filter_by(id=id).first() is not None
    print(user)

    # if the user existed then do nothing 
    # otherwise is the user did not exist add the user to the DB
    if (user == False): # add the user to the db
        user = User(name=name, id=id, email=email)
            
        db.session.add(user)
        db.session.commit()

    return "200"

if __name__ == '__main__':
    db.create_all()
    db.session.commit()
    app.run(debug=True, host="localhost", port=3000)