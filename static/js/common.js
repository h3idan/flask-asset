/**
 *
 * 作者: 于淼 (yumiao@comsenz.com)
 * 创建时间: 2011-02-22 16:03:53
 * 修改记录:
 *
 * $Id: common.js 14789 2012-06-28 07:08:39Z zhixinmeng $
 */

// form 表单名称
var STATS_FORM = 'statsForm';
// 表格数据 form 表单名称
var STATS_TABLE_FORM = 'statsTableForm';
// Ajax 数据读取的标识
var AJAX_LOADING = [];
// 上一次读取数据的URL的MD5值
var AJAX_MD5 = [];
// 站点ID隐藏域的ID值
var HIDDEN_SID = 'sId';
// item 顺序数组
var SELECT_ITEMS = [];
// 站点开启统计应用的时间
var STATS_START_TIME = 0;
// 指标的说明提示
var ITEM_TIPS_MESSAGE = [];
// checkbox 的现在个数限制，checkboxName => num
var CHECKBOX_LIMIT = [];
// 图表 Flash 对象
var OBJECT_FLASH_CHARTS = [];
// 对话框样式是否加载
var INIT_CSS = false;
// 指标tip的setTimeout对象
var TIPS_TIMEOUT = {};
// 指标tip的显示时长setTimeout对象
var TIPS_SHOW_TIMEOUT = {};
// 防止用户操作太快
var FORM_CLICKED = [];
// 表格列数大于7，显示滚动条
var ROW_NUM = 7;
// 表格每列宽度
var TABLE_ROW_WIDTH = 130;
// 表格默认宽度
var TABLE_WIDTH = 762;
// 指标的Tips
var ITEM_TIPS = [];
// 指标的ID列表
var ITEM_IDS = [];

/**
 * 画图函数
 * @param data 图表 Json 数据
 * @param fcId 图表所在位置ID
 * @param options 参数选项
 */
function paintFlashChart(data, fcId, options) {
    var defaults = {
        swfUrl : '/misc/anychart/AnyChart.swf', // flash 地址
        width : '100%', // flash 宽度
        height : 200, // flash 高度
        type : 'data', // flash 数据来源类型
        wmode : 'opaque' // flash 的 wmode 属性
    };
    this.__pfc_cfg = $.extend({}, defaults, options);
    // 如果对象已经存在
    if(OBJECT_FLASH_CHARTS[fcId]) {
        setFlashChartData(OBJECT_FLASH_CHARTS[fcId], data, this.__pfc_cfg.type);
        return true;
    }
    // 创建图表对象
    OBJECT_FLASH_CHARTS[fcId] = new AnyChart(this.__pfc_cfg.swfUrl);
    OBJECT_FLASH_CHARTS[fcId].width = this.__pfc_cfg.width;
    OBJECT_FLASH_CHARTS[fcId].height = this.__pfc_cfg.height;
    OBJECT_FLASH_CHARTS[fcId].wMode = this.__pfc_cfg.wmode;
    setFlashChartData(OBJECT_FLASH_CHARTS[fcId], data, this.__pfc_cfg.type);
	OBJECT_FLASH_CHARTS[fcId].write(fcId);
}

/**
 * 更新 Flash 图表数据
 * @param objFlash object 图表 Flash 对象
 * @param data string 图表 XML 数据字串或地址
 * @param type string 数据类型(data:XML 字串; file:XML 地址)
 */
function setFlashChartData(objFlash, data, type) {
    if('undefined' == typeof(type)) {
        type = 'data';
    }
    if('file' == this.__pfc_cfg.type) {
        objFlash.setXMLFile(data);
    } else {
        objFlash.setData(data);
    }
}

/**
 * 使用 Ajax 提交 form
 * @param frmObj form 对象
 */
function statsFormAjax(frmObj) {
    try {
        var frmId = $(frmObj).attr('id');
        var action = $(frmObj).attr('action');
        var params = [];
        var callBack = '';
        if(true == FORM_CLICKED[frmId]) {
            return false;
        }
        FORM_CLICKED[frmId] = true;
        // 获取 form 中所有 input 框
        $(frmObj).find('input').each(function() {
            // forum 表单允许的名称
            var reIpt = new RegExp('^[\\w\\[\\]\\-\\.]+$', 'ig');
            if(false == reIpt.test($(this).attr('name'))) {
                return true;
            }
            // type = radio/checkbox 需要做特殊处理
            if('radio' == $(this).attr('type')) {
                if(false == $(this).attr('checked')) {
                    return true;
                }
            } else if('checkbox' == $(this).attr('type')) {
                if(false == $(this).attr('checked')) {
                    return true;
                }
            }
            if('jsCallback' == $(this).attr('name')) {
                callBack = $(this).val();
                return true;
            }
            params.push($(this).attr('name') + '=' + $(this).val());
        });
        // 获取 form 中所有 select 框
        $(frmObj).find('select').each(function() {
            // forum 表单允许的名称
            var reIpt = new RegExp('^[\\w\\[\\]\\-\\.]+$', 'ig');
            if(false == reIpt.test($(this).attr('name'))) {
                return true;
            }
            params.push($(this).attr('name') + '=' + $(this).val());
        });
        // ajax 标识
        params.push('ajax=1');
        // 判断是否有需要进行特殊处理，不执行 doAjax 方法
        if(0 < callBack.length) {
            eval(callBack + "(frmObj);");
            return false;
        }
        // 开始 ajax 调用
        doAjax({
            type : 'GET',
            url : action,
            data : params.join('&')
        }, frmId);
    } catch(err) {
        alert("Error name: " + err.name + ";\r\nError message: " + err.message + ";");
    } finally {
        // 表单可以点击
        FORM_CLICKED[frmId] = false;
    }
    return false;
}

