################################################################################
# WikiFamily Capstone 2021-2022
# 
# Family Tree CRUD API
################################################################################
from asyncio.windows_events import NULL
from hashlib import new
import re
from tkinter.messagebox import NO
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

################################################################################
# Description:  Used to help prevent SQL server DB disconnected error. Used to open
#               connection to DB when using specific definitions and closes the
#               connection when it is no longer being used.
# 
# input:        NONE
# 
# return:       tuple -- (connection to DB, cursor)
################################################################################
def connect():
    cnx = mysql.connector.connect(
        host = 'us-cdbr-east-05.cleardb.net',
        user = 'b2f8725312304e',
        password = '0c26bf48',
        database = 'heroku_688d3d7a3cbb111'
    )
    cursor = cnx.cursor()
    return (cnx, cursor)

################################################################################
# Description:  NONE
# 
# input:        NONE
# 
# return:       NONE
################################################################################
@app.route('/api1/create/<id>', methods=['GET', 'DELETE', 'PUT'])
def get_family(id):
    print("get children of the root individual (parent is NULL)")
    # opens DB connection
    dbInfo = connect()
    cursor = dbInfo[1]
    cnx = dbInfo[0]

    # tree traversal algorithm
    # first get the children of a root, in children we see each of childs's id and name
    root_node, children_root, children, new_children, spouses = [], [], [], [], [];

    # check if it is a shared tree
    cursor.execute('SELECT shared_root from family where family_id = %s', (id,))
    shared = cursor.fetchall()

    if (shared[0][0] != None):
        print("shared tree was " + str(shared[0][0]))
        root = '''select individual_id, first_name
                FROM individual
                WHERE FIND_IN_SET(%s, family_ids) AND individual_id = %s;
           '''
        cursor.execute(root,(id,str(shared[0][0]),))

    else:
        root = '''select individual_id, first_name, last_name, birth, death, gender
                FROM individual
                WHERE family_id=%s AND parent is null AND individual_id is not null;
                    '''
        cursor.execute(root,(id,))

    sql_root = '''select c.individual_id, c.first_name, c.last_name, c.birth, c.death, c.gender
                FROM individual p1
                LEFT JOIN individual c ON p1.individual_id = c.parent
                WHERE p1.family_id=%s AND p1.parent is null AND c.individual_id is not null;
           '''
    # cursor.execute(root,(id,))
    root_data = cursor.fetchall()
    row_headers = [x[0] for x in cursor.description]
    for result in root_data:
        root_node.append(dict(zip(row_headers, result)))
    # print("ROOT: ", root_node[0])
    children_root.append(root_node[0])
    # print("Children Root Initial: ", children_root)


    # cursor.execute(sql_root,(id,))
    # datas = cursor.fetchall()
    # for result in datas:
    #     # got the root's children
    #     children_root.append(dict(zip(row_headers, result)))
    # print("children root: ", children_root[1])

    # get the children of root
    for parent in children_root:
        root_id = parent['individual_id']
        fam_id = id
        # print("parent's individual id is: ", root_id)
        cursor.execute('SELECT c.individual_id, c.first_name, c.last_name, c.birth, c.death, c.gender FROM individual p1 LEFT JOIN individual c ON p1.individual_id = c.parent WHERE FIND_IN_SET(%s, p1.family_ids) AND c.individual_id is not null AND p1.individual_id = %s', (fam_id,root_id,))
        datas2 = cursor.fetchall()
        children = []
        for result in datas2:
            children.append(dict(zip(row_headers, result)))
        # print("children array: ", children)
        # new stuff for spouse field
        cursor.execute('SELECT c.individual_id, c.first_name, c.last_name, c.birth, c.death, c.gender FROM individual p1 LEFT JOIN individual c ON p1.individual_id = c.spouse')
        datas4 = cursor.fetchall()
        if datas4:
            spouses = []
            print("DATA4: ", datas4)
            for result in datas4:
                spouses.append(dict(zip(row_headers, result)))
                parent["spouse"] = spouses[0]
                print("I've just added a spouse: ", parent)
        else:
            continue
        # try to add children array into children_root as a nested key
        parent["children"] = children

    # PUT THIS ALL IN A FOR LOOP UNTIL THE END OF THE PATH
    # the end of the path: no children for all of parents
    cursor.execute('''SELECT COUNT(first_name) FROM individual WHERE family_id=%s''',(fam_id,))
    count_fetch = cursor.fetchall()
    substract = len(children) + 1
    # print("count fetch: ", count_fetch[0][0]) #17
    # print("len chil ", len(children)) #1
    count = count_fetch[0][0] - substract
    # print("how many children?", count)
    while count>=0:
    # for each child, look if they have children_root
        # and if so, append to a new children array & then add it as a nested key
        for parent_who_was_child in children:
            parent_id = parent_who_was_child['individual_id']
            #print("parent who was child's id: ", parent_id)
            cursor.execute('SELECT c.individual_id, c.first_name,  c.last_name, c.birth, c.death, c.gender FROM individual p1 LEFT JOIN individual c ON p1.individual_id = c.parent WHERE FIND_IN_SET(%s, p1.family_ids) AND c.individual_id is not null AND p1.individual_id = %s', (fam_id,parent_id,))
            datas3 = cursor.fetchall()
            if datas3:
                new_children = []
                for result in datas3:
                    new_children.append(dict(zip(row_headers, result)))
                    parent_who_was_child["children"] = new_children
                    children = new_children
                    count = count - 1
            else:
                count = count - 1
                continue

            if count==0:
                break
            else:
                continue

    #print("Final spouses: ", spouses)
    print("Final children root: ", children_root)

    return json.dumps(children_root)


