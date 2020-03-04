from django.shortcuts import render
from RtMonSys.models.models_logger import Logger
from RtMonSys.models import models_common
from django.http import JsonResponse
import json
import time
import datetime

# Create your views here.
def go_CheckTask(request):
    Logger.write_log("任务一览")
    return render(request, 'Check.html')


