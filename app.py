from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json
from bson import json_util
from bson.json_util import dumps
import os 

app = Flask(__name__)

port = int(os.environ.get('PORT', 5000)) 

MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
TWITTER_DBS_NAME = 'twitter_db'
TWITTER_COLLECTION_NAME = 'tweets'
TWITTER_FIELDS = {'screen_name': True, 'sentiment': True, 'time': True, 'score': True, '_id': False}

STACKOVERFLOW_DBS_NAME = 'stackoverflow_db'
STACKOVERFLOW_COLLECTION_NAME = 'questions'
STACKOVERFLOW_FIELDS = {'display_name': True, 'sentiment': True, 'time': True, 'score': True, '_id': False}

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/alchemiapi/sentimentanalysis")
def twittersa_projects():
    connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
    collection = connection[TWITTER_DBS_NAME][TWITTER_COLLECTION_NAME]
    projects = collection.find(projection=TWITTER_FIELDS)
    json_projects = []
    for project in projects:
        json_projects.append(project)
    json_projects = json.dumps(json_projects, default=json_util.default)
    connection.close()
    return json_projects

@app.route("/stackoverflow/sentimentanalysis")
def stackoverflowsa_projects():
    connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
    collection = connection[STACKOVERFLOW_DBS_NAME][STACKOVERFLOW_COLLECTION_NAME]
    projects = collection.find(projection=STACKOVERFLOW_FIELDS)
    json_projects = []
    for project in projects:
        json_projects.append(project)
    json_projects = json.dumps(json_projects, default=json_util.default)
    connection.close()
    return json_projects    

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=port,debug=True)