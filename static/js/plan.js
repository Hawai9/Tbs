
app.controller('myCtrl', function ($scope) {
    //配置

    $scope.musers = []
    $scope.s_show = false
    $scope.mp3s = []
    $scope.mp3 = ''
    $scope.rowdata = {}
    $scope.isShow = false;
    $scope.weeks=0
    $scope.id = 0
    $scope.name = "";
    $scope.time = "";
    $scope.mp3 = "";
    $scope.state = "";
    $scope.week_id=0
    $scope.w_name = ""
    $scope.w_time = ""
    $scope.w_state = ""
    $scope.w_mp3 = ""

    $scope.pytime=function(){
        $.ajax({
            url: "Pytime",  //获取
            type: 'POST', //GET、PUT、DELETE
            async: false,    //是否异步
            timeout: 10000,    //超时时间
            dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
            beforeSend: function (xhr) {
                // 发送前处理
            },
            success: function (data, textStatus, jqXHR) {
                // 调用成功，解析response中的data到自定义的data中
                if(data.code=='0'){
                     $scope.weeks=data.data;
                }




            },
            error: function (xhr, textStatus) {
                // 调用时，发生错误
                toastr.warning(textStatus);
            },
            complete: function (XMLHttpRequest, textStatus) {
                // 交互后处理
            }
        })
    }
    $scope.getWeekTask = function (int) {
        $scope.week_id=int
        let parmas = {
            'week': int
        }
        $.ajax({
            url: "getweekTasks",  //获取
            type: 'POST', //GET、PUT、DELETE
            async: false,    //是否异步
            timeout: 10000,    //超时时间
            data: parmas,
            dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
            beforeSend: function (xhr) {
                // 发送前处理
            },
            success: function (data, textStatus, jqXHR) {
                // 调用成功，解析response中的data到自定义的data中
                toastr.success('ok');
                dom='#'+int
                $(dom).tab('show');
                if(data.data.length<=0){
                       $scope.isShow = false;
                }else {
                     $scope.isShow = true;
                     $scope.musers = data.data
                for (let i = 0; i < $scope.musers.length; i++) {
                    switch ($scope.musers[i]['state']) {
                        case 2:
                            $scope.musers[i]['state'] = '开启'
                            break;
                        case 1:
                            $scope.musers[i]['state'] = '暂停'
                            break;
                        default:
                    }
                }
                }



            },
            error: function (xhr, textStatus) {
                // 调用时，发生错误
                toastr.warning(textStatus);
            },
            complete: function (XMLHttpRequest, textStatus) {
                // 交互后处理
            }
        })
    }
    $scope.pytime()
    $scope.getWeekTask($scope.weeks)
    $scope.handleEdite = function (obj) {
        console.log(obj,3)
        $scope.mp3 = ''
        $scope.rowdata = obj.item
        $scope.s_show = false
        $("#editTitle").text("编辑");
        $scope.id = obj['item']['id']
        $scope.name = obj['item']['name']
        $scope.time = obj['item']['time']
        $scope.state = obj['item']['state']=="开启"?2:1;
        $scope.sort_num = "";
        $scope.getmp3(obj['item']['mp3s'])
        $('#editModel').modal();


    };
    $scope.Delete=function(obj){
        console.log(obj.$index)
        let parmas={
            'del_id':obj['item']['id']
        }
        $.ajax({
            url:'deleteTask',
            type:'POST',
            async:false,
            timeout:10000,
            data:parmas,
            dataType:'json',
            beforeSend:function (xhr) {

            },
            success:function (data,textStatus,jqXHR) {
              if(data.code=='0'){
                  $scope.musers.splice(obj.$index,1)
                  toastr.success(data.msg)
                  $scope.updatetask()
                  if(  $scope.musers.length<=0){
                      $scope.isShow=false
                  }
              }
            }
        })

    }
    $scope.getmp3 = function (mp3) {

        $.ajax({
            url: "getmp3",  //获取
            type: "GET", //GET、PUT、DELETE
            async: false,    //是否异步
            timeout: 10000,    //超时时间
            dataType: "json",    //返回的数据格式：json/xml/html/script/jsonp/text
            beforeSend: function (xhr) {
                // 发送前处理
            },
            success: function (data, textStatus, jqXHR) {
                // 调用成功，解析response中的data到自定义的data中
                if (data.code == 0) {
                    $scope.mp3s = data.data;
                    for (var i = 0; i < data.data.length; i++) {
                        if (mp3 == data.data[i]['id']) {

                            $scope.mp3 = data.data[i];
                            break;
                        }
                    }
                    // $scope.selectedVal = data.data[0];

                }

            },
            error: function (xhr, textStatus) {
                // 调用时，发生错误
                toastr.info(textStatus);
            },
            complete: function () {
                // 交互后处理
            }
        })
    }
    $scope.saveEdit = function () {

        if (!$scope.name) {
            toastr.warning("name is null");
            return;
        }
        if (!$scope.time) {
            toastr.warning("time is null");
            return;
        }
        if (!$scope.mp3) {
            toastr.warning("mp3 is null");
            return;
        }
        if (!$scope.state) {
            toastr.warning("state is null");
            return;
        }
        var params = {
            "id": $scope.id,
            "name": $scope.name,
            "time": $scope.time,
            "mp3": $scope.mp3['id'],
            "mp3name": $scope.mp3['mp3'],
            "state": $scope.state,
            'mp3s':$scope.mp3s,
            'week':$scope.week_id
        };

        //编辑ajax
        $.ajax({
            url: "updateWeek",  //获取
            type: "POST", //GET、PUT、DELETE
            async: false,    //是否异步
            data: params,
            timeout: 10000,    //超时时间
            dataType: "json",    //返回的数据格式：json/xml/html/script/jsonp/text
            beforeSend: function (xhr) {
                // 发送前处理
            },
            success: function (data, textStatus, jqXHR) {
                // 调用成功，解析response中的data到自定义的data中
                if (data.code == 0) {
                    toastr.success("编辑成功");

                    $('#editModel').modal('hide');
                    $scope.rowdata.id = params.id
                    $scope.rowdata.name = params.name
                    $scope.rowdata.time = params.time
                    $scope.rowdata.mp3s = params.mp3
                    $scope.rowdata.mp3 = params.mp3name
                    $scope.rowdata.state = params.state==2?'开启':'暂停'
                    $scope.updatetask()
                } else {
                    toastr.error(data.msg);
                }
            },
            error: function (xhr, textStatus) {
                // 调用时，发生错误
                toastr.info(textStatus);
            },
            complete: function () {
                // 交互后处理
            }
        })
    }
    $scope.updatetask = function () {
        $.ajax({
            url: "updateshow_results",  //获取
            type: 'POST', //GET、PUT、DELETE
            async: false,    //是否异步
            timeout: 10000,    //超时时间
            dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
            beforeSend: function (xhr) {
                // 发送前处理
            },
            success: function (data, textStatus, jqXHR) {
                // 调用成功，解析response中的data到自定义的data中
            },
            error: function (xhr, textStatus) {
                // 调用时，发生错误

            },
            complete: function (XMLHttpRequest, textStatus) {
                // 交互后处理
            }
        })
    }
    $scope.show_addweekTask = function (arg) {
        $scope.week_id=arg
        $scope.getmp3()
        $scope.w_name = ""
        $scope.w_time = ""
        $scope.w_state = ""
        $scope.w_mp3 = ""
    }
    $scope.addweekTask = function (obj) {
         if (!obj['w_name']) {
            toastr.warning("任务名不能为空");
            return;
        }
        if (!obj['w_time']) {
            toastr.warning("请选择时间");
            return;
        }
        if (!obj['w_state']) {
            toastr.warning("请选择状态");
            return;
        }
        if (!obj['w_mp3']) {
            toastr.warning("请选择广播文件");
            return;
        }
        let parmas = {
            'week_id':$scope.week_id,
            'w_name': obj['w_name'],
            'w_time': obj['w_time'],
            'w_state': obj['w_state'],
            'w_mp3': obj['w_mp3']['id']
        }
        $.ajax({
            url: "AddWeekTask",  //获取
            type: "POST", //GET、PUT、DELETE
            async: false,    //是否异步
            timeout: 10000,    //超时时间
            data: parmas,
            dataType: "json",    //返回的数据格式：json/xml/html/script/jsonp/text
            beforeSend: function (xhr) {
                // 发送前处理
            },
            success: function (data, textStatus, jqXHR) {
                // 调用成功，解析response中的data到自定义的data中
                if (data.code == 0) {
                    toastr.success(data.msg)
                    $('#rev_Model').modal()
                    $scope.updatetask()
                }else {
                    toastr.error(data.msg)
                }

            },
            error: function (xhr, textStatus) {
                // 调用时，发生错误
                toastr.info(textStatus);
            },
            complete: function () {
                // 交互后处理
            }
        })

    }
    $scope.rev_add=function(){
        $('#rev_Model').modal('hide')
        $scope.w_name = ""
        $scope.w_time = ""
        $scope.w_state = ""
        $scope.w_mp3 = ""
    }
    $scope.close=function(){
         dom='#'+$scope.week_id
         $(dom).tab('show');
      $scope.getWeekTask($scope.week_id)

    }
    $(document).ready(function () {

        //点击触发事件，监听按钮状态


        laydate.render({
            elem: '#tasktime',
            
            type: 'time',
            format: 'HH:mm:ss',
            change: function (value) {
                $scope.w_time = value;
            }

        });
        laydate.render({
            elem: '#tasktimes',
            type: 'time',
            format: 'HH:mm:ss',
            change: function (value) {
                $scope.time = value;
            }

        });


    })
});