// 设置 XML 文件地址
function setFlashChartXmlFile(frmObj) {
    var action = $(frmObj).attr('action');
    var params = [];
    // 获取 form 中所有 input 框
    $(frmObj).find('input').each(function() {
        // forum 表单允许的名称
        var reIpt = new RegExp('^[\\w\\[\\]\\-\\.]+$', 'ig');
        if(false == reIpt.test($(this).attr('name'))) {
            return true;
        }
        // type = radio/checkbox 需要做特殊处理
        if('radio' == $(this).attr('type')) {
            if(false == $(this).attr('checked')) {
                return true;
            }
        } else if('checkbox' == $(this).attr('type')) {
            if(false == $(this).attr('checked')) {
                return true;
            }
        }
        params.push($(this).attr('name') + '=' + $(this).val());
    });
    // 获取 form 中所有 select 框
    $(frmObj).find('select').each(function() {
        // forum 表单允许的名称
        var reIpt = new RegExp('^[\\w\\[\\]\\-\\.]+$', 'ig');
        if(reIpt.test($(this).attr('name'))) {
            return true;
        }
        params.push($(this).attr('name') + '=' + $(this).val());
    });
    // 调用画图数据
    paintFlashChart(action + '?' + params.join('&'), 'flashChart', {type:'file'});
    return false;
}

/**
 * 执行 Ajax 操作
 * @param obj Ajax 请求所需的参数
 * @param frmId 表单ID
 * @param func function 函数对象
 */
function doAjax(obj, frmId, func) {
    if('undefined' == typeof(frmId)) {
        frmId = 'defaultFrm';
    }
    // 计算当前请求的 type + url + data 的 md5 值
    var md5 = $.md5(obj.type + ':' + obj.url + '?' + ('undefined' == typeof(obj.data) ? '' : obj.data.toString()));
    // 如果是第一次进行 Ajax 请求，则给 AJAX_MD5 赋一个初值
    /*
    if(AJAX_MD5[frmId] == md) {
        AJAX_MD5 = '0';
        return doAjax(obj, frmId, func);
    }
    */

    // 如果前后两次 md5 值相等，则不进行操作
    if(AJAX_MD5[frmId] == md5) {
        return true;
    }

    if(true == AJAX_LOADING[frmId]) {
        alert('正在为您读取数据，请稍候……');
        return false;
    }
    // 赋一个新值
    AJAX_MD5[frmId] = md5;
    // 正在进行 Ajax 操作的标识
    AJAX_LOADING[frmId] = true;
    // 数据读取失败
    obj.error = function() {
        // 清除 flash 数据读取时的层
        clearLoadingDiv();
        AJAX_LOADING[frmId] = false;
        // 处理回调函数
        if('function' == typeof(func)) {
            func();
        }
    }
    // 成功返回数据的处理函数
    obj.success = function(msg) {
        AJAX_LOADING[frmId] = false;
        try {
            // ajax 标识
            var ajaxReg = /<ajax id="(.*?)">([^\x00]+?)<\/ajax>/ig;
            var ajaxAlertReg = /<ajaxAlert>([^\x00]+?)<\/ajaxAlert>/ig;
            // 剥离提示信息
            if(msg.match(ajaxAlertReg)) {
                ajaxTipsMsg = msg.replace(ajaxAlertReg, function($0, $1) {
                    alert($1);
                    return '';
                });
                return true;
            }
            // Ajax 操作
            ajaxMsg = msg.replace(ajaxReg, function($0, $1, $2) {
                // flash 这种特殊的 DOM 对象
                var objectReg = /(embed|object)$/ig;
                // script
                var scriptReg = /<script(.*?)>([^\x00]+?)<\/script>/ig;
                // object
                var obj = $('#' + $1);
                if(1 > obj.length) {
                    return '';
                }
                // 如果是 flash 对象元素
                if(objectReg.exec(obj.attr('nodeName'))) {
                    var script = ($2).match(scriptReg);
                    if(script[0]) {
                        obj.append(script[0]);
                    }
                    return '';
                }
                if ('dataTable' == $1) {
                    var tableObj = jQuery($2);
                    var thNum = tableObj.get(0).rows.item(0).cells.length;
                    var defaultWidth = parseInt(tableObj.attr('defaultWidth'));
                    if (defaultWidth) {
                        var defaultRows = parseInt(tableObj.attr('defaultRows'));
                        var newRowWidth = parseInt(tableObj.attr('newRowWidth'));
                        var dataTableWidth = defaultWidth + (thNum - defaultRows) * newRowWidth;
                        if (dataTableWidth > TABLE_WIDTH) {
                            $('#dataTable').css('width', dataTableWidth + 'px');
                        } else {
                            $('#dataTable').css('width', 'auto');
                        }
                    } else {
                        if (ROW_NUM < thNum) {
                            var dataTableWidth = (thNum - ROW_NUM) * TABLE_ROW_WIDTH + TABLE_WIDTH + 'px';
                            $('#dataTable').css('width', dataTableWidth);
                        } else {
                            $('#dataTable').css('width', 'auto');
                        }
                    }
                }
                obj.empty().append($2);
                return '';
            });
        } catch(err) {
            alert("Error name: " + err.name + ";\r\nError message: " + err.message + ";");
        } finally {
            // 清除 flash 数据读取时的层
            clearLoadingDiv();
            // 处理回调函数
            if('function' == typeof(func)) {
                func();
            }
        }
    }
    // 完成以后执行操作
    obj.complete = function(){
        if($('#overflowDiv') && $('#overflowDiv').hasClass('overflowDivPlus')) {
            $('#overflowDiv').removeClass('overflowDivPlus');
        }
    }
    // 超时时间为25s
    obj.timeout = 25000;
    // 在 flash 上覆盖一个层
    showLoadingDiv();
    // 提交表单
    $.ajax(obj);
}

