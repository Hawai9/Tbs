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
import request
from tpc_services.service.IR_sender import sender
from pygame import mixer
from pygame.locals import *
import shelve
import os


STOPEVENT = 1  # 音乐停止事件
show_results = []
is_play = False
noon_state = False
state = False
playing_task = {}
week_id = 0
switch=False

def CreateData(args):

    try:
        db = shelve.open('db', 'c')
        # key与value必须是字符串
        db['switch'] = args

    finally:
        db.close()
    return JsonResponse({"data": '0'})
def task_switch(request):

    global switch
    switch=True if request.POST.get('task_switch') == 'true' else False
    CreateData(switch)
    if switch:
       getDailyData(1)
       res={"code": '0','data':show_results}
    else:
       updateshow_results(1)
       res = {"code":'0' ,'data':show_results}

    return JsonResponse({"data": res})

def go_Play(request):
    return render(request, 'play.html')


def stopTask(request):
    print(show_results)
    global state
    state = False
    return JsonResponse({"code": "0"})


def playState(request):
    return JsonResponse({"is_play": is_play, "sys_open": state, 'playing_task': playing_task})


def stopPlay(request):
    global noon_state
    if noon_state:
        sender.close_echo()
        global is_play
        is_play = 0
        noon_state = False
    else:
        global STOPEVENT
        STOPEVENT = 0
        time.sleep(1)
        STOPEVENT = 1
    return JsonResponse({"code": "0"})

def getTask(request):

    return JsonResponse({"code": "0", "data": show_results})

def listSql(req):
    sql = '''
            SELECT play_task.id as id,name,to_char(time, 'HH24:MI:SS') as time,play_music.mp3 as mp3,state,week,play_task.mp3 as mp3id
        FROM
            play_task,
            play_music 
        WHERE
            play_task.mp3 = play_music.id and week='%s';  
    ''' % (req)
    return sql

def listDailySql():
    sql = '''
          SELECT play_task_daily.id as id,name,to_char(time, 'HH24:MI:SS') as time,play_music.mp3 as mp3,state,play_task_daily.mp3 as mp3id
        FROM
            play_task_daily,
            play_music 
        WHERE
            play_task_daily.mp3 = play_music.id  
    '''
    return sql


def updateshow_results(req):
    today = time.strftime("%w")
    sql_result = listSql(today)
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
        show_result["mp3"] = item[3].split('\\')[-1].strip('.mp3')
        show_result["state"] = item[4]
        show_result["mp3id"] = item[6]
        show_results.append(show_result)
    return JsonResponse({"code": "0"})

def getDailyData(req):

    cur = models_common.get_cur()
    sql_result = listDailySql()
    cur.execute(sql_result)
    results = cur.fetchall()
    global show_results
    show_results = []
    for item in results:
        show_result = {}
        show_result["id"] = item[0]
        show_result["name"] = item[1]
        show_result["time"] = item[2]
        show_result["mp3"] = item[3].split('\\')[-1].strip('.mp3')
        show_result["state"] = item[4]
        show_result["mp3id"] = item[5]
        show_results.append(show_result)
    return JsonResponse({"code": "0"})

def startTask(req):
    '''
    循环判定任务
    :returreqn:
    '''
    global state
    state = True
    updateshow_results(1)

    print('系统已启动')
    try:
        t = threading.Thread(target=doWhile)
        t.start()
        print(threading.enumerate())
    except:
        print("Error: 无法启动线程")

    return JsonResponse({"code": "0"})


def doWhile():
    while state:
        now = datetime.datetime.now().strftime("%H:%M:%S")
        if switch:
            getDailyData(1)
        else:
            updateshow_results(1)
            if now == '00:00:00':
                updateshow_results(1)


        try:
            for i in range(0, len(show_results)):
                print(now, show_results[i]['time'], show_results[i]['state'])
                if now == show_results[i]['time'] and show_results[i]['state'] == 2:
                    mp3name = show_results[i]['mp3'].split('\\')[-1].strip('.mp3')

                    if mp3name == '午间操':
                        global playing_task
                        playing_task = show_results[i]
                        print('开始任务')
                        global is_play
                        is_play = True
                        sender.send_echo()
                        global noon_state
                        noon_state = True
                        time.sleep(60)
                        is_play = False
                        break
                    else:

                        print('开始任务')

                        play(show_results[i])

                        break
        except:
            pass

    print('系统已关闭')


def play(taskobj):
    '''
    当前的目录文件中检索.mp3文件，并初始化任务，加载播放
    :param start:
    :return:
    '''
    global playing_task
    playing_task = taskobj
    file = os.getcwd() + '\static\music' + '\\' + taskobj["mp3"]+'.mp3'
    file = file.encode('utf-8')
    mixer.init()
    pygame.init()
    mixer.music.load(file)  # 加载,支持中文文件名
    mixer.music.play()  # 播放
    global is_play
    is_play = True
    # 当播放完毕后，停止播放
    print('播放中.......')
    while pygame.mixer.music.get_busy() == 1:
        time.sleep(1)  # 1秒监听一次事件
        event = pygame.event.poll()
        if event.type == STOPEVENT:
            pygame.mixer.music.stop()
            break;

    pygame.mixer.music.stop()
    is_play = False
    print('播放完毕')
