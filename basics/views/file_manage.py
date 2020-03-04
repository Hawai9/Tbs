
import datetime
import threading
from django.shortcuts import render
from RtMonSys.models.models_logger import Logger
import time
from threading import Timer
import os
import unittest
from django.shortcuts import render
from RtMonSys.models.models_logger import Logger
from RtMonSys.models import models_common
from django.http import JsonResponse
import json
import _thread
import signal
import pygame
import sys
import json
from tpc_services.service.IR_sender import sender
from pygame import mixer
from pygame.locals import *
show_results=[]
res_file=[]
task={}
def go_File_manage(request):
    return render(request, 'file.html')


def listSql():
    sql = '''

        select id,mp3 from play_music
    '''
    return sql

def getfile(request):

    sql_result = listSql()
    cur = models_common.get_cur()
    cur.execute(sql_result)
    results = cur.fetchall()
    global res_file
    res_file=[]

    for item in results:
        show_result = {}
        show_result['id']=item[0]
        show_result['mp3']=item[1].split('\\')[-1].strip('.mp3')
        res_file.append(show_result)
    return JsonResponse({"code": "0", "data": res_file})

def delfile(request):
    delid= request.POST.get("id")
    name=request.POST.get('name')
    global show_results
    show_results=[]
    sql_result = "select name,mp3 FROM play_task WHERE mp3='%s'" % (delid)
    cur = models_common.get_cur()
    cur.execute(sql_result)
    results = cur.fetchall()
    if len(results) > 0:
        print(results)
        for item in results:
            global task
            task = {}
            task['name'] = item[0]
            task['mp3'] = item[1]
            show_results.append(task)
    else:
        sql_result = " DELETE FROM play_music WHERE id='%s'" % (delid)
        cur = models_common.get_cur()
        cur.execute(sql_result)
        file = os.getcwd() + '\static\music' + '\\' + name+'.mp3'
        print(file)
        os.remove(file)
        pass


    return JsonResponse({"code": "0", "data": show_results})
