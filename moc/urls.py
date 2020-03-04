"""sf URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url

import tpc_services.service.IR_sender.sender
import basics.views.paly
import basics.views.edite
import basics.views.user
import basics.views.check
import basics.views.login
import basics.views.timehistory
import basics.views.file_manage
import basics.views.week_plan
from django.views.generic.base import RedirectView

urlpatterns = [
    # 显示
    url(r'^favicon.ico$',RedirectView.as_view(url=r'../static/img/logo.ico')),
    url(r'^$',  basics.views.login.go_Login),
    url(r'^go_homePage', basics.views.paly.go_Play),
    url(r'^task_switch', basics.views.paly. task_switch),
    url(r'^getTask', basics.views.paly.getTask),


    url(r'^go_Play', basics.views.paly.go_Play),  #
    url(r'^startTask', basics.views.paly.startTask),  #
    url(r'^stopTask', basics.views.paly.stopTask),  #
    url(r'^updateshow_results', basics.views.paly.updateshow_results),  #
    url(r'^getDailyData', basics.views.paly.getDailyData),  #
    url(r'^stopPlay', basics.views.paly.stopPlay),  #
    url(r'^playState', basics.views.paly.playState),  #

    # 查看任务
    url(r'^go_CheckTask', basics.views.check.go_CheckTask),  # 一览画面
    # 编辑任务
    url(r'^go_Edite', basics.views.edite.go_Edite),  # 用户一览画面
    url(r'^insertWeekTask', basics.views.edite.insertWeekTask),  # 获取用户
    url(r'^insertDailyTask', basics.views.edite.insertDailyTask),  # 获取用户
    url(r'^getmp3', basics.views.edite.getmp3),  # 获取用户
    url(r'^deleteWeekTask', basics.views.edite.deleteWeekTask),
    url(r'^deleteDailyTask', basics.views.edite.deleteDailyTask),
    url(r'^getediteTask', basics.views.edite.getediteTask),  #
    url(r'^updateWeek', basics.views.edite.updateWeek),  #
    url(r'^updateDaily', basics.views.edite.updateDaily),  #
    url(r'^query', basics.views.edite.query),  #
    url(r'^getmp3_byid', basics.views.edite.getmp3_byid),  #
    url(r'^save_file', basics.views.edite.save_file),  #
    url(r'^change_state', basics.views.edite.change_state),  #
    url(r'^updaily_state', basics.views.edite.updaily_state),  #

    # 登陆
    url(r'^go_User', basics.views.user.go_User),  # 登陆页面
    url(r'^getUsers', basics.views.user.getUsers),  # 登陆页面
    url(r'^insertUser', basics.views.user.insertUser),  # 登陆页面
    url(r'^deleteUser', basics.views.user.deleteUser),  # 登陆页面
    url(r'^editUser', basics.views.user.editUser),  # 登陆页面
    url(r'^quruser', basics.views.user.quruser),  # 登陆页面
    url(r'^go_Login', basics.views.login.go_Login),  # 登陆页面
    url(r'^user_Login', basics.views.login.user_Login),  # 登陆方法、
    url(r'^updatePassword', basics.views.user.updatePassword),  # 登陆方法
    url(r'^get_Auth', basics.views.user.get_Auth),  # 登陆方法
    url(r'^setAuth', basics.views.user.setAuth),  # 登陆方法

    url(r'^go_TimeHistory', basics.views.timehistory.go_TimeHistory),  # 登陆页面
    url(r'^getTimes', basics.views.timehistory.getTimes),  # 登陆页面
    url(r'^getDailyTimes', basics.views.timehistory.getDailyTimes),  # 登陆页面
    url(r'^pointDailyTask', basics.views.timehistory.pointDailyTask),  # 登陆页面
    url(r'^pointWeekTask', basics.views.timehistory.pointWeekTask),  # 登陆页面
    url(r'^uppointWeek', basics.views.timehistory.uppointWeek),  # 登陆页面
    url(r'^uppointDaily', basics.views.timehistory.uppointDaily),  # 登陆页面

    url(r'^go_File_manage', basics.views.file_manage.go_File_manage),  # 登陆页面
    url(r'^getfile', basics.views.file_manage.getfile),  # 登陆页面
    url(r'^delfile', basics.views.file_manage.delfile),  # 登陆页面

    url(r'^go_Weeks', basics.views.week_plan.go_Weeks),  # 登陆页面
    url(r'^getweekTasks', basics.views.week_plan.getweekTasks),  # 登陆页面
    # url(r'^updateWeekTasks', basics.views.week_plan.updateWeekTasks),  # 登陆页面
    url(r'^AddWeekTask', basics.views.week_plan.AddWeekTask),  # 登陆页面
    url(r'^deleteTask', basics.views.week_plan.deleteTask),  # 登陆页面
    url(r'^Pytime', basics.views.week_plan.pytime),  # 登陆页面

]