################################################################################
# Description:  gets the whole family for the table given a family ID
# 
# input:        id -- family tree ID
# 
# return:       json_data -- list of individuals who exist in the tree, ordered
#                            by parent
################################################################################
@app.route('/api1/create-family/<id>', methods=['GET', 'PUT', 'DELETE'])
def get_whole_family(id):
    # opens DB connection
    dbInfo = connect()
    cursor = dbInfo[1]
    cnx = dbInfo[0]

    # queries for individuals in tree
    cursor.execute("select * from individual where FIND_IN_SET(%s, family_ids) order by parent",(id,))
    row_headers = [x[0] for x in cursor.description]
    data = cursor.fetchall()
    json_data = []

    # stores individuals in list format
    for result in data:
        json_data.append(dict(zip(row_headers, result)))

    return json.dumps(json_data)

################################################################################
# Description:  gets list of trees a user is the creator of given ID
# 
# input:        id -- User id
# 
# return:       json_data -- list of trees user ID is creator of
################################################################################
@app.route('/api1/listTrees/<id>', methods=['GET'])
def getFamilies(id):
    if id != NULL:
        # opens DB connection
        dbInfo = connect()
        cursor = dbInfo[1]
        cnx = dbInfo[0]

        # queries for the trees a user created
        cursor.execute("SELECT * FROM family WHERE owner_id = %s", (id,))

        # puts the created trees in list format
        row_headers = [x[0] for x in cursor.description]
        data = cursor.fetchall()
        json_data = []
        for result in data:
            json_data.append(dict(zip(row_headers, result)))

        print(json_data)

        # closes DB connections
        cursor.close()
        cnx.close()
    return json.dumps(json_data)

################################################################################
# Description:  Given a family tree ID, queries for the family trees name
# 
# input:        id -- tree id
# 
# return:       json_data -- name of the family tree
################################################################################
@app.route('/api1/getTreeName/<id>', methods=['GET'])
def getFamilyName(id):
    # opens DB connection
    dbInfo = connect()
    cursor = dbInfo[1]
    cnx = dbInfo[0]

    # queries for the tree name
    cursor.execute("SELECT family_name FROM family WHERE family_id = %s", (id,))

    row_headers = [x[0] for x in cursor.description]
    data = cursor.fetchall()
    json_data = []
    for result in data:
        json_data.append(dict(zip(row_headers, result)))

    print(json_data)

    # # closes DB connections
    # cursor.close()
    # cnx.close()
    return json.dumps(json_data)

################################################################################
# Description:  Adds a user given information received from a form from frontend.
#               If a person's parent ID is not speceified sets it to 0. 
#               Before adds a person to DB queries for shared_from in family 
#               table from DB to identify the family trees the new person should
#               exist in and sets family_ids to the query result.
# 
# input:        treeId -- current treeID to add user to
# 
# return:       redirects to get_whole_family function
################################################################################
@app.route('/api1/createadd/<treeId>', methods=['GET','POST'])
@cross_origin(supports_credentials=True)
def add_person_w_treeID(treeId):
    # opens DB connection
    dbInfo = connect()
    cursor = dbInfo[1]
    cnx = dbInfo[0]

    msg = ''
    if request.method=='POST':
        # parse for new individuals data
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
            # check if the current tree was shared from another tree
           cursor.execute("select shared_from from family where family_id = %s;", (fid,))
           listIds = list(cursor.fetchall())
           print(listIds)

            #if the current tree is a shared tree concat the treed it should exist in to the curr tree var fid 
            # fid will be in form ["ID,ID,ID"]
           if (listIds != ""):
               print("added new person list of ids is: ")
               print(listIds)
               for id in listIds:
                   print(fid)
                   print(id[0])
                   if(id[0] != None):
                       fid += "," + id[0]

        # insert user to DB
        cursor.execute('''INSERT INTO individual (first_name, last_name, info, gender, birth, death, family_id, parent, family_ids) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)''', (fn, ls, i, g, b, d,fid,p,fid))
        cnx.commit()
        msg = "Successfully added a person!"
    else:
        msg = "Please fill out the form."
    print("Message: ", msg)
    # closes DB connections
    cursor.close()
    cnx.close()
    return redirect(url_for('get_whole_family', id=treeId))

