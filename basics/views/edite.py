from django.shortcuts import render
from RtMonSys.models.models_logger import Logger
from RtMonSys.models import models_common
from django.http import JsonResponse
from django.db import transaction
import json
from basics.views.paly import updateshow_results,getDailyData
import time
import os


# Create your views here.
def go_Edite(request):
    Logger.write_log("编辑任务")
    return render(request, 'Edite.html')
def listSql(arg):
    if arg=='play_task':
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
    if arg=='play_music':
        sql = '''
                    SELECT
                       id,
                       mp3 
                    FROM
                        play_music  
                '''
    if arg=='play_task_daily':
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
def insertWeekTask(request):
    name=str(request.POST.get("name"))
    time = request.POST.get("time")
    mp3 = str(request.POST.get("mp3"))
    state = request.POST.get("state")
    week=request.POST.get('week')
    sql_name = listSql('play_task') + " WHERE name='" + name + "' and week='" + week + "' "
    sql_time = listSql('play_task') + " WHERE time='" + time + "'and week='" + week + "'"
    cur_name = models_common.get_cur()
    cur_time = models_common.get_cur()
    cur_name.execute(sql_name)
    cur_time.execute(sql_time)
    result_name = cur_name.fetchall()
    result_time = cur_time.fetchall()

    if len(result_name) > 0:
        return JsonResponse({"code": "1", "msg": "任务已存在,"})
    if len(result_time) > 0:
        return JsonResponse({"code": "1", "msg": "该时间已存在,请重新选择"})
    else:
        sql = '''
                     INSERT INTO play_task ( name, time, mp3,state,week)
                      VALUES ( %s,%s,%s,%s,%s)
                   '''
        cur_name.execute(sql, ( name, time, mp3,state,week))
        return JsonResponse({"code": "0"})

def insertDailyTask(request):
        name = str(request.POST.get("name"))
        time = request.POST.get("time")
        mp3 = str(request.POST.get("mp3"))
        state = request.POST.get("state")
        sql_name = listSql('play_task_daily') + " WHERE name='" + name + "'  "
        sql_time = listSql('play_task_daily') + " WHERE time='" + time + "'"
        cur_name = models_common.get_cur()
        cur_time = models_common.get_cur()
        cur_name.execute(sql_name)
        cur_time.execute(sql_time)
        result_name = cur_name.fetchall()
        result_time = cur_time.fetchall()

        if len(result_name) > 0:
            return JsonResponse({"code": "1", "msg": "任务已存在,"})
        if len(result_time) > 0:
            return JsonResponse({"code": "1", "msg": "该时间已存在,请重新选择"})
        else:
            sql = '''
                         INSERT INTO play_task_daily ( name, time, mp3,state)
                          VALUES ( %s,%s,%s,%s)
                       '''
            cur_name.execute(sql, (name, time, mp3, state))
            return JsonResponse({"code": "0"})

def getmp3_byid(requeset):
    id = str(requeset.GET.get("id"))
    sql_result = listSql('play_music') + " WHERE id='" + id + "'"
    cur = models_common.get_cur()
    cur.execute(sql_result)
    results = cur.fetchall()
    show_results = []
    for item in results:
        show_result = {}
        show_result["id"] = item[0]
        show_result["mp3"] = item[1].split('\\')[-1].strip('.mp3')
        show_results.append(show_result)
    return JsonResponse({"code": 0, "data": show_results})
def getmp3(request):
    where = " WHERE 1=1 "
    sql_result = listSql('play_music') +where
    cur = models_common.get_cur()
    cur.execute(sql_result)
    results = cur.fetchall()
    show_results = []
    for item in results:
        show_result = {}
        show_result["id"] = item[0]
        show_result["mp3"] = item[1].split('\\')[-1].strip('.mp3')
        show_results.append(show_result)
    return JsonResponse({"code":0,"data": show_results})

def deleteWeekTask(request):
    id = request.POST.get("id")
    cur = models_common.get_cur()
    sql = '''
                 DELETE FROM play_task where id= %s
              '''
    cur.execute(sql, (id,))
    return JsonResponse({"code": "0"})

def deleteDailyTask(request):
    id = request.POST.get("id")
    cur = models_common.get_cur()
    sql = '''
                 DELETE FROM play_task_daily where id= %s
              '''
    cur.execute(sql, (id,))
    return JsonResponse({"code": "0"})

