# from crypt import methods
from hashlib import new
from unicodedata import name
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
    print("get children of the root individual (parent is NULL)")
    dbInfo = connect()
    cursor = dbInfo[1]
    cnx = dbInfo[0]

    # get parent root
    #cursor.execute("SELECT * FROM individual WHERE parent is NULL")
    #row_headers1 = [x[0] for x in cursor.description]
    #r = cursor.fetchall()
    #print("root in get data: ", r)
    #json_data = []
    #for result in r:
    #    json_data.append(dict(zip(row_headers1, result)))

    # get parent and children
    # cursor.execute('''
    #     SELECT
	#        p.first_name as Parent,
    #        GROUP_CONCAT(c.first_name ORDER BY c.first_name) as Children
    #        FROM individual c
    #        JOIN individual p
    #        ON c.parent = p.individual_id
    #        GROUP BY p.individual_id;
    # ''')

    # cursor.execute('''
    #     SELECT t1.first_name AS lev1,
    #         t2.first_name as lev2,
    #         t3.first_name as lev3,
    #         t4.first_name as lev4
    #     FROM individual AS t1
    #     LEFT JOIN individual AS t2 ON t2.parent = t1.individual_id
    #     LEFT JOIN individual AS t3 ON t3.parent = t2.individual_id
    #     LEFT JOIN individual AS t4 ON t4.parent = t3.individual_id
    # ''')


    cursor.execute('''
        SELECT
            p1.individual_id as individual_id,
            p1.first_name as ParentName,
            p2.first_name as Child1,
            p3.first_name as Child2,
            p4.first_name as Child3,
            p5.first_name as Child4
FROM individual p1
 LEFT JOIN individual AS p2 ON p2.parent = p1.individual_id
 LEFT JOIN individual AS p3 ON p3.parent = p2.individual_id
 LEFT JOIN individual AS p4 ON p4.parent = p3.individual_id
 LEFT JOIN individual AS p5 on p5.parent = p4.individual_id
WHERE p1.parent is null AND 1 IN  (p1.parent,
                   p2.parent,
                   p3.
                   parent,
                   p4.parent,
                   p5.parent)
    ''')


    # get everyone
    #cursor.execute("SELECT * FROM individual")
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
@cross_origin(supports_credentials=True)
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

    # FOR OG TREE SEARCH W ID
    # cursor.execute("SELECT * FROM individual WHERE family_id = %s", (treeId,))
    cursor.execute("SELECT * FROM individual WHERE FIND_IN_SET(%s, family_ids)", (treeId,))

    row_headers = [x[0] for x in cursor.description]
    data = cursor.fetchall()
    json_data = []
    for result in data:
        json_data.append(dict(zip(row_headers, result)))
    return json.dumps(json_data)

@app.route('/api1/createjj/<treeId>', methods=['GET','POST'])
@cross_origin(supports_credentials=True)
def add_person_w_treeID(treeId):
    dbInfo = connect()
    cursor = dbInfo[1]
    cnx = dbInfo[0]

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

        # if user not input parent ID make it automatically 0
        if p == "":
            p = "0"

        cursor.execute('SELECT * FROM individual WHERE first_name = %s', (fn,))
        result = cursor.fetchone()
        if result:
            msg = 'Such a person already exists in your family!'
        elif result is None:
            # check if the tree was shared 
            # cursor.execute("SELECT shared_from from family where family_id=%s;", (treeId,))
            # if shared get the id and insert it with current tree id
            # else... do nothing

            cursor.execute('''INSERT INTO individual (first_name, last_name, info, gender, birth, death, family_id, parent, family_ids) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)''', (fn, ls, i, g, b, d,fid,p,treeId))
            cnx.commit()
            msg = "Successfully added a person!"
    else:
        msg = "Please fill out the form."
    print("Message: ", msg)
    cursor.close()
    cnx.close()
    return redirect(url_for('get_family_w_treeID', treeId=treeId))

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