################################################################################
# Description:  If individual ID is not 0 then delete from DB, if 0 then it is 
#               Jane Doe (dummy data) and deletes Jane Doe from that specific tree
# 
# input:        individual_id -- ID to delete from DB
#               treeId        -- current tree ID to delete individual from
# 
# return:       redirects to get_whole_family function
################################################################################
@app.route('/api1/delete/<individual_id>/<treeId>', methods=['DELETE'])
def delete_person_w_treeID(individual_id, treeId):
    # opens DB connection
    dbInfo = connect()
    cursor = dbInfo[1]
    cnx = dbInfo[0]

    msg = ''
    id = individual_id

    # if id == 0 #jane doe. update jane doe to remove curr treeId from family_ids
    print("id is" + str(id))
    if int(id) == 0 or str(id) == "0":
        cursor.execute('SELECT family_ids FROM individual WHERE individual_id = %s', (id,))

        ids = cursor.fetchall()
        print(ids[0][0])

        # first family ID is 0 -- never to be deleted
        # newFamIds = str(ids[0])

        ogIds = []
        temp = ""
        # get new set of family_ids char by char as ids is a string
        for char in ids[0][0]:
            # if "," then temp is a complete family ID string
            if char == ",":
                # if its not the current tree we want to delete from then add it
                # to the final tree list
                if temp != str(treeId):
                    ogIds.append(temp)
                
                # reset temp
                temp = ""

            # otherwise is a number and add it to temp which will eventually 
            # be a full tree ID
            else:
                temp += char

        # list of tree ids Jane Doe exists in, in format ["#","#","#"]
        print(ogIds)

        # loop through list of tree IDs Jane should exist in and put it in 
        # string format "#,#,#"
        for id in ogIds:
            if id == "0":
                print("add first id")
                finalId = str(id)
            else:
                finalId += "," + str(id)

        print("final IDS to insert in jane doe's family_ids " + str(finalId))

        # update Jane does family trees they should exist in
        query='UPDATE individual SET family_ids = %s WHERE individual_id = 0;'
        data = ((str(finalId)),)

        cursor.execute(query, data)
        cnx.commit()
    else:
        # was not jane doe and delete from DB
        cursor.execute('DELETE FROM individual WHERE individual_id = %s', (id,))
        cnx.commit()
        msg = "Successfully deleted person!"
        print(msg)
        print("Person id is %s ", id)

    # closes DB connections
    cursor.close()
    cnx.close()
    return redirect(url_for('get_whole_family', id=treeId))

################################################################################
# Description:  Edits an individual given the individual ID and family tree
# 
# input:        individual_id -- ID of individual to edit
#               treeId -- ID of the current tree
# 
# return:       redirects to get_whole_family function
################################################################################
@app.route('/api1/edit/<individual_id>/<treeId>', methods=['PUT', 'PATCH'])
def edit_person_w_treeID(individual_id, treeId):
    # opens DB connection
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
    p = theform['parent']

    if p != "":
        # if changing parent id
        query = 'UPDATE individual SET first_name=%s, last_name=%s, info=%s, gender=%s, birth=%s, death=%s, parent=%s WHERE individual_id = %s'
        data = (fn, ls, i, g, b, d, p, id,)
        cursor.execute(query, data)
    else:
        # not changing parent id
        query = 'UPDATE individual SET first_name=%s, last_name=%s, info=%s, gender=%s, birth=%s, death=%s WHERE individual_id = %s'
        data = (fn, ls, i, g, b, d, id,)
        cursor.execute(query, data)
    cnx.commit()
    msg = "Successfully updated person!"
    print(msg)
    # closes DB connections
    cursor.close()
    cnx.close()
    # return redirect(url_for('get_whole_family', id=treeId))
    return redirect(url_for('get_whole_family', id=treeId))

