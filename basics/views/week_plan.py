from django.shortcuts import render
from RtMonSys.models.models_logger import Logger
from RtMonSys.models import models_common
from django.http import JsonResponse
from django.db import transaction
import json
from basics.views.paly import updateshow_results
import time
import os


# Create your views here.
def go_Weeks(request):
    Logger.write_log("编辑任务")
    return render(request, 'plan.html')


def listSql(req):
    sql = '''
            SELECT play_task.id as id,name,time,play_music.mp3 as mp3,play_task.mp3 as mp3s,state,week
        FROM
            play_task,
            play_music 
        WHERE
            play_task.mp3 = play_music.id and week='%s';  
    ''' % (req)

    return sql


def addSql(req, req1):
    sql = '''
            SELECT name 
        FROM
            play_task
        WHERE
            week='%s' and name='%s';  
    ''' % (req, req1)

    return sql

def addSqls(req, req1):
    sql = '''
            SELECT to_char(time, 'HH24:MI:SS') as time
        FROM
            play_task
        WHERE
            week='%s' and time='%s';  
    ''' % (req, req1)

    return sql

def delSql(req):
    sql = '''
            
       DELETE  FROM play_task WHERE id ='%s'
    ''' % (req)

    return sql


def getweekTasks(request):
    week = request.POST.get('week')
    sql_result = listSql(week)
    cur = models_common.get_cur()
    cur.execute(sql_result)
    results = cur.fetchall()
    show_results = []
    for item in results:
        show_result = {}
        show_result["id"] = item[0]
        show_result["name"] = item[1]
        show_result["time"] = item[2]
        show_result["mp3"] = item[3].split('\\')[-1].strip('.mp3')
        show_result["mp3s"] = item[4]
        show_result["state"] = item[5]

        show_results.append(show_result)
    print(time.strftime("%w"))
    return JsonResponse({"code": "0", "data": show_results})
# def updateWeekTasks(request):
def pytime(request):
    day=time.strftime("%w")
    return JsonResponse({'code':'0','data':day})

def AddWeekTask(request):
    week_id = int(request.POST.get('week_id'))
    w_name = str(request.POST.get('w_name'))
    w_time = request.POST.get('w_time')
    print(w_name)
    w_state = int(request.POST.get('w_state'))
    w_mp3 = int(request.POST.get('w_mp3'))
    sql_name = addSql(week_id, w_name)
    sql_time = addSqls(week_id, w_time)
    cur_name = models_common.get_cur()
    cur_time = models_common.get_cur()
    cur_time.execute(sql_time)
    cur_name.execute(sql_name)
    results_name = cur_name.fetchall()
    results_time = cur_time.fetchall()
    if len(results_name) > 0:
        return JsonResponse({"code": "1", "msg": "任务已存在,"})
    if len(results_time) > 0:
        return JsonResponse({"code": "1", "msg": "该时间已存在,请重新选择"})
    else:
        sql = '''
                     INSERT INTO play_task ( name, time, mp3,state,week)
                      VALUES ( %s,%s,%s,%s,%s)
                   '''
        cur_name.execute(sql, ( w_name, w_time, w_mp3,w_state,week_id))
        return JsonResponse({"code": "0","msg": "添加成功"})



def deleteTask(request):
    del_id = int(request.POST.get('del_id'))
    sql = delSql(del_id)
    cur = models_common.get_cur()
    cur.execute(sql)
    res = {"code": "0", 'msg': '删除成功'}
    return JsonResponse(res)