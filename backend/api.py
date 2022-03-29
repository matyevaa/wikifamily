from flask import Flask, render_template, redirect, url_for
from flask import jsonify
from flask import request
from flask_cors import CORS, cross_origin
import json
import base64
import mysql.connector

import pymysql

app = Flask(__name__)
cors = CORS(app)

def connect():
    cnx = mysql.connector.connect(
        host = 'us-cdbr-east-05.cleardb.net',
        user = 'b2f8725312304e',
        password = '0c26bf48',
        database = 'heroku_688d3d7a3cbb111'
    )
    cursor = cnx.cursor()
    return (cnx, cursor)

@app.route('/api1/create', methods=['GET', 'DELETE', 'PUT'])
def get_family():
    print("get family apis")
    dbInfo = connect()
    cursor = dbInfo[1]
    cnx = dbInfo[0]

    # gets parents value
    # cursor.execute('SELECT DISTINCT c.first_name FROM individual i, individual j, individual c WHERE i.parent=c.individual_id AND j.parent=c.individual_id')
    # get child and parent
    cursor.execute('SELECT DISTINCT i.first_name, c.first_name FROM individual i, individual c WHERE i.individual_id=84 AND i.parent=c.individual_id')
    f = cursor.fetchall()
    print("Selected ", f)

    cursor.execute("SELECT * FROM individual")
    row_headers = [x[0] for x in cursor.description]
    data = cursor.fetchall()
    json_data = []
    for result in data:
        json_data.append(dict(zip(row_headers, result)))
    return json.dumps(json_data)

@app.route('/api1/create', methods=['GET','POST'])
def add_person():
    dbInfo = connect()
    cursor = dbInfo[1]
    cnx = dbInfo[0]

    #cursor.execute('SELECT family_id FROM family')
    #f = cursor.fetchall()
    #print("Family id in post ", f)

    print("/create GET POST")
    msg = ''
    if request.method=='POST':
        theform = request.get_json(force=True)
        fn = theform['first_name']
        ls = theform['last_name']
        i = theform['info']
        g = theform['gender']
        b = theform['birth']
        d = theform['death']
        fid = theform['family_id']
        p = theform['parent']
        cursor.execute('SELECT * FROM individual WHERE first_name = %s', (fn,))
        result = cursor.fetchone()
        if result:
            msg = 'Such a person already exists in your family!'
        elif result is None:
            cursor.execute('''INSERT INTO individual (first_name, last_name, info, gender, birth, death, family_id, parent) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)''', (fn, ls, i, g, b, d,fid,p,))
            cnx.commit()
            msg = "Successfully added a person!"
    else:
        msg = "Please fill out the form."
    print("Message: ", msg)
    cursor.close()
    cnx.close()
    return redirect(url_for('get_family'))


@app.route('/api1/delete/<individual_id>', methods=['DELETE'])
def delete_person(individual_id):
    dbInfo = connect()
    cursor = dbInfo[1]
    cnx = dbInfo[0]

    print("/delete/id DELETE")
    msg = ''
    id = individual_id
    cursor.execute('DELETE FROM individual WHERE individual_id = %s', (id,))
    cnx.commit()
    msg = "Successfully deleted person!"
    print(msg)
    print("Person id is %s ", id)
    cursor.close()
    cnx.close()
    return redirect(url_for('get_family'))


@app.route('/api1/create/<individual_id>', methods=['GET'])
def get_individual(individual_id):
    dbInfo = connect()
    cursor = dbInfo[1]
    cnx = dbInfo[0]

    print("/create/id GET")
    id = individual_id
    cursor.execute("SELECT * FROM individual WHERE individual_id = %s", (id,))
    print("In app.py, /create/id GET, the ind id is  %s", id)
    row_headers = [x[0] for x in cursor.description]
    data = cursor.fetchall()
    json_data = []
    for result in data:
        json_data.append(dict(zip(row_headers, result)))
    cursor.close()
    cnx.close()
    return json.dumps(json_data)


