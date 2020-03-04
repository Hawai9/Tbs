# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import json
import datetime
from django.db import connections
import os

def get_config(key):
    # 加载配置文件
    file_path = os.getcwd() + '/config/config.json'
    fp = open(file_path)
    json_data = json.load(fp)
    return json_data[key]

def databaseException(exp):
    if 'could not connect to server' in str(exp):
        # return {'status': "fail", 'msg': 'Connect to database failed[101]'}
        return 101
    else:
        # return {'status': "fail", 'msg': 'Operate to database failed[102]'}
        return 102

def get_cur():
    database = get_config("database")
    model_name = database[0]['MODEL']
    cur = connections[model_name].cursor()
    return cur
