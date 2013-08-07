function alertWin(title, msg, w, h){ 
    var titleheight = "22px"; // 提示窗口标题高度 
    var bordercolor = "#666699"; // 提示窗口的边框颜色 
    var titlecolor = "#FFFFFF"; // 提示窗口的标题颜色 
    var titlebgcolor = "#666699"; // 提示窗口的标题背景色
    var bgcolor = "#FFFFFF"; // 提示内容的背景色
    
    var iWidth = document.documentElement.clientWidth; 
    var iHeight = document.documentElement.clientHeight; 
    var bgObj = document.createElement("div"); 
    bgObj.id="bgObjId";
    bgObj.style.cssText = "position:absolute;left:0px;top:0px;width:"+iWidth+"px;height:"+Math.max(document.body.clientHeight, iHeight)+"px;filter:Alpha(Opacity=30);opacity:0.3;background-color:#000000;z-index:101;";
    document.body.appendChild(bgObj); 
    
    var msgObj=document.createElement("div");
    msgObj.id="msgObjId";
    msgObj.style.cssText = "position:absolute;font:11px '宋体';top:"+(iHeight-h)/2+"px;left:"+(iWidth-w)/2+"px;width:"+w+"px;height:"+h+"px;text-align:center;border:1px solid "+bordercolor+";background-color:"+bgcolor+";padding:1px;line-height:22px;z-index:102;";
    document.body.appendChild(msgObj);
    
    var table = document.createElement("table");
    msgObj.appendChild(table);
    table.style.cssText = "margin:0px;border:0px;padding:0px;";
    table.cellSpacing = 0;
    var tr = table.insertRow(-1);
    var titleBar = tr.insertCell(-1);
    titleBar.style.cssText = "width:100%;height:"+titleheight+"px;text-align:left;padding:3px;margin:0px;font:bold 13px '宋体';color:"+titlecolor+";border:1px solid " + bordercolor + ";cursor:move;background-color:" + titlebgcolor;
    titleBar.style.paddingLeft = "10px";
    titleBar.innerHTML = title;
    var moveX = 0;
    var moveY = 0;
    var moveTop = 0;
    var moveLeft = 0;
    var moveable = false;
    var docMouseMoveEvent = document.onmousemove;
    var docMouseUpEvent = document.onmouseup;
    titleBar.onmousedown = function() {
        var evt = getEvent();
        moveable = true; 
        moveX = evt.clientX;
        moveY = evt.clientY;
        moveTop = parseInt(msgObj.style.top);
        moveLeft = parseInt(msgObj.style.left);
        
        document.onmousemove = function() {
            if (moveable) {
                var evt = getEvent();
                var x = moveLeft + evt.clientX - moveX;
                var y = moveTop + evt.clientY - moveY;
                if ( x > 0 &&( x + w < iWidth) && y > 0 && (y + h < iHeight) ) {
                    msgObj.style.left = x + "px";
                    msgObj.style.top = y + "px";
                }
            }    
        };
        document.onmouseup = function () { 
            if (moveable) { 
                document.onmousemove = docMouseMoveEvent;
                document.onmouseup = docMouseUpEvent;
                moveable = false; 
                moveX = 0;
                moveY = 0;
                moveTop = 0;
                moveLeft = 0;
            } 
        };
    }
    
    var closeBtn = tr.insertCell(-1);
    closeBtn.style.cssText = "cursor:pointer; padding:2px;background-color:" + titlebgcolor;
    closeBtn.innerHTML = "<span style='font-size:15pt; color:"+titlecolor+";'>×</span>";
    closeBtn.onclick = function(){ 
        document.body.removeChild(bgObj); 
        document.body.removeChild(msgObj); 
    } 
    var msgBox = table.insertRow(-1).insertCell(-1);
    msgBox.style.cssText = "font:10pt '宋体';";
    msgBox.colSpan = 2;
    
    var msgs = "<span>后台账号*：</span><input type='text' id='name' style='width: 160px' /><p />"
   			 +"<span>输入密码*：</span><input type='password' id='passwd1' style='width: 160px' /><p />"
   			 +"<span>确认密码*：</span><input type='password' id='passwd2' style='width: 160px' /><p />"
 			 +"<span>权限设置*：</span><select type='text' id='power' style='width: 166px;height: 23px'><option>P</option><option>S</option></select><p />"
                +"<input type='button' value='提交' onclick='getValue(\""+bgObj.id+"\",\""+msgObj.id+"\")' />";
    msgBox.innerHTML = msgs;
    
    // 获得事件Event对象，用于兼容IE和FireFox
    function getEvent() {
        return window.event || arguments.callee.caller.arguments[0];
    }
} 
//执行后台 click()
function getValue(bgObjId,msgObjId) 
{
	if (document.getElementById("name").value.length<3){ alert("用户名不能短于3个字符。"); return false;}
	if (document.getElementById("passwd1").value.length<6){ alert("密码不能小于6个字符"); return false;}
	//if (document.getElementById("passwd2").value.length<6){ alert("密码不能为空"); return false;}
	a=document.getElementById("passwd1").value;
	b=document.getElementById("passwd2").value;
	if(a==b){}
	else{alert("两次密码不一样。");
		return false;
		}
	var r=confirm("确认添加?")
	if (r=true)
	{
		window.location.href = "/user/adduser/?username="+document.getElementById("name").value+"&passwd1="+document.getElementById("passwd1").value+"&passwd2="+document.getElementById("passwd2").value+"&power="+document.getElementById("power").value;
	}

    
    document.body.removeChild(bgObj); 
    document.body.removeChild(msgObj); 
    

}

