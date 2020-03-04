// directive()
app.controller('myCtrl', function ($scope) {
    $scope.flog = ""
    $scope.query = ""
    $scope.task_c_edite = ''
    //配置
    $scope.musers = [];
    $scope.count = 0;
    $scope.p_pernum = 10;
    $scope.isShow = false;
    $scope.s_assy_cd = "";
    $scope.mp3s = []
    $scope.aValue = ""
    //编辑表单元素
    $scope.id = 0
    $scope.name = "";
    $scope.time = "";
    $scope.mp3 = "";
    $scope.state = "";
    $scope.sort_num = "";
    //变量
    $scope.musicfile = ''
    $scope.p_current = 1;
    $scope.p_all_page = 0;
    $scope.pages = [];
    $scope.deleteCd = "";
    $scope.deleteName = "";
    $scope.isEdit = false;
    $scope.switch_state = true
    $scope.alldata = []
    $scope.rowdata = {}
    $scope.mp3id=0
    $scope.load_page = function () {
        let parmas={
            'task_switch':localStorage.getItem('switch_state')
        }
        $.ajax({
            url: "task_switch",  //获取
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
                $scope.musers = data.data.data;
                $scope.alldata = data.data.data;
                console.log(data.data.data, 2)
                for (let i = 0; i < $scope.musers.length; i++) {
                    switch ($scope.musers[i]['state']) {
                        case 1:
                            $scope.musers[i]['state'] = false
                            break;
                        case 2:
                            $scope.musers[i]['state'] = true
                            break;
                        default:
                    }
                }

                $scope.musers['']
                if ($scope.musers.length > 0) {
                    $scope.isShow = true;
                } else {
                    $scope.isShow = false;
                }
                // $scope.stateSwitch();
            },
            error: function (xhr, textStatus) {
                // 调用时，发生错误
                toastr.warning(textStatus);
            },
            complete: function (XMLHttpRequest, textStatus) {
                // 交互后处理
            }

        })
    };
    $scope.load_page();
    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {

        $('.make-switch').bootstrapSwitch();
        $scope.stateSwitch()


    });
    $scope.updateWeek = function () {
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
    $scope.updateDaily = function () {
        $.ajax({
            url: "getDailyData",  //获取
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
    $scope.check_byid = function (arg) {
        let params = {
            "id": arg,
        }
        $.ajax({
            url: "getmp3_byid",  //获取
            type: 'GET', //GET、PUT、DELETE
            async: false,    //是否异步
            timeout: 10000,    //超时时间
            data: params,
            dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
            beforeSend: function (xhr) {
                // 发送前处理
            },
            success: function (data, textStatus, jqXHR) {
                // 调用成功，解析response中的data到自定义的data中
                $scope.musers = data.data;
                console.log($scope.musers)
                for (let i = 0; i < $scope.musers.length; i++) {
                    switch ($scope.musers[i]['state']) {
                        case 1:
                            $scope.musers[i]['state'] = '暂停'
                            break;
                        case 2:
                            $scope.musers[i]['state'] = '开启'
                            break;
                        default:
                    }
                }
                if ($scope.musers.length > 0) {
                    $scope.isShow = true;
                } else {
                    $scope.isShow = false;
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
    $scope.querystate = function () {
        $scope.load_page()
        $scope.musers = []
        if (this.query == "") {
            toastr.error("请选择");
            $scope.musers = $scope.alldata
        }
        if (this.query == 2) {
            $scope.load_page()

        }
        if (this.query == 1) {
            $scope.isShow = false;
            for (let i = 0; i < $scope.alldata.length; i++) {
                if ($scope.alldata[i]['state']) {
                    $scope.musers.push($scope.alldata[i])
                    $scope.isShow = true;
                }
            }
        }
        if (this.query == 3) {
            $scope.isShow = false;
            for (let i = 0; i < $scope.alldata.length; i++) {

                if ($scope.alldata[i]['state'] == false) {
                    $scope.musers.push($scope.alldata[i])
                    $scope.isShow = true;
                }
            }

        }

    }
    $scope.showDelete = function (taskid, taskname) {
        $scope.name = taskname
        $("#del_div").text($scope.name);
        $scope.deleteCd = taskid;

        $('#deleteModel').modal();
    };
    $scope.delete = function () {
        ///删除的API
        let url=''
        if(localStorage.getItem('switch_state')=='true'){
            url='deleteDailyTask'
        }else {
            url='deleteWeekTask'
        }

        let parmas={
            'id':$scope.deleteCd
        }
        console.log(parmas)
        $.ajax({
            url: url, //
            type: "POST", //GET、PUT、DELETE
            async: false,    //是否异步
            timeout: 10000,    //超时时间
            data:parmas,
            dataType: "json",    //返回的数据格式：json/xml/html/script/jsonp/text
            beforeSend: function (xhr) {
                // 发送前处理
            },
            success: function (data, textStatus, jqXHR) {
                // 调用成功，解析response中的data到自定义的data中
                if (data.code == '0') {
                    toastr.success("删除成功");
                     if(url=='deleteDailyTask'){
                        $scope.updateDaily()
                    }else {
                        $scope.updateWeek()
                    }
                    $('#deleteModel').modal('hide');
                    $scope.load_page()
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

    };
    $scope.show = function (arg, taskid, arg2) {

        $scope.id = taskid
        if ($scope.isEdit) {
            $scope.isEdit = false;
        } else {
            $scope.isEdit = true;
            if (arg == 'Add') {
                $scope.handleAdd()
            } else {
                $scope.handleEdite(taskid, arg2)
            }

        }
    };
    $scope.handleAdd = function () {
        $scope.s_show = true
        $("#editTitle").text("新增");
        $scope.flog = '1'
        $scope.name = "";
        $scope.time = "";
        $scope.mp3 = "";
        $scope.state = "";
        $scope.sort_num = "";
        $scope.getmp3()
        $('#editModel').modal();

    };
    $scope.handleEdite = function (taskid, arg2) {
        $scope.s_show = false
        $("#editTitle").text("编辑");
        $scope.flog = '0'
        $scope.rowdata = arg2.item
        $scope.name = arg2.item['name']
        $scope.time = arg2.item['time'];
        $scope.sort_num = "";
        $scope.mp3id=arg2.item['mp3id']
        $scope.getmp3(arg2.item['mp3id'])
        $('#editModel').modal();

    };
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
    $scope.save = function (arg) {

        switch (arg) {
            case '1':
                $scope.saveAdd()
                break;
            case '0':
                $scope.saveEdit()
                break;

        }
    }
    $scope.saveAdd = function () {
        if ($scope.name == "") {
            toastr.warning("name is null");
            return;
        }
        if ($scope.time == "") {
            toastr.warning("time is null");
            return;
        }
        if ($scope.mp3 == "") {
            toastr.warning("mp is null");
            return;
        }

        if ($scope.state == "") {
            toastr.warning("state2 is null");
            return;
        }
        let url=''
        if(localStorage.getItem('switch_state')=='true'){
            url='insertDailyTask'
        }else {
            url='insertWeekTask'
        }
         var dataList = {
            'name': $scope.name,
            'time': $scope.time,
            'mp3': $scope.mp3['id'],
            'state': $scope.state,
            'week':new Date().getDay(),
            'mp3id':$scope.mp3id,
            'sort_num': $scope.musers.length + 1,
        };
        //新增ajax
        $.ajax({
            url: url,  //获取
            type: "POST", //GET、PUT、DELETE
            async: false,    //是否异步
            data: dataList,
            timeout: 10000,    //超时时间
            dataType: "json",    //返回的数据格式：json/xml/html/script/jsonp/text
            beforeSend: function (xhr) {
                // 发送前处理
            },
            success: function (data, textStatus, jqXHR) {
                // 调用成功，解析response中的data到自定义的data中
                if (data.code == 0) {
                    toastr.success("新增成功");
                     if(url=='updateDaily'){
                        $scope.updateDaily()
                    }else {
                        $scope.updateWeek()
                    }
                    $('#editModel').modal('hide');
                    $scope.load_page()
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

    };
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
        let url=''
        if(localStorage.getItem('switch_state')=='true'){
            url='updateDaily'
        }else {
            url='updateWeek'
        }
         let params = {
            "id": $scope.id,
            "name": $scope.name,
            "time": $scope.time,
            "mp3": $scope.mp3['id'],
            "mp3name": $scope.mp3['mp3'],
            'week':new Date().getDay(),
            'mp3id':$scope.mp3id
        };
         $.ajax({
            url: url,  //获取
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
                    $scope.rowdata.mp3 = params.mp3name
                    $scope.rowdata.state = params.state
                    $scope.rowdata.mp3id = params.mp3
                    if(url=='updateDaily'){
                        $scope.updateDaily()
                    }else {
                        $scope.updateWeek()
                    }

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
    $scope.stateSwitch = function () {
        $('.make-switch').on('switchChange.bootstrapSwitch', function (event, state) {
            console.log(event)
            var task_state = 0
            var task_id = event.currentTarget.id
            console.log(state)
            if (state) {
                task_state = 2
            } else {
                task_state = 1

            }
            //内置对象、内置属性
            let url=''
           if(localStorage.getItem('switch_state')=='true'){
              url='updaily_state'
            }else {
              url='change_state'
            }
            var params = {
                "task_id": task_id,
                "state": task_state
            };
            $.ajax({
                url: url,  //获取
                type: 'POST', //GET、PUT、DELETE
                async: false,    //是否异步
                timeout: 10000,    //超时时间
                data: params,
                dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
                beforeSend: function (xhr) {
                    // 发送前处理

                },
                success: function (data, textStatus, jqXHR) {
                    // 调用成功，解析response中的data到自定义的data中

                    console.log(data)
                    if (data.code == 1) {

                        toastr.success(data.msg)
                    } else {
                        toastr.success(data.msg)
                    }
                     if(url=='updaily_state'){
                        $scope.updateDaily()
                    }else {
                        $scope.updateWeek()
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

            //获取状态
            console.log(state);
        });
    };
    // zhi xing
    $(document).ready(function () {


        //点击触发事件，监听按钮状态
        laydate.render({
            elem: '#tasktime',
            type: 'time',
            format: 'HH:mm:ss',
            change: function (value) {
                $scope.time = value;
            }

        });


    })


})

