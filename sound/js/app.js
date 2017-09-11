var app={};
(function(window,document,tools){
	app.extends={},//扩展
	app.config = {
		"wx_token":"5bd0ff83bd7c",//微信公众号唯一标识
		"shareObj":{
			"title": '科学总动员',
			"desc": '',
			"link":"//spstatic.yaotv.tvm.cn/opera/joined.html",
			"imgurl":"//spstatic.yaotv.tvm.cn/opera/share1.png"
		},
		"shareObj2":{
			"title": '',
			"desc": '',
			"link":"//spstatic.yaotv.tvm.cn/opera/joined.html",
			"imgurl":"//spstatic.yaotv.tvm.cn/opera/share1.png"
		}
	};//配置相关
	app.hosts ={
		"server":"//spservice.yaotv.tvm.cn",//后台服务地址
//		"poservices":"//spservice.yaotv.tvm.cn",//正式服务地址
		"poservices":"http://122.152.196.153",//测试服务地址
		"mtq":"//mb.mtq.tvm.cn",//媒体桥服务地址"
		"ana":"//ana.mtq.tvm.cn/ana",//广告统计服务地址
		"geocoder":"//apis.map.qq.com/ws/geocoder/v1/",//腾讯GEO服务地址
		"auth":this.mtq+"/oauth?wx_token="+app.config.wx_token+"&redirect_uri="+
encodeURIComponent(location.protocal+"://"+location.host+location.pathname)//授权地址
	};//域名相关
	app.tools ={
		//功能：预加载图片
		//参数：图片路径，回调方法
		//返回：图片对象
		"preloadImage":function(src,callback)
		{
			var img = new Image();
			img.crossOrgin='Anonymous';
			img.src = src;
			img.addEventListener("load",function(e){
				if(typeof(callback) == "function")
				{
					callback(true);
				}
			});
			img.addEventListener("error",function(e){
				if(typeof(callback) == "function")
				{
					callback(false);
				}
			})
			return img;
		},

		//功能：判断对象是否为数组
		//参数：待判断对象
		//返回：如果是数组返回true,否则返回false
	    "isArray":function(object){
			if(Object.prototype.toString.call(object)=='[object Array]'){
				return true;
			}
			return false;
		},

		//功能：是否为一个空对象
		//参数：判断对象
		//返回：bool值
		"isEmptyObject":function(obj)
		{
			if(obj == undefined || obj == null || obj=="")
			{
				return true;
			}else{
				for(var l in obj)
				{
					return false;
				}
			}
			return true;
		},

		//功能：为指定元素添加事件
		//参数：指定元素，事件，事件出发时执行的函数，事件是否在捕获或冒泡阶段执行
		//返回：无
		"addEvent":function(ele,event,fun,useCapture){
			if(window.attachEvent){
				 ele.attachEvent("on"+event,fun);
			}else if(window.addEventListener){
				ele.addEventListener(event,fun,useCapture||false);
			}
		},

		//功能：移除指定元素上添加的事件
		//参数：指定元素，事件，待移除函数，指定移除事件句柄的阶段
		//返回：无
		"removeEvent":function(ele,event,fun,useCapture){
			if(window.attachEvent){
				 ele.detachEvent("on"+event,fun);
			}else if(window.addEventListener){
				ele.removeEventListener(event,fun||null,useCapture||false);
			}
		},

		//功能：删除字符串首尾空格
		//参数：指定字符串
		//返回：格式化后的字符串
		"trim":function(str){
			var s=str||'';
			return s.replace(/^\s+|\s+$/g,'');
		},

		//功能：为指定元素添加类
		//参数：元素，类
		//返回：无
		"addclass":function(ele, classname) {
			if(!this.hasclass(ele, classname)) {
				ele.className += " " + classname;
			}
		},

		//功能：为指定元素删除类
		//参数：元素，类
		//返回：无
		"removeclass":function(ele, classname) {
			if(this.hasclass(ele, classname)) {
				var reg = new RegExp('(\\s|^)' + classname + '(\\s|$)');
				ele.className = ele.className.replace(reg, '');
			}
		},

		//功能：判断元素是否有指定类
		//参数：元素，类
		//返回：如果元素有指定类返回true,否则返回false
		"hasclass":function(ele, classname) {
			return ele.className.match(new RegExp('(\\s|^)' + classname + '(\\s|$)'));
		},
		
		//功能：获取url中指定的参数值
		//参数：指定参数名称
		//返回：参数值
		"getQueryString":function(name){
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
				var search=window.location.search;
				var r = search.substr(1).match(reg);
				if(r != null) return decodeURI(r[2]);
				return null;
		},

		//功能：返回对象类型
		"typeOf":function(_){
			var a=typeof(_);
				if(a==="object"){
					if(_===null){
						a=null
					}else if(_.setAttribute){
						a="DOM"
					}else if(_.shift){
						a="array"
					}
				}
			return a
		},
		//功能：设置元素属性
		//参数：
		//返回：无
		"setAtt":function(_,att,val){
		if(this.typeOf(att)=="object"){
			for(var i in att){
				if(att.propertyIsEnumerable(i))
					Att(i,att[i])	
				}
			}else{	
				Att(att,val)
			}
			function Att(att,val){
				switch(att){
					case "style":_.style.cssText=val;break;
					case "className":_.className=val;break;
					case "html":_.innerHTML=val;break;
					default:_.setAttribute(att,val);break
				}
			}	
		},

		"getChildNodes":function(_,tag){
			var nodes=[],node=_.firstChild;
			if(tag){
				tag=tag.toUpperCase();
				while(node){ 
					if(tag==node.tagName)nodes.push(node);
					node=node.nextSibling;
				} 
			}else{
				while(node){ 
					if(node.tagName)nodes.push(node);
					node=node.nextSibling;
				} 
			}
			return (nodes==""?null:nodes); 	
		},
		//功能：创建指定的元素
		//参数：
		//返回：创建的元素
		"createNode":function(_,tag,type,position){    
			var p=position||"p3"; 
			var node=(typeof(tag)=="string"?document.createElement(tag):tag)
				if(type)this.setAtt(node,type)
				switch(p){ 
					case "p1": 
						_.parentNode.insertBefore(node,_); 
						break; 
					case "p2": 
						_.insertBefore(node,_.firstChild); 
						break; 
					case "p3":
						_.appendChild(node)
						break; 
					case "p4":
						if(_.nextSibling)
							_.parentNode.insertBefore(node,_.nextSibling); 
						else 
							_.parentNode.appendChild(node); 
					break;
					default:
					var child=this.getChildNodes(_)
						if(child){
							if(child[p])_.insertBefore(node,child[p]); 
						}else{
						_.parentNode.insertBefore(node,_.nextSibling)
						}
					break
					 
				} 
			return node
		 },

		//功能：从DOM中移除指定元素
		//参数：指定元素
		//返回：无
		"removeNode":function(_){
			if(!this.isEmptyObject(_) && !this.isEmptyObject(_.parentNode))
			{
				_.parentNode.removeChild(_);
			}
		},

		//功能：动态加载CSS
		//参数：CSS内容，父元素
		//返回：无
		"dynamicAddCSS":function(css, parent) {
			var sty = document.createElement("style");
			sty.setAttribute("type", "text/css");
			if(sty.styleSheet) {
				var setCssText = function() {
					try {
						sty.styleSheet.cssText = css;

					} catch(e) {

					}
				}
				if(sty.styleSheet.disabled) {
					setTimeout(setCssText());
				} else {
					setCssText();
				}
			} else {
				var textNode = document.createTextNode(css);
				sty.appendChild(textNode);
			}
			if(parent) {
				parent.appendChild(sty);
			} else {
				parent = document.head || document.getElementsByTagName("head")[0];
				parent.appendChild(sty);
			}
		},

		//功能发送异步请求
		"setAjax":function(a,b,c,d,e){
			function xmlObj(){
				try{
					return (new ActiveXObject("Msxml2.XMLHTTP")||new ActiveXObject('Microsoft.XMLHTTP'))
					}catch(e){
					return new XMLHttpRequest()
				}	
			}
			return new function(){
				var t=this,errRun=0;
				t.method=a||"get";      
				t.action=b;      
				t.async=(c!=undefined?c:true);  
				t.callBack=(typeof(e)=="function"?e:0)         
				t.data=d||null;	
				t.Open=t.Send=t.Test=t.Over=Function;
				t.Err=function(){xmlhttp=null}
				t.send=function(xmlCache){
					var	xmlhttp=xmlObj();
				    xmlhttp.open(t.method,t.action,t.async);
				  t.set&&t.set.call(xmlhttp);
				  if(t.method.toUpperCase()=="POST"){
						if(!t.set)xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded; charset=UTF-8; text/html");
					}
					function err(){
						t.stop();
						if(errRun)return;errRun=1;
						typeof(t.err)==="function"&&t.err()
						}
					  xmlhttp.onreadystatechange=function(){
						  if(xmlhttp.readyState===4){				
							  if(xmlhttp.status===200||xmlhttp.status===304){
									t.err=null								
								  if(t.callBack)t.callBack.call(xmlhttp,xmlhttp.responseText);//responseXML responseText
									xmlhttp=null;
							 }else{
								 xmlhttp=null;
								 err()
							 }
						  }
					  }				  
					  xmlhttp.send(t.data);
					  t.stop=function(){					
						xmlhttp&&xmlhttp.abort()
						}	
					setTimeout(function(){	
						if(t.err)err()
					},15000)						  
					};
				}	
		},

		//功能：发送jsonP请求
		//参数：资源路径，回调方法，父元素
		//返回：无
		"setJsonp":function(src,callback,_){	
			var js=document.createElement("script"),_=_||document.documentElement;
			js.src=src;
			 _.appendChild(js);
			 js.onreadystatechange=js.onload=function(e){
				 var read=js.readyState;
				 if(read){
					if(read=="loaded")callback&&callback(1)
				 }else{
					 callback&&callback(1)
				 }
				 _.removeChild(js); 
				 }
			js.onerror=err;
			function err(error){
				if(typeof(callback)==="function")
				{
					callback(0);
				}
				_.removeChild(js);
			}
		},

		//功能：格式化微信头像地址 
		//参数：头像地址,默认头像路径
		//返回：格式化后的头像地址
		"getHead":function($url,defaultImg){
		    if(!$url)return defaultImg;
		    var url=decodeURIComponent($url)
		    if(/\.jpg$|\.png$|\.gif$/gi.test(url))return url
		    else{     
		      return url.indexOf("tvm")>-1?url:url.replace(/\/0$|\/64$|\/96$/,'').replace("http://wx.qlogo.cn/mmopen/http://wx.qlogo.cn/mmopen/","//wx.qlogo.cn/mmopen/")+"/64"
		    }
		},

		//功能：播放音频
		//参数：音频地址，全局变量名称
		//返回：无
		"audioPlay":function($url,$f){
			var that=this.audioPlay;
			var url=$url,audio;
			if($f){
				if(!that[$f])that[$f]=audio=new Audio;
				else audio=that[$f]
			}else{
				if(!that.sound)that.sound=audio=new Audio;
				else audio=that.sound
			}
			audio.src=url;
			audio.play();
		},
		//功能：微信分享
		//参数：分享调用域名，微信token
		//返回：无
		//功能：微信分享
		//参数：分享调用域名，微信token,分享相关信息对象
		//返回：无
		"wxShare":function(host,wx_token,ishidden,share){
//			ishidden = ishidden || true;
			window.getWX=function($data){
				wx.config({
				  debug:false,
				  appId:$data.appid,
				  timestamp: $data.timestamp,
				  nonceStr: $data.noncestr,
				  signature:$data.signature,
					jsApiList: [
					"onMenuShareTimeline", 
					"onMenuShareAppMessage", 
					"onMenuShareQQ", 
					"onMenuShareWeibo",
					 "onMenuShareQZone", 
					 "startRecord", 
					 "stopRecord", 
					 "onVoiceRecordEnd",
					 "playVoice",
					 "pauseVoice",
					 "stopVoice", 
					 "onVoicePlayEnd", 
					 "uploadVoice", 
					 "downloadVoice", 
					 "chooseImage", 
					 "previewImage", 
					 "uploadImage", 
					 "downloadImage", 
					 "translateVoice", 
					 "getNetworkType", 
					 "openLocation", 
					 "getLocation", 
					 "hideOptionMenu", 
					 "showOptionMenu", 
					 "hideMenuItems", 
					 "showMenuItems", 
					 "hideAllNonBaseMenuItem", 
					 "showAllNonBaseMenuItem", 
					 "closeWindow", 
					 "scanQRCode", 
					 "chooseWXPay", 
					 "openProductSpecificView", 
					 "addCard", 
					 "chooseCard", 
					 "openCard"]
				 }),
				wx.ready(function(){
	           		wx.getNetworkType({
					  success:function(res){
							
					  },
					  fail: function (res) {
					  	//获取网络状态失败
					  }
					})
	                wx.onMenuShareTimeline({
	                    title: app.config.shareObj2.title,
	                    desc: app.config.shareObj2.desc,
	                    link: app.config.shareObj2.link,
	                    imgUrl: app.config.shareObj2.imgurl
//	                    success: function (e) {
//	                       if(typeof(shareObj.success)=="function")
//	                       {
//	                       		shareObj.success();
//	                       }
//	                    },
//	                    fail: function(e){
//	                       if(typeof(shareObj.fail)=="function")
//	                       {
//	                       		shareObj.fail();
//	                       }
//	                    },
//	                    complete:function(e){
//	                       if(typeof(shareObj.complete)=="function")
//	                       {
//	                       		shareObj.complete();
//	                       }
//	                    },
//	                    cancel: function (e) {
//	                       if(typeof(shareObj.cancel)=="function")
//	                       {
//	                       		shareObj.cancel();
//	                       }
//	                    },
//	                    trigger: function (e) {
//	                       if(typeof(shareObj.trigger)=="function")
//	                       {
//	                       		shareObj.trigger();
//	                       }
//	                    }
	                }), wx.onMenuShareAppMessage({
	                    title: app.config.shareObj.title,
	                    desc: app.config.shareObj.desc,
	                    link: app.config.shareObj.link,
	                    imgUrl: app.config.shareObj.imgurl
//	                    success: function (e) {
//	                       if(typeof(shareObj.success)=="function")
//	                       {
//	                       		shareObj.success();
//	                       }
//	                    },
//	                    fail: function(e){
//	                       if(typeof(shareObj.fail)=="function")
//	                       {
//	                       		shareObj.fail();
//	                       }
//	                    },
//	                    complete:function(e){
//	                       if(typeof(shareObj.complete)=="function")
//	                       {
//	                       		shareObj.complete();
//	                       }
//	                    },
//	                    cancel: function (e) {
//	                       if(typeof(shareObj.cancel)=="function")
//	                       {
//	                       		shareObj.cancel();
//	                       }
//	                    },
//	                    trigger: function (e) {
//	                       if(typeof(shareObj.trigger)=="function")
//	                       {
//	                       		shareObj.trigger();
//	                       }
//	                    }
	                }), wx.onMenuShareQQ({
	                    title: app.config.shareObj.title,
	                    link: app.config.shareObj.link,
	                    desc: app.config.shareObj.desc,
	                    imgUrl: app.config.shareObj.imgurl
//	                    success: function (e) {
//	                       if(typeof(shareObj.success)=="function")
//	                       {
//	                       		shareObj.success();
//	                       }
//	                    },
//	                    fail: function(e){
//	                       if(typeof(shareObj.fail)=="function")
//	                       {
//	                       		shareObj.fail();
//	                       }
//	                    },
//	                    complete:function(e){
//	                       if(typeof(shareObj.complete)=="function")
//	                       {
//	                       		shareObj.complete();
//	                       }
//	                    },
//	                    cancel: function (e) {
//	                       if(typeof(shareObj.cancel)=="function")
//	                       {
//	                       		shareObj.cancel();
//	                       }
//	                    },
//	                    trigger: function (e) {
//	                       if(typeof(shareObj.trigger)=="function")
//	                       {
//	                       		shareObj.trigger();
//	                       }
//	                    }
	                }), wx.onMenuShareWeibo({
	                    title: app.config.shareObj.title,
	                    link: app.config.shareObj.link,
	                    desc: app.config.shareObj.desc,
	                    imgUrl: app.config.shareObj.imgurl
//	                    success: function (e) {
//	                       if(typeof(shareObj.success)=="function")
//	                       {
//	                       		shareObj.success();
//	                       }
//	                    },
//	                    fail: function(e){
//	                       if(typeof(shareObj.fail)=="function")
//	                       {
//	                       		shareObj.fail();
//	                       }
//	                    },
//	                    complete:function(e){
//	                       if(typeof(shareObj.complete)=="function")
//	                       {
//	                       		shareObj.complete();
//	                       }
//	                    },
//	                    cancel: function (e) {
//	                       if(typeof(shareObj.cancel)=="function")
//	                       {
//	                       		shareObj.cancel();
//	                       }
//	                    },
//	                    trigger: function (e) {
//	                       if(typeof(shareObj.trigger)=="function")
//	                       {
//	                       		shareObj.trigger();
//	                       }
//	                    }
	                }), wx.onMenuShareQZone({
	                    title: app.config.shareObj.title,
	                    link: app.config.shareObj.link,
	                    desc: app.config.shareObj.desc,
	                    imgUrl: app.config.shareObj.imgurl
//	                    success: function (e) {
//	                       if(typeof(shareObj.success)=="function")
//	                       {
//	                       		shareObj.success();
//	                       }
//	                    },
//	                    fail: function(e){
//	                       if(typeof(shareObj.fail)=="function")
//	                       {
//	                       		shareObj.fail();
//	                       }
//	                    },
//	                    complete:function(e){
//	                       if(typeof(shareObj.complete)=="function")
//	                       {
//	                       		shareObj.complete();
//	                       }
//	                    },
//	                    cancel: function (e) {
//	                       if(typeof(shareObj.cancel)=="function")
//	                       {
//	                       		shareObj.cancel();
//	                       }
//	                    },
//	                    trigger: function (e) {
//	                       if(typeof(shareObj.trigger)=="function")
//	                       {
//	                       		shareObj.trigger();
//	                       }
//	                    }
	                });
	                if(ishidden){
	                	wx.hideOptionMenu();
	                }
	                else
	                {
	                	
	                	wx.showOptionMenu();
	                }
					}),
				wx.error(function (e) {

		        });
			}

			var eurl=window.location.href;
			var index=-1;
			index=eurl.indexOf('#');
			if(index>=0)
			{
				var eurl= eurl.substr(0,index);
			}
			eurl=encodeURIComponent(eurl);
			this.setJsonp(host+"/ufo/signature?cb=getWX&url="+eurl+"&wx_token="+wx_token);
			
		},
		//禁用微信分享
//		"wxNoShare":function(host,wx_token,shareObj){
//			window.getWX=function($data){
//				wx.config({
//				  debug:false,
//				  appId:$data.appid,
//				  timestamp: $data.timestamp,
//				  nonceStr: $data.noncestr,
//				  signature:$data.signature,
//					jsApiList: [
//					"onMenuShareTimeline", 
//					"onMenuShareAppMessage", 
//					"onMenuShareQQ", 
//					"onMenuShareWeibo",
//					 "onMenuShareQZone", 
//					 "startRecord", 
//					 "stopRecord", 
//					 "onVoiceRecordEnd",
//					 "playVoice",
//					 "pauseVoice",
//					 "stopVoice", 
//					 "onVoicePlayEnd", 
//					 "uploadVoice", 
//					 "downloadVoice", 
//					 "chooseImage", 
//					 "previewImage", 
//					 "uploadImage", 
//					 "downloadImage", 
//					 "translateVoice", 
//					 "getNetworkType", 
//					 "openLocation", 
//					 "getLocation", 
//					 "hideOptionMenu", 
//					 "showOptionMenu", 
//					 "hideMenuItems", 
//					 "showMenuItems", 
//					 "hideAllNonBaseMenuItem", 
//					 "showAllNonBaseMenuItem", 
//					 "closeWindow", 
//					 "scanQRCode", 
//					 "chooseWXPay", 
//					 "openProductSpecificView", 
//					 "addCard", 
//					 "chooseCard", 
//					 "openCard"]
//				 }),
//				wx.ready(function(){
//					wx.hideOptionMenu();
//	                
//					}),
//				wx.error(function (e) {
//
//		        });
//			}
//
//			var eurl=window.location.href;
//			var index=-1;
//			index=eurl.indexOf('#');
//			if(index>=0)
//			{
//				var eurl= eurl.substr(0,index);
//			}
//			eurl=encodeURIComponent(eurl);
//			this.setJsonp(host+"/ufo/signature?cb=getWX&url="+eurl+"&wx_token="+wx_token);
//			
//		},
		
		
		
		
		
		


		//功能：授权
		//参数：域名,wx_token,重定向地址,回调方法
		//返回：无
		"auth":function(host,wx_token,url,callback){
			return callback(null,{data:{openid:"测试OPENID",nickname:"测试昵称",weixin_avatar_url:"",sex:1}});
			 var openid=this.getQueryString("openid");
			 if(openid == null){
			 	location.href=url;
			 }else{
			 	var localUser=JSON.parse(localStorage.getItem("userInfo"+openid));
			 	if(localUser==null){
			 		window.getUserInfo=function(data){
			 			data=data||{err:true,msg:""};
			 			if(data.err == false) {
			 				data.msg=data.msg||{};
			 				if(data.msg.openid != openid)
			 				{
			 					callback({errMsg:"用户身份无法识别"},null);
			 				}else
			 				{
			 					var user={};
			 					user.nickname = data.msg.nickname || "";
			 					user.weixin_avatar_url = data.msg.weixin_avatar_url || "";
			 					user.sex=data.msg.sex;
			 					user.openid=data.msg.openid;
			 					localStorage.setItem("userInfo"+openid,JSON.stringify(user));
			 					callback(null,{data:user});					
			 				}
			 			}else{
			 				callback({errMsg:data.msg},null);
			 			}
			 		}
			 		this.setJsonp(host+"/ufo/puserinfo?cb=getUserInfo&wx_token="+wx_token+"&openid="+openid);
			 	}else{
			 		callback(null,{data:localUser});
			 	}
			 }
		}
	};//工具对象

})(window,document,app);