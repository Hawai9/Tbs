app.controller('myCtrl', function ($scope) {
    $scope.isShow = false;
    $scope.alldata=[];
    $scope.musers =[]
    $scope.Checklist=[]
    $scope.error=[]
    $scope.deleteid=''
    $scope.deletename=''
    $scope.load_page = function () {

        $.ajax({
            url: "getfile",  //获取
            type: 'POST', //GET、PUT、DELETE
            async: false,    //是否异步
            timeout: 10000,    //超时时间
            dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
            beforeSend: function (xhr) {
                // 发送前处理
            },
            success: function (data, textStatus, jqXHR) {
                // 调用成功，解析response中的data到自定义的data中
                $scope.musers = data.data;
                $scope.alldata = data.data;


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
    $scope.load_page()
    $scope.uploadmusic = function () {
        $('#uploadModel').modal();
        $('#uploadfile').val("");
        $scope.musicfile = ''
    }
    $("#uploadfile").change(function () {
        $scope.musicfile = document.getElementById("uploadfile").files[0];
    });
    $scope.savefile = function () {
        if ($scope.musicfile != '') {
            var index = $scope.musicfile.name.lastIndexOf(".");
            var ext = $scope.musicfile.name.substr(index + 1);
            if (ext == "mp3") {
                var formData = new FormData();
                formData.append("music_file", $scope.musicfile);
                $.ajax({
                    url: "save_file",  //获取
                    type: 'POST', //GET、PUT、DELETE
                    async: false,    //是否异步
                    timeout: 10000,    //超时时间
                    data: formData,
                    processData: false,
                    contentType: false,
                    dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
                    beforeSend: function (xhr) {
                        // 发送前处理
                    },
                    success: function (data, textStatus, jqXHR) {
                        // 调用成功，解析response中的data到自定义的data中
                        if (data.code == '0') {
                            $('#uploadModel').modal('hide');
                            toastr.success(data.msg);
                            $scope.load_page()
                        }else {
                             toastr.error(data.msg);
                        }

                    },
                    error: function (xhr, textStatus) {
                        // 调用时，发生错误

                    },
                    complete: function (XMLHttpRequest, textStatus) {
                        // 交互后处理
                    }
                })
            } else {
                toastr.error("必须是MP3文件！");
            }

        } else {
            toastr.error("请选择！");
        }

    }

    $scope.del_rev=function (obj) {
        $("#del_div").text(obj['item']['mp3']);
        $scope.deleteid = obj['item']['id'];
        $scope.deletename=obj['item']['mp3']
        $('#okModel').modal();
    }

    $scope.del_file=function () {
        $('#okModel').modal('hide');
           var pramas= {
              "id":  $scope.deleteid,
               'name': $scope.deletename
          }
             $.ajax({
            url: "delfile",  //获取
            type: 'POST', //GET、PUT、DELETE
            async: false,    //是否异步
            timeout: 10000,    //超时时间
            data: pramas,
            dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
            beforeSend: function (xhr) {
                // 发送前处理
            },
            success: function (data, textStatus, jqXHR) {
                // 调用成功，解析response中的data到自定义的data中
                if (data.code == '0') {

                   if(data.data.length>0){
                        $scope.error=[]
                       for(var i=0;i<data.data.length;i++){
                           $scope.error.push(data.data[i]['name'])
                       }
                       $('#err_delModel').modal()

                   }
                    $scope.load_page()
                }

            },
            error: function (xhr, textStatus) {
                // 调用时，发生错误

            },
            complete: function (XMLHttpRequest, textStatus) {
                // 交互后处理
            }
        })



    }

})