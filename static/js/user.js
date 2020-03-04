app.controller('myCtrl', function ($scope) {
    $scope.allassys = [];
    $scope.task_c_user = ""
    $scope.queryuser = ''
    //配置
    $scope.musers = [];
    $scope.count = 0;
    $scope.p_pernum = 10;
    $scope.isShow = false;
    $scope.isHide = true;
    $scope.s_user_name = "";
    $scope.s_true_name = "";
    //编辑表单元素
    $scope.num = "";
    $scope.id = "";
    $scope.name = "";
    $scope.password = "";
    //变量
    $scope.p_current = 1;
    $scope.p_all_page = 0;
    $scope.pages = [];
    $scope.deleteId = "";
    $scope.deleteNum = "";
    $scope.showpas = false
    $scope.rowdata = {}
    $scope.admin_name = ''
    $scope.userid = 0
    $scope.q_user = function () {
        var user_name = $('#quer_yuser').val().trim().split("'").join("")

        if (user_name == "") {
            $scope.load_page()

        } else {
            var params = {
                'user_name': user_name
            }
            $.ajax({
                url: "quruser",  //获取
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
                    if (data.code == '0') {
                        $scope.musers = data.data
                        $scope.count = $scope.musers.length;
                        if ($scope.count > 0) {
                            $scope.isShow = true;

                        } else {
                            $scope.isShow = false;
                        }
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

    }
    $scope.load_page = function () {
        if (localStorage.getItem('task_c_user') == 'true') {
            $scope.task_c_user = true
        } else {
            $scope.task_c_user = false
        }
        $.ajax({
            url: "getUsers",  //获取
            type: 'GET', //GET、PUT、DELETE
            async: false,    //是否异步
            timeout: 10000,    //超时时间
            dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
            beforeSend: function (xhr) {
                // 发送前处理
            },
            success: function (data, textStatus, jqXHR) {
                // 调用成功，解析response中的data到自定义的data中

                $scope.musers = data.data
                console.log($scope.musers)
                $scope.count = $scope.musers.length;
                if ($scope.count > 0) {
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
    };
    $scope.load_page();
    $scope.showDelete = function (id, name) {

        $("#showdelname_div").text(name + "  该用户");
        $scope.deleteId = id;
        $('#deleteModel').modal();
    };
    $scope.delete = function () {
        var id = $scope.deleteId;
        ///删除的API
        $.ajax({

            url: "deleteUser?id=" + id,  //获取
            type: "POST", //GET、PUT、DELETE
            async: false,    //是否异步
            timeout: 10000,    //超时时间
            dataType: "json",    //返回的数据格式：json/xml/html/script/jsonp/text
            beforeSend: function (xhr) {
                // 发送前处理
            },
            success: function (data, textStatus, jqXHR) {
                // 调用成功，解析response中的data到自定义的data中
                if (data.code == 0) {
                    toastr.success("删除成功");
                    $('#deleteModel').modal('hide');
                    $scope.load_page();
                } else {
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
    };
    $scope.showEdit = function (id, name, password, c_edite, c_user, obj) {
        console.log(obj.item)
        $scope.rowdata = obj.item
        $scope.showpas = false
        $("#editTitle").text("编辑用户");
        $scope.id = id;
        $scope.name = name;
        $scope.password = password;
        $('#e_checkbox').bootstrapSwitch('state', c_edite);
        $('#u_checkbox').bootstrapSwitch('state', c_user);
        $('#editModel').modal();

    };
    $scope.showAdd = function () {

        $("#editTitle").text("新增用户");
        $scope.id = "";
        $scope.name = "";
        $scope.password = "";
        $scope.c_edite = true;
        $scope.c_user = true;
        $scope.showpas = true
        $('#e_checkbox').bootstrapSwitch('state', $scope.c_edite);
        $('#u_checkbox').bootstrapSwitch('state', $scope.c_user);
        $('#editModel').modal();
    };
    $scope.saveUser = function () {
        if ($scope.name == "") {
            toastr.warning("用户名不能为空");
            return;
        }
        if ($scope.password == "") {
            toastr.warning("密码不能为空");
            return;
        }

        var dataList = {
            'id': $scope.id,
            'name': $scope.name,
            'password': $scope.password,

        };
        if ($scope.id == "") {  //新增
            //新增ajax
            $.ajax({
                url: "insertUser",  //获取
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
                        $('#editModel').modal('hide');
                        $scope.load_page();
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
        } else {
            //编辑ajax
            $.ajax({

                url: "editUser",  //获取
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
                        toastr.success("编辑成功");
                        $('#editModel').modal('hide');
                        $scope.rowdata.id = dataList.id
                        $scope.rowdata.name = dataList.name
                        $scope.rowdata.password = dataList.password
                        $scope.rowdata.c_edite = dataList.c_edite
                        $scope.rowdata.c_user = dataList.c_user

                    } else {
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
    };
    $scope.clearSelect2Value = function () {
        var selectObj = $("#roleList").select2();
        selectObj.val('').trigger('change');
        selectObj.val('test').trigger('change');
    };
    $scope.saveAdmin = function () {

        let parmas = {
            'id': $scope.userid,
            'admin': $scope.admin
        }
        $.ajax({

            url: "change_admin",  //获取
            type: "POST", //GET、PUT、DELETE
            async: false,    //是否异步
            data: parmas,
            timeout: 10000,    //超时时间
            dataType: "json",    //返回的数据格式：json/xml/html/script/jsonp/text
            beforeSend: function (xhr) {
                // 发送前处理
            },
            success: function (data, textStatus, jqXHR) {
                // 调用成功，解析response中的data到自定义的data中
                if (data.code == 0) {
                    toastr.success("设置成功");
                    $scope.load_page()

                } else {
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
    $scope.checkAuth = function (obj) {
        $scope.admin_name = obj['item']['name']
        $scope.user_id = obj['item']['id']
        let parmas={
            'user_id':$scope.user_id
        }
        $.ajax({

            url: "get_Auth",  //获取
            type: "POST", //GET、PUT、DELETE
            async: false,    //是否异步
            data: parmas,
            timeout: 10000,    //超时时间
            dataType: "json",    //返回的数据格式：json/xml/html/script/jsonp/text
            beforeSend: function (xhr) {
                // 发送前处理
            },
            success: function (data, textStatus, jqXHR) {
                // 调用成功，解析response中的data到自定义的data中
                if (data.code == 0) {
                    console.log(data.data)
                     $scope.setting(data.data)
                    $('#checkAuthModel ').modal()
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
    $scope.setting=function(arg){

          let setting = {
            view: {
                addHoverDom: false,
                removeHoverDom: false,
                selectedMulti: false
            },
            check: {
                enable: false
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            edit: {
                enable: false,
            },


        };

        let zNodes = [
            {id: 1, pId: 0, name: "权限列表", open: true},
            {id: 2, pId: 1, name: "播放首页"},
            {id: 2, pId: 1, name: "任务浏览"},
        ];
        for(let i=0;i<arg.length;i++){
            zNodes.push({id: 2, pId: 1, name:arg[i]['name'] },)
        }

        $.fn.zTree.init($("#checktreeDemo"), setting, zNodes);
    }
    $scope.setAuth = function (obj) {
        $scope.userid = obj['item']['id']
        $scope.admin_name = obj['item']['name']
        $('#setAuthModel').modal()
        var setting = {
            view: {
                addHoverDom: false,
                removeHoverDom: false,
                selectedMulti: false
            },
            check: {
                enable: true
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            edit: {
                enable: false,
            },


        };


        let zNodes = [
            {id: 1, pId: 0, name: "权限列表", open: true},
            {id: 2, pId: 1, name: "任务编辑"},
            {id: 3, pId: 1, name: "周计划"},
            {id: 4, pId: 1, name: "时程浏览"},
            {id: 5, pId: 1, name: "文件管理"},
            {id: 6, pId: 1, name: "用户管理"},
        ];

        $.fn.zTree.init($("#treeDemo"), setting, zNodes);
    }
    $scope.saveAuth = function () {
        var zTreeOjb = $.fn.zTree.getZTreeObj("treeDemo");  //ztree的Id  zTreeId

        var checkedNodes = zTreeOjb.getCheckedNodes(true);
        let checkArr = []
        for (let i = 1; i < checkedNodes.length; i++) {
            checkArr.push(checkedNodes[i]['id'])
        }
        console.log(checkArr)
        let parmas = {
            'user_id': $scope.userid,
            'auth_id': "[" + checkArr + "]"
        }
        $.ajax({

            url: "setAuth",  //获取
            type: "POST", //GET、PUT、DELETE
            async: false,    //是否异步
            data: parmas,
            timeout: 10000,    //超时时间
            dataType: "json",    //返回的数据格式：json/xml/html/script/jsonp/text
            beforeSend: function (xhr) {
                // 发送前处理
            },
            success: function (data, textStatus, jqXHR) {
                // 调用成功，解析response中的data到自定义的data中
                if (data.code == 0) {
                    toastr.success('设置成功')
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


});