/**
 * 去除 loading 加载层
 * @param className 加载层的样式名称;
 */
function clearLoadingDiv(className) {
    var divClass = 'div.flashChartLoading';
    if('undefined' != typeof(className)) {
        divClass = className;
    }
    $(divClass).each(function() {
        $(this).remove();
    });
}

/**
 * 显示 loading 加载层
 * @param id 需要被覆盖的元素ID;
 */
function showLoadingDiv(id) {
    var id_class = '.flashChart, .overflowDiv';
    if('undefined' != typeof(id)) {
        id_class = '#' + id;
    }
    var isIe6 = false;
    var top_extra = 0; 
    var browser_diff = 0;
    $(id_class).each(function() {
        if($(this).hasClass("overflowDiv")) {
            top_extra = 30;
            if($.browser.msie) {
                if ($.browser.version < 7) {
                    isIe6 = true;
                    browser_diff = top_extra / 2; 
                } else {
                    browser_diff = top_extra;
                }
            }
        };
        var pos = $(this).offset();
        var fDiv = document.createElement('div');
        var jDiv = $(fDiv);
        jDiv.css('position', 'absolute');
        jDiv.css('left', pos.left);
        jDiv.css('top', pos.top + top_extra);
        jDiv.css('width', $(this).attr('offsetWidth'));
        jDiv.css('height', $(this).attr('offsetHeight') - browser_diff);
        jDiv.css('line-height', $(this).attr('offsetHeight') - browser_diff + 'px');
        jDiv.addClass('flashChartLoading');
        jDiv.html('<img src="' + STATIC_DOMAIN + '/stats/images/loading.gif" />数据加载中...');
        $(this).parent().append(jDiv);
    });
}

/**
 * 把翻页链接都转成 Ajax 请求方式
 * @param pageWrapId 分页 HTML 的上层 ID 值
 */
function pageHrefAjax(pageWrapId) {
    if('undefined' == typeof(pageWrapId)) {
        pageWrapId = 'pageAjax';
    }
    // 为分页链接加上 click 事件
    $('#' + pageWrapId).find('a').bind('click', function() {
        doAjax({
            type : 'GET',
            url : $(this).attr('href') + '&ajax=1'
        });
        return false;
    });
}

function initItemTips(className) {
    if('undefined' == typeof(className)) {
        className = 'itemTips';
    }
    //<a href="javascript:;" title="帮助" class="itemTips" id="itemTips_{$iiValue}"></a>
    $('td, th').each(function() {
        if($(this).hasClass(className)) {
            var item = $(this).attr('item');
            if('undefined' == typeof(ITEM_TIPS_MESSAGE[item])) {
                return true;
            }
            var aObj = document.createElement('A');
            aObj.innerHTML = '<img class="vm" src="' + STATIC_DOMAIN + '/stats/images/btn_help.png">';
            $(aObj).bind('mouseover', function(event) {
                showItemTips(ITEM_TIPS_MESSAGE[item], this, {id:item + '_item_tips_div'});
                // 防止冒泡
                event.stopPropagation();
                return true;
            });
            $(this).append(aObj);
        }
    });
}

function orderAjax(url, order, ascDesc, className, wrapId) {
    if('undefined' == typeof(wrapId)) {
        wrapId = 'dataTheadTr';
    }
    // 为表格列加上 click 事件
    $('#' + wrapId).find('td, th').each(function() {
        if($(this).hasClass(className)) {
            $(this).contents().wrapAll('<span></span>');
            var orderObj = $(this).children();
            orderObj.toggleClass('header');
            orderObj.attr('order', $(this).attr('order'));
            $(this).removeAttr('order');
            if(order == $(orderObj).attr('order')) {
                $(orderObj).addClass('desc' == ascDesc ? 'headerSortDown' : 'headerSortUp');
            }
            $(orderObj).bind('click', function() {
                var currentOrder = $(this).attr('order');
                var ajaxUrl = url + '&order=' + currentOrder;
                if(order == currentOrder) {
                    ajaxUrl += '&ascDesc=' + ('desc' == ascDesc ? 'asc' : 'desc');
                }
                if($('#order').get(0)) {
                    $('#order').val(currentOrder);
                }
                doAjax({
                    type : 'GET',
                    url : ajaxUrl + '&ajax=1'
                });
                return false;
            });
        }
    });
}

