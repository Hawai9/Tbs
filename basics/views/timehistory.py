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
res_time=[]
res_min=[]
res_name=[]
show_results=[]
def go_TimeHistory(request):
    return render(request, 'TimeHy.html')


def listSql(req):
    sql = '''
           
        select name,to_char(time, 'HH24:MI:SS') as time,EXTRACT(hour FROM time) hours,EXTRACT(MIN FROM time) mins from play_task WHERE week ='%s' ORDER BY hours ASC
    '''%(req)
    return sql


def listdailySql():
    sql = '''

        select name,to_char(time, 'HH24:MI:SS') as time,EXTRACT(hour FROM time) hours,EXTRACT(MIN FROM time) mins from play_task_daily  ORDER BY hours ASC
    '''
    return sql
def listdataSql():
    sql = '''

                  SELECT
                   id,
                   name ,
                   time,
                   mp3,
                   state
                FROM
                    play_task_daily  
          '''
    return sql
def listdataSqls():
    sql = '''
               SELECT
                  id,
                  name ,
                  time,
                  mp3,
                  state,
                  week
               FROM
                   play_task  
           '''
    return sql

def pointWeekSql(req,reqs):
    sql = '''
               SELECT play_task.id as id,name,to_char(time, 'HH24:MI:SS') as time,play_music.mp3 as mp3,state,week,play_task.mp3 as mp3s
           FROM
               play_task,
               play_music 
           WHERE
               play_task.mp3 = play_music.id and week='%s' and time='%s';  
       ''' % (req,reqs)
    return sql
def pointDailySql(req):
    sql = '''
               SELECT play_task_daily.id as id,name,to_char(time, 'HH24:MI:SS') as time,play_music.mp3 as mp3,state,play_task_daily.mp3 as mp3s
           FROM
               play_task_daily,
               play_music 
           WHERE
               play_task_daily.mp3 = play_music.id and time='%s';  
       ''' % (req)
    return sql

def getTimes(request):
    today = int(time.strftime("%w"))
    sql_result = listSql(today)
    cur = models_common.get_cur()
    cur.execute(sql_result)
    results = cur.fetchall()
    global res_time
    res_time = []
    global res_min
    res_min = []
    global res_name
    res_name = []
    for item in results:
       res_name.append(item[0])
       res_time.append(item[1])
       res_min.append(item[2])
    res={'res_time':res_time,'res_min':res_min,'res_name':res_name}
    return JsonResponse({"code": "0", "data": res})

def getDailyTimes(request):
    sql_result = listdailySql()
    cur = models_common.get_cur()
    cur.execute(sql_result)
    results = cur.fetchall()
    global res_time
    res_time = []
    global res_min
    res_min = []
    global res_name
    res_name = []
    for item in results:
       res_name.append(item[0])
       res_time.append(item[1])
       res_min.append(item[2])
    res={'res_time':res_time,'res_min':res_min,'res_name':res_name}
    return JsonResponse({"code": "0", "data": res})

def pointWeekTask(request):
    pointTime=request.POST.get('time')
    today = int(time.strftime("%w"))
    sql_result = pointWeekSql(today,pointTime)
    cur = models_common.get_cur()
    cur.execute(sql_result)
    results = cur.fetchall()
    global show_results
    show_results = []
    for item in results:
        show_result = {}
        show_result["id"] = item[0]
        show_result["name"] = item[1]
        show_result["time"] = item[2]
        show_result["mp3"] = item[3]
        show_result["state"] = item[4]
        show_result["mp3s"] = item[6]
        show_results.append(show_result)
    return JsonResponse({"code": "0",'data':show_results})


def pointDailyTask(request):
    pointTime=request.POST.get('time')
    sql_result = pointDailySql(pointTime)
    cur = models_common.get_cur()
    cur.execute(sql_result)
    results = cur.fetchall()
    global show_results
    show_results = []
    for item in results:
        show_result = {}
        show_result["id"] = item[0]
        show_result["name"] = item[1]
        show_result["time"] = item[2]
        show_result["mp3"] = item[3]
        show_result["state"] = item[4]
        show_result["mp3s"] = item[5]
        show_results.append(show_result)
    return JsonResponse({"code": "0",'data':show_results})

def uppointWeek(request):
    id = request.POST.get("id")
    name = request.POST.get("name")
    time = request.POST.get("time")
    mp3 = str(request.POST.get("mp3"))
    week = request.POST.get('week')
    state = request.POST.get("state")
    sql_name = listdataSqls() + " WHERE name='" + name + "' and week='" + week + "' "
    sql_time = listdataSqls() + " WHERE time='" + time + "'and week='" + week + "'"
    cur_name = models_common.get_cur()
    cur_time = models_common.get_cur()
    cur_name.execute(sql_name)
    cur_time.execute(sql_time)
    result_name = cur_name.fetchall()
    result_time = cur_time.fetchall()
    if len(result_name) > 0 and result_name[0][0]!=int(id):
        return JsonResponse({"code": "1", "msg": "任务已存在,"})
    if len(result_time) > 0 and result_time[0][0]!=int(id):
        return JsonResponse({"code": "1", "msg": "该时间已存在,请重新选择"})
    else:
        sql = "UPDATE play_task SET name = '%s',time= '%s',mp3= '%s',state='%s' WHERE id =  '%s'" \
              "" % (name, time, mp3, state,id)

        cur_name.execute(sql)
        return JsonResponse({"code": "0"})
def uppointDaily(request):
    id = request.POST.get("id")
    name = request.POST.get("name")
    time = request.POST.get("time")
    mp3 = str(request.POST.get("mp3"))
    state = request.POST.get("state")
    sql_name = listdataSql() + " WHERE name='" + name + "' "
    sql_time = listdataSql() + " WHERE time='" + time + "'"
    cur_name = models_common.get_cur()
    cur_time = models_common.get_cur()
    cur_name.execute(sql_name)
    cur_time.execute(sql_time)
    result_name = cur_name.fetchall()
    result_time = cur_time.fetchall()
    if len(result_name) > 0 and result_name[0][0]!=int(id):
        return JsonResponse({"code": "1", "msg": "任务已存在,"})
    if len(result_time) > 0 and result_time[0][0]!=int(id):
        return JsonResponse({"code": "1", "msg": "该时间已存在,请重新选择"})
    else:
        sql = "UPDATE play_task_daily SET name = '%s',time= '%s',mp3= '%s',state='%s' WHERE id =  '%s'" \
              "" % (name, time, mp3, state,id)

        cur_name.execute(sql)
        return JsonResponse({"code": "0"})