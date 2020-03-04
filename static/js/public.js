var userid = localStorage.getItem("task_id");
var result = [];//chart的数据集
var changeShow = false;
var chartList = [];
var app = angular.module('myApp', []);
app.controller('myHeader', function ($scope, $http) {
    $scope.name = localStorage.getItem("task_name")
    $scope.allassys = [];
    $scope.head_name = "";
    $scope.show_assy = false;
    $scope.user_id = localStorage.getItem("task_id");
    $scope.user_name = localStorage.getItem("task_name");


    $scope.model_name = "";
    $scope.show_menu = false;
    $scope.oldpassword = "";
    $scope.newpassword = "";
    $scope.r_newpassword = "";
    $scope.switch=true
    $scope.load_menu = function () {
        let state=true ? localStorage.getItem('switch_state')=='true':false;
        $('.tasks-switch').bootstrapSwitch('state',state );
        let auth_nameArr = localStorage.getItem("task_auth_name")
        let auth_pathArr = localStorage.getItem("task_auth_path")
        auth_nameArr = eval("(" + auth_nameArr + ")")
        auth_pathArr = eval("(" + auth_pathArr + ")")
        for (let i = 0; i < auth_nameArr.length; i++) {
            var elem_li = document.createElement('li'); // 生成一个 li元素
            var elem_a = document.createElement('a'); // 生成一个 a元素
            elem_a.href = auth_pathArr[i]
            elem_li.id = auth_pathArr[i]
            elem_a.innerHTML = " <i class='fa fa-pencil-square-o'></i><span>" + auth_nameArr[i] + "</span>"
            elem_li.appendChild(elem_a)
            $("#menu")[0].appendChild(elem_li);
        }
    }
    $scope.load_menu()
    $scope.showMenu = function () {
        if (!$scope.show_menu) {
            $("#show_menu").show();
            $scope.show_menu = true;
        } else {
            $("#show_menu").hide();
            $scope.show_menu = false;
        }
        $("#show_assy").hide();

    };
    //注销
    $scope.logout = function () {
        // 清空 LocalSotrge
        localStorage.removeItem('task_id');
        localStorage.removeItem('task_name');
        localStorage.removeItem('task_password');
        window.open('go_Login', '_self')
    };
    //修改密码
    $scope.showPassword = function () {
        $("#show_menu").hide();
        $scope.show_menu = false;
        $('#passwordModel').modal();
        $("#oldpassword").val("");
        $("#newpassword").val("");
        $("#r_newpassword").val("");

    };

    $scope.change_state=function () {
         let state=localStorage.getItem('switch_state');
         let params={
                'task_switch':state
            }
            $.ajax({
                url: "task_switch",  //获取
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
                    console.log(data.data)
                    //
                    if (data.data.code == '0') {
                        toastr.success('切换成功')
                        $('#switchModel').modal('hide')
                        if(data.data.length<=0){
                            toastr.error('暂无任务,请编辑任务')
                        }
                        setTimeout("window.location.reload()",2000);

                    } else {
                        toastr.success('失败')
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

});


//生成csrftoken

$(function () {
    directive()
    $('.tasks-switch').on('switchChange.bootstrapSwitch', function (event, state) {

            localStorage.setItem('switch_state',state);
            $('#switchModel').modal()

        });

    function Init() {
        check_playing()
    }

    var arr = eval("(" + localStorage.getItem('task_auth_name') + ")")
    if (arr.indexOf('时程浏览') > -1) {

        setInterval(Init, 1000);
    }


    var strUrl = window.location.href;   //判断有没有登陆
    var arrUrl = strUrl.split("/");
    var strPage = arrUrl[arrUrl.length - 1];  //url
    if (strPage != "login.html") {
        if (localStorage.getItem("task_id") == null) {
            window.open('go_Login', '_self'); //没找到apptoken就返回登陆界面
        }

    }
    $("#" + strPage).addClass("active");


});

function check_playing() {
    $.ajax({
        url: "playState",  //获取
        type: 'POST', //GET、PUT、DELETE
        async: false,    //是否异步
        timeout: 10000,    //超时时间
        dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
        beforeSend: function (xhr) {
            // 发送前处理
        },
        success: function (data, textStatus, jqXHR) {
            // 调用成功，解析response中的data到自定义的data
            if (data.is_play) {

                if ($("#go_TimeHistory")[0].style.backgroundColor == 'red') {
                    $("#go_TimeHistory")[0].style.backgroundColor = 'green'
                } else {
                    $("#go_TimeHistory")[0].style.backgroundColor = 'red'
                }

            } else {
                $("#go_TimeHistory")[0].style.backgroundColor = '#333333'
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

function savePassword() {
    if (!$("#oldpassword").val() || $("#oldpassword").val() == "") {
        toastr.warning("原密码不能为空");
        return;
    }
    if (!$("#newpassword").val() || $("#newpassword").val() == "") {
        toastr.warning("新密码不能为空");
        return;
    }
    if (!$("#r_newpassword").val() || $("#r_newpassword").val() == "") {
        toastr.warning("请再次输入新密码");
        return;
    }
    if ($("#newpassword").val() != $("#r_newpassword").val()) {
        toastr.warning("新密码两次不一致");
        return;
    }
    if ($("#oldpassword").val() == $("#newpassword").val()) {
        toastr.warning("新密码不能与旧密码一致");
        return;
    }
    $.ajax({
        url: "updatePassword",
        type: 'POST', //GET、PUT、DELETE
        async: false,    //是否异步
        timeout: 10000,    //超时时间
        data: {
            "user_id": userid,
            "oldpassword": $("#oldpassword").val(),
            "newpassword": $("#newpassword").val(),
        },
        dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
        beforeSend: function (xhr) {
            // 发送前处理
        },
        success: function (data, textStatus, jqXHR) {
            if (data.code == "0") {
                toastr.success("修改成功");
                $('#passwordModel').modal('hide');
                window.open('go_Login', '_self'); //没找到apptoken就返回登陆界面
            } else {
                toastr.error(data.msg);
            }
        },
        error: function (xhr, textStatus) {
            // 调用时，发生错误
            toastr.warning(textStatus);
        },
        complete: function () {
            // 交互后处理
        }
    })
}

function directive() {
    app.directive('onFinishRender', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit('ngRepeatFinished');
                        // scope.isSelectShow = false;
                    });
                }
            }
        }
    });

}