/**
 * 站点切换
 * @param obj 下拉选框自身的对象
 */
function changeWebsite(obj) {
    var fSIdReg = /sId\/\d*\&?\/?/ig;
    var sSIdReg = /sId\=\d*\&?/ig;
    var lastReg = /(\?|&)$/i;
    var href = window.location.href;
    href = href.replace(fSIdReg, '');
    href = $.trim(href.replace(sSIdReg, ''));
    if(href.match(lastReg)) {
        href += 'sId=' + $(obj).val();
    } else {
        href += (-1 == href.indexOf('?') ? '?' : '&') + 'sId=' + $(obj).val();
    }
    window.location.href = href;
}

/**
 * 改变左侧菜单
 * @param sId 当前查看的站点ID默认值
 */
function changeFunc(obj, sId) {
    var formSId = parseInt($('#' + HIDDEN_SID).val());
    if(!isNaN(formSId)) {
        sId = formSId;
    }
    window.location.href = $(obj).attr('href') + '?sId=' + sId;
    return false;
}

/**
 * 展开左侧菜单
 * @param sId 当前查看的站点ID默认值
 */
function displayMenu(mId, level) {
    var liId = 'li_' + mId;
    var openClass = 'open_' + level;
    var closeClass = 'close_' + level;

    if ($('#' + liId).attr('class') == openClass) {
        $('#' + liId).removeClass().addClass(closeClass);
    } else {
        $('#' + liId).removeClass().addClass(openClass);
    }

}

/**
 * 计算列的 paddingTop 值
 * @param ajaxId Ajax 目标ID
 */
function getAjaxDivPaddingTop(ajaxId) {
    // 前一个节点对象
    var prevObj = $('#' + ajaxId).prev();
    // 获取点击位置的 LI 序号
    var liFocusIndex = 0;
    prevObj.find('li').each(function(index) {
        if($(this).hasClass('a')) {
            liFocusIndex = index;
            return false;
        }
    });
    var paddingTop = 0;
    var basePx = 54;
    // 当前 LI 的总数
    var curLiCount = $('#' + ajaxId).find('li').length;
    if(liFocusIndex + 1 >= curLiCount) {
        if(2 == curLiCount) {
            paddingTop = (liFocusIndex - curLiCount + 1) * basePx + (basePx / 2);
        } else {
            paddingTop = (liFocusIndex - curLiCount + 1) * basePx;
        }
    }
    $('#' + ajaxId).css('padding-top', paddingTop);
}

/**
 * 取消我知道了的提示信息
 * 
 * @param mId
 *            int 当前页面的ID;
 * @param hideId
 *            string 操作成功后，需要隐藏的元素ID;
 */
function cancelTip(mId, hideId) {
	var sId = $('#' + HIDDEN_SID).val()||window.location.search.replace(/.*sId=(\d+)[^\d]?.*/,function(a,b){return b});
	var intRe = /^\d+$/ig;
	// 如果站点ID、页面ID不是数字
	if (null == sId.match(intRe) || null == mId.toString().match(intRe)) {
		alert('请刷新页面后重新尝试');
	}
	// 取消当前页面的信息提示
	$.ajax( {
		type : 'GET',
		url : '/ajax/setAppConfig/?sId=' + sId + '&mId=' + mId,
		error : function() {
			alert('网络错误，请重新尝试');
		},
		success : function(msg) {
			var ajaxAlertReg = /<ajaxAlert>([^\x00]+?)<\/ajaxAlert>/ig;
			// 如果没有 alert 信息，则说明成功了
		if (null == msg.match(ajaxAlertReg)) {
			$('#' + hideId).hide();
			return true;
		}
		// 弹出错误信息，提示用户
		ajaxTipsMsg = msg.replace(ajaxAlertReg, function($0, $1) {
			var alertMsg = $.trim($1);
			alert(alertMsg);
			return '';
		});
		return true;
	}
	});
}

/**
 * 显示Tips
 *
 * @param string tipsContent 提示内容
 * @param string tipsId tips的Id，不能重复
 * @param Element offsetElement tips显示的提示点，tips要提示于那个位置
 * @param int top 相对提示点的高度
 * @param int left 相对提示点的左边距离
 * @param boolean autoClose 是否有关闭
 */
