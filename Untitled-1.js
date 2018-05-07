/**
 * jQuery EasyUI 1.4.3
 * Copyright (c) 2009-2015 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL license: http://www.gnu.org/licenses/gpl.txt
 * To use it on other terms please contact us at info@jeasyui.com
 * http://www.jeasyui.com/license_commercial.php
 *
 * jQuery EasyUI datagrid 编辑器扩展-回车聚焦
 * jeasyui.extensions.datagrid.edit.enterFocus.js
 * 开发 落阳
 * 最近更新：2017-03-21
 *
 * 依赖项：
 *   1、jquery.jdirk.js
 *   2、jeasyui.extensions.datagrid.rowState.js
 *   3、jeasyui.extensions.datagrid.editors.js
 *   4、jeasyui.extensions.datagrid.getColumnInfo.js
 *
 * Copyright (c) 2015 ChenJianwei personal All rights reserved.
 */
(function() {

    //获取其他行的指定列之和
    //t：datagrid-jquery对象
    //opts：datagrid-options对象
    //field：要计算的列名
    //exceptRowIndex：要排除的数据行索引
    var getOtherRowsTotal = function(t, opts, field, exceptRowIndex) {
        var rows = t.datagrid("getRows"),
            len = rows.length,
            total = 0;
        for (var i = 0; i < len; i++) {
            if (i == exceptRowIndex) { continue; }
            if (t.datagrid("isEditing", i)) {
                var editor = t.datagrid("getEditor", { index: i, field: field });
                if (editor) {
                    var val = editor.actions ? editor.actions.getValue(editor.target[0]) : editor.target.val();
                    if (!$.string.isNullOrWhiteSpace(val)) { total += Number(val); }
                } else {
                    var val = rows[i][field];
                    if (!$.string.isNullOrWhiteSpace(val)) { total += Number(val); }
                }
            } else {
                var val = rows[i][field];
                if (!$.string.isNullOrWhiteSpace(val)) { total += Number(val); }
            }
        }

        return total;
    };

    //更新合计行
    //t：datagrid-jquery对象
    //opts：datagrid-options对象
    //totalField：显示合计值的列名
    //total：合计值
    var updateFooter = function(t, opts, totalField, total) {
        var footerRows = t.datagrid("getFooterRows");
        $.array.forEach(footerRows, function(row) {
            var temp = {};
            temp[totalField] = total;
            $.extend(row, temp);
        });
        t.datagrid('reloadFooter', footerRows);
    };

    //计算统计行
    //t：datagrid-jquery对象
    //opts：datagrid-options对象
    //index：要排除计算的数据行索引
    //field：要计算的列名
    var calcToFooter = function(t, opts, index, field) {
        var val = $(this).val(),
            otherCountTotal = getOtherRowsTotal(t, opts, field, index);
        var total = $.string.isNullOrWhiteSpace(val) ? otherCountTotal : (Number(val) + otherCountTotal);
        updateFooter(t, opts, field, total);
    };

    //绑定自动计算事件
    //t：datagrid-jquery对象
    //opts：datagrid-options对象
    //input：输入框jquery对象
    //index：要排除计算的数据行索引
    //field：要计算的列名
    var bindCalcEvent = function(t, opts, input, index, field) {
        var colOpts = t.datagrid("getColumnOption", field);
        if (colOpts.calcable) {
            input.keyup(function() {
                calcToFooter.call(this, t, opts, index, field);
            });
        }
    };




    // 初始化事件绑定
    function initExtendEventBind(t, opts) {

        //开始编辑事件
        var _onBeginEdit = opts.onBeginEdit;
        opts.onBeginEdit = function(index, row) {
            if ($.isFunction(_onBeginEdit)) { _onBeginEdit.call(this, index, row); }

            var fields = t.datagrid("getColumnFields", "all"),
                editors = $.array.map(fields, function(item) { return t.datagrid("getEditor", { index: index, field: item }); });
            if (editors.length == 0) { return; }

            $.array.forEach(editors, function(item) {
                if (!item) { return; }
                if (item.actions && $.isFunction(item.actions.input)) {
                    var theInput = item.actions.input(item.target[0]);
                    bindCalcEvent(t, opts, theInput, index, item.field);
                } else {
                    bindCalcEvent(t, opts, item.target, index, item.field);
                }
            });
        };
    }

    // 初始化列 options 扩展属性
    function initExtendColumnOptions(t, opts) {
        var target = t[0],
            state = $.data(target, "datagrid"),
            cols = t.datagrid("getColumnOptions", "all");
        $.each(cols, function(i, col) {
            $.extend(col, $.fn.datagrid.columnOptions);
        });
    }

    function initializeExtensions(target) {
        var t = $(target),
            state = $.data(target, "datagrid"),
            opts = state.options;

        initExtendColumnOptions(t, opts);
        initExtendEventBind(t, opts);
    }

    var _datagrid = $.fn.datagrid;
    $.fn.datagrid = function(options, param) {
        if (typeof options == "string") {
            return _datagrid.apply(this, arguments);
        }
        options = options || {};
        return this.each(function() {
            var jq = $(this),
                isInited = $.data(this, "datagrid") ? true : false,
                opts = isInited ? options : $.extend({},
                    $.fn.datagrid.parseOptions(this),
                    $.parser.parseOptions(this, []), options);
            _datagrid.call(jq, opts, param);
            if (!isInited) {
                initializeExtensions(this);
            }
        });
    };
    $.extend($.fn.datagrid, _datagrid);


    var columnOptions = {

        // 表示该列是否可计算，其值可以是 Boolean 类型；
        // 默认为 false。
        // 该属性用于在“自动纵向统计”时使用。
        calcable: false
    };

    if ($.fn.datagrid.columnOptions) {
        $.extend($.fn.datagrid.columnOptions, columnOptions);
    } else {
        $.fn.datagrid.columnOptions = columnOptions;
    }

    var methods = {


    };

    var defaults = {


    };

    if ($.fn.datagrid.defaults) {
        $.extend($.fn.datagrid.defaults, defaults);
    } else {
        $.fn.datagrid.defaults = defaults;
    }

    if ($.fn.datagrid.methods) {
        $.extend($.fn.datagrid.methods, methods);
    } else {
        $.fn.datagrid.methods = methods;
    }

    $.extend($.fn.datagrid.defaults, defaults);
    $.extend($.fn.datagrid.methods, methods);

})(jQuery);