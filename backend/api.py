from flask import Flask, render_template, redirect, url_for
from flask import jsonify
from flask import request
from flask_cors import CORS, cross_origin
import json
import base64
import mysql.connector

app = Flask(__name__)
cors = CORS(app)

cnx = mysql.connector.connect(
    host = 'localhost',
    user = 'wikiNew',
    password = 'wikipassword',
    database = 'newwikifamily_db',
    auth_plugin = 'mysql_native_password'
    )

cursor = cnx.cursor()

@app.route('/api1/create', methods=['GET', 'DELETE', 'PUT'])
def get_family():
    cursor.execute("SELECT * FROM individual")
    row_headers = [x[0] for x in cursor.description]
    data = cursor.fetchall()
    json_data = []
    for result in data:
        json_data.append(dict(zip(row_headers, result)))
    return json.dumps(json_data)

@app.route('/api1/create', methods=['GET','POST'])
def add_person():
    msg = ''
    if request.method=='POST':
        theform = request.get_json(force=True)
        fn = theform['first_name']
        ls = theform['last_name']
        i = theform['info']
        g = theform['gender']
        fi = theform['family_id_FK']
        cursor.execute('SELECT * FROM individual WHERE first_name = %s', (fn,))
        result = cursor.fetchone()
        if result:
            msg = 'Such a person already exists in your family!'
        elif result is None:
            cursor.execute('''INSERT INTO individual (first_name, last_name, info, gender, family_id_FK) VALUES (%s,%s,%s,%s,%s)''', (fn, ls, i, g, fi))
            cnx.commit()
            msg = "Successfully added a person!"
    else:
        msg = "Please fill out the form."
    print("Message: ", msg)
    return redirect(url_for('get_family'))


@app.route('/api1/delete/<individual_id>', methods=['DELETE'])
def delete_person(individual_id):
    msg = ''
    id = individual_id
    cursor.execute('DELETE FROM individual WHERE individual_id = %s', (id,))
    cnx.commit()
    msg = "Successfully deleted person!"
    print(msg)
    print("Person id is %s ", id)
    return redirect(url_for('get_family'))

@app.route('/api1/create/<individual_id>', methods=['GET'])
def get_individual(individual_id):
    id = individual_id
    cursor.execute("SELECT * FROM individual WHERE individual_id = %s", (id,))
    row_headers = [x[0] for x in cursor.description]
    data = cursor.fetchall()
    json_data = []
    for result in data:
        json_data.append(dict(zip(row_headers, result)))
    return json.dumps(json_data)

@app.route('/api1/edit/<individual_id>', methods=['PUT', 'PATCH'])
def edit_person(individual_id):
    id = individual_id
    msg = ''
    theform = request.get_json(force=True)
    print("EDIT")
    fn = theform['first_name']
    ls = theform['last_name']
    i = theform['info']
    g = theform['gender']
    fi = theform['family_id_FK']
    query = 'UPDATE individual SET first_name=%s, last_name=%s, info=%s, gender=%s, family_id_FK=%s WHERE individual_id = %s'
    data = (fn, ls, i, g, fi,id,)
    cursor.execute(query, data)
    print("HEREEE")
    cnx.commit()
    msg = "Successfully updated person!"
    print(msg)
    return redirect(url_for('get_family'))

if __name__ == "__main__":
    app.run(debug=True, port=5000)