def returnSharedTreeID(name, collaborator):
    dbInfo = connect()
    cursor = dbInfo[1]
    cnx = dbInfo[0]

    print("in retTreeId\n")
    print(name, collaborator)

    cursor.execute("SELECT family_id FROM family WHERE owner_id=%s", (collaborator,))

    newTree = list(cursor.fetchall())

    totTrees = len(newTree)

    print(newTree)
    cursor.close()
    cnx.close()

    return newTree[totTrees-1]

@app.route('/api1/createTree', methods=['POST'])
def create_empty_tree():
    dbInfo = connect()
    cursor = dbInfo[1]
    cnx = dbInfo[0]

    msg = ''
    theform = request.get_json(force=True)
    print("add tree")
    
    b = theform['user_id']
    d = theform['parent']

    if request.method=='POST':
        query = 'INSERT INTO family (family_name, family_size, owner_id) VALUES (%s,"0",%s);'
        data = (d, b,)

        cursor.execute(query, data)
        cnx.commit()
        msg = "Successfully added new tree"
        print(msg)

    else:
        print("did not create new tree")
        
    newlyCreatedTree = returnSharedTreeID(d,b)
    print(newlyCreatedTree[0])
    
    # avbdavjkfvbhfdvbj
    query='UPDATE individual SET family_ids = concat(family_ids,%s) WHERE individual_id = "0";'
    data = ((","+ str(newlyCreatedTree[0])),)

    cursor.execute(query, data)

    cnx.commit()
        
    cursor.close()
    cnx.close()

    return "200"

# when enters the email has already been checked that it exists
@app.route('/api2/share/<start>/<end>/<treeid>/<name>/<collaborator>')
def shareWithUser(start,end,treeid, name, collaborator):
    dbInfo = connect()
    cursor = dbInfo[1]
    cnx = dbInfo[0]

    print("info sent: %s %s %s %s %s", str(start), str(end), str(treeid), str(name), str(collaborator))

    # can also do bt with names
    # query = "SELECT individual_id, first_name,last_name, gender, info, birth, death,family_id, children, parent  FROM individual WHERE family_id = %s AND (individual_id between %s AND %s);"
    query = "SELECT individual_id, first_name,last_name, gender, info, birth, death,family_id, children, parent  FROM individual WHERE FIND_IN_SET(%s, family_ids) AND (individual_id between %s AND %s);"
    data = (str(treeid), str(int(start) - 1), str(int(end) + 1))

    cursor.execute(query, data)

    # print out results of the query
    print("People that would be shared")
    individuals = list(cursor.fetchall())
    print(individuals)
    cursor.close()
    cnx.close()

    # create and return the family tree id that was just made
    createEmptySharedTree(name, collaborator)

    newTree = returnSharedTreeID(name, collaborator)
    print(newTree[0])

    # for each person in the list add another treeID to the treeID column
    addTreeIds(individuals, newTree[0], treeid)
        

    return "200"

def createEmptySharedTree(name, collaborator):
    dbInfo = connect()
    cursor = dbInfo[1]
    cnx = dbInfo[0]

    print("in create tree\n")

    name = "Shared Tree: " + name

    print(name, collaborator)

    # create new family tree for collaborator
    query = 'INSERT INTO family (family_name, family_size, owner_id) VALUES (%s,"0",%s);'
    data = (name, collaborator)
    cursor.execute(query, data)
    cnx.commit()

    
    cursor.close()
    cnx.close()

def addTreeIds(listIndividuals, addTree, ogTree):
    print("add tree ids param")
    i = 0
    for indivs in listIndividuals:
        # call function to edit individuals one by one
        indivEditTrees(listIndividuals[i][0], addTree, ogTree)
        i += 1

def indivEditTrees(id, treeid):
    print(treeid, id)
    dbInfo = connect()
    cursor = dbInfo[1]
    cnx = dbInfo[0]

    query='UPDATE individual SET family_ids = concat(family_ids,%s) WHERE individual_id = %s;'
    data = ((","+ str(treeid)), id,)

    cursor.execute(query, data)
    cnx.commit()
    cursor.close()
    cnx.close()



if __name__ == "__main__":
    app.run(debug=True, port=5000)
