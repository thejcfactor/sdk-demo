from flask import Blueprint, jsonify, request, Response
import os
import json

from repository.sdk_demo_repository import SdkDemoRepository

python25_service = Blueprint('python25_api', __name__, url_prefix='/api/python25')

repository = SdkDemoRepository()
response = {
    'message': None,
    'data': None
}

default_host = os.environ.get('CB_HOST')

@python25_service.route('/ping', methods=['GET'])
def ping():
    return jsonify('Python v2.5 SDK service:  pong!')


@python25_service.route('/connect', methods=['POST'])
def connect():
    request_args = request.get_json()

    if 'host' not in request_args or 'bucket' not in request_args\
      or 'username' not in request_args or 'password' not in request_args:

        response['message'] = 'No configuration info found.'
        return jsonify(response), 500

    is_parent_host_mac = isParentHostMac()
    host = request_args['host']

    if is_parent_host_mac and (host.lower() == 'localhost' or host == '127.0.0.1'):
        print('Parent is MacOS, cannot use localhost w/in Docker')
        host = default_host
    
    bucket = request_args['bucket']
    username = request_args['username']
    password = request_args['password']

    try:
        connected = repository.connect(host, bucket, username, password)
        if connected:
            ids = repository.get_sample_doc_ids()
            response['message'] = 'connected to {0}'.format(bucket)
            response['data'] = ids
            return jsonify(response)
        else:
            response['message'] = 'Unabled to connect to bucket {0}.'.format(bucket)
            return jsonify(response), 500
    except Exception as error:
        response['message'] = 'Error trying to connect to bucket {0}.'.format(bucket)
        response['data'] = str(error)
        return jsonify(response), 500

@python25_service.route('/n1qlQuery', methods=['POST'])
def n1qlQuery():
    request_args = request.get_json()

    if 'query' not in request_args:
        response['message'] = 'No query provided.'
        return jsonify(response), 500

    query = request_args['query']

    try:
        results = repository.n1qlQuery(query)
        response['message'] = 'Executed N1QL query.'
        response['data'] = results
        return jsonify(response)
    except Exception as error:
        response['message'] = 'Error trying to run N1QL query.'
        response['data'] = str(error)
        return jsonify(response), 500

@python25_service.route('/get', methods=['POST'])
def get():
    request_args = request.get_json()

    if 'docId' not in request_args:
        response['message'] = 'No docId provided.'
        return jsonify(response), 500

    docId = request_args['docId']

    try:
        results = repository.get(docId)
        response['message'] = 'Executed get() KV operation.'
        response['data'] = results
        return jsonify(response)
    except Exception as error:
        response['message'] = 'Error trying to run get() KV operation.'
        response['data'] = str(error)
        return jsonify(response), 500

@python25_service.route('/getMulti', methods=['POST'])
def getMulti():
    request_args = request.get_json()

    if 'docIds' not in request_args:
        response['message'] = 'No docId(s) provided.'
        return jsonify(response), 500

    docIds = request_args['docIds']

    try:
        results = repository.getMulti(docIds)
        response['message'] = 'Executed getMulti() KV operation.'
        response['data'] = results
        return jsonify(response)
    except Exception as error:
        response['message'] = 'Error trying to run getMulti() KV operation.'
        response['data'] = str(error)
        return jsonify(response), 500

@python25_service.route('/upsert', methods=['POST'])
def upsert():
    request_args = request.get_json()

    if 'docId' not in request_args or 'doc' not in request_args:
        response['message'] = 'No docId or document provided.'
        return jsonify(response), 500

    try:
        docId = request_args['docId']
        docValue = json.loads(request_args['doc'])

        results = repository.upsert(docId, docValue)
        response['message'] = 'Executed upsert() KV operation.'
        response['data'] = results
        return jsonify(response)
    except Exception as error:
        response['message'] = 'Error trying to run upsert() KV operation.'
        response['data'] = str(error)
        return jsonify(response), 500

@python25_service.route('/insert', methods=['POST'])
def insert():
    request_args = request.get_json()

    if 'docId' not in request_args or 'doc' not in request_args:
        response['message'] = 'No docId or document provided.'
        return jsonify(response), 500

    try:
        docId = request_args['docId']
        docValue = json.loads(request_args['doc'])

        results = repository.insert(docId, docValue)
        response['message'] = 'Executed insert() KV operation.'
        response['data'] = results
        return jsonify(response)
    except Exception as error:
        response['message'] = 'Error trying to run insert() KV operation.'
        response['data'] = str(error)
        return jsonify(response), 500

@python25_service.route('/replace', methods=['POST'])
def replace():
    request_args = request.get_json()

    if 'docId' not in request_args or 'doc' not in request_args:
        response['message'] = 'No docId or document provided.'
        return jsonify(response), 500

    try:
        docId = request_args['docId']
        docValue = json.loads(request_args['doc'])

        results = repository.replace(docId, docValue)
        response['message'] = 'Executed replace() KV operation.'
        response['data'] = results
        return jsonify(response)
    except Exception as error:
        response['message'] = 'Error trying to run replace() KV operation.'
        response['data'] = str(error)
        return jsonify(response), 500

@python25_service.route('/remove', methods=['POST'])
def remove():
    request_args = request.get_json()

    if 'docId' not in request_args:
        response['message'] = 'No docId provided.'
        return jsonify(response), 500

    docId = request_args['docId']

    try:
        results = repository.remove(docId)
        response['message'] = 'Executed remove() KV operation.'
        response['data'] = results
        return jsonify(response)
    except Exception as error:
        response['message'] = 'Error trying to run remove() KV operation.'
        response['data'] = str(error)
        return jsonify(response), 500

@python25_service.route('/lookupIn', methods=['POST'])
def lookupIn():
    request_args = request.get_json()

    if 'docId' not in request_args or 'path' not in request_args:
        response['message'] = 'No docId or sub-document path provided.'
        return jsonify(response), 500

    docId = request_args['docId']
    path = request_args['path']

    try:
        results = repository.lookupIn(docId, path)
        response['message'] = 'Executed lookupIn() KV operation.'
        response['data'] = results
        return jsonify(response)
    except Exception as error:
        response['message'] = 'Error trying to run lookupIn() KV operation.'
        response['data'] = str(error)
        return jsonify(response), 500

def isParentHostMac():
    env_var = os.environ.get('OS_PARENT_MAC')

    if not env_var:
        return False

    parent_is_mac = env_var.lower() == 'true'

    return parent_is_mac