@app.route('/api1/edit/<individual_id>', methods=['PUT', 'PATCH'])
def edit_person(individual_id):
    dbInfo = connect()
    cursor = dbInfo[1]
    cnx = dbInfo[0]

    print("/edit/id PUT PATCH")
    id = individual_id
    msg = ''
    theform = request.get_json(force=True)
    print("EDIT")
    fn = theform['first_name']
    ls = theform['last_name']
    i = theform['info']
    g = theform['gender']
    b = theform['birth']
    d = theform['death']
    query = 'UPDATE individual SET first_name=%s, last_name=%s, info=%s, gender=%s, birth=%s, death=%s WHERE individual_id = %s'
    data = (fn, ls, i, g, b, d, id,)
    cursor.execute(query, data)
    cnx.commit()
    msg = "Successfully updated person!"
    print(msg)
    cursor.close()
    cnx.close()
    return redirect(url_for('get_family'))

# FUNCTS GET TREE INFO
# get list of tree ids, need add <userId> later
@app.route('/api1/listTrees/<id>', methods=['GET'])
def getFamilies(id):
    dbInfo = connect()
    cursor = dbInfo[1]
    cnx = dbInfo[0]

    cursor.execute("SELECT * FROM family WHERE owner_id =" + id)

    row_headers = [x[0] for x in cursor.description]
    data = cursor.fetchall()
    json_data = []
    for result in data:
        json_data.append(dict(zip(row_headers, result)))

    print(json_data)

    cursor.close()
    cnx.close()
    return json.dumps(json_data)

# get name of tree from specific tree id, need to add userId later
@app.route('/api1/getTreeName/<id>', methods=['GET'])
def getFamilyName(id):
    dbInfo = connect()
    cursor = dbInfo[1]
    cnx = dbInfo[0]

    cursor.execute("SELECT family_name FROM family WHERE family_id = %s", (id,))

    row_headers = [x[0] for x in cursor.description]
    data = cursor.fetchall()
    json_data = []
    for result in data:
        json_data.append(dict(zip(row_headers, result)))

    print(json_data)

    # cursor.close()
    # cnx.close()
    return json.dumps(json_data)

    # testing for getting data w treeId
@app.route('/api1/createjj/<treeId>', methods=['GET', 'DELETE', 'PUT'])
def get_family_w_treeID(treeId):
    print("get family apis, /<treeId>")
    dbInfo = connect()
    cursor = dbInfo[1]
    cnx = dbInfo[0]

    # gets parents value
    # cursor.execute('SELECT DISTINCT c.first_name FROM individual i, individual j, individual c WHERE i.parent=c.individual_id AND j.parent=c.individual_id')
    # get child and parent
    cursor.execute('SELECT DISTINCT i.first_name, c.first_name FROM individual i, individual c WHERE i.individual_id=84 AND i.parent=c.individual_id')
    f = cursor.fetchall()
    print("Selectedjj ", f)

    cursor.execute("SELECT * FROM individual WHERE family_id = %s", (treeId,))
    row_headers = [x[0] for x in cursor.description]
    data = cursor.fetchall()
    json_data = []
    for result in data:
        json_data.append(dict(zip(row_headers, result)))
    return json.dumps(json_data)

@app.route('/api1/createjj/<treeId>', methods=['GET','POST'])
def add_person_w_treeID(treeId):
    dbInfo = connect()
    cursor = dbInfo[1]
    cnx = dbInfo[0]

    #cursor.execute('SELECT family_id FROM family')
    #f = cursor.fetchall()
    #print("Family id in post ", f)

    print("/create GET POST")
    msg = ''
    if request.method=='POST':
        theform = request.get_json(force=True)
        fn = theform['first_name']
        ls = theform['last_name']
        i = theform['info']
        g = theform['gender']
        b = theform['birth']
        d = theform['death']
        fid = theform['family_id']
        p = theform['parent']
        cursor.execute('SELECT * FROM individual WHERE first_name = %s', (fn,))
        result = cursor.fetchone()
        if result:
            msg = 'Such a person already exists in your family!'
        elif result is None:
            cursor.execute('''INSERT INTO individual (first_name, last_name, info, gender, birth, death, family_id, parent) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)''', (fn, ls, i, g, b, d,fid,p,))
            cnx.commit()
            msg = "Successfully added a person!"
    else:
        msg = "Please fill out the form."
    print("Message: ", msg)
    cursor.close()
    cnx.close()
    return redirect(url_for('get_family_w_treeID', treeId=treeId))

