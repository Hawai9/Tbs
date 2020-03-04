from django.shortcuts import render
from RtMonSys.models.models_logger import Logger
from RtMonSys.models import models_common
from django.http import JsonResponse
import json

cur = models_common.get_cur()


# Create your views here.
def go_User(request):
    Logger.write_log("用户一览")
    return render(request, 'User.html')


def listSql():
    sql = '''
        SELECT
            id,
            name,
            password
    
        FROM
            user_list
    '''
    return sql


def getUsers(request):
    sql_num = listSql()
    cur.execute(sql_num)
    num = cur.fetchall()
    count = len(num)
    sql_result = listSql()
    cur.execute(sql_result)
    results = cur.fetchall()
    show_results = []
    for item in results:
        show_result = {}
        show_result["id"] = item[0]
        show_result["name"] = item[1]
        show_result["password"] = item[2]

        show_results.append(show_result)
    return JsonResponse({"data": show_results})


def editUser(request):
    id = request.POST.get("id")
    name = request.POST.get("name")
    password = request.POST.get("password")
    sql_is = listSql() + " WHERE name ='" + name + "' AND id <> '" + id + "'"
    cur.execute(sql_is)
    results = cur.fetchall()
    if len(results) > 0:
        return JsonResponse({"code": "1", "msg": "用户名已经存在"})
    else:
        sql = "UPDATE user_list SET name =  '%s',password= '%s' WHERE id =  '%s'" % (
            name, password, id)
        cur.execute(sql)
        return JsonResponse({"code": "0"})


def insertUser(request):
    name = str(request.POST.get("name"))
    password = str(request.POST.get("password"))

    sql_is = listSql() + " WHERE name='" + name + "'"
    cur.execute(sql_is)
    results = cur.fetchall()
    if len(results) > 0:
        return JsonResponse({"code": "1", "msg": "用户名已经存在"})
    else:
        sql = '''
                INSERT INTO user_list ( name, password )
                VALUES ( %s,%s)
            '''
        cur.execute(sql, (name, password))
        return JsonResponse({"code": "0"})


def updatePassword(request):
    user_id = str(request.POST.get("user_id"))
    oldpassword = str(request.POST.get("oldpassword"))
    newpassword = str(request.POST.get("newpassword"))
    sql_is = listSql() + " WHERE id='" + user_id + "' AND  password='" + oldpassword + "'"
    cur.execute(sql_is)
    results = cur.fetchall()
    if len(results) == 0:
        return JsonResponse({"code": "1", "msg": "密码不正确"})
    else:
        sql = '''
                UPDATE user_list SET password = %s WHERE id = %s
            '''
        cur.execute(sql, (newpassword, user_id))
        return JsonResponse({"code": "0"})


def deleteUser(request):
    id = request.GET.get("id")
    sql = '''
              DELETE FROM user_list where id= %s
           '''
    cur.execute(sql, (id,))
    return JsonResponse({"code": "0"})


def quruser(request):
    user_name = str(request.GET.get("user_name"))
    sql_is = listSql() + " WHERE  name LIKE '%" + user_name + "%' "
    cur.execute(sql_is)
    results = cur.fetchall()
    show_results = []
    if len(results) == 0:
        return JsonResponse({"code": "1", "msg": "无数据"})
    else:
        for item in results:
            show_result = {}
            show_result["id"] = item[0]
            show_result["name"] = item[1]
            show_result["password"] = item[2]

        show_results.append(show_result)
        return JsonResponse({"code": '0', "data": show_results})


def get_Auth(request):
    user_id = request.POST.get("user_id")
    print(id)
    sql = '''
                SELECT
                user_auth.ID AS ID,
                play_auth.NAME AS NAME,
                play_auth.PATH AS PATH 
            FROM
                play_auth,
                user_auth 
            WHERE
                user_auth.auth_id = play_auth.ID 
                AND user_id = '%s';  
                  ''' % (user_id,)
    cur.execute(sql, (user_id,))
    results = cur.fetchall()
    print(results)
    getAuthArr = []
    for item in results:
        get_Auth_res = {}
        get_Auth_res["id"] = item[0]
        get_Auth_res["name"] = item[1]
        get_Auth_res["path"] = item[2]
        getAuthArr.append(get_Auth_res)
    return JsonResponse({"code": '0','data':getAuthArr})


def setAuth(request):
    user_id = int(request.POST.get("user_id"))
    auth_id = request.POST.get("auth_id")
    auth_id = json.loads(auth_id)
    sql = '''
                  SELECT id FROM user_auth where user_id='%s'
                             '''
    cur.execute(sql, (user_id,))
    results = cur.fetchall()
    if (len(results) > 0):
        cur.execute(' DELETE FROM user_auth where user_id= %s', (user_id,))
    for i in range(0, len(auth_id)):
        sql = '''
                               INSERT INTO user_auth ( user_id, auth_id)
                                VALUES ( %s,%s)
                             '''
        cur.execute(sql, (user_id, auth_id[i]))
    return JsonResponse({"code": '0'})
