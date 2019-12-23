from flask import Flask, jsonify
from flask_cors import CORS

from .views.python25_service import python25_service

service = Flask('SDK_DEMO_SERVICE')

service.config['APPLICATION_ROOT'] = '/api/python25'

CORS(service, resources={r'/*': {'origins':'*'}})

service.register_blueprint(python25_service)

@service.route('/ping', methods=['GET'])
def ping():
    return jsonify('pong!')
