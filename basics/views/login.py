from django.shortcuts import render
from RtMonSys.models.models_logger import Logger
from django.http import JsonResponse
from RtMonSys.models import models_common
import  json
import shelve
# Create your views here.
def go_Login(request):
    Logger.write_log("登陆页面")
    return render(request, 'login.html')


def findSql():
    sql = '''
          SELECT
              id,
              name,
              password
          FROM
              user_list
      '''
    return sql

def AuthSql(req):
    sql = '''
                    SELECT
                    play_auth.NAME AS NAME,
                    play_auth.PATH AS PATH 
                FROM
                    play_auth,
                    user_auth 
                WHERE
                    user_auth.auth_id = play_auth.ID 
                    AND user_id = '%s';  
                      ''' % (req,)
    return  sql

def LoadData():
    db = shelve.open('db', 'r')
    for item in db.items():
        print (item)
    db.close()
    return item[1]


def user_Login(request):
    Logger.write_log("用户登陆")
    name = str(request.POST.get("name"))
    password = str(request.POST.get("password"))

    where = " WHERE "
    where += " name = '" + name + "'"
    where += " AND password = '" + password + "'"
    sql_num = findSql() + where
    cur = models_common.get_cur()
    cur.execute(sql_num)
    results = cur.fetchall()
    count = len(results)
    show_results = []
    print(results,3)
    for item in results:
        result = {}
        result["id"] = item[0]
        result["name"] = item[1]
        result["password"] = item[2]
        result["switch_state"]=LoadData()
    if count > 0:
        sql_num = AuthSql(result["id"] )
        cur = models_common.get_cur()
        cur.execute(sql_num)
        results = cur.fetchall()
        auth_nameArr=[]
        auth_pathArr=[]
        for i in range(0,len(results)):
            auth_nameArr.append(results[i][0])
            auth_pathArr.append(results[i][1])
        result['auth_name']=auth_nameArr
        result['auth_path']=auth_pathArr
        print(result)
        return JsonResponse({"code": "0", "data": result})
    else:
        return JsonResponse({"code": "1", "msg": "用户名或密码不正确"})