# @app.route('/api1/createjj/<treeId>', methods=['GET','POST'])
# def add_person_w_treeID(treeId):
#     dbInfo = connect()
#     cursor = dbInfo[1]
#     cnx = dbInfo[0]

#     #cursor.execute('SELECT family_id FROM family')
#     #f = cursor.fetchall()
#     #print("Family id in post ", f)

#     print("/createjj/<treeId> GET POST")
#     msg = ''
#     if request.method=='POST':
#         theform = request.get_json(force=True)
#         fn = theform['first_name']
#         ls = theform['last_name']
#         i = theform['info']
#         g = theform['gender']
#         b = theform['birth']
#         d = theform['death']
#         fid = theform['family_id']
#         p = theform['parent']
#         cursor.execute('SELECT * FROM individual WHERE first_name = %s', (fn,))
#         result = cursor.fetchone()
#         if result:
#             msg = 'Such a person already exists in your family!'
#         elif result is None:
#             cursor.execute('''INSERT INTO individual (first_name, last_name, info, gender, birth, death, family_id, parent) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)''', (fn, ls, i, g, b, d,fid,p,))
#             cnx.commit()
#             msg = "Successfully added a person!"
#     else:
#         msg = "Please fill out the form."
#     print("Message: ", msg)
#     cursor.close()
#     cnx.close()
#     return redirect(url_for('get_family_w_treeID', treeId=treeId))


@app.route('/api1/deletejj/<individual_id>/<treeId>', methods=['DELETE'])
def delete_person_w_treeID(individual_id, treeId):
    dbInfo = connect()
    cursor = dbInfo[1]
    cnx = dbInfo[0]

    print("/delete/id/<treeId> jjDELETE")
    msg = ''
    id = individual_id
    cursor.execute('DELETE FROM individual WHERE individual_id = %s', (id,))
    cnx.commit()
    msg = "Successfully deleted person!"
    print(msg)
    print("Person id is %s ", id)
    cursor.close()
    cnx.close()
    return redirect(url_for('get_family_w_treeID', treeId=treeId))


@app.route('/api1/createjj/<treeId>/<individual_id>', methods=['GET'])
def get_individual_w_treeID(individual_id, treeId):
    dbInfo = connect()
    cursor = dbInfo[1]
    cnx = dbInfo[0]

    print("/create/id/<treeId> GET")
    id = individual_id
    cursor.execute("SELECT * FROM individual WHERE individual_id = %s", (id,))
    print("In app.py, /create/id GET <treeid>, the ind id is  %s", id)
    row_headers = [x[0] for x in cursor.description]
    data = cursor.fetchall()
    json_data = []
    for result in data:
        json_data.append(dict(zip(row_headers, result)))
    cursor.close()
    cnx.close()
    return json.dumps(json_data)


@app.route('/api1/editjj/<individual_id>/<treeId>', methods=['PUT', 'PATCH'])
def edit_person_w_treeID(individual_id, treeId):
    dbInfo = connect()
    cursor = dbInfo[1]
    cnx = dbInfo[0]

    print("/edit/id/<treeId> PUT PATCH")
    id = individual_id
    msg = ''
    theform = request.get_json(force=True)
    print("EDIT")
    fn = theform['first_name']
    ls = theform['last_name']
    i = theform['info']
    g = theform['gender']
    b = theform['birth']
    d = theform['death']
    query = 'UPDATE individual SET first_name=%s, last_name=%s, info=%s, gender=%s, birth=%s, death=%s WHERE individual_id = %s'
    data = (fn, ls, i, g, b, d, id,)
    cursor.execute(query, data)
    cnx.commit()
    msg = "Successfully updated person!"
    print(msg)
    cursor.close()
    cnx.close()
    return redirect(url_for('get_family_w_treeID', treeId=treeId))

if __name__ == "__main__":
    app.run(debug=True, port=5000)
