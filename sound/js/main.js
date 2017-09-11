(function(){
app.tools.wxShare(app.hosts.mtq,app.config.wx_token,true);	
//授权,获取互动信息
//	var oOpenid='',oNickname="",oHeadpic='';
//	
//	//授权,获取用户信息	
//	var auth_url = app.hosts.mtq+"/oauth?wx_token="+app.config.wx_token+"&redirect_uri="+encodeURIComponent(location.protocol+"//"+location.host+location.pathname);
//	app.tools.auth(app.hosts.mtq,app.config.wx_token,auth_url,function(error,data){
//		if(error){
//
//			window.location.href=location.protocol+"//"+location.host+location.pathname;
//		}else
//		{
//			console.log(JSON.stringify(data))
//			oOpenid=data.data.openid;	
//			oHeadpic=app.tools.getHead(data.data.weixin_avatar_url,"img/wxhead.jpg");
//			oNickname=data.data.nickname;
//			document.querySelector(".boxT").style.backgroundImage="url("+oHeadpic+")";
//			document.querySelector(".nickname").innerHTML=oNickname;
//			allFn();
//
//		}
//	});
		var sound=document.querySelector(".sound");
		var play=document.querySelector(".play");
		var START=null;
		var END=null;
		
		var localId=null;
		sound.addEventListener("touchstart",function(e){
			e.preventDefault();
		        wx.startRecord({
		            success: function(){
		               START = new Date().getTime();
		                wx.onVoiceRecordEnd({
		                    // 录音时间超过一分钟没有停止的时候会执行 complete 回调
		                    complete: function (res) {
		                        alert('最多只能录制一分钟');
		                        localId = res.localId;
		                        uploadluyin(localId,60000);
		                    }
		                }); 
		            },
		            cancel: function () {
		                alert('用户拒绝授权录音');
		            }
		        });
		},false);
		sound.addEventListener("touchend",function(event){
			 	event.preventDefault();
			    END = new Date().getTime();
		        //录音时间
		        luyintime=END - START;
		        if(luyintime < 2000){
		            END = 0;
		            START = 0;
		            wx.stopRecord({});
		            alert('录音时间不能少于2秒');
		            return false;
		            //小于300ms，不录音
		        }else {
		
		            wx.stopRecord({
		                success: function (res) {
		                    localId = res.localId;
		
		                    uploadluyin(localId,luyintime);
		
		                }
		            });
		        }
		},false);
		
		
		  //  播放音频
		  play.onclick = function () {
		  	//alert(localId)
		    if (localId == null) {
		      alert('请先录制一段声音');
		      return;
		    }
		    wx.playVoice({
		      localId: localId
		    });
		    wx.translateVoice({
			   localId: localId, // 需要识别的音频的本地Id，由录音相关接口获得
			    isShowProgressTips: 1, // 默认为1，显示进度提示
			    success: function (res) {
			        alert(res.translateResult); // 语音识别的结果
			    }
			});
		  };
		
		//上传录音
		function uploadluyin(localId,luyintime) {
	        wx.uploadVoice({
	            localId: localId, // 需要上传的音频的本地ID，由stopRecord接口获得
	            isShowProgressTips: 1, // 默认为1，显示进度提示
	            success: function (res) {
	                var serverId = res.serverId; // 返回音频的服务器端ID
	                alert(serverId);
	                alert("上传成功")
	                play.addEventListener("touchstart",function(){
	                	wx.playVoice({ 
   			 				localId: serverId // 需要播放的音频的本地ID，由stopRecord接口获得 
   			 				//alert("开始播放")
						}); 
	                },false);
					
//	                $.post("/home/xishanluyin/scyuyin", {
//	                            "serverId": serverId,
//	                            "luyintime": luyintime
//	                        },
//	                        function (data) {
//	                            if (data.success == 1) {
//	                                alert('录音成功');
//	                            } else {
//	                                alert(data.msg);
//	                            }
//	                        }, "json");
	            }
	        })
    	}
		
		//注册微信播放录音结束事件【一定要放在wx.ready函数内】
		wx.onVoicePlayEnd({
		    success: function (res) {
		        stopWave();
		    }
		});
		
		
})()
