var app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope) {
    //配置
    $scope.name = "";
    $scope.password = "";
    $scope.submit = function () {

        if ($scope.name == "") {
            toastr.warning("用户名不能为空");
            return;
        }
        if ($scope.password == "") {
            toastr.warning("密码不能为空");
            return;
        }
        // POST请求
        $.ajax({
            url: "user_Login",
            type: 'POST', //GET、PUT、DELETE
            async: true,    //是否异步
            data: {
                name: $scope.name,
                password: $scope.password
            },
            headers: {"X-CSRFToken": getCookie("csrftoken")},
            timeout: 5000,    //超时时间
            dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
            beforeSend: function (xhr) {
                // 发送前处理
            },
            success: function (data, textStatus, jqXHR) {
                // 调用成功，解析response中的data到自定义的data中
                if (data.code == 0) {
                    localStorage.setItem('task_id', data.data["id"]);
                    localStorage.setItem('task_name', data.data["name"]);
                    localStorage.setItem('task_password', data.data["password"]);
                    localStorage.setItem('task_auth_name',JSON.stringify(data.data['auth_name']));
                    localStorage.setItem('task_auth_path', JSON.stringify(data.data["auth_path"]));
                    localStorage.setItem('switch_state', data.data["switch_state"]);

                    window.location.href = "go_homePage";

                } else {
                    toastr.error(data.msg);
                }

            },
            error: function (xhr, textStatus) {
                // 调用时，发生错误
                toastr.error("请求失败");
            },
            complete: function () {
                // 交互后处理
            }
        })
    }

});



//生成csrftoken
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return decodeURI(arr[2]);
    else
        return null;
}