function showItemTips(tipsContent, offsetElement, extra) {

    if (!INIT_CSS) {
        INIT_CSS = true;
        $('head').append('<link rel="stylesheet" type="text/css" media="all" href="http://discuz.gtimg.cn/cloud/styles/common.dialog.css?v=2" />');
    }

    tipsId = (extra && typeof(extra['id']) != 'undefined') ? extra['id'] : 'f_win_tips';
    tipsTop = (extra && typeof(extra['top']) != 'undefined') ? extra['top'] : -20;
    tipsLeft = (extra && typeof(extra['left']) != 'undefined') ? extra['left'] : -67;
    autoClose = (extra && typeof(extra['autoClose']) != 'undefined') ? extra['autoClose'] : true;

    if (TIPS_TIMEOUT[tipsId]) {
        clearTimeout(TIPS_TIMEOUT[tipsId]);
    }

    pos = $(offsetElement).position();

    tipsQ  = '<div id="' + tipsId + '" class="prmm up" style="display:block; position: absolute; z-index: 100000; " initialized="true"> ';
    tipsQ += '<div class="prmc">';
    tipsQ += '<ul><li>' + tipsContent + '</li>';
    if (!autoClose) {
        tipsQ += '<li style="text-align: right; padding-bottom: 5px;"><a onclick="$(\'#' + tipsId + '\').fadeOut();" style="color: #336699; cursor: pointer;">我知道了</a></li>';
    }
    tipsQ += '</ul></div></div>';

    if (!$('#' + tipsId)[0]) {
        $(tipsQ).appendTo('body');
    }
    tipsStyle = {
        'top': (pos.top - $('#' + tipsId).height() + tipsTop) + 'px',
        'left': (pos.left + tipsLeft) + 'px',
        'display': 'none'
    };
    $('#' + tipsId).css(tipsStyle);
    $('#' + tipsId).mouseover(function() {clearTimeout(TIPS_TIMEOUT[tipsId]);});
    $('#' + tipsId).mouseout(function() {
        clearTimeout(TIPS_TIMEOUT[tipsId]);
        TIPS_TIMEOUT[tipsId] = setTimeout(function(){$('#' + tipsId).fadeOut();}, 200);
    });
    $(offsetElement).mouseout(function() {
        if (TIPS_SHOW_TIMEOUT[tipsId]) { clearTimeout(TIPS_SHOW_TIMEOUT[tipsId]); }
        if (TIPS_TIMEOUT[tipsId]) { clearTimeout(TIPS_TIMEOUT[tipsId]); }
        TIPS_TIMEOUT[tipsId] = setTimeout(function(){$('#' + tipsId).fadeOut();}, 200);
    }); 
    $("div.prmm.up").fadeOut();
    TIPS_SHOW_TIMEOUT[tipsId] = setTimeout(function(){$('#' + tipsId).fadeIn();}, 600);
}

/**
 * 快速排序算法
 * @param a array 数组
 * @param s integer 开始位置
 * @param e integer 结束位置
 */
function quickSort(a, s, e) {
    if(s < e) {
        var pos = partition(a, s, e);
        quickSort(a, s, pos - 1);
        quickSort(a, pos + 1, e);
    }
}

/**
 * 调整顺序
 * @param a array 数组
 * @param s integer 开始位置
 * @param e integer 结束位置
 */
function partition(a, st, en) {
    var s = st;
    var e = en + 1;
    var temp = a[s];
    while(1) {
        while('undefined' != typeof(a[++ s]) && a[s][1] < temp[1]);
        while(a[-- e][1] > temp[1]);
        if(s > e) break;
        var tem = a[s];
        a[s] = a[e];
        a[e] = tem;
    }
    a[st] = a[e];
    a[e] = temp;
    return e;
}

// 为数组增加一个快速排序方法
// 禁止增加全局属性
Array.prototype.quickSort=function(){
    quickSort(this, 0, this.length - 1);
}

/**
 * 提示框
 * 
 * @param string
 *            $content 提示内容
 * @param title
 *            $title 标题
 * @param sting
 *            callback 回调方法
 * @param sting
 *            btnType 按钮样式 1.确定取消，2.是否
 * @access public
 * @return mixed
 */
