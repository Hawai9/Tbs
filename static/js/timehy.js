app.controller('myCtrl', function ($scope) {
    $scope.weeks=new Date().getDay()
    $scope.ectitle=''
    if(localStorage.getItem('switch_state')=='true'){
        $scope.ectitle='每天'

    }else {
        $scope.ectitle='周'+new Date().getDay()
    }
    $scope.X_data = []
    $scope.Y_data = []
    $scope.mp3s = []
    //编辑表单元素
    $scope.id = 0
    $scope.names = "000";
    $scope.time = "";
    $scope.mp3 = "";
    $scope.state = "";
    $scope.sort_num = "";
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
                $scope.state = true
                if (data.is_play) {
                    $scope.check_state(data.playing_task)
                }else {
                     $scope.check_state({'time':''})
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
    $scope.load_date = function () {
        let url=''
       if(localStorage.getItem('switch_state')=='true'){
           url='getDailyTimes'
       }else {
           url='getTimes'
       }
        $.ajax({
            url: url,  //获取
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
                toastr.success('ok');

                $scope.X_data = data.data['res_time']

                $scope.Y_data = data.data['res_min']

            },
            error: function (xhr, textStatus) {
                // 调用时，发生错误
                toastr.warning(textStatus);
            },
            complete: function (XMLHttpRequest, textStatus) {
                // 交互后处理
            }
        })
            function setInter() {
            $scope.check_playState()
        }

        setInterval(setInter, 1000);

        let width = document.getElementsByClassName("content")[0].clientWidth
        document.getElementById('time_line').style.width = width + "px";
        let myChart = echarts.init(document.getElementById('time_line'));
        // 指定图表的配置项和数据
        let series = [

            {
                type: 'line',
                symbolSize:20,
                data: $scope.Y_data,
                 lineStyle: {
                     normal: {
                         color: 'green',
                         width: 4,
                         type: 'dashed'
                     }
        },

            },

        ]
        let option = {
            title: {
                text: $scope.ectitle+'---任务趋势线',
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (a) {

                    return '点击编辑'
                }
            },


            xAxis: {
                name: '时间',

                boundaryGap: false,
                data: $scope.X_data,
                axisLabel: {
                    formatter: function (parmas) {

                        return parmas
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {

                        width: 1,
                        type: 'solid'
                    }
                }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value}'
                }
            },
            series: series
        };
        myChart.setOption(option);

        myChart.on('click', function(hander){
            let url=''
            if(localStorage.getItem('switch_state')=='true'){
               url='pointDailyTask'
            }else {
                url='pointWeekTask'
            }
            let parmas={
                'time':hander.name
            }
             console.log(parmas,1212)
             $.ajax({
            url: url,  //获取
            type: "POST", //GET、PUT、DELETE
            async: false,    //是否异步
            data: parmas,
            timeout: 10000,    //超时时间
            dataType: "json",    //返回的数据格式：json/xml/html/script/jsonp/text
            beforeSend: function (xhr) {
                // 发送前处理
            },
            success: function (data, textStatus, jqXHR) {
                console.log(data.data[0])
                // 调用成功，解析response中的data到自定义的data中
                   $('#pointid').val(data.data[0]['id'])
                   $('#name').val(data.data[0]['name'])
                   $('#tasktime').val(data.data[0]['time'])
                   $('#state').val(data.data[0]['state'])
                   $scope.getmp3(data.data[0]['mp3s'])
                   $('#editModel').modal()


            },
            error: function (xhr, textStatus) {
                // 调用时，发生错误
                toastr.info(textStatus);
            },
            complete: function () {
                // 交互后处理
            }
        })

		    })

        window.addEventListener("resize", () => {
            myChart.resize();
        });

    }
    $scope.load_date()
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
    $scope.saveEdite=function(){

        let url=''
        if(localStorage.getItem('switch_state')=='true'){
            url='uppointDaily'
        }else {
            url='uppointWeek'
        }
        let parmas={
            'week': $scope.weeks,
            'id':$('#pointid').val(),
            'name': $('#name').val(),
            'time': $('#tasktime').val(),
            'mp3':parseInt($('#mp3file').val()),
            'state':parseInt($('#state').val()),
        }
        console.log(parmas)
          $.ajax({
            url:url,  //获取
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
                    toastr.success(data.msg)
                    $('#editModel').modal('hide')
                    $scope.load_date()
                    if(url=='updateDaily'){
                        $scope.updateDaily()
                    }else {
                        $scope.updateWeek()
                    }
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
    $(document).ready(function () {


        //点击触发事件，监听按钮状态


        laydate.render({
            elem: '#tasktime',
            type: 'time',
            format: 'HH:mm:ss',
            change: function (value) {
               $('#tasktime').val(value)
            }

        });


    })
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
                    $("#mp3file").empty();
                    for (var i = 0; i < data.data.length; i++) {

                        $("#mp3file").append("<option value='"+data.data[i]['id']+"'>"+data.data[i]['mp3']+"</option>");
                    }
                    $("#mp3file option[value='"+mp3+"']").attr("selected","selected");

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
    $scope.check_state = function (obj) {
        var width = document.getElementsByClassName("content")[0].clientWidth
        document.getElementById('time_line').style.width = width  + "px";
        var myChart = echarts.init(document.getElementById('time_line'));

        // 指定图表的配置项和数据
        let series = [

            {
                type: 'line',
                data: $scope.Y_data,
            }

        ]
        var option = {
           title: {
                text: $scope.ectitle+'---任务趋势线',
            },
            // backgroundColor: '#27408B',

            tooltip: {
                trigger: 'axis',
                formatter: function (a) {
                    console.log(a)
                }
            },


            xAxis: {
                name: '时间',

                boundaryGap: false,
                data: $scope.X_data,
                axisLabel: {

                    formatter: '{value} '
                }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value}'
                }
            },
            series: series
        };

        let effectScatterData = [];
        effectScatterData.push([obj['time'], obj['time'].substring(0, 2)])
        let effectScatter = {

            type: 'effectScatter',
            data: effectScatterData, //2d坐标系
            symbolSize: 15,
            itemStyle: {
                normal: {
                    color: 'red',
                }
            },
            zlevel: 1
        };
        option.series.push(effectScatter);


        myChart.setOption(option);


    }
    new ResizeSensor(document.querySelector('.content'), function () {
        var myChart = echarts.init(document.getElementById('time_line'));
        var width = document.getElementsByClassName("content")[0].clientWidth
        document.getElementById("time_line").style.width = width  + "px";
        myChart.resize();
    });
    function getCookie(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return decodeURI(arr[2]);
        else
            return null;
    }

})