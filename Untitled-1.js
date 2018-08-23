/*班列装车汇总查询 */
$(document).ready(function() {
    var dataPmsTyp = $.main.getDataPmsTyp();
    /* 国际化 start */
    $.i18n.properties({
        name: 'yard', //资源文件名称
        path: '../i18n/project/', //资源文件路径
        mode: 'map', //用Map的方式使用资源文件中的值
        language: getBrowserLanguage(),
        callback: function() { //加载成功后设置显示内容
            $("label").each(function(i) {
                $(this).html($.i18n.prop($(this).attr("name")));
            });
        }
    });
    String.prototype.replaceCharAt = function(n, c) {
            return this.substr(0, n) + c + this.substr(n + 1, this.length - 1 - n);
        }
        //时间段
    $("#load_startTime").datebox({
        width: '100',
        value: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).format('yyyy-MM-dd'),
        onSelect: function(value) {
            queryDate();
        }
    });
    $("#load_endTime").datebox({
        width: '100',
        value: (new Date()).format('yyyy-MM-dd'),
        onSelect: function(value) {
            queryDate();
        }
    });
    //查询方法
    function queryDate() {
        var startTime = $("#load_startTime").datebox('getValue');
        var endDate = $("#load_endTime").datebox('getValue');
        if (startTime > endDate) {
            $("#load_startTime").datebox("setValue", new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).format('yyyy-MM-dd'));
            $("#load_endTime").datebox("setValue", new Date(new Date().getTime()).format('yyyy-MM-dd'));
            HdUtils.messager.info("开始日期不能大于结束日期");
            return
        }
    }
    //持箱人
    $("#cntrCorpSearch").combogrid(HdUtils.code.cntrHorderNam({
        required: false,
        width: 110
    }));
    //发货人
    $("#shipperSearch").combogrid(HdUtils.code.tpCustomer({
        required: false,
        width: 110
    }));
    //收货人
    $("#consigneeSearch").combogrid(HdUtils.code.tpCustomer({
        required: false,
        width: 110
    }));
    //到站
    $("#endStationSearch").combogrid(HdUtils.code.station({
        required: false,
        width: 110
    }));
    //箱型
    $("#cntrTypeSearch").combogrid(HdUtils.code.cCntrTyp({
        required: false,
        width: 110
    }));

    var startTime = $("#load_startTime").datebox('getValue');
    var dateEnd = new Date($("#load_endTime").datebox('getValue'));
    var endYear = dateEnd.getFullYear();
    var endMonth = dateEnd.getMonth() + 1;
    var endDay = dateEnd.getDate() + 1;
    var endTime = endYear + "-" + endMonth + "-" + endDay;
    if (endTime.slice(6, 7) == '-') {
        var month = endTime.slice(5, 6);
        month = '0' + month;
        endTime = endTime.replaceCharAt(5, month);
    }
    if (endTime.slice(8, 9) != '0' && endTime.length == 9) {
        var day = endTime.slice(8, 9);
        day = '0' + day;
        endTime = endTime.replaceCharAt(8, day);
    }
    var builderApply = new HdEzuiQueryParamsBuilder();
    builderApply.setOtherskeyValue("startTime", startTime + " 08:00:00");
    builderApply.setOtherskeyValue("endTime", endTime + " 08:00:00");
    builderApply.setOtherskeyValue("dataPmsTyp", dataPmsTyp);
    builderApply.setOtherskeyValue("reviewId", "0");
    // 查询
    $("#trainloadCntrToolbar a[iconCls='icon-search']").on("click", function() {
        var startTime = $("#load_startTime").datebox('getValue');
        var dateEnd = new Date($("#load_endTime").datebox('getValue'));
        var endYear = dateEnd.getFullYear();
        var endMonth = dateEnd.getMonth() + 1;
        var endDay = dateEnd.getDate() + 1;
        var endTime = endYear + "-" + endMonth + "-" + endDay;
        if (endTime.slice(6, 7) == '-') {
            var month = endTime.slice(5, 6);
            month = '0' + month;
            endTime = endTime.replaceCharAt(5, month);
        }
        if (endTime.slice(8, 9) != '0' && endTime.length == 9) {
            var day = endTime.slice(8, 9);
            day = '0' + day;
            endTime = endTime.replaceCharAt(8, day);
        }
        var builderApply = new HdEzuiQueryParamsBuilder();
        builderApply.setOtherskeyValue("startTime", startTime + " 08:00:00");
        builderApply.setOtherskeyValue("endTime", endTime + " 08:00:00");
        builderApply.setOtherskeyValue("dataPmsTyp", dataPmsTyp);
        if ($("#cntrCorpSearch").combogrid("getValue") != '') {
            builderApply.setOtherskeyValue("cntrCorpSearch", $("#cntrCorpSearch").combogrid("getValue"));
        }
        if ($("#shipperSearch").combogrid("getValue") != '') {
            builderApply.setOtherskeyValue("shipperSearch", $("#shipperSearch").combogrid("getValue"));
        }
        if ($("#consigneeSearch").combogrid("getValue") != '') {
            builderApply.setOtherskeyValue("consigneeSearch", $("#consigneeSearch").combogrid("getValue"));
        }
        if ($("#endStationSearch").combogrid("getValue") != '') {
            builderApply.setOtherskeyValue("endStationSearch", $("#endStationSearch").combogrid("getValue"));
        }
        if ($("#cntrTypeSearch").combogrid("getValue") != '') {
            builderApply.setOtherskeyValue("cntrTypeSearch", $("#cntrTypeSearch").combogrid("getValue"));
        }
        if ($("#cntrNo").val() != '') {
            builderApply.setOtherskeyValue("cntrNo", $("#cntrNo").val());
        }
        if ($("#workBillSearch").val() != '') {
            builderApply.setOtherskeyValue("workBillSearch", $("#workBillSearch").val());
        }
        if ($("#remarkSearch").val() != '') {
            builderApply.setOtherskeyValue("remarkSearch", $("#remarkSearch").val());
        }
        if ($("#transNoSearch").val() != '') {
            builderApply.setOtherskeyValue("transNoSearch", $("#transNoSearch").val());
        }
        if ($("#carNoSearch").val() != '') {
            builderApply.setOtherskeyValue("carNoSearch", $("#carNoSearch").val());
        }
        //复核检算标志
        var types = $('input[name="trainLoadFindDetl_radio"][type="radio"]:checked').val();
        builderApply.setOtherskeyValue("reviewId", types);
        $("#WorkPlanLoadCntrDetailDatagird20180207").datagrid("load", builderApply.build());

    });
    //勾选数据发送淀粉厂   
    $("#trainloadCntrToolbar a[iconCls='icon-sendEdi']").on("click", function() {
        var checkRow = $("#WorkPlanLoadCntrDetailDatagird20180207").datagrid("getChecked");
        $.ajax({
            type: "POST",
            url: "../webresources/login/TrainLoadCntrdetl/sendEdi",
            contentType: "application/json",
            data: $.toJSON(checkRow),
            dataType: "json",
            async: false,
            success: function(data) {
                HdUtils.messager.bottomRight("发送成功", '保存操作');
                $("#WorkPlanLoadCntrDetailDatagird20180207").datagrid("load");
            }
        });
    });
    //导出
    $("#trainloadCntrToolbar a[iconCls='icon-export']").on("click", function() {
        var load_startTime = $("#load_startTime").datebox("getValue");
        var load_endTime = $("#load_endTime").datebox("getValue");
        $("#WorkPlanLoadCntrDetailDatagird20180207").datagrid("hdExportExcel", {
            url: "../webresources/login/TrainLoadCntrdetl/exportExcel?load_startTime=" +
                load_startTime + "&load_endTime=" + load_endTime,
            exportFileName: '班列装车明细' + new Date().format("yyyyMMddhhmmss")
        });
    });
    //装车datagrid===============================================================================================
    $("#WorkPlanLoadCntrDetailDatagird20180207").datagrid({
        method: "POST",
        url: "../webresources/login/TrainLoadCntrdetl/findLoadCntrDetail",
        queryParams: builderApply.build(),
        pagination: true,
        singleSelect: true,
        checkOnSelect: false,
        selectOnCheck: false,
        rownumbers: true,
        pageSize: 20,
        fit: true,
        fitColumns: false,
        autoLoad: true,
        remoteFilter: false,
        showFooter: true,
        filterStringify: function(data) {
            var aa = {};
            aa.filterRules = data;
            return aa;
        },
        rowStyler: function(index, row) {
            if (row.sendEdiId == "1") {
                return 'background-color:#B3EE3A;';
            }
        },
        frozenColumns: [
            [{
                field: 'ck',
                checkbox: true
            }, {
                field: "trainId",
                title: $.i18n.prop('<font color="red">车次ID</font>'),
                multiSort: true,
                halign: "center",
                hidden: true,
                sortable: true
            }, {
                field: "loadCntrId",
                title: $.i18n.prop('<font color="red">主键ID</font>'),
                multiSort: true,
                halign: "center",
                hidden: true,
                sortable: true
            }, {
                field: "loadCntrdetlId",
                title: $.i18n.prop('<font color="red">班列装计划箱明细Id</font>'),
                multiSort: true,
                halign: "center",
                hidden: true,
                sortable: true
            }, {
                field: "tallyTim",
                title: $.i18n.prop("派工日期"),
                multiSort: true,
                halign: "center",
                width: 100,
                formatter: function(value) {
                    if (value) {
                        return new Date(value).format("yyyy-MM-dd");
                    } else {
                        return "";
                    }
                },
                sortable: true
            }, {
                field: "cntrNo",
                title: $.i18n.prop("箱号"),
                multiSort: true,
                halign: "center",
                width: 90,
                sortable: true
            }, {
                field: "logisticCarno",
                title: $.i18n.prop("物流发车号"),
                multiSort: true,
                align: "right",
                sortable: true,
                width: 80,
                halign: "center"
            }, {
                field: "sealNo",
                title: $.i18n.prop("铅封号"),
                multiSort: true,
                halign: "center",
                width: 90,
                sortable: true
            }, {
                field: "trworkPlanNo",
                title: $.i18n.prop("工票号"),
                multiSort: true, //TRWORK_PLAN_NO
                halign: "center",
                width: 100,
                sortable: true
            }, {
                field: "wagonNo",
                title: $.i18n.prop("车皮号"),
                multiSort: true,
                halign: "center",
                width: 90,
                sortable: true
            }]
        ],
        columns: [
            [{
                    field: "cntrTyp",
                    title: $.i18n.prop("箱型"),
                    multiSort: true,
                    halign: "center",
                    width: 70,
                    formatter: function(value, row, index) {
                        if (row.cntrTypNam != null && row.cntrTypNam != "") {
                            return row.cntrTypNam;
                        } else {
                            return value;
                        }
                    },
                    sortable: true
                }, {
                    field: "cntrSiz",
                    title: $.i18n.prop("箱尺寸"),
                    multiSort: true,
                    align: "left",
                    width: 50,
                    sortable: true,
                    formatter: function(value, row, index) {
                        if (row.cntrSizNam != null && row.cntrSizNam != "") {
                            return row.cntrSizNam;
                        } else {
                            return value;
                        }
                    },
                    halign: "center"
                }, {
                    field: "cntrCorp",
                    title: $.i18n.prop("持箱人"),
                    multiSort: true,
                    align: "left",
                    width: 120,
                    sortable: true,
                    formatter: function(value, row, index) {
                        if (row.cntrCorpNam != null && row.cntrCorpNam != "") {
                            return row.cntrCorpNam;
                        } else {
                            return value;
                        }
                    },
                    halign: "center"
                },
                {
                    field: "cntrEf",
                    title: $.i18n.prop('空重'),
                    multiSort: true,
                    halign: "center",
                    sortable: true,
                    formatter: function(value, row, index) {
                        //return row.cntrEf == 'E'?'空':'重';
                        if (row.cntrEf == 'E') {
                            return '空';
                        } else if (row.cntrEf == 'F') {
                            return '重';
                        } else {
                            return value;
                        }
                    }
                }, {
                    field: "statStation",
                    title: $.i18n.prop("发站"),
                    multiSort: true,
                    align: "left",
                    width: 80,
                    sortable: true,
                    formatter: function(value, row, index) {
                        if (row.fstatStationNam != null && row.fstatStationNam != "") {
                            return row.fstatStationNam;
                        } else {
                            return value;
                        }
                    },
                    halign: "center"
                }, {
                    field: "endStation",
                    title: $.i18n.prop("到站"),
                    multiSort: true,
                    align: "left",
                    width: 80,
                    sortable: true,
                    formatter: function(value, row, index) {
                        if (row.endStationNam != null && row.endStationNam != "") {
                            return row.endStationNam;
                        } else {
                            return value;
                        }
                    },
                    halign: "center"
                },
                {
                    field: "checkId",
                    title: $.i18n.prop("是否检算"),
                    multiSort: true,
                    align: "left",
                    width: 60,
                    sortable: true,
                    formatter: function(value, row, index) {
                        return row.checkId = '0' ? '未检算' : '已检算';
                    },
                    halign: "center"
                }, {
                    field: "reviewTim", //REVIEW_TIM
                    title: $.i18n.prop("理货时间"),
                    multiSort: true,
                    halign: "center",
                    width: 110,
                    formatter: $.hd.ezui.formatter.datetime,
                    sortable: true
                },
                {
                    field: "shipper",
                    title: $.i18n.prop("托运人"),
                    multiSort: true,
                    align: "right",
                    width: 220,
                    sortable: true,
                    formatter: function(value, row, index) {
                        if (row.shipperNam != null && row.shipperNam != "") {
                            return row.shipperNam;
                        } else {
                            return value;
                        }
                    },
                    halign: "center"
                }, {
                    field: "consigiee",
                    title: $.i18n.prop("收货人"),
                    multiSort: true,
                    align: "left",
                    width: 220,
                    sortable: true,
                    formatter: function(value, row, index) {
                        if (row.consigieeNam != null && row.consigieeNam != "") {
                            return row.consigieeNam;
                        } else {
                            return value;
                        }
                    },
                    halign: "center"
                }, {
                    field: "cntrLocal",
                    title: $.i18n.prop("箱存放地"),
                    multiSort: true,
                    align: "left",
                    width: 90,
                    sortable: true,
                    formatter: function(value, row, index) {
                        if (row.cntrLoaclName != null && row.cntrLoaclName != "") {
                            return row.cntrLoaclName;
                        } else {
                            return value;
                        }
                    },
                    halign: "center"
                }, {
                    field: "cargoKind",
                    title: $.i18n.prop("货类"),
                    multiSort: true,
                    align: "right",
                    hidden: true,
                    sortable: true,
                    width: 90,
                    formatter: function(value, row, index) {
                        if (row.cargoKindNam != null && row.cargoKindNam != "") {
                            return row.cargoKindNam;
                        } else {
                            return value;
                        }
                    },
                    halign: "center"
                }, {
                    field: "cargoId",
                    title: $.i18n.prop("货名"),
                    multiSort: true,
                    align: "left",
                    width: 70,
                    sortable: true,
                    formatter: function(value, row, index) {
                        if (row.cargoNam != null && row.cargoNam != "") {
                            return row.cargoNam;
                        } else {
                            return value;
                        }
                    },
                    halign: "center"
                }, {
                    field: "trainLine",
                    title: $.i18n.prop("道线"),
                    multiSort: true,
                    align: "left",
                    width: 70,
                    sortable: true,
                    formatter: function(value, row, index) {
                        if (row.trainLineNam != null && row.trainLineNam != "") {
                            return row.trainLineNam;
                        } else {
                            return value;
                        }
                    },
                    halign: "center"
                }, {
                    field: "carrierNo",
                    title: $.i18n.prop("托运编号"), //CARRIER_NO
                    multiSort: true,
                    align: "left",
                    width: 80,
                    sortable: true,
                    halign: "center"
                }, {
                    field: "useId",
                    title: $.i18n.prop("是否使用"),
                    multiSort: true,
                    align: "center",
                    hidden: true,
                    width: 50,
                    sortable: true,
                    formatter: $.hd.ezui.formatter.checkbox,
                    halign: "center"
                }, {
                    field: "sendEdiId",
                    title: $.i18n.prop("发送状态"),
                    multiSort: true,
                    align: "center",
                    width: 60,
                    sortable: true,
                    formatter: $.hd.ezui.formatter.checkbox,
                    halign: "center"
                }, {
                    field: "sendEdiTim",
                    title: $.i18n.prop("发送时间"), // SEND_EDI_TIM
                    multiSort: true,
                    align: "left",
                    width: 110,
                    sortable: true,
                    halign: "center"
                }, {
                    field: "sendEdiNam",
                    title: $.i18n.prop("发送人"), // SEND_EDI_TIM
                    multiSort: true,
                    align: "left",
                    width: 80,
                    sortable: true,
                    halign: "center"
                }, {
                    field: "remarkTxt",
                    title: $.i18n.prop("备注"),
                    multiSort: true,
                    align: "left",
                    sortable: true,
                    width: 150,
                    halign: "center"
                }
            ]
        ]
    });
    $("#WorkPlanLoadCntrDetailDatagird20180207").datagrid('enableFilter', [{}]);
});