function showWindows(content, title, callback, btnType, extra) {

	if (!INIT_CSS) {
		INIT_CSS = true;
		$('head')
				.append(
						'<link rel="stylesheet" type="text/css" media="all" href="http://discuz.gtimg.cn/cloud/styles/common.dialog.css?v=2" />');
	}

	dialogPosition = ($.browser.msie && $.browser.version < 7) ? 'absolute'
			: 'fixed';

	if(extra && typeof(extra['heatmap']) != 'undefined'){
        	dialogPosition = 'absolute';
	}
    
	
	btnText1 = '确定';
	btnText2 = '取消';

	switch (btnType) {
	case 2:
		btnText1 = '是';
		btnText2 = '否';
		break;
	case 3:
		btnText1 = '确定';
		btnText2 = false;
		break;
	case 4:
		btnText1 = '继续';
		btnText2 = false;
		break;
	case 5:
		btnText1 = false;
		btnText2 = false;
	}

	if (btnType != -1 && btnText1) {
		if (btnType && typeof ('btnType') != 'undefined'
				&& isNaN(parseInt(btnType)) && btnType.length > 1) {
			btnText1 = btnType;
			btnText2 = '';
		}
		btnHtml = '<div class="o pns"><span id="promptOff" style="color:#aaaaaa"></span><button id="btn_1" class="pn pnc"><span>' + btnText1 + '</span></button>';
		if (btnText2) {
			btnHtml += '&nbsp;&nbsp;<button class="pn" onclick="$(\'#fwin_dialog_close\').click();"><span>' + btnText2 + '</span></button>';
		}
		btnHtml += '</div>';
	} else {
		btnHtml = '';
	}
    var zIndex = '1001';
    if(extra && typeof(extra['zIndex']) != 'undefined'){
        zIndex = extra['zIndex'];
    }	

	message_id = 'fs_100' + zIndex;// + parseInt((Math.random()*6)+1);
	dialogId = "fwin_dialog_" + message_id;

	win_dialog = "<div style=\"position: " + dialogPosition
			+ "; z-index: " + zIndex + "; " + "display:none;\" class=\"fwinmask\" id=\""
			+ dialogId + "\">";

	win_dialog += "<table cellspacing=\"0\" cellpadding=\"0\" class=\"fwin\">"
			+ "<tr><td class=\"t_l\"></td><td class=\"t_c\"></td><td class=\"t_r\"></td></tr>"
			+ "<tr><td class=\"m_l\">&nbsp;&nbsp;</td><td class=\"m_c\">"
			+ "<h3 class=\"flb\" style=\"cursor: move;\"><em>"
			+ ((title == undefined || title == "") ? "提示信息" : title)
			+ "</em><span><a title=\"关闭\" onclick=\"hideWindows('fwin_dialog_"
			+ message_id
			+ "');\" class=\"flbc\" id=\"fwin_dialog_close\" href=\"javascript:;\">关闭</a></span></h3>"
			+ "<div id=\"fwin_content_"
			+ message_id
			+ "\">"
			+ "</div>"
			+ "<p class=\"o pns\" id=\"fwin_pns_"
			+ message_id
			+ "\" style=\"display:none; margin-top:10px;\"><span class=\"z xg1\"></span>"
			+ "<button class=\"pn pnc\" value=\"true\" id=\"fwin_dialog_submit\" onclick=\"submit_content('"
			+ message_id
			+ "');\"><strong>确定</strong></button></p>"
			+ "</td><td class=\"m_r\"></td></tr>"
			+ "<tr><td class=\"b_l\"></td><td class=\"b_c\"></td><td class=\"b_r\"></td></tr></table>";

	win_dialog += "</div>";

	if (!$('#' + dialogId)[0]) {
		$(win_dialog).appendTo("body");
	}

	$(".flb em")[0].className = '';
	$(".flb em").html((title == undefined || title == "") ? "提示信息" : title);
	$('#fwin_content_' + message_id)
			.html(
					'<div style="padding: 10px; margin-bottom:20px; table-layout:fixed; word-break: break-all; overflow:hidden;" class="c">'
							+ content + '</div>' + btnHtml);
	$("#" + dialogId).show();

	dialogWidth = (extra && typeof (extra['width']) != 'undefined') ? parseInt(extra['width'])
			: 'auto';
	if (dialogWidth != 'auto') {
		$('#fwin_content_' + message_id).css( {
			"width" : (dialogWidth) + "px"
		});
	} else {
		$('#fwin_content_' + message_id).css( {
			"width" : "auto"
		});
	}

	dialogLeft = (extra && typeof (extra['left']) != 'undefined') ? extra['left']
			: ($(window).width() - $('#' + dialogId).width()) / 2;
	dialogTop = (extra && typeof (extra['top']) != 'undefined') ? extra['top']
			: ($(window).height() - $('#' + dialogId).height()) / 2;
	$("#" + dialogId).css( {
		"top" : dialogTop + "px",
		"left" : dialogLeft + "px"
	});
    
	if(!extra || typeof(extra['heatmap']) == 'undefined'){

         $("#" + dialogId).draggable({
             handle:"h3.flb",
             drag:function(){ 
                 if($("#frm_100_" + dialogId)){
                     $("#frm_100_" + dialogId).css({"top": $("#" + dialogId).css("top"),"left": $("#" + dialogId).css("left")});   
                 }
				 //解决拖拽过程中的日期选择的位置问题
				 if($("div[id^='calendar_']")){
				 	$("div[id^='calendar_']").css('display', 'none');
				 }
             }
         });
    }
	if ($('#btn_1')[0]) {
		if (callback) {
			$("#" + dialogId + " #btn_1").click(callback);
		} else {
			$("#" + dialogId + " #btn_1").click(function() {
				$('#fwin_dialog_close').click();
			});
		}
	}

	if (typeof (extra) != 'undefined') {
		switch (extra['type']) {
		case 'tips':
			$("#fwin_dialog_close").css('display', 'none');break;
		case 'report_tips':
			$("#fwin_dialog_close").css('display','none');
			if($("#"+dialogId)){
				$("#"+dialogId).css({'left' : extra['left'] , 'top' : extra['top']});
			}
			break;
		}
	}

	var noPrompt = (extra && typeof (extra['noPrompt']) != 'undefined') ? extra['noPrompt'] : false;
	if (noPrompt) {
		$('#' + 'promptOff').html(
				'<input type="checkbox" id="noDataPromptOff" name="noDataPromptOff" value="1" style="position:relative;top:2px;"/> 不再提醒 '
				);
	}

	// 解决IE6select控件bug
	hidIframeId = "frm_100_" + dialogId;
	//如果已经存在，那么删除
	if($("#"+hidIframeId)){
		$("#"+hidIframeId).remove();
	}
    hidIframe = "<iframe id=\"" + hidIframeId + "\"></iframe>";
	$(hidIframe).appendTo("body");
    zIndex = parseInt(zIndex);
    zIndex--;
	$("#" + hidIframeId).css({
		"width" : $("#" + dialogId).width(),
		"height" : $("#" + dialogId).height(),
		"position" : dialogPosition,
		"top" : $("#" + dialogId).css("top"),
		"left" : $("#" + dialogId).css("left"),
		"z-index" : zIndex,
		"scrolling":"no",
		"border":"0"
	});

	return dialogId;
}

