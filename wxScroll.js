document.body.ontouchmove = function (e) {
    e.preventDefault();
};

var startX = 0, startY = 0;
//touchstart事件  
function touchSatrtFunc(evt) {
    try
    {
        //evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等  

        var touch = evt.touches[0]; //获取第一个触点  
        var x = Number(touch.pageX); //页面触点X坐标  
        var y = Number(touch.pageY); //页面触点Y坐标  
        //记录触点初始位置  
        startX = x;
        startY = y;

    } catch (e) {
        alert('touchSatrtFunc：' + e.message);
    }
}
document.addEventListener('touchstart', touchSatrtFunc, false);

var _ss = document.getElementById('page0');
_ss.ontouchmove = function (ev) {
    var _point = ev.touches[0],
            _top = _ss.scrollTop;
    // 什么时候到底部
    var _bottomFaVal = _ss.scrollHeight - _ss.offsetHeight;
    // 到达顶端
    if (_top === 0) {
        // 阻止向下滑动
        if (_point.clientY > startY) {
            ev.preventDefault();
        } else {
            // 阻止冒泡
            // 正常执行
            ev.stopPropagation();
        }
    } else if (_top === _bottomFaVal) {
        // 到达底部
        // 阻止向上滑动
        if (_point.clientY < startY) {
            ev.preventDefault();
        } else {
            // 阻止冒泡
            // 正常执行
            ev.stopPropagation();
        }
    } else if (_top > 0 && _top < _bottomFaVal) {
        ev.stopPropagation();
    } else {
        ev.preventDefault();
    }
};


var jsonArr = {
    "supplierName": "test supplier",
    "orderNo": "170614071046567495999",
    "shippingName": "zzzz",
    "addTime": "2017-06-14 07:10:46",
    "create_time": null,
    "postscript": "HELIAN",
    "goodsId": "1120",
    "skuValue": "lstextlslsls",
    "bussType": "insertOrder",
    "userName": "Cindy",
    "userId": 25958,
    "userCode": "999",
    "addressId": "774",
    "csessionid": "M2FmNDExOGE5ZjEzNDMyMWIyMGM5Y2QxZTYzOWZlMGM=",
    "isPromote": "0",
    "payPrice": 2,
    "goodsNumber": "1"
}
var arr_1={}
var arr_2={}
var num_style=0;
for (k in jsonArr) {
    num_style++;
    if(num_style%2==1){
        arr_2[k]=jsonArr[k];
        console.log(arr_2)
    }else {
        arr_1[k]=jsonArr[k];
//      console.log(SB_2)
    }
}