################################################################################
# Description:  NONE
# 
# input:        NONE
# 
# return:       NONE
################################################################################
def returnSharedTreeID(name, collaborator):
    # opens DB connection
    dbInfo = connect()
    cursor = dbInfo[1]
    cnx = dbInfo[0]

    print("in retTreeId\n")
    print(name, collaborator)

    cursor.execute("SELECT family_id FROM family WHERE owner_id=%s", (collaborator,))

    newTree = list(cursor.fetchall())

    totTrees = len(newTree)

    print(newTree)
    # closes DB connections
    cursor.close()
    cnx.close()

    return newTree[totTrees-1]

################################################################################
# Description:  NONE
# 
# input:        NONE
# 
# return:       NONE
################################################################################
@app.route('/api1/createTree', methods=['POST'])
def create_empty_tree():
    # opens DB connection
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

    # closes DB connections
    cursor.close()
    cnx.close()

    return "200"

################################################################################
# Description:  NONE
# 
# input:        NONE
# 
# return:       NONE
################################################################################
# when enters the email has already been checked that it exists
@app.route('/api2/share/<startingID>/<treeid>/<name>/<collaborator>', methods=['POST', 'GET'])
@cross_origin(supports_credentials=True)
def shareWithUser(startingID,treeid, name, collaborator):
    print("info sent: individual to share: %s treeid: %s name: %s collaborator: %s", str(startingID), str(treeid), str(name), str(collaborator))

    # replace --^ w/ new share tree
    print("People that would be shared")
    individuals = newTreeShare(startingID, treeid)
    listIndivs = individuals.split(",")
    print(listIndivs)


    # create and return the family tree id that was just made
    createEmptySharedTree(name, collaborator, treeid, startingID)


    newTree = returnSharedTreeID(name, collaborator)
    print(newTree[0])

    # in create tree upate the share root
    # for each person in the list add another treeID to the treeID column
    addTreeIds(listIndivs, newTree[0], treeid)


    return "200"

################################################################################
# Description:  NONE
# 
# input:        NONE
# 
# return:       NONE
################################################################################
def createEmptySharedTree(name, collaborator, ogTreeId, rootID):
    # opens DB connection
    dbInfo = connect()
    cursor = dbInfo[1]
    cnx = dbInfo[0]

    print("in create tree\n")

    name = "Shared Tree: " + name

    print(name, collaborator)

    # create new family tree for collaborator
    query = 'INSERT INTO family (family_name, family_size, owner_id, shared_from, shared_root) VALUES (%s,"0",%s,%s, %s);'
    data = (name, collaborator, ogTreeId, rootID)
    cursor.execute(query, data)
    cnx.commit()


    # closes DB connections
    cursor.close()
    cnx.close()

################################################################################
# Description:  NONE
# 
# input:        NONE
# 
# return:       NONE
################################################################################
def addTreeIds(listIndividuals, addTree, ogTree):
    print("add tree ids param")
    i = 0
    for indivs in listIndividuals:
        # call function to edit individuals one by one
        indivEditTrees(indivs, addTree)
        print(listIndividuals[i][0])
        print(indivs)
        i += 1

################################################################################
# Description:  NONE
# 
# input:        NONE
# 
# return:       NONE
################################################################################
def indivEditTrees(id, treeid):
    print(treeid, id)
    # opens DB connection
    dbInfo = connect()
    cursor = dbInfo[1]
    cnx = dbInfo[0]

    query='UPDATE individual SET family_ids = concat(family_ids,%s) WHERE individual_id = %s;'
    data = ((","+ str(treeid)), id,)

    cursor.execute(query, data)
    cnx.commit()
    # closes DB connections
    cursor.close()
    cnx.close()

################################################################################
# Description:  NONE
# 
# input:        NONE
# 
# return:       NONE
################################################################################
@app.route('/api1/getInfo/<id>', methods=['GET'])
def getUserInfo(id):
    # opens DB connection
    dbInfo = connect()
    cursor = dbInfo[1]
    cnx = dbInfo[0]

    cursor.execute("SELECT first_name, last_name, info, gender, birth, death, parent FROM individual WHERE individual_id = %s", (id,))

    # row_headers = [x[0] for x in cursor.description]
    individuals = list(cursor.fetchall())

    print(individuals)

    # # closes DB connections
    # cursor.close()
    # cnx.close()
    return json.dumps(individuals)