function hideWindows(windowId) {
    $("#" + windowId).hide();
    $("#" + windowId).remove();
    $("#frm_100_"+windowId).remove();
	//解决IE浏览器下a标签不向上冒泡的问题
	if($("div[id^='calendar_']")){
		$("div[id^='calendar_']").css('display', 'none');
	}
	return false;
}

function setNoDataPromptStats() {
	var value = 0;
	if ($('#noDataPromptOff').attr("checked")==true) {
		value = 1;
	} 
	$.ajax( {
		type : 'GET',
		url : '/ajax/closeNoDataPrompt/?value=' + value,
		error : function() {
		//	alert('网络错误，请重新尝试');
		hideWindows('fwin_dialog_fs_100');
		},
		success : function() {
		hideWindows('fwin_dialog_fs_100');
		return true;
	}
	});
}
/**
 * 获得URL参数
 * @param name 参数名
 * @param src url
 * @return 参数值
 * @author johnnyzheng
 */
function getParameter(name, src) {
    if (name && src) {
        var r = new RegExp("(\\?|#|&)" + name + "=([^&^#]*)(#|&|$)");
        var m = src.match(r);
        return m ? m[2] : "";
    }
    return "";
}

/**
 * 遮罩层
 * @author johnnyzheng
 */
var  $_overlay =  {
		self: '',
		//isIE6: $.browser.msie && $.browser.version < 7,
		create: function() {
			if(this.self && this.self.parent().length){return;}
			$(window).bind('resize.overlay', $_overlay.resize);
			return (this.self = (this.self || $('<div></div>').css({
				height:'100%',left:0,position:'absolute',top:0,width:'100%',background:'#000','opacity':0.3,'z-index':777
			})).appendTo('body').css({
				width:this.width(),
				height:this.height()
			}));
		},

		destroy: function() {
			if(this.self &&!this.self.parent().length){return;}
			$([document, window]).unbind('resize.overlay');
			$_overlay.self.animate({
				opacity:'hide'
			},function(){
				$(this).remove().show();
			}); 
		},
		resize: function() {
			$_overlay.self.css({
				width: 0,height: 0
			}).css({
				width: $_overlay.width(),height: $_overlay.height()
			});
		},
		height: function() {
			var scrollHeight,offsetHeight;
			if (this.isIE6) {
				scrollHeight = Math.max(
					document.documentElement.scrollHeight,document.body.scrollHeight
				);
				offsetHeight = Math.max(
					document.documentElement.offsetHeight,document.body.offsetHeight
				);
				if (scrollHeight < offsetHeight) {
					return $(window).height() + 'px';
				} else {
					return scrollHeight + 'px';
				}
			} else {
				return $(document).height() + 'px';
			}
		},
		width: function() {
			var scrollWidth,
				offsetWidth;
			if (this.isIE6) {
				scrollWidth = Math.max(
					document.documentElement.scrollWidth,document.body.scrollWidth
				);
				offsetWidth = Math.max(
					document.documentElement.offsetWidth,document.body.offsetWidth
				);
				if (scrollWidth < offsetWidth) {
					return $(window).width() + 'px';
				} else {
					return scrollWidth + 'px';
				}
			} else {
				return $(document).width() + 'px';
			}
		}
	};
/**
 * base64编码
 */
var _base64 = {
        base64EncodeChars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        //客户端Base64编码
        base64encode: function(str) {
            var out, i, len;
            var c1, c2, c3;
            len = str.length;
            i = 0;
            out = "";
            while (i < len) {
                c1 = str.charCodeAt(i++) & 0xff;
                if (i == len) {
                    out += this.base64EncodeChars.charAt(c1 >> 2);
                    out += this.base64EncodeChars.charAt((c1 & 0x3) << 4);
                    out += "==";
                    break;
                }
                c2 = str.charCodeAt(i++);
                if (i == len) {
                    out += this.base64EncodeChars.charAt(c1 >> 2);
                    out += this.base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                    out += this.base64EncodeChars.charAt((c2 & 0xF) << 2);
                    out += "=";
                    break;
                }
                c3 = str.charCodeAt(i++);
                out += this.base64EncodeChars.charAt(c1 >> 2);
                out += this.base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                out += this.base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
                out += this.base64EncodeChars.charAt(c3 & 0x3F);
            }
            return out;
        }
};

