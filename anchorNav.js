DBFX.RegisterNamespace("DBFX.Web.Controls");
DBFX.RegisterNamespace("DBFX.Design");
DBFX.RegisterNamespace("DBFX.Serializer");
DBFX.RegisterNamespace("DBFX.Design.ControlDesigners");

DBFX.Web.Controls.AnchorNav = function (n) {
    var an = DBFX.Web.Controls.Control("AnchorNav");
    an.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.AnchorNavDesigner");
    an.ClassDescriptor.Serializer = "DBFX.Serializer.AnchorNavSerializer";

    an.VisualElement = document.createElement("DIV");
    an.VisualElement.className = "AnchorNav";
    an.OnCreateHandle();
    // an.OnCreateHandle = function () {
    //
    // }

    an.showTexts = [];
    Object.defineProperty(an,"ShowTexts",{
        get:function () {
            return an.showTexts;
        },
        set:function (v) {
            an.showTexts = v;
            an.layoutSubViews();
        }
    });

    an.aWidth = "15px";
    an.aHeight = "400px";

    an.spans = [];

    an.Value = '';

    //布局所有按钮 并设置样式
    an.layoutSubViews = function () {
        var count = an.showTexts.length;

        var cssObj = window.getComputedStyle(an.VisualElement,null);
        console.log("w======"+cssObj.width);
        console.log("h======"+cssObj.height);

        var w = parseFloat(an.aWidth),
            h = parseFloat(an.aHeight);

        var liW = 0,liH = 0;

        //浮动设置
        var cssF = '';

        var spanWH = 0;
        //左右、上下间距
        var marginLR = 0;
        var marginTB = 0;


        if(w>h){//横向排列
            liW = w/count;
            liH = h;
            cssF = "left";
            spanWH = liH > liW ? liW : liH;
            marginLR = 0;
            marginTB = (liH - spanWH)*0.5;

        }else {//纵向排列
            liW = w;
            liH = h/count;
            cssF = '';
            spanWH = liH > liW ? liW : liH;
            marginLR = (liW - spanWH)*0.5;
            marginTB = 0;
        }

        an.container.innerHTML = "";

        for(var i=0;i<count;i++){
            var liE = document.createElement('li');
            var span = document.createElement('span');
            span.innerText = an.showTexts[i][0];
            //添加事件处理
            span.addEventListener('mousedown',an.mouseClick,false);
            span.addEventListener("touchstart",an.mouseClick,false);

            span.addEventListener("touchend",function (ev) {
                ev.cancelBubble = true;
                an.preTouchedSpan = an.curTouchedSpan;

                //TODO:隐藏提示标签
                an.hideTipE();

            },false);

            span.addEventListener("mouseup",function (ev) {
                ev.cancelBubble = true;
                an.preTouchedSpan = an.curTouchedSpan;

                //TODO:隐藏提示标签
                an.hideTipE();

            },false);

            liE.appendChild(span);

            // liE.style.display = "inline-block";
            liE.style.width = liW+"px";
            liE.style.height = liH+"px";
            liE.style.cssFloat = cssF;
            liE.style.padding = "0px";
            liE.style.boxSizing = "border-box";
            liE.style.textAlign = "center";
            // liE.style.fontSize = "12px";

            span.style.display = "block";
            span.style.width = spanWH+"px";
            span.style.height = spanWH+"px";
            span.style.cursor = "pointer";
            span.style.backgroundColor = an.btnBgC;
            span.style.boxSizing = "border-box";
            span.style.borderRadius = an.btnBorderR;
            span.style.borderWidth = an.btnBorderW;
            span.style.borderColor = an.btnBorderC;
            span.style.borderStyle = 'solid';
            span.style.textDecoration = "none";
            span.style.marginLeft = marginLR + "px";
            span.style.marginTop = marginTB + "px";
            span.style.lineHeight = spanWH+"px";
            span.style.overflow = "hidden";

            an.spans.push(span);
            an.container.appendChild(liE);
        }
    }

    an.handleTouchEnter = function (e) {
        console.log('handleTouchEnter');
        // e.preventDefault();
        console.log(e);
    }

    an.handleTouchStart = function (e) {
        console.log('handleTouchStart');
        e.preventDefault();
        e.cancelBubble = true;
        console.log(e);
    }

    an.handleTouchMove = function (e) {
        console.log('handleTouchMove');
        e.preventDefault();
        e.cancelBubble = true;
        // console.log(e);
    }

    an.handleTouchCancel = function (e) {
        console.log("handleTouchCancel");
    }

    an.handleTouchEnd = function (e) {
        console.log("handleTouchEnd");
        e.cancelBubble = true;
    }

    //处理点击事件
    an.mouseClick = function (e) {
        e.preventDefault();
        e.cancelBubble = true;
        var target = e.target;
        console.log(target.innerText);
        an.curTouchedSpan = target;

        var cssObj = window.getComputedStyle(an.VisualElement,null);
        an.spans.forEach(function (span) {
            span.style.backgroundColor = an.btnBgC;
            span.style.color = cssObj.color;
            span.style.borderWidth = an.btnBorderW;
        });

        target.style.backgroundColor = an.selectedC;
        target.style.color = an.selectedTextC;

        //实时更新提示标签位置
        an.refreshTipEPos(target);

        if(an.preTouchedSpan == an.curTouchedSpan){
            return;
        }


        an.Value = target.innerText;
        if (an.Command != undefined && an.Command != null) {
            an.Command.Sender = an;
            an.Command.Execute();
        }
        if(an.Click != undefined && an.Click.GetType() == "Command"){
            an.Click.Sender = an;
            an.Click.Execute();
        }

        if(an.Click != undefined && an.Click.GetType() == "function"){
            an.Click(e,an);
        }

    }


    //按钮样式设置
    //按钮边框宽度
    an.btnBorderW = "1px";
    Object.defineProperty(an,"BtnBorderW",{
        get:function () {
            return an.btnBorderW;
        },
        set:function (v) {
            an.btnBorderW = v;
        }
    });
    //按钮圆角
    an.btnBorderR = "50%";
    Object.defineProperty(an,"BtnBorderR",{
        get:function () {
            return an.btnBorderR;
        },
        set:function (v) {
            an.btnBorderR = v;
        }
    });
    //按钮边框颜色
    an.btnBorderC = "transparent";
    Object.defineProperty(an,"BtnBorderC",{
        get:function () {
            return an.btnBorderC;
        },
        set:function (v) {
            an.btnBorderC = v;
        }
    });
    //按钮背景色
    an.btnBgC = "transparent";
    Object.defineProperty(an,"BtnBgC",{
        get:function () {
            return an.btnBgC;
        },
        set:function (v) {
            an.btnBgC = v;
        }
    });

    //按钮高亮（被选中）时背景色
    an.selectedC = "#13d1be";
    Object.defineProperty(an,"SelectedC",{
        get:function () {
            return an.selectedC;
        },
        set:function (v) {
            an.selectedC = v;
        }
    });
    //按钮高亮（被选中）时字体颜色
    an.selectedTextC = "#f9f9f9";
    Object.defineProperty(an,"SelectedTextC",{
        get:function () {
            return an.selectedTextC;
        },
        set:function (v) {
            an.selectedTextC = v;
        }
    });

    /*==================================平台属性配置begin=======================================================*/
    an.SetHeight = function (v) {
        if(v.indexOf("%") != -1 || v.indexOf("px") != -1){
            an.VisualElement.style.height = v;
        }else {
            an.VisualElement.style.height = parseFloat(v)+'px';
        }
        var cssObj = window.getComputedStyle(an.VisualElement,null);

        // console.log("=========="+cssObj.height);
        an.VisualElement.style.lineHeight = cssObj.height;
        an.aHeight = cssObj.height;
        an.layoutSubViews();

    }

    an.SetWidth = function (v) {
        if(v.indexOf("%") != -1 || v.indexOf("px") != -1){
            an.VisualElement.style.width = v;
        }else {
            an.VisualElement.style.width = parseFloat(v)+'px';
        }
        var cssObj = window.getComputedStyle(an.VisualElement,null);
        an.aWidth = cssObj.width;
        // console.log(an.aWidth);
        an.layoutSubViews();
    }

    an.SetFontSize = function (v) {
        an.VisualElement.style.fontSize = v;
    }

    an.SetFontFamily = function (v) {
        an.VisualElement.style.fontFamily = v;
    }

    an.SetFontStyle = function (v) {
        an.VisualElement.style.fontStyle = v;
    }

    an.SetColor = function (v) {
        an.VisualElement.style.color = v;
    }


    /*==================================平台属性配置end=======================================================*/

    an.timeout = "";
    //隐藏提示标签
    an.hideTipE = function () {
        //清除之前的
        clearTimeout(an.timeout);
       an.timeout = setTimeout("an.tipEHidden()",500);
    }

    an.tipEHidden = function () {
        an.tipE.hidden = true;
    }


    //TODO:根据点击的按钮位置 更新提示标签的位置
    an.refreshTipEPos = function (span) {

        //当前span的信息
        var spanRectObj = span.getBoundingClientRect();
        var x = spanRectObj.x,
            y = spanRectObj.y,
            w = spanRectObj.width,
            h = spanRectObj.height,
            maxX = x + w,
            maxY = y + h;
        //屏幕宽度
        var width = document.body.clientWidth;

        //控件信息
        var divRectObj = an.VisualElement.getBoundingClientRect();
        var div_y = divRectObj.y,
            div_x = divRectObj.x,
            div_maxX = div_x + divRectObj.width;

        //提示标签的宽高
        an.tipEW = w*3;
        an.tipEH = an.tipEW*0.6;
        an.tipFontSize = 20;
        an.setTipStyle();

        an.tipSpan.innerText = span.innerText;
        an.tipE.hidden = false;
        if(x+w*0.5 >= width*0.5){//按钮在屏幕右侧

            an.tipE.style.left = '';
            an.tipE.style.right = (div_maxX-x+w*0.5)+'px';
            //TODO:可以根据tipE的高度在优化计算
            an.tipE.style.top = (y-div_y+h*0.5-an.tipEH*0.5)+"px";
        }else {//按钮在屏幕左侧

            an.tipE.style.right = '';
            an.tipE.style.left = (maxX+w*0.5)+'px';
            an.tipE.style.top = (y-div_y+h*0.5-an.tipEH*0.5)+"px";
        }

    }

    an.preTouchedSpan = {};
    an.curTouchedSpan = {};

    //提示标签的宽高
    an.tipEW = 55;
    an.tipEH = an.tipEW*0.6;
    an.tipFontSize = 30;

    //设置提示标签样式
    an.setTipStyle = function () {
        if(an.tipE){
            an.VisualElement.removeChild(an.tipE);
        }

        //提示标签
        an.tipE = document.createElement('DIV');
        an.tipE.className = "AnchorNav_Tip";
        an.VisualElement.appendChild(an.tipE);
        // an.tipE.style.border = "1px solid red";
        an.tipE.style.width = an.tipEW+"px";
        an.tipE.style.height = an.tipEH+"px";
        an.tipE.style.lineHeight = an.tipEH+"px";

        an.tipE.style.position = "absolute";
        an.tipE.style.top = "30px";
        an.tipE.style.left = "100px";
        an.tipE.style.textAlign = "center";

        //默认隐藏
        an.tipE.hidden = true;
        //
        an.leftTip = document.createElement('DIV');
        an.leftTip.className = "AnchorNav_LeftTip";

        // an.leftTip.style.position = "absolute";
        // an.leftTip.style.borderRadius = "50%";
        // an.leftTip.style.boxSizing = "border-box";
        // an.leftTip.style.zIndex = "30";
        // an.leftTip.style.backgroundColor = "#cbcbcb";

        an.leftTip.style.width = an.tipEH+"px";
        an.leftTip.style.height = an.tipEH+"px";
        an.tipE.appendChild(an.leftTip);

        an.rightTip = document.createElement('DIV');
        an.rightTip.style.border = "1px solid blue";
        an.rightTip.className = "AnchorNav_RightTip";

        // an.rightTip.style.width = an.tipEW*0.4+"px";
        // an.rightTip.style.height = an.tipEH*0.8+"px";
        // an.rightTip.style.boxSizing = "border-box";

        //顶部和底部边框宽度
        var bTW = an.tipEW*0.6*0.9*0.5;
        //上边偏移距离
        var tP = an.tipEH*0.5-bTW;
        //左边偏移距离
        var arc = Math.acos(bTW/(an.tipEH*0.5));
        var lP = an.tipEH*0.5*Math.sin(arc)+an.tipEW*0.5*0.5+1;

        an.rightTip.style.left = an.tipEH+"px";
        an.rightTip.style.borderTopWidth = bTW+"px";
        an.rightTip.style.borderRightWidth = 0+"px";
        an.rightTip.style.borderBottomWidth = bTW+"px";
        an.rightTip.style.borderLeftWidth = (an.tipEW-an.tipEH)+"px";
        an.rightTip.style.borderColor = "transparent transparent transparent #cbcbcb";
        an.rightTip.style.top = tP + "px";
        an.rightTip.style.left = lP + "px";
        an.tipE.appendChild(an.rightTip);

        an.tipSpan = document.createElement('span');
        an.tipSpan.style.fontSize = an.tipFontSize+"px";
        an.tipSpan.style.fontWeight = "900";
        an.tipSpan.style.color = "#f9f9f9";
        an.leftTip.appendChild(an.tipSpan);
    }

    an.onload = function () {
        var anE = an.VisualElement;

        an.container = document.createElement("ul");
        an.container.className = "AnchorNav_Container";
        anE.appendChild(an.container);

        //设置提示标签样式
        an.setTipStyle();

        //手指移动
        anE.addEventListener("touchmove",function (ev) {
            // console.log(ev.changedTouches[0].clientY.toFixed(2));
            var touchObj = ev.changedTouches[0],
                clientX = touchObj.clientX.toFixed(2),
                clientY = touchObj.clientY.toFixed(2);

            an.spans.forEach(function (sp) {
                var domRectObj = sp.getBoundingClientRect();
                var x = domRectObj.x,
                    y = domRectObj.y,
                    maxX = x + domRectObj.width,
                    maxY = y + domRectObj.height;

                var cssObj = window.getComputedStyle(an.VisualElement,null);
                sp.style.backgroundColor = an.btnBgC;
                sp.style.color = cssObj.color;
                sp.style.borderWidth = an.btnBorderW;

                //手指移动时 触摸点在某个span内
                if(clientX>x && clientX<maxX && clientY>y && clientY<maxY){
                    console.log(sp.innerText);
                    an.curTouchedSpan = sp;
                    //手动触发触摸事件
                    // sp.dispatchEvent()
                    sp.style.backgroundColor = an.selectedC;
                    sp.style.color = an.selectedTextC;
                }
            });

            an.refreshTipEPos(an.curTouchedSpan);

            if(an.preTouchedSpan == an.curTouchedSpan){
                console.log("同一个，不执行click方法");

            }else {

                console.log("不是同一个,执行Click方法");

                an.Value = an.curTouchedSpan.innerText;

                if (an.Command != undefined && an.Command != null) {
                    an.Command.Sender = an;
                    an.Command.Execute();
                }
                if(an.Click != undefined && an.Click.GetType() == "Command"){
                    an.Click.Sender = an;
                    an.Click.Execute();
                }

                if(an.Click != undefined && an.Click.GetType() == "function"){
                    an.Click(e,an);
                }

            }

            an.preTouchedSpan = an.curTouchedSpan;
        },false);

        //触摸结束
        anE.addEventListener("touchend",function (ev) {
            ev.cancelBubble = true;
            console.log('end');
            //判断结束时的触摸点是否在控件内部
            var touchObj = ev.changedTouches[0],
                clientX = touchObj.clientX.toFixed(2),
                clientY = touchObj.clientY.toFixed(2);

            an.spans.forEach(function (sp) {
                var domRectObj = sp.getBoundingClientRect();
                var x = domRectObj.x,
                    y = domRectObj.y,
                    maxX = x + domRectObj.width,
                    maxY = y + domRectObj.height;

                var cssObj = window.getComputedStyle(an.VisualElement,null);
                sp.style.backgroundColor = an.btnBgC;
                sp.style.color = cssObj.color;
                sp.style.borderWidth = an.btnBorderW;

                //手指移动时 触摸点在某个span内
                if(clientX>x && clientX<maxX && clientY>y && clientY<maxY){
                    console.log(sp.innerText);
                    sp.style.backgroundColor = an.selectedC;
                    sp.style.color = an.selectedTextC;

                    //选中的字符
                    an.Value = sp.innerText;
                    an.curTouchedSpan = sp;
                }else {
                    an.Value = null;
                }

                an.preTouchedSpan = an.curTouchedSpan;
            })



        },false);

        //触摸取消
        anE.addEventListener("touchcancel",function (ev) {
            console.log('cancel');

        },false)

    }
    an.onload();
    return an;
}

