app.controller('myCtrl', function ($scope) {
    $scope.is_play=false
    $scope.is_show=true
    $scope.is_close=true
    $scope.show_task="2"
    $scope.check_playState = function () {
        $.ajax({
            url: "playState",  //获取
            type: 'POST', //GET、PUT、DELETE
            async: false,    //是否异步
            timeout: 10000,    //超时时间
              headers: {"X-CSRFToken": getCookie("csrftoken")},
            dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
            beforeSend: function (xhr) {
                // 发送前处理
            },
            success: function (data, textStatus, jqXHR) {
                // 调用成功，解析response中的data到自定义的data
                console.log(data.is_play)
                console.log(data.sys_open)
                if (data.is_play) {
                    $scope.is_play = true
                    if( $scope.is_close){
                        document.getElementById('show_task').innerHTML="正在广播：  "+data.playing_task['name']
                        $('#uploadModel').modal();
                    }

                }if(!(data.is_play)){
                     $('#uploadModel').modal('hide');
                     $scope.is_play = false
                }if(data.sys_open){
                    $scope.is_show = false
                    $("#startBtn").hide();
                    $("#stopBtn").show();
                    $("#playBtn").show();

                }else {
                    $scope.is_show = true;
                    $("#startBtn").show();
                    $("#stopBtn").hide();
                    $("#playBtn").hide();
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
    $scope.start_task = function () {
        $scope.is_show=false;
        $.ajax({
            url: "startTask",  //获取
            type: 'POST', //GET、PUT、DELETE
            async: false,    //是否异步
            timeout: 10000,    //超时时间
              headers: {"X-CSRFToken": getCookie("csrftoken")},
            dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
            beforeSend: function (xhr) {
                // 发送前处理
            },
            success: function (data, textStatus, jqXHR) {
                // 调用成功，解析response中的data到自定义的data中
                toastr.success('系统已启动');
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
    $scope.stop_task = function () {
        $scope.is_show=true
        $.ajax({
            url: "stopTask",  //获取
            type: 'POST', //GET、PUT、DELETE
            async: false,    //是否异步
              headers: {"X-CSRFToken": getCookie("csrftoken")},
            timeout: 10000,    //超时时间
            dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
            beforeSend: function (xhr) {
                // 发送前处理
            },
            success: function (data, textStatus, jqXHR) {
                // 调用成功，解析response中的data到自定义的data中
                $scope.stopPlay()
                toastr.success('系统已关闭');

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
    $scope.close_dialog=function(){
          $('#uploadModel').modal('hide');
          $scope.is_close=false
    }
    $scope.stopPlay = function () {

       if(!$scope.is_play){
           toastr.error('无任务广播');
       }else {
           $('#uploadModel').modal('hide');
        $.ajax({
            url: "stopPlay",  //获取
            type: 'POST', //GET、PUT、DELETE
            async: false,    //是否异步
            headers: {"X-CSRFToken": getCookie("csrftoken")},
            timeout: 10000,    //超时时间
            dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
            beforeSend: function (xhr) {
                // 发送前处理
            },
            success: function (data, textStatus, jqXHR) {
                // 调用成功，解析response中的data到自定义的data中
                if (data.code == '0') {
                    $scope.is_play=false
                    toastr.success('播放已暂停');
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
    //生成csrftoken
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return decodeURI(arr[2]);
    else
        return null;
}
  window.onload=function(){

    function setInter(){
        $scope.check_playState()
    }
    setInterval(setInter,1000);}
    $(document).ready(function () {
        $scope.check_playState()
    })
})