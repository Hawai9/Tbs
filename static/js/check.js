app.controller('myCtrl', function ($scope) {
    //配置
    $scope.musers = [];
    $scope.count = 0;
    $scope.p_pernum = 10;
    $scope.isShow = false;
    $scope.s_assy_cd = "";

    //编辑表单元素
    $scope.assy_cd = "";
    $scope.plan_cnt = "";
    $scope.green = "";
    $scope.olive = "";
    $scope.orange = "";
    $scope.sort_num="";
    //变量
    $scope.p_current = 1;
    $scope.p_all_page = 0;
    $scope.pages = [];
    $scope.deleteCd = "";
    $scope.deleteName = "";
    $scope.isEdit = false;

    $scope.load_page = function (pageNum) {

        let parmas={
            'task_switch':localStorage.getItem('switch_state')
        }

        $.ajax({
            url: "task_switch",  //获取
            type: 'POST', //GET、PUT、DELETE
            async: false,    //是否异步
            data:parmas,
            timeout: 10000,    //超时时间
            dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
            beforeSend: function (xhr) {
                // 发送前处理
            },
            success: function (data, textStatus, jqXHR) {
                // 调用成功，解析response中的data到自定义的data中
                if(data.data.code=='0'){
                    $scope.musers = data.data.data;
                for(let i=0;i< $scope.musers.length;i++){
                    switch ( $scope.musers[i]['state']) {
                        case 2:
                            $scope.musers[i]['state']='开启'
                            break;
                        case 1:
                             $scope.musers[i]['state']='暂停'
                            break;
                        default:
                    }
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
    };



    $scope.load_page(1);

});