DBFX.Serializer.AnchorNavSerializer = function () {
    //系列化
    this.Serialize = function (c, xe, ns) {
        DBFX.Serializer.SerialProperty("BtnBorderW", c.BtnBorderW, xe);
        DBFX.Serializer.SerialProperty("BtnBorderR", c.BtnBorderR, xe);
        DBFX.Serializer.SerialProperty("BtnBorderC", c.BtnBorderC, xe);
        DBFX.Serializer.SerialProperty("BtnBgC", c.BtnBgC, xe);
        DBFX.Serializer.SerialProperty("SelectedC", c.SelectedC, xe);
        DBFX.Serializer.SerialProperty("SelectedTextC", c.SelectedTextC, xe);
        //序列化方法
        DBFX.Serializer.SerializeCommand("Click", c.Click, xe);
    }

    //反系列化
    this.DeSerialize = function (c, xe, ns) {
        DBFX.Serializer.DeSerialProperty("BtnBorderW", c, xe);
        DBFX.Serializer.DeSerialProperty("BtnBorderR", c, xe);
        DBFX.Serializer.DeSerialProperty("BtnBorderC", c, xe);
        DBFX.Serializer.DeSerialProperty("BtnBgC", c, xe);
        DBFX.Serializer.DeSerialProperty("SelectedC", c, xe);
        DBFX.Serializer.DeSerialProperty("SelectedTextC", c, xe);
        //对方法反序列化
        DBFX.Serializer.DeSerializeCommand("Click", xe, c);
    }

}
DBFX.Design.ControlDesigners.AnchorNavDesigner = function () {
    var obdc = new DBFX.Web.Controls.GroupPanel();
    obdc.OnCreateHandle();
    obdc.OnCreateHandle = function () {
        DBFX.Resources.LoadResource("design/DesignerTemplates/FormDesignerTemplates/AnchorNavDesigner.scrp", function (od) {
            od.DataContext = obdc.dataContext;
            //设计器中绑定事件处理
            od.EventListBox = od.FormContext.Form.FormControls.EventListBox;
            od.EventListBox.ItemSource = [{EventName:"Click",EventCode:undefined,Command:od.dataContext.Click,Control:od.dataContext}];
        }, obdc);
    }

    //事件处理程序
    obdc.DataContextChanged = function (e) {
        obdc.DataBind(e);
        if(obdc.EventListBox != undefined){
            obdc.EventListBox.ItemSource = [{EventName:"Click",EventCode:undefined,Command:obdc.dataContext.Click,Control:obdc.dataContext}];
        }
    }

    obdc.HorizonScrollbar = "hidden";
    obdc.OnCreateHandle();
    obdc.Class = "VDE_Design_ObjectGeneralDesigner";
    obdc.Text = "锚点控件";
    return obdc;
}