function makeMultipartFormDataPostRequest(path, params) {    
    var xmlhttp = false;

    if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
            try {
                    xmlhttp = new XMLHttpRequest();
            } catch (e) {
                    xmlhttp=false;
            }
    }

    if (!xmlhttp && window.createRequest) {
            try {
                    xmlhttp = window.createRequest();
            }catch (e) {
                    xmlhttp=false;
            }
    }

    xmlhttp.open("POST", path, false);
    var boundary = "Boundary_" + new Date().getMilliseconds() + ";";
    xmlhttp.setRequestHeader("Content-Type","multipart/form-data; boundary="+boundary);
    
    var dataString = "";
    
    for (var propName in params) {
            dataString += '--' + boundary + '\r\n';
            dataString += 'content-disposition: form-data; name="' + propName + '"' + '\r\n';
            dataString += 'content-type: application/octet-stream;\r\n\r\n\r\n';
            dataString += params[propName] + '\r\n';
    }
    dataString += "--"+boundary;
    
    xmlhttp.send(dataString);
    return xmlhttp.responseText ;
}    

function saveChartAsImage(fcId) {
	var chart = OBJECT_FLASH_CHARTS[fcId];	
    var requestData = {};

    if(chart == null) {
        return null;
    }
    
    requestData['imgData'] = chart.getPng(); 
    requestData['imgType'] = 'png';
    requestData['timestamp'] = new Date().getTime();
    sId = getParameter('sId', document.location.href)
    
    var path = makeMultipartFormDataPostRequest('/image/saveImage?sId=' + sId, requestData);
    return path;        
}

function getCurrentStyle(obj, cssproperty, csspropertyNS) {
	if(obj.style[cssproperty]){
		return obj.style[cssproperty];
	}
	if (obj.currentStyle) {
		return obj.currentStyle[cssproperty];
	} else if (document.defaultView.getComputedStyle(obj, null)) {
		var currentStyle = document.defaultView.getComputedStyle(obj, null);
		var value = currentStyle.getPropertyValue(csspropertyNS);
		if(!value){
			value = currentStyle[cssproperty];
		}
		return value;
	} else if (window.getComputedStyle) {
		var currentStyle = window.getComputedStyle(obj, "");
		return currentStyle.getPropertyValue(csspropertyNS);
	}
}

function fetchOffset(obj, mode) {
	var left_offset = 0, top_offset = 0, mode = !mode ? 0 : mode;

	if(obj.getBoundingClientRect && !mode) {
		var rect = obj.getBoundingClientRect();
		var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
		var scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
		if(document.documentElement.dir == 'rtl') {
			scrollLeft = scrollLeft + document.documentElement.clientWidth - document.documentElement.scrollWidth;
		}
		left_offset = rect.left + scrollLeft - document.documentElement.clientLeft;
		top_offset = rect.top + scrollTop - document.documentElement.clientTop;
	}
	if(left_offset <= 0 || top_offset <= 0) {
		left_offset = obj.offsetLeft;
		top_offset = obj.offsetTop;
		while((obj = obj.offsetParent) != null) {
			position = getCurrentStyle(obj, 'position', 'position');
			if(position == 'relative') {
				continue;
			}
			left_offset += obj.offsetLeft;
			top_offset += obj.offsetTop;
		}
	}
	return {'left' : left_offset, 'top' : top_offset};
}

function showQQCustomService() {
	if($('#footer')[0]){
		var viewPortHeight = parseInt(document.documentElement.clientHeight);
		var scrollHeight = parseInt(document.body.getBoundingClientRect().top);
		var basew = parseInt($('#footer').attr('offsetWidth'));
		var sw = parseInt($('#QQCustomService').attr('offsetWidth'));
		if (basew < 1000) {
            var left = parseInt(fetchOffset($('#footer')[0])['left']);
			$('#QQCustomService').css('left', basew + left + 'px');
		} else {
			$('#QQCustomService').css('left', 'auto');
			$('#QQCustomService').css('right', 0);
		}

		if ($.browser.msie && $.browser.version < 7) {
			$('#QQCustomService').css('top', viewPortHeight - scrollHeight - 150 + 'px');
		}
		$('#QQCustomService').css('visibility', 'visible');

	}
}

function updateItemDivPos(switchDiv, panel) {
    var switchPos = $('#' + switchDiv).offset();
    $('#' + panel).css('right', ($(window).width() - switchPos.left - $('#' + switchDiv).attr('offsetWidth') - 2) + 'px');
    $('#' + panel).css('top', (switchPos.top + $('#' + switchDiv).attr('offsetHeight') - 2) + 'px');
}

function sendHotClick(tag){
    pgvSendClick({hottag : tag});
}

var _cookie = {
	get : function(key){
		var cookies = document.cookie;
		var value = null;
		var offset, end;
		offset = cookies.indexOf(key);
		if(offset > -1){
			offset += key.length + 1;
			end = cookies.indexOf(";", offset);
			if(end == -1)
				end = cookies.length;
			value = unescape(cookies.substring(offset, end));
		}
	    return value;
	},
	saveCookie : function(key, value, expires, domain){
		var strExpires = "";
		var strDomain = "";
		if(expires != null)
			strExpires = ";expires=" + expires;
		if(domain != null)
			strDomain = ";domain=" + domain;
		document.cookie = key + "=" + value + strExpires + strDomain + ";path=/";
	}
}