def getediteTask(request):
    id = str(request.POST.get("id"))
    sql_is = listSql('play_task') + " WHERE id='" + id + "'"
    cur = models_common.get_cur()
    cur.execute(sql_is)
    results = cur.fetchall()
    show_results = []
    for item in results:
        show_result = {}
        show_result["id"] = item[0]
        show_result["name"] = item[1]
        show_result["time"] = item[2]
        show_result["mp3"] = item[3]
        show_result["state"] = item[4]
        show_results.append(show_result)
    return JsonResponse({"code": 0, "data": show_results})

def change_state(request):
    id=int(request.POST.get("task_id"))
    state=int(request.POST.get("state"))
    cur = models_common.get_cur()
    # with transaction.atomic():
    try:
        sql = "UPDATE play_task SET state= %s WHERE id =  %s" % (state,id)
        cur.execute(sql)
    except Exception as e:
        print(e)
        # print(cur.execute(sql))
    updateshow_results(1)
    if state==2:
      return JsonResponse({"code": "1", "msg": "已开启"})
    else:
        return JsonResponse({"code": "1", "msg": "已暂停"})

def updaily_state(request):
        id = int(request.POST.get("task_id"))
        state = int(request.POST.get("state"))
        cur = models_common.get_cur()
        # with transaction.atomic():
        try:
            sql = "UPDATE play_task_daily SET state= %s WHERE id =  %s" % (state, id)
            cur.execute(sql)
        except Exception as e:
            print(e)
            getDailyData(1)
        if state == 2:
            return JsonResponse({"code": "1", "msg": "已开启"})
        else:
            return JsonResponse({"code": "1", "msg": "已暂停"})

def updateWeek(request):
    id = request.POST.get("id")
    name = request.POST.get("name")
    time = request.POST.get("time")
    mp3 = str(request.POST.get("mp3"))
    week = request.POST.get('week')
    print(id,name)
    sql_name = listSql('play_task') + " WHERE name='" + name + "' and week='" + week + "' "
    sql_time = listSql('play_task') + " WHERE time='" + time + "'and week='" + week + "'"
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
        sql = "UPDATE play_task SET name = '%s',time= '%s',mp3= '%s' WHERE id =  '%s'" \
              "" % (name, time, mp3, id)

        cur_name.execute(sql)
        return JsonResponse({"code": "0"})
def updateDaily(request):
    id = request.POST.get("id")
    name = request.POST.get("name")
    time = request.POST.get("time")
    mp3 = str(request.POST.get("mp3"))
    print(id,name)
    sql_name = listSql('play_task_daily') + " WHERE name='" + name + "' "
    sql_time = listSql('play_task_daily') + " WHERE time='" + time + "'"
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
        sql = "UPDATE play_task_daily SET name = '%s',time= '%s',mp3= '%s' WHERE id =  '%s'" \
              "" % (name, time, mp3, id)

        cur_name.execute(sql)
        return JsonResponse({"code": "0"})

def query(request):

    state = request.GET.get("query")

    sql_is = listSql('play_task') + " WHERE state='" + state + "'"
    cur = models_common.get_cur()
    cur.execute(sql_is)
    results = cur.fetchall()
    show_results = []
    if len(results) < 0:
        return JsonResponse({"code": "1", "msg": "无任务"})
    for item in results:
        show_result = {}
        show_result["id"] = item[0]
        show_result["name"] = item[1]
        show_result["time"] = item[2]
        show_result["mp3"] = item[3]
        show_result["state"] = item[4]
        show_results.append(show_result)
    return JsonResponse({"code": 0, "data": show_results})


def save_file(request):
    music_file = request.FILES.get("music_file",None)
    file_list=os.listdir(os.getcwd()+'\static\music')
    if music_file.name in file_list:
        res={"code": "1",'msg':'该文件已存在,请更换文件'}
        return JsonResponse(res)
    else:
        sql = "INSERT INTO play_music (mp3) VALUES ('%s')" % (music_file.name)
        cur = models_common.get_cur()
        cur.execute(sql)
        dir = os.getcwd() + '\static\music'

        f = open(os.path.join(dir, music_file.name), 'wb+')  # 打开特定的文件进行二进制的写操作
        for chunk in music_file.chunks():  # 分块写入文件
            f.write(chunk)
        res={"code": "0",'msg':'已上传'}

    return JsonResponse(res)