################################################################################
# Description:  NONE
# 
# input:        NONE
# 
# return:       NONE
################################################################################
@app.route('/api1/testShareIndiv/<id>/<treeId>')
def newTreeShare(id, treeId):
    print("(root will be %s)", id)
    # opens DB connection
    dbInfo = connect()
    cursor = dbInfo[1]
    cnx = dbInfo[0]

    mimic = []

    # tree traversal algorithm
    # first get the children of a root, in children we see each of childs's id and name
    root_node, children_root, children, new_children = [], [], [], [];
    # root = '''select individual_id, first_name
    #             FROM individual
    #             WHERE family_id=%s AND parent = %s AND individual_id = %s;
    #        '''

    root = '''select individual_id, first_name
                FROM individual
                WHERE FIND_IN_SET(%s, family_ids) AND individual_id = %s;
           '''



    cursor.execute(root,(treeId,id))
    root_data = cursor.fetchall()

    # mimic.append(id)

    row_headers = [x[0] for x in cursor.description]
    for result in root_data:
        root_node.append(dict(zip(row_headers, result)))
    # children_root.append(root_node[0])
    children_root.append(root_node[0])
    print("root found was ")
    print(root[0])

    # get the children of root
    for parent in children_root:
        root_id = parent['individual_id']
        fam_id = treeId
        cursor.execute('SELECT c.individual_id FROM individual p1 LEFT JOIN individual c ON p1.individual_id = c.parent WHERE FIND_IN_SET(%s, p1.family_ids) AND c.individual_id is not null AND p1.individual_id = %s', (fam_id,root_id,))
        datas2 = cursor.fetchall()

        children = []
        for result in datas2:
            children.append(dict(zip(row_headers, result)))
        print("children array: ", children)
        # try to add children array into children_root as a nested key
        parent["children"] = children


    # PUT THIS ALL IN A FOR LOOP UNTIL THE END OF THE PATH
    # the end of the path: no children for all of parents
    cursor.execute('''SELECT COUNT(individual_id) FROM individual WHERE family_id=%s''',(fam_id,))
    count_fetch = cursor.fetchall()
    substract = len(children) + 1
    count = count_fetch[0][0] - substract
    print("how many children?", count)
    while count>=0:
    # for each child, look if they have children_root
        # and if so, append to a new children array & then add it as a nested key
        for parent_who_was_child in children:
            parent_id = parent_who_was_child['individual_id']
            print("parent who was child's id: ", parent_id)                                                                                                                                                        # WHERE FIND_IN_SET(%s, p.1family_ids) -- og --> p1.family_id=%s
            cursor.execute('SELECT c.individual_id FROM individual p1 LEFT JOIN individual c ON p1.individual_id = c.parent WHERE FIND_IN_SET(%s, p1.family_ids) AND c.individual_id is not null AND p1.individual_id = %s', (fam_id,parent_id,))
            datas3 = cursor.fetchall()

            print("datas3 is")
            print(datas3)

            if datas3:
                new_children = []
                for result in datas3:
                    new_children.append(dict(zip(row_headers, result)))

                    parent_who_was_child["children"] = new_children
                    mimic.append(result)
                    children = new_children
                    count = count - 1
            else:
                count = count - 1
                print("cont")
                continue
            if count==0:
                print("at zero")
                break
            else:
                print("count is alive: ", count)
                continue

    print("DATAS3 outside of the for loop: ", datas3)

    # removes the first name of root, individual_id, {},  [], , , : , ',  , from text
    new0 = str(children_root).replace(root_node[0]['first_name'], "")
    new = str(new0).replace(", 'first_name'", "")
    new2 = str(new).replace("individual_id", "")
    new3 = str(new2).replace("children", "")
    new4 = str(new3).replace("[", "")
    new5 = str(new4).replace("]", "")
    new6 = str(new5).replace("{", "")
    new7 = str(new6).replace("}", "")
    new8 = str(new7).replace("'", "")
    new9 = str(new8).replace(":", "")
    new10 = str(new9).replace(" ", "")

    final = new10.split(",")
    print(final)
    print(len(final))
    print(type(final))

    # ret in string form
    return new10

@app.route('/api1/deleteTree/<id>', methods=['GET', 'POST'])
def getUserInfo(id):
    # opens DB connection
    dbInfo = connect()
    cursor = dbInfo[1]
    cnx = dbInfo[0]

    cursor.execute("SELECT first_name, last_name, info, gender, birth, death, parent FROM individual WHERE individual_id = %s", (id,))

    # row_headers = [x[0] for x in cursor.description]
    individuals = list(cursor.fetchall())

    print(individuals)

    # # closes DB connections
    # cursor.close()
    # cnx.close()
    return json.dumps(individuals)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
