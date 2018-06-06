var document = {};

// var ckplayer_id = (typeof document.getElementsByName('movie')[0] == "undefined") ? "ckplayer_a1" : document.getElementsByName('movie')[0].parentNode.id;
// var a1 = document.getElementById('a1');
// var wP;
// var playData = [];
// var playIdx = 0;
// if (typeof jQuery == "undefined") {
//     jQueryJS = document.createElement("script");
//     jQueryJS.type = "text/javascript";
//     jQueryJS.src = "//apps.bdimg.com/libs/jquery/1.11.3/jquery.min.js";
//     document.getElementsByTagName("head")[0].appendChild(jQueryJS);
// }
// ;function check_jQuery() {
//     if (typeof jQuery != "undefined") {
//         clearInterval(cjInterval);
//         CKobject.getObjectById(ckplayer_id).weParser_scriptLoaded();
//     }
// };
// function weParse_Play(data) {
//     if (typeof data.image == 'undefined') {
//         data.image = '';
//     }
//     playData = data;
//     if (data.urls.length > 1) {
//         //partPlay = true;
// 		$('#a1').hide();
// 		$('#error').show();
// 		$('#error').html('视频为分段播放，几分钟一段<br/>播放完一段会自动播放下一段');
//         setTimeout(function(){
// 			$('#error').hide();
// 			$('#a1').show();
// 			wP.play();
// 		}, 4000);
//     }
//     if (data.urls.length == 0) {
// 		$('#a1').hide();
// 		$('#error').show();
// 		$('#error').html('视频源为空！');
//         return
//     }
//     wP = document.createElement('video');
//     wP.id = 'videoPlayer';
//     wP.style.width = '100%';
//     wP.style.height = '100%';
//     wP.controls = 'controls';
//     wP.poster = data.image;
//     a1.appendChild(wP);
//
//     var playLink = playData.urls[0].u;
//     wP.src = playLink;
//     if (playData.urls.length == 1) {
//         return;
//     }
//     wP.onended = function() {
//         playIdx++;
//         if (playIdx < playData.urls.length) {
//             wP.src = playData.urls[playIdx].u;
//             wP.play();
//         } else {
//             playIdx = 0;
//             wP.src = playData.urls[playIdx].u;
//         }
//     }
//     wP.onseeking = function() {
//         if (wP.currentTime < 2 && playIdx > 0) {
//             playIdx--;
//             wP.src = playData.urls[playIdx].u;
//             wP.play();
//             setTimeout('wP.currentTime = playData.urls[playIdx].d - 5;', 500);
//         } else if (wP.currentTime > playData.urls[playIdx].d - 2 && playIdx < playData.urls.length - 1) {
//             playIdx++;
//             wP.src = playData.urls[playIdx].u;
//             wP.play();
//         }
//     }
// }
// var oMeta = document.createElement('meta');
// oMeta.name = 'referrer';
// oMeta.content = 'never';
// document.getElementsByTagName('head')[0].appendChild(oMeta);

function weParser_Play(obj) {
    CKobject.getObjectById(ckplayer_id).weParser_Play(obj);
}
;function weParser_Error() {
    CKobject.getObjectById(ckplayer_id).weParser_Error();
}
;function weParser_Report(BossId, rptPwd, rptData) {
    rptData.BossId = BossId;
    rptData.Pwd = rptPwd;
    $.ajax({
        url: "https://weparser.duapp.com/kvcollect",
        type: "POST",
        data: rptData
    });
}
;weParser = {
    cookie: {
        get: function(name) {
            var arr = "";
            var reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg)) {
                return unescape(arr[2]);
            } else {
                return null;
            }
        },
        set: function(name, value) {
            var Days = 10;
            var exp = new Date();
            exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
            document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
        }
    },
    data: {},
    h5play: {
        parse: function(params) {
            weParser.data = params;
            if (typeof params.parser != "undefined" && params.parser) {
                weParser[params.parser].parse(params);
                return;
            }
            ;if (typeof document.createElement('video').canPlayType == "undefined") {
                weParser_Play({
                    success: true,
                    urls: [{
                        u: params.url,
                        d: 0,
                        s: 0
                    }],
                    type: params.type
                });
                return;
            }
            ;if (params.type == "mp4") {
                $("style").remove();
                $("#" + ckplayer_id).parent().addClass("dplayer");
                $("<link>").attr({
                    rel: "stylesheet",
                    type: "text/css",
                    href: "//weParserlib.duapp.com/lib/css/DPlayer.min.css"
                }).appendTo("head");
                $.ajaxSetup({
                    cache: true
                });
                $.getScript("//cdn.bootcss.com/dplayer/1.1.4/DPlayer.min.js").done(function() {
                    var dp = new DPlayer({
                        element: $("#" + ckplayer_id).parent()[0],
                        autoplay: true,
                        theme: "#FADFA3",
                        loop: false,
                        lang: "zh",
                        screenshot: false,
                        hotkey: true,
                        preload: "auto",
                        video: {
                            url: weParser.data.url,
                            type: "normal"
                        }
                    });
                });
            }
            ;
        }
    },
	strsub:function(str,start,end){
		var s = str.indexOf(start) + start.length;
		var e = str.indexOf(end,s);
		return str.substring(s,e);
	},
	dplayer_play:function(params){
		var isiPad = navigator.userAgent.match(/iPad|iPhone|Android|Linux|iPod/i) != null;
		if(isiPad){
			document.getElementById('a1').innerHTML = '<video src="'+params.mobile+'" controls="controls" width="100%" height="100%"></video>';
			$('<div class="content" id="divBag" style="position: fixed;left: 0px;top: 0px;z-index: 1;background-color: rgba(0,0,0,0);"></div>').appendTo($('body'));
			$('#divBag').on('click',function(){
				$('video').get(0).play();
				$(this).remove();
			});
		}else{
			var dp = new DPlayer({
				element: document.getElementById('a1'),
				autoplay: true,
				video: {
					quality: params.data,
					defaultQuality: params.data.length-1
				}
			});
		}
	},
	qq_mobile:{
		parse: function(params){
			weParser.qq.parse(params);
		}
	},
    qq: {
        parse: function(params) {
            var g = weParser.qq.gettime();
			var h = weParser.qq.createGUID();
			var i = '10201';
			var j = 'v1010';
			weParser.qq.getPushGuid(params.vid, h, i, '');
			$.ajax({
				url: 'https://vd.l.qq.com/proxyhttp',
				async: false,
				type: 'POST',
				dataType: 'json',
				crossDomain: !0,
				xhrFields: {
					withCredentials: !0
				},
				contentType: 'text/plain',
				data: JSON.stringify({
					adparam: '',
					buid: 'vinfoad',
					vinfoparam: $.param({
						charge: 0,
						defaultfmt: 'auto',
						otype: 'json',
						guid: h,
						flowid: weParser.qq.createGUID() + '_' + i,
						platform: i,
						sdtfrom: j,
						defnpayver: 1,
						appVer: '3.5.41',
						host: 'film.qq.com',
						refer: 'http://film.qq.com/film_index_prevue/index.html?firstVid=' + params.vid,
						ehost: 'http://film.qq.com/film_index_prevue/index.html',
						sphttps: 1,
						tm: g,
						spwm: 4,
						vid: params.vid,
						defn: 'mp4',
						fhdswitch: 0,
						show1080p: 0,
						isHLS: 1,
						dtype: 3,
						defsrc: 1,
						encryptVer: weParser.qq.getencrypt(),
						cKey: weParser.qq.ckey7(params.vid, g, i)
					})
				}),
				success: function(d) {
					var b = weParser.qq.strsub(d.vinfo, 'QZOutputJson=', '};') + '}';
					b = JSON.parse(b);
					if (b.vl.vi[0].drm == 1) {
						i = '11001';
						var c = weParser.qq.qv(i, params.vid, j, 1, g);
						$.ajax({
							url: 'https://h5vv.video.qq.com/getinfo',
							async: false,
							dataType: 'jsonp',
							jsonpCallback: 'jsonp' + g,
							data: {
								charge: 0,
								defaultfmt: 'auto',
								otype: 'json',
								guid: h,
								flowid: weParser.qq.createGUID() + '_' + i,
								platform: i,
								sdtfrom: j,
								defnpayver: 0,
								appVer: '3.3.367',
								host: 'm.v.qq.com',
								ehost: 'https://m.v.qq.com/play.html?vid=' + params.vid,
								sphttps: 1,
								_rnd: g,
								spwm: 4,
								vid: params.vid,
								defn: 'mp4',
								fhdswitch: 0,
								show1080p: 0,
								isHLS: 0,
								fmt: 'auto',
								defsrc: 1,
								dtype: 1,
								clip: 4,
								sphls: 0,
								_qv_rmt: c.u1,
								_qv_rmt2: c.u2
							},
							success: function(d) {
								var a = d.vl.vi[0].ul.ui[0].url + d.vl.vi[0].fn + '?sdtfrom=' + j + '&guid=' + h + '&vkey=' + d.vl.vi[0].fvkey.substring(0, 64) + '&platform=2';
								weParser.qq.getPushGuid(params.vid, h, i, a);
								$('#a1').empty();
								weParser.dplayer_play({
									data: [{
										name: '自动',
										type: 'mp4',
										url: a
									}],
									mobile: a
								})
							}
						})
					} else {
						if (b.dltype == 3) {
							var e = b.vl.vi[0].ul.ui[0].url + b.vl.vi[0].ul.ui[0].hls.pt;
							e = e.replace('ltsdl.qq.com', 'stsws.qq.com');
							weParser.qq.getPushGuid(params.vid, h, i, e);
							$('#a1').empty();
							weParser.dplayer_play({
								data: [{
									name: '自动',
									type: 'hls',
									url: e
								}],
								mobile: e
							})
						} else if (b.dltype == 1) {
							var e = b.vl.vi[0].ul.ui[0].url + b.vl.vi[0].fn + '?sdtfrom=' + j + '&guid=' + h + '&vkey=' + b.vl.vi[0].fvkey + '&platform=2';
							weParser.qq.getPushGuid(params.vid, h, i, e);
							$('#a1').empty();
							weParser.dplayer_play({
								data: [{
									name: '自动',
									type: 'mp4',
									url: e
								}],
								mobile: e
							})
						}
					}
				}
			})
        },
		getStdfrom: function(a, d) {
			if (a && "70201" == a) return "v1104";
			if (a && "70901" == a) return "v1103";
			if (a && "3670201" == a) return "v1105";
			var b = "view.inews.qq.com" === b,
				c = c.indexOf("caixin.com") > -1;
			return c ? "v1093" : this.useragent().mobile || "ke.qq.com" !== c ? this.useragent().os.iphone || this.useragent().os.ipod ? b ? "v3110" : "v3010" : this.useragent().os.ipad ? b ? "v4110" : "v4010" : this.useragent().os.android ? this.useragent().os.tablet ? "v6010" : b ? "v5110" : "v5010" : this.useragent().browser.IEMobile ? "v7010" : "v1010" : "v1101"
		},
		dateFormat: function(a) {
			var b = new Date(),
				a = a || "yyyy-MM-dd hh:mm:ss";
			var c = {
				"M+": b.getMonth() + 1,
				"d+": b.getDate(),
				"h+": b.getHours(),
				"m+": b.getMinutes(),
				"s+": b.getSeconds(),
				"q+": Math.floor((b.getMonth() + 3) / 3),
				S: b.getMilliseconds()
			};
			/(y+)/.test(a) && (a = a.replace(RegExp.$1, (b.getFullYear() + "").substr(4 - RegExp.$1.length)));
			for (var d in c) new RegExp("(" + d + ")").test(a) && (a = a.replace(RegExp.$1, 1 == RegExp.$1.length ? c[d] : ("00" + c[d]).substr(("" + c[d]).length)));
			return a
		},
		getPushGuid: function(a, b, c, d) {
			var e = new Array(),
				ctime = this.dateFormat("yyyy-MM-dd hh:mm S");
			if (d == '') {
				e.push("//tj.video.qq.com/fcgi-bin/set_cookie?" + $.param({
					lv_irt_id: '',
					dm: 'v.qq.com',
					ua: navigator.userAgent,
					r: '',
					vid: a,
					sr: '1600x900',
					ul: 'zh-CN',
					tv: '0.0.7',
					pt: '腾讯视频',
					guid: b,
					url: 'http://film.qq.com/film_index_prevue/index.html?firstVid=' + a,
					from: 'http://film.qq.com/film_index_prevue/index.html?firstVid=' + a,
					playing_url: ''
				}));
				e.push("//btrace.video.qq.com/kvcollect?" + $.param({
					BossId: '3717',
					Pwd: '1055758521',
					version: '3.3.367',
					uid: b,
					pid: b,
					vid: a,
					player_type: 'h5',
					video_type: 1,
					platform: c,
					usr_action: 'pause',
					usr_action_detail: '',
					url: 'http://film.qq.com/film_index_prevue/index.html?firstVid=' + a,
					vid: a,
					ptag: 'v.qq.com#v.play.adaptor#2',
					mreferrer: 'https://v.qq.com/',
					start: 0
				}));
				e.push("//btrace.video.qq.com/kvcollect?BossId=4501&Pwd=142347456&loginid=&loginex=&logintype=0&guid=" + b + "&longitude=&latitude=&vip=0&online=1&p2p=0&downloadkit=0&resolution=1280*720*1.5&testid=&osver=windows+10.0&playerver=&playertype=1&uip=&confid=&cdnip=&cdnid=&cdnuip=&freetype=&sstrength=&network=&speed=&device=&appver=3.3.367&p2pver=&url=https%3A%2F%2Fv.qq.com%2Fx%2Fcover%2Flqp2m6v1m450l3n.html&refer=&ua=Mozilla%2F5.0+(Windows+NT+10.0%3B+WOW64)+AppleWebKit%2F537.36+(KHTML++like+Gecko)+Chrome%2F55.0.2883.87+Safari%2F537.36&ptag=&flowid=" + b + "_" + c + "&platform=" + c + "&dltype=1&vid=" + a + "&fmt=&rate=&clip=&status=&type=&duration=&data=%7B%22code%22%3A%22%22%2C%22stime%22%3A1508894110924%7D&step=0&seq=0");
				e.push("//btrace.video.qq.com/kvcollect?BossId=4501&Pwd=142347456&loginid=&loginex=&logintype=0&guid=" + b + "&longitude=&latitude=&vip=0&online=1&p2p=0&downloadkit=0&resolution=1280*720*1.5&testid=&osver=windows+10.0&playerver=&playertype=1&uip=&confid=&cdnip=&cdnid=&cdnuip=&freetype=&sstrength=&network=&speed=&device=&appver=3.3.367&p2pver=&url=https%3A%2F%2Fv.qq.com%2Fx%2Fcover%2Flqp2m6v1m450l3n.html&refer=&ua=Mozilla%2F5.0+(Windows+NT+10.0%3B+WOW64)+AppleWebKit%2F537.36+(KHTML++like+Gecko)+Chrome%2F55.0.2883.87+Safari%2F537.36&ptag=&flowid=" + b + "_" + c + "&platform=" + c + "&dltype=1&vid=" + a + "&fmt=&rate=&clip=&status=&type=&duration=&data=%7B%22stime%22%3A1508894111146%2C%22etime%22%3A1508894111834%2C%22code%22%3A%22%22%7D&step=5&seq=1");
				e.push("//btrace.video.qq.com/kvcollect?BossId=4298&Pwd=686148428&uin=&vid=" + a + "&coverid=&pid=" + b + "&guid=" + b + "&unid=&vt=&type=&url=https%3A%2F%2Fv.qq.com%2Fx%2Fcover%2Flqp2m6v1m450l3n.html&bi=&bt=&version=3.3.367&platform=" + c + "&format=&defn=&ctime=" + ctime + "&ptag=&isvip=0&tpid=1&pversion=chromehls&hc_uin=&hc_main_login=&hc_vuserid=&hc_openid=&hc_appid=&hc_pvid=494205040&hc_ssid=&hc_qq=&hh_ua=Mozilla%2F5.0+(Windows+NT+10.0%3B+WOW64)+AppleWebKit%2F537.36+(KHTML++like+Gecko)+Chrome%2F55.0.2883.87+Safari%2F537.36&ckey=&iformat=&hh_ref=https%3A%2F%2Fv.qq.com%2Fx%2Fcover%2Flqp2m6v1m450l3n.html&vurl=&v_idx=0&rcd_info=&extrainfo=&step=3&val=1&idx=0&diagonal=1009&isfocustab=1&isvisible=1")
			} else {
				e.push("//btrace.video.qq.com/kvcollect?" + $.param({
					BossId: '2865',
					Pwd: '1698957057',
					_dc: 0,
					version: 'TenPlayerHTML5V2.0',
					vid: a,
					rid: weParser.qq.createGUID(),
					pid: weParser.qq.createGUID(),
					url: 'http://film.qq.com/film_index_prevue/index.html?firstVid=' + a,
					platform: c,
					pfversion: '9.1',
					vt: 203,
					tpid: 9,
					vurl: d,
					bt: 5905,
					step: 3,
					ctime: ctime,
					val: 1,
					isshortvd: 0,
					opensource: 0,
					cmid: weParser.qq.createGUID(),
					ua: navigator.userAgent
				}))
			}
			for (var i = 0; i < e.length; i++){
				document.createElement("img").src=e[i];
			}
		},
		useragent: function(a) {
			var a = a || navigator.userAgent,
				a = a.toLowerCase(),
				browser = {}, os = {}, phone = {}, mobile = !1;
			a.indexOf("mobile") > -1 && (mobile = !0);
			var b, c, d = {
					android_1: /android[\s\/]([\d\.]+)/i,
					android_2: /android/i,
					android_3: /MIDP-/i,
					ipod_1: /iPod\stouch;\sCPU\siPhone\sos\s([\d_]+)/i,
					ipod_100: /iPod.*os\s?([\d_\.]+)/i,
					iphone: /iPhone;\sCPU\siPhone\sos\s([\d_]+)/i,
					iphone_100: /iPhone.*os\s?([\d_\.]+)/i,
					ipad_1: /ipad;\scpu\sos\s([\d_]+)/i,
					ipad_2: /ipad([\d]+)?/i,
					windows: /windows\snt\s([\d\.]+)/i,
					mac: /Macintosh.*mac\sos\sx\s([\d_\.]+)/i,
					linux: /Linux/i
				};
			for (var e in d)
				if (b = d[e].exec(a)) {
					c = e.replace(/_\d+/, ""), os[c] = !0, os.name = c, b[1] && (os.version = b[1].replace(/_/g, "."));
					break
				}(os.iphone || os.ipad || os.ipod) && (os.ios = !0);
			var f, g, h = {
					wechat: /MicroMessenger\/([\d\.]+)/i,
					ipadqq: /IPadQQ\/([\d\.]+)/i,
					mqq: /qq\/([\d\.]+)/i,
					qzone: /QZONEJSSDK\/([\d\.]+)/i,
					mqqbrowser: /mqqbrowser\/([\d\.]+)/i,
					qqbrowser: /[^m]QQBrowser\/([\d\.]+)/i,
					x5: /tbs\/(\d+)/i,
					uc: /UCBrowser\/([\d\.]+)/i,
					safari_1: /Version\/(([\d\.]+))\sSafari\/[\d\.]+/i,
					safari_2: /Safari\/([\d\.]+)/i,
					firefox: /Firefox\/([\d\.]+)/i,
					opera: /OPR\/([\d\.]+)/i,
					ie_1: /MSIE\s([\d\.]+)/i,
					ie_2: /(trident\/\d\.\d)/i,
					ie_3: /(Edge)\/\d+\.\d+/i,
					weibo: /weibo__([\d\.]+)/i,
					qqnews: /qqnews\/([\d\.]+)/i,
					qqlive_1: /QQLiveBrowser\/([\d\.]+)/i,
					qqlive_2: /QQLiveHDBrowser\/([\d\.]+)/i,
					kuaibao: /qnreading\/([\d\.]+)/i,
					liebao: /LieBaoFast\/([\d\.]+)/i,
					douban: /com\.douban\.frodo\/([\d\.]+)/i,
					miuibrowser: /MiuiBrowser/i,
					baidu: /baiduboxapp/i,
					browser360: /360browser/i,
					oppobrowser: /OppoBrowser/i,
					chrome_1: /CriOS\/([\d\.]+)/i,
					chrome_2: /Chrome\/([\d\.]+)/i,
					qqdownloader: /qqdownloader\/([\d\.]+)/i
				};
			for (var i in h)
				if (f = h[i].exec(a)) {
					if (g = i.replace(/_\d+/, ""), browser[g]) return;
					browser[g] = {
						version: f[1]
					}
				}
			os.android && browser.safari && delete browser.safari, browser.chrome && browser.safari && delete browser.safari, browser.ie && browser.ie.version && browser.ie.version.indexOf("trident") > -1 && (browser.ie.version.indexOf("6.0") > -1 ? browser.ie.version = "10" : browser.ie.version.indexOf("5.0") > -1 ? browser.ie.version = "9" : browser.ie.version.indexOf("4.0") > -1 ? browser.ie.version = "8" : browser.ie.version = "11");
			var j, k = {
					ipod: /iPod/i,
					ipad: /iPad/i,
					iphone: /iPhone/i,
					wp: /Windows Phone ([\d.]+)/,
					huawei_1: /HUAWEI([\w_-]+)/i,
					huawei_2: /(CHM-\w+)/i,
					huawei_3: /(HonorChe)/i,
					huawei_4: /HONORPLK/i,
					huawei_5: /(Che\d+-CL\d+)/i,
					huawei_6: /(H\d+-L\d+)/i,
					huawei_100: /HUAWEI/i,
					xiaomi_1: /(HM\sNOTE)/i,
					xiaomi_2: /(HM\s\w+)/i,
					xiaomi_3: /(MI\s\w+)/i,
					xiaomi_4: /(MI-ONE\sPlus)/i,
					xiaomi_5: /(M1)\sBuild/i,
					xiaomi_6: /(HM\d+)/i,
					xiaomi_7: /Xiaomi[\s_]?([\w_]+)/i,
					samsung_1: /(GT-\w+)/i,
					samsung_2: /(SCH-\w+)/i,
					samsung_3: /(SM-\w+)/i,
					vivo: /vivo\s(\w+)/i,
					oneplus: /ONEPLUS-([a-z0-9]+)/i,
					lenovo_1: /Lenovo[\s-]?([\w-]+)/i,
					lenovo_100: /Lenovo/i,
					zte_1: /ZTE\s?(\w+)?/i,
					zte_2: /ZTE/i,
					coolpad_1: /Coolpad\s(\w+)/i,
					coolpad_100: /Coolpad/i,
					oppo_1: /OPPO\s?(\w+)/i,
					oppo_2: /(R7Plus|R8007|R801|R831S|R8205)/i,
					oppo_100: /OPPO/i,
					meizu_1: /(MX\d+)/i,
					meizu_2: /(m\d+\snote)\sBuild/i,
					htc_1: /HTC\s?(\w+)/i,
					htc_100: /HTC/i,
					tcl: /TCL\s(\w+)/i,
					lephone: /lephone\s(\w+)/i,
					lg: /LG[\s-]?(\w+)/i,
					galaxy: /(galaxy\d+)/,
					hisense_1: /Hisense/i,
					hisense_2: /HS-(\w+)/i,
					philips: /Philips\s?(\w+)?/i,
					"é‡‘ç«‹": /(GN\w+)\sBuild/i,
					sonny: /sonny/i,
					"å¤©è¯­": /K-Touch/i,
					"MiPad": /XiaoMi\/MiPad/i,
					"lepad": /lepad/i,
					yoga: /YOGA/i,
					mediapad: /MediaPad/i,
					gtp: /GT-P/i,
					smt: /SM-T/i,
					gt_n5100: /GT-N5100/i,
					sch_i800: /sch-i800/i,
					"huawei": /HUAWEI\s?[MTS]\d+-\w/i,
					nexus_s7: /Nexus\s7/i,
					nexus_s8: /Nexus\s8/i,
					nexus_s11: /Nexus\s11/i,
					"Kindle_Fire": /Kindle Fire HD/i,
					Tablet: /Tablet/i,
					samsung_tab: /tab/i
				};
			for (var l in k)
				if (j = k[l].exec(a)) {
					phone.name = l.replace(/_\d+/, ""), j[1] && (phone.version = j[1].replace(/^[_-]/gi, ""));
					break
				}
			return {
				browser: browser,
				os: os,
				phone: phone,
				mobile: mobile,
				mac: /mac/i.test(a)
			}
		},
		getBusinessId: function() {
			var d = this.useragent();
			if (d.browser.wechat) return 6;
			if (d.browser.mqq) return 17;
			var a = "";
			if (document.location.href.indexOf("http://v.qq.com/iframe/") >= 0 && window != top) {
				var b = document.referrer;
				if ("" !== b) {
					var c = document.createElement("a");
					c.href = b, a = c.hostname, c = null
				}
			}
			"" === a && (a = 'v.qq.com');
			var e = [{
				r: /(\w+\.)?weixin\.qq\.com$/i,
				v: 6
			}, {
				r: /^(v|film)\.qq\.com$/i,
				v: 1
			}, {
				r: /^news\.qq\.com$/i,
				v: 2
			}, {
				r: /(\w+\.)?qzone\.qq\.com$/i,
				v: 3
			}, {
				r: /(\w+\.)?t\.qq\.com$/i,
				v: 5
			}, {
				r: /^3g\.v\.qq\.com$/i,
				v: 8
			}, {
				r: /^m\.v\.qq\.com$/i,
				v: 10
			}, {
				r: /3g\.qq\.com$/i,
				v: 12
			}];
			a = a.toLowerCase();
			for (var f = 0, g = e.length; f < g; f++) {
				var h = e[f];
				if (h.r.test(a)) return h.v
			}
			return 7
		},
		getPlatform: function() {
			var a = this.getBusinessId(),
				b = this.getDeviceId();
			return 1e4 * a + 100 * b + 1
		},
		getDeviceId: function() {
			var a = navigator.userAgent,
				d = this.useragent();
			return d.os.ipad ? 1 : d.os.windows ? /Touch/i.test(a) ? 8 : /Phone/i.test(a) ? 7 : 2 : d.os.android ? d.mobile ? 3 : 5 : d.os.iphone ? 4 : d.os.mac ? 9 : 10
		},
		strsub: function(a, b, c) {
			var s = a.indexOf(b) + b.length;
			var e = a.indexOf(c, s);
			return a.substring(s, e)
		},
		tempcalc: function(a, b) {
			for (var c = "", d = 0; d < a.length; d++) c += String.fromCharCode(a.charCodeAt(d) ^ b.charCodeAt(d % 4));
			return c
		},
		u1: function(a, b) {
			for (var c = "", d = b; d < a.length; d += 2) c += a.charAt(d);
			return c
		},
		urlenc: function(a, b, d) {
			var c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
			for (var e, f, g, h, i, j, k, l = "", m = 0; m < a.length;) e = a.charCodeAt(m++), f = a.charCodeAt(m++), g = a.charCodeAt(m++), 15 == m && (l += "A", l += b, l += d), h = e >> 2, i = (3 & e) << 4 | f >> 4, j = (15 & f) << 2 | g >> 6, k = 63 & g, isNaN(f) ? j = k = 64 : isNaN(g) && (k = 64), l = l + c.charAt(h) + c.charAt(i) + c.charAt(j) + c.charAt(k);
			return l
		},
		qv: function(a, b, d, e, f) {
			f = f || parseInt(+new Date / 1e3), e = ("" + e).charAt(0);
			var g = "",
				h = "",
				i = {
					plt: a || "",
					vid: b || "",
					std: d || "",
					sts: e || "",
					ts: f,
					rf: g,
					ua: h
				};
			i = window.JSON ? JSON.stringify(i) : function() {
				var a = [];
				for (var b in i) a.push('"' + b + '":"' + i[b] + '"');
				return "{" + a.join(",") + "}"
			}(i);
			var j = this.hexToString(md5(a + b + f + "#$#@#*ad" + g + h + e.charAt(0) + d)),
				k = this.urlenc(this.tempcalc(j, "#$#@#*ad"), e.charAt(0), f),
				l = this.urlenc(this.tempcalc(j, "86FG@hdf"), e.charAt(0), f),
				m = this.u1(k, 0),
				n = this.u1(k, 1);
			return {
				p: i,
				u: k,
				c: l,
				u1: m,
				u2: n,
				t: f
			}
		},
		hexToString: function(a) {
			for (var b = "", c = "0x" == a.substr(0, 2) ? 2 : 0; c < a.length; c += 2) b += String.fromCharCode(parseInt(a.substr(c, 2), 16));
			return b
		},
		gettime: function() {
			return parseInt(new Date().getTime() / 1000)
		},
		getencrypt: function() {
			var a = new Date().getDay(),
				g = (a == 0 ? 7 : a);
			return '7.' + g
		},
		ckey7: function(a, b, c) {
			var d = new Date().getDay(),
				g = (d == 0 ? 7 : d),
				magic = '';
			if (g == 1) {
				magic = "06fc1464"
			} else if (g == 2) {
				magic = "4244ce1b"
			} else if (g == 3) {
				magic = "77de31c5"
			} else if (g == 4) {
				magic = "e0149fa2"
			} else if (g == 5) {
				magic = "60394ced"
			} else if (g == 6) {
				magic = "2da639f0"
			} else if (g == 7) {
				magic = "c2f0cf9f"
			}
			return md5(magic + a + b + "*#06#" + c)
		},
		createGUID: function(a) {
			a = a || 32;
			for (var b = "", c = 1; c <= a; c++) {
				var d = Math.floor(16 * Math.random()).toString(16);
				b += d
			}
			return b
		}
    },
    youku: {
        parse: function(params) {
            weParser.data = params;
            var cna = weParser.cookie.get("weParser_youku_cna");
            if (cna && cna != "undefined") {
                window.goldlog = {
                    Etag: cna
                };
                weParser.data.cna = cna;
                weParser.youku.getUPS();
                return
            } else {
                $.ajax({
                    url: "https://log.mmstat.com/eg.js",
                    dataType: "script",
                    cache: true,
                    success: function() {
                        weParser.data.cna = window.goldlog.Etag;
                        weParser.cookie.set("weParser_youku_cna", window.goldlog.Etag);
                        weParser.youku.getUPS();
                    }
                });
            }
        },
        getUPS: function(_ccode) {
			if(_ccode=='010101500003'){
				$('meta[name="referrer"]').attr('content','never');
			}else{
				$('meta[name="referrer"]').attr('content','never');
			}
            params = weParser.data;
            $.ajax({
                url: "https://ups.youku.com/ups/get.json",
                type: "GET",
                dataType: "jsonp",
                jsonpCallback: "json" + parseInt(new Date().getTime()),
                cache: true,
                data: {
                    vid: params.vid,
                    ccode: _ccode? _ccode : params.ccode,
                    client_ip: "192.168.1.1",
                    utid: params.utid? params.utid : params.cna,
                    client_ts: parseInt(new Date().getTime() / 1000),
					'ckey':'7B19C0AB12633B22E7FE81271162026020570708D6CC189E4924503C49D243A0DE6CD84A766832C2C99898FC5ED31F3709BB3CDD82C96492E721BDD381735026'
                },
                success: function(e) {
					if(e.data.error && (e.data.error.code==-6004 || e.data.error.code==-4001)){
						weParser.youku.getUPS('010101500003');
						return
					}
                    params = weParser.data;
                    if (e.e.code != 0) {
                        weParser_Error();
                        return
                    };
					var audioDefault = e.data.stream[0].audio_lang;
					var stm, seg, files = [], psid, netip,playUrl;
					var stypes = {'flvhd':'mp4sd','mp4hd2':'mp4hd2v2','mp4hd3':'mp4hd3v2'};
					psid = (typeof e.data.ups != "undefined" ? e.data.ups.psid : seg.cdn_url.match(/psid=(.{32})/)[1]);
					netip = (typeof e.data.ups != "undefined" ? e.data.ups.ups_client_netip : seg.cdn_url.match(/netip=([\d\.]+)/)[1]);
					if((e.data.show!=null&&e.data.show.pay=='1')||(e.data.fee!=null&&e.data.fee.paid_type!=null)){
						var userid=e.data.video.userid;
						for (var i in e.data.stream) {
							stm = e.data.stream[i];
							if (stm.audio_lang != audioDefault) {
								continue;
							}
							;if (stm.stream_type == params.stype || stm.stream_type == stypes[params.stype]) {
								var reg = new RegExp("(^|&)ups_userid=([^&]*)(&|$)");
								var r = stm.m3u8_url.match(reg);
								if(r!=null){
									playUrl=stm.m3u8_url.replace('pl-ali.youku.com','pl.cp31.ott.cibntv.net').replace('&ups_userid='+unescape(r[2]),'').replace('&ups_ytid='+unescape(r[2]),'')+'&ups_userid='+userid+'&ups_ytid='+userid;
								}else{
									playUrl=stm.m3u8_url.replace('pl-ali.youku.com','pl.cp31.ott.cibntv.net')+'&ups_userid='+userid+'&ups_ytid='+userid;
								}
							}
						};
						var gokey={psid:psid,ups_client_netip:netip,title:e.data.video.title,ccode:params.ccode,uid:'null',user_agent:navigator.userAgent,vip:0,logtype:3};
						document.createElement("img").src="http://gm.mmstat.com/yt/youkuplayer.fdl.h5send?cache="+Math.floor(268435456*Math.random()).toString(16)+"&gmkey=EXP&gokey="+encodeURIComponent($.param(gokey))+"%26uidaplus&cna="+encodeURIComponent(params.cna)+"&spm-cnt=a2h0j.8191439.0.0&logtype=2";
						$('#a1').empty();
						var flashvars={f:WWW_URL+'ckplayer/m3u8.swf',a:encodeURIComponent(playUrl),c:0,s:4,lv:0,p:1,v:100,b:1};
						var _params={bgcolor:'#FFF',allowFullScreen:true,allowScriptAccess:'always',wmode:'transparent'};
						CKobject.embedSWF(WWW_URL+'ckplayer/ckplayer.swf','a1','ckplayer_a1','100%','100%',flashvars,_params);
						return;
					}
					if(e.data.video && e.data.video.transfer_mode && e.data.video.transfer_mode=='rtmp'){
						for (var i in e.data.stream) {
							stm = e.data.stream[i];
							if (stm.audio_lang != audioDefault) {
								continue;
							}
							;if (stm.stream_type == params.stype || stm.stream_type == stypes[params.stype]) {
								playUrl=stm.m3u8_url;
							}
						};
						$('#a1').empty();
						var flashvars={f:WWW_URL+'ckplayer/m3u8.swf',a:encodeURIComponent(playUrl),c:0,s:4,lv:0,p:1,v:100,b:1};
						var params={bgcolor:'#FFF',allowFullScreen:true,allowScriptAccess:'always',wmode:'transparent'};
							CKobject.embedSWF(WWW_URL+'ckplayer/ckplayer.swf','a1','ckplayer_a1','100%','100%',flashvars,params);
						return;
					}

                    for (var i in e.data.stream) {
                        stm = e.data.stream[i];
                        if (stm.audio_lang != audioDefault) {
                            continue;
                        };
                        if (stm.stream_type == params.stype || stm.stream_type == stypes[params.stype]) {
                            for (var s in stm.segs) {
                                seg = stm.segs[s];
                                files.push({
                                    u: seg.cdn_url,
                                    d: seg.total_milliseconds_video / 1000,
                                    s: seg.size
                                });
                            }
							break;
                        };
                    }
                    ;if (files.length == 0) {
                        stm = e.data.stream[0];
                        for (var s in stm.segs) {
                            seg = stm.segs[s];
                            files.push({
                                u: seg.cdn_url,
                                d: seg.total_milliseconds_video / 1000,
                                s: seg.size
                            });
                        }
                    }
                    if (!files.length) {
                        weParser_Error();
                        return
                    }
                    var flashvars = {};
                    var k = []
                      , n = [];
                    if (typeof e.data.dvd != "undefined") {
                        if (typeof e.data.dvd.head != "undefined" && e.data.dvd.head > 0) {
                            flashvars.g = e.data.dvd.head / 1000
                        }
                        ;if (typeof e.data.dvd.tail != "undefined" && e.data.dvd.tail > 0) {
                            flashvars.j = e.data.dvd.tail / 1000
                        }
                        ;if (typeof e.data.dvd.point != "undefined" && e.data.dvd.point.length > 0) {
                            var pt;
                            for (var p in e.data.dvd.point) {
                                pt = e.data.dvd.point[p];
                                if (pt.title) {
                                    k.push(pt.start / 1000);
                                    n.push(pt.title);
                                }
                            }
                        }
                        ;if (k.length) {
                            flashvars.k = k.join("|");
                            flashvars.n = n.join("|");
                        }
                    }
                    ;weParser_Play({
                        success: true,
                        urls: files,
                        type: files[0].u.indexOf("/st/mp4/") > 0 ? "mp4" : "flv",
                        image: e.data.video.logo,
                        flashvars: flashvars
                    });
                    var reportUrl1 = "http://gm.mmstat.com/yt/youkuplayer.fdl.send?" + $.param({
                        cna: params.cna,
                        title: e.data.video.title,
                        vip: false,
                        psid: psid,
                        Useragent: navigator.userAgent,
                        ccode: params.ccode,
                        log_type: 3,
                        t: parseInt(new Date().getTime() / 1000),
                        vid: e.data.video.id,
                        fileid: "",
                        ups_client_netip: netip
                    });
                    var r1 = document.createElement("img");
                    r1.src = reportUrl1;
                }
            });
        }
    },
	youku_mobile:{
		parse: function(params) {
            weParser.data = params;
            var cna = weParser.cookie.get("weParser_youku_cna");
            if (cna && cna != "undefined") {
                window.goldlog = {
                    Etag: cna
                };
                weParser.data.cna = cna;
                weParser.youku_mobile.getUPS();
                return
            } else {
                $.ajax({
                    url: "https://log.mmstat.com/eg.js",
                    dataType: "script",
                    cache: true,
                    success: function() {
                        weParser.data.cna = window.goldlog.Etag;
                        weParser.cookie.set("weParser_youku_cna", window.goldlog.Etag);
                        weParser.youku_mobile.getUPS();
                    }
                });
            }
        },
        getUPS: function(_ccode) {
			if(_ccode=='010101500003'){
				$('meta[name="referrer"]').attr('content','never');
			}else{
				$('meta[name="referrer"]').attr('content','never');
			}
            params = weParser.data;
            $.ajax({
                url: "https://ups.youku.com/ups/get.json",
                type: "GET",
                dataType: "jsonp",
                jsonpCallback: "json" + parseInt(new Date().getTime()),
                cache: true,
                data: {
                    vid: params.vid,
                    ccode: _ccode? _ccode : params.param.ccode,
                    client_ip: "192.168.1.1",
                    utid: params.param.utid? params.param.utid : params.cna,
                    client_ts: parseInt(new Date().getTime() / 1000),
					'ckey':'7B19C0AB12633B22E7FE81271162026020570708D6CC189E4924503C49D243A0DE6CD84A766832C2C99898FC5ED31F3709BB3CDD82C96492E721BDD381735026'
                },
                success: function(e) {
					if(e.data.error && (e.data.error.code==-6004 || e.data.error.code==-4001)){
						weParser.youku_mobile.getUPS('010101500003');
						return
					}
                    params = weParser.data;
                    if (e.e.code != 0) {
                        weParser_Error();
                        return
                    }
                    ;var audioDefault = e.data.stream[0].audio_lang;
                    var stm, seg, files = [], psid, netip,playUrl;
					var stypes = {'flvhd':'mp4sd','mp4hd2':'mp4hd2v2','mp4hd3':'mp4hd3v2'};
					var userid=e.data.video.userid;
                    for (var i in e.data.stream) {
                        stm = e.data.stream[i];
                        if (stm.audio_lang != audioDefault) {
                            continue;
                        }
                        if (stm.stream_type == params.param.stype || stm.stream_type == stypes[params.param.stype]) {
							if((e.data.show!=null&&e.data.show.pay=='1')||(e.data.fee!=null&&e.data.fee.paid_type!=null)){
								var reg = new RegExp("(^|&)ups_userid=([^&]*)(&|$)");
								var r = stm.m3u8_url.match(reg);
								if(r!=null){
									playUrl=stm.m3u8_url.replace('pl-ali.youku.com','pl.cp31.ott.cibntv.net').replace('&ups_userid='+unescape(r[2]),'').replace('&ups_ytid='+unescape(r[2]),'')+'&ups_userid='+userid+'&ups_ytid='+userid;
								}else{
									playUrl=stm.m3u8_url.replace('pl-ali.youku.com','pl.cp31.ott.cibntv.net')+'&ups_userid='+userid+'&ups_ytid='+userid;
								}
							}else{
								playUrl=stm.m3u8_url;
							}
                        }
                    }
                    psid = (typeof e.data.ups != "undefined" ? e.data.ups.psid : seg.cdn_url.match(/psid=(.{32})/)[1]);
                    netip = (typeof e.data.ups != "undefined" ? e.data.ups.ups_client_netip : seg.cdn_url.match(/netip=([\d\.]+)/)[1]);
                    if (!playUrl) {
                        return
                    }
					document.getElementById('a1').innerHTML = '<video src="'+playUrl+'" controls="controls" width="100%" height="100%" poster="'+e.data.video.logo+'"></video>';
					$('<div class="content" id="divBag" style="position: fixed;left: 0px;top: 0px;z-index: 1;background-color: rgba(0,0,0,0);"></div>').appendTo($('body'));
					$('#divBag').on('click',function(){
						$('video').get(0).play();
						$(this).remove();
					});
                    var gokey={psid:psid,ups_client_netip:netip,title:e.data.video.title,ccode:params.param.ccode,uid:'null',user_agent:navigator.userAgent,vip:0,logtype:3};
					document.createElement("img").src="http://gm.mmstat.com/yt/youkuplayer.fdl.h5send?cache="+Math.floor(268435456*Math.random()).toString(16)+"&gmkey=EXP&gokey="+encodeURIComponent($.param(gokey))+"%26uidaplus&cna="+encodeURIComponent(params.cna)+"&spm-cnt=a2h0j.8191439.0.0&logtype=2";
                }
            });
        }
	},
	tudou: {
        parse: function(params) {
            weParser.data = params;
            var cna = weParser.cookie.get("weParser_youku_cna");
            if (cna && cna != "undefined") {
                window.goldlog = {
                    Etag: cna
                };
                weParser.data.cna = cna;
                weParser.tudou.getUPS();
                return
            } else {
                $.ajax({
                    url: "https://log.mmstat.com/eg.js",
                    dataType: "script",
                    cache: true,
                    success: function() {
                        weParser.data.cna = window.goldlog.Etag;
                        weParser.cookie.set("weParser_youku_cna", window.goldlog.Etag);
                        weParser.tudou.getUPS();
                    }
                });
            }
        },
        getUPS: function(_ccode) {
			$('meta[name="referrer"]').attr('content','always');
            params = weParser.data;
            $.ajax({
                url: "https://ups.youku.com/ups/get.json",
                type: "GET",
                dataType: "jsonp",
                jsonpCallback: "json" + parseInt(new Date().getTime()),
                cache: true,
                data: {
                    vid: params.vid,
                    ccode: _ccode? _ccode : params.ccode,
                    client_ip: "192.168.1.1",
                    utid: params.utid? params.utid : params.cna,
                    client_ts: parseInt(new Date().getTime() / 1000),
					'ckey':'DIl58SLFxFNndSV1GFNnMQVYkx1PP5tKe1siZu/86PR1u/Wh1Ptd+WOZsHHWxysSfAOhNJpdVWsdVJNsfJ8Sxd8WKVvNfAS8aS8fAOzYARzPyPc3JvtnPHjTdKfESTdnuTW6ZPvk2pNDh4uFzotgdMEFkzQ5wZVXl2Pf1/Y6hLK0OnCNxBj3+nb0v72gZ6b0td+WOZsHHWxysSo/0y9D2K42SaB8Y/+aD2K42SaB8Y/+ahU+WOZsHcrxysooUeND'
                },
                success: function(e) {
					if(e.data.error && (e.data.error.code==-6004 || e.data.error.code==-4001)){
						weParser.youku.getUPS('010101500003');
						return
					}
                    params = weParser.data;
                    if (e.e.code != 0) {
                        weParser_Error();
                        return
                    };
					var audioDefault = e.data.stream[0].audio_lang;
					var stm, seg, files = [], psid, netip,playUrl;
					var stypes = {'flvhd':'mp4sd','mp4hd2':'mp4hd2v2','mp4hd3':'mp4hd3v2'};
					psid = (typeof e.data.ups != "undefined" ? e.data.ups.psid : seg.cdn_url.match(/psid=(.{32})/)[1]);
					netip = (typeof e.data.ups != "undefined" ? e.data.ups.ups_client_netip : seg.cdn_url.match(/netip=([\d\.]+)/)[1]);
					if((e.data.show!=null&&e.data.show.pay=='1')||(e.data.fee!=null&&e.data.fee.paid_type!=null)){
						var userid=e.data.video.userid;
						for (var i in e.data.stream) {
							stm = e.data.stream[i];
							if (stm.audio_lang != audioDefault) {
								continue;
							}
							;if (stm.stream_type == params.stype || stm.stream_type == stypes[params.stype]) {
								var reg = new RegExp("(^|&)ups_userid=([^&]*)(&|$)");
								var r = stm.m3u8_url.match(reg);
								if(r!=null){
									playUrl=stm.m3u8_url.replace('pl-ali.youku.com','pl.cp31.ott.cibntv.net').replace('&ups_userid='+unescape(r[2]),'').replace('&ups_ytid='+unescape(r[2]),'')+'&ups_userid='+userid+'&ups_ytid='+userid;
								}else{
									playUrl=stm.m3u8_url.replace('pl-ali.youku.com','pl.cp31.ott.cibntv.net')+'&ups_userid='+userid+'&ups_ytid='+userid;
								}
							}
						};
						var gokey={psid:psid,ups_client_netip:netip,title:e.data.video.title,ccode:params.ccode,uid:'null',user_agent:navigator.userAgent,vip:0,logtype:3};
						document.createElement("img").src="http://gm.mmstat.com/yt/youkuplayer.fdl.h5send?cache="+Math.floor(268435456*Math.random()).toString(16)+"&gmkey=EXP&gokey="+encodeURIComponent($.param(gokey))+"%26uidaplus&cna="+encodeURIComponent(params.cna)+"&spm-cnt=a2h0j.8191439.0.0&logtype=2";
						$('#a1').empty();
						var flashvars={f:WWW_URL+'ckplayer/m3u8.swf',a:encodeURIComponent(playUrl),c:0,s:4,lv:0,p:1,v:100,b:1};
						var _params={bgcolor:'#FFF',allowFullScreen:true,allowScriptAccess:'always',wmode:'transparent'};
						CKobject.embedSWF(WWW_URL+'ckplayer/ckplayer.swf','a1','ckplayer_a1','100%','100%',flashvars,_params);
						return;
					}
					if(e.data.video && e.data.video.transfer_mode && e.data.video.transfer_mode=='rtmp'){
						for (var i in e.data.stream) {
							stm = e.data.stream[i];
							if (stm.audio_lang != audioDefault) {
								continue;
							}
							;if (stm.stream_type == params.stype || stm.stream_type == stypes[params.stype]) {
								playUrl=stm.m3u8_url;
							}
						};
						$('#a1').empty();
						var flashvars={f:WWW_URL+'ckplayer/m3u8.swf',a:encodeURIComponent(playUrl),c:0,s:4,lv:0,p:1,v:100,b:1};
						var params={bgcolor:'#FFF',allowFullScreen:true,allowScriptAccess:'always',wmode:'transparent'};
							CKobject.embedSWF(WWW_URL+'ckplayer/ckplayer.swf','a1','ckplayer_a1','100%','100%',flashvars,params);
						return;
					}

                    for (var i in e.data.stream) {
                        stm = e.data.stream[i];
                        if (stm.audio_lang != audioDefault) {
                            continue;
                        };
                        if (stm.stream_type == params.stype || stm.stream_type == stypes[params.stype]) {
                            for (var s in stm.segs) {
                                seg = stm.segs[s];
                                files.push({
                                    u: seg.cdn_url,
                                    d: seg.total_milliseconds_video / 1000,
                                    s: seg.size
                                });
                            }
							break;
                        };
                    }
                    ;if (files.length == 0) {
                        stm = e.data.stream[0];
                        for (var s in stm.segs) {
                            seg = stm.segs[s];
                            files.push({
                                u: seg.cdn_url,
                                d: seg.total_milliseconds_video / 1000,
                                s: seg.size
                            });
                        }
                    }
                    if (!files.length) {
                        weParser_Error();
                        return
                    }
                    var flashvars = {};
                    var k = []
                      , n = [];
                    if (typeof e.data.dvd != "undefined") {
                        if (typeof e.data.dvd.head != "undefined" && e.data.dvd.head > 0) {
                            flashvars.g = e.data.dvd.head / 1000
                        }
                        ;if (typeof e.data.dvd.tail != "undefined" && e.data.dvd.tail > 0) {
                            flashvars.j = e.data.dvd.tail / 1000
                        }
                        ;if (typeof e.data.dvd.point != "undefined" && e.data.dvd.point.length > 0) {
                            var pt;
                            for (var p in e.data.dvd.point) {
                                pt = e.data.dvd.point[p];
                                if (pt.title) {
                                    k.push(pt.start / 1000);
                                    n.push(pt.title);
                                }
                            }
                        }
                        ;if (k.length) {
                            flashvars.k = k.join("|");
                            flashvars.n = n.join("|");
                        }
                    }
                    ;weParser_Play({
                        success: true,
                        urls: files,
                        type: files[0].u.indexOf("/st/mp4/") > 0 ? "mp4" : "flv",
                        image: e.data.video.logo,
                        flashvars: flashvars
                    });
                    var reportUrl1 = "http://gm.mmstat.com/yt/youkuplayer.fdl.send?" + $.param({
                        cna: params.cna,
                        title: e.data.video.title,
                        vip: false,
                        psid: psid,
                        Useragent: navigator.userAgent,
                        ccode: params.ccode,
                        log_type: 3,
                        t: parseInt(new Date().getTime() / 1000),
                        vid: e.data.video.id,
                        fileid: "",
                        ups_client_netip: netip
                    });
                    var r1 = document.createElement("img");
                    r1.src = reportUrl1;
                }
            });
        }
    },
	tudou_mobile:{
		parse: function(params) {
            weParser.data = params;
            var cna = weParser.cookie.get("weParser_youku_cna");
            if (cna && cna != "undefined") {
                window.goldlog = {
                    Etag: cna
                };
                weParser.data.cna = cna;
                weParser.tudou_mobile.getUPS();
                return
            } else {
                $.ajax({
                    url: "https://log.mmstat.com/eg.js",
                    dataType: "script",
                    cache: true,
                    success: function() {
                        weParser.data.cna = window.goldlog.Etag;
                        weParser.cookie.set("weParser_youku_cna", window.goldlog.Etag);
                        weParser.tudou_mobile.getUPS();
                    }
                });
            }
        },
        getUPS: function(_ccode) {
			$('meta[name="referrer"]').attr('content','always');
            params = weParser.data;
            $.ajax({
                url: "https://ups.youku.com/ups/get.json",
                type: "GET",
                dataType: "jsonp",
                jsonpCallback: "json" + parseInt(new Date().getTime()),
                cache: true,
                data: {
                    vid: params.vid,
                    ccode: _ccode? _ccode : params.param.ccode,
                    client_ip: "192.168.1.1",
                    utid: params.param.utid? params.param.utid : params.cna,
                    client_ts: parseInt(new Date().getTime() / 1000),
					'ckey':'DIl58SLFxFNndSV1GFNnMQVYkx1PP5tKe1siZu/86PR1u/Wh1Ptd+WOZsHHWxysSfAOhNJpdVWsdVJNsfJ8Sxd8WKVvNfAS8aS8fAOzYARzPyPc3JvtnPHjTdKfESTdnuTW6ZPvk2pNDh4uFzotgdMEFkzQ5wZVXl2Pf1/Y6hLK0OnCNxBj3+nb0v72gZ6b0td+WOZsHHWxysSo/0y9D2K42SaB8Y/+aD2K42SaB8Y/+ahU+WOZsHcrxysooUeND'
                },
                success: function(e) {
					if(e.data.error && (e.data.error.code==-6004 || e.data.error.code==-4001)){
						weParser.youku_mobile.getUPS('010101500003');
						return
					}
                    params = weParser.data;
                    if (e.e.code != 0) {
                        weParser_Error();
                        return
                    }
                    ;var audioDefault = e.data.stream[0].audio_lang;
                    var stm, seg, files = [], psid, netip,playUrl;
					var stypes = {'flvhd':'mp4sd','mp4hd2':'mp4hd2v2','mp4hd3':'mp4hd3v2'};
					var userid=e.data.video.userid;
                    for (var i in e.data.stream) {
                        stm = e.data.stream[i];
                        if (stm.audio_lang != audioDefault) {
                            continue;
                        }
                        if (stm.stream_type == params.param.stype || stm.stream_type == stypes[params.param.stype]) {
							if((e.data.show!=null&&e.data.show.pay=='1')||(e.data.fee!=null&&e.data.fee.paid_type!=null)){
								var reg = new RegExp("(^|&)ups_userid=([^&]*)(&|$)");
								var r = stm.m3u8_url.match(reg);
								if(r!=null){
									playUrl=stm.m3u8_url.replace('pl-ali.youku.com','pl.cp31.ott.cibntv.net').replace('&ups_userid='+unescape(r[2]),'').replace('&ups_ytid='+unescape(r[2]),'')+'&ups_userid='+userid+'&ups_ytid='+userid;
								}else{
									playUrl=stm.m3u8_url.replace('pl-ali.youku.com','pl.cp31.ott.cibntv.net')+'&ups_userid='+userid+'&ups_ytid='+userid;
								}
							}else{
								playUrl=stm.m3u8_url;
							}
                        }
                    }
                    psid = (typeof e.data.ups != "undefined" ? e.data.ups.psid : seg.cdn_url.match(/psid=(.{32})/)[1]);
                    netip = (typeof e.data.ups != "undefined" ? e.data.ups.ups_client_netip : seg.cdn_url.match(/netip=([\d\.]+)/)[1]);
                    if (!playUrl) {
                        return
                    }
					document.getElementById('a1').innerHTML = '<video src="'+playUrl+'" controls="controls" width="100%" height="100%" poster="'+e.data.video.logo+'"></video>';
					$('<div class="content" id="divBag" style="position: fixed;left: 0px;top: 0px;z-index: 1;background-color: rgba(0,0,0,0);"></div>').appendTo($('body'));
					$('#divBag').on('click',function(){
						$('video').get(0).play();
						$(this).remove();
					});
                    var gokey={psid:psid,ups_client_netip:netip,title:e.data.video.title,ccode:params.param.ccode,uid:'null',user_agent:navigator.userAgent,vip:0,logtype:3};
					document.createElement("img").src="http://gm.mmstat.com/yt/youkuplayer.fdl.h5send?cache="+Math.floor(268435456*Math.random()).toString(16)+"&gmkey=EXP&gokey="+encodeURIComponent($.param(gokey))+"%26uidaplus&cna="+encodeURIComponent(params.cna)+"&spm-cnt=a2h0j.8191439.0.0&logtype=2";
                }
            });
        }
	},
	iqiyi_mobile:{
		parse: function(params){
			weParser.iqiyi.parse(params);
		}
	},
    iqiyi: {
        parse: function(params) {
            var o = weParser.qq.gettime();
			$.ajax({
				url: 'http://mixer.video.iqiyi.com/jp/mixin/videos/' + params.vid,
				async: false,
				dataType: 'text',
				success: function(d) {
					var h = JSON.parse(d.replace('var tvInfoJs=', ''));
					var i = h.vid;
					var j = h.url;
					if (i == '' || h.isPurchase == 2) {
						rundao.msg('解析失败,已上报至服务器,请耐心等待管理员修复');
						return
					}
					var k = {
						uid: '',
						platForm:'h5',
						agenttype:'237',
						type:'m3u8',
						nolimit:0,
						k_ft1:8,
						rate:4,
						p:'',
						codeflag:'1',
						qdv:'1',
						qdx:'n',
						qdy:'x',
						qds:0,
						__jsT:'sgve',
						t:parseInt(new Date().getTime() / 1000),
						src:'02028001010000000000'
					};
					var l = '/tmts/' + params.vid + '/' + i + '/';
					var m = md5(l + '?' + $.param(k) + '3sj8xof48xof4tk9f4tk9ypgk9ypg5ul');
					k.vf = m;
					$.ajax({
						url: '//cache.m.iqiyi.com' + l,
						async: false,
						data: k,
						dataType: 'text',
						success: function(d) {
							var a = JSON.parse(d.replace('var tvInfoJs=', ''));
							if (a.code != 'A00000') {
								//rundao.msg('解析失败,已上报至服务器,请耐心等待管理员修复');
								return
							}
							var b = a.data.vidl;
							if (b == '') {
								//rundao.msg('解析失败,已上报至服务器,请耐心等待管理员修复');
								return
							}
							var c = new Object();
							var e = new Array();
							for (var f in b) {
								var g = b[f];
								if (g.m3utx != '') {
									switch (g.vd) {
										case 1:
											e[0] = {
												name: '标清',
												type: 'hls',
												url: g.m3utx
											};
											break;
										case 2:
											e[1] = {
												name: '高清',
												type: 'hls',
												url: g.m3utx
											};
											break;
										case 4:
											e[2] = {
												name: '超清',
												type: 'hls',
												url: g.m3utx
											};
											break;
										case 5:
											e[3] = {
												name: '蓝光',
												type: 'hls',
												url: g.m3utx
											};
											break;
										case 10:
											e[4] = {
												name: '原画',
												type: 'hls',
												url: g.m3utx
											};
											break
									}
								}
							}
							if (a.data.m3utx != '') {
								switch (a.data.vd) {
									case 1:
										e[0] = {
											name: '标清',
											type: 'hls',
											url: a.data.m3utx
										};
										break;
									case 2:
										e[1] = {
											name: '高清',
											type: 'hls',
											url: a.data.m3utx
										};
										break;
									case 4:
										e[2] = {
											name: '超清',
											type: 'hls',
											url: a.data.m3utx
										};
										break;
									case 5:
										e[3] = {
											name: '蓝光',
											type: 'hls',
											url: a.data.m3utx
										};
										break;
									case 10:
										e[4] = {
											name: '原画',
											type: 'hls',
											url: a.data.m3utx
										};
										break
								}
							}
							var g = new Array();
							for (var f in e) {
								g.push(e[f]);
							}
							c.url = g[g.length - 1].url;
							$('#a1').empty();
							weParser.dplayer_play({
								data: g,
								mobile: c.url
							})
						}
					})
				}
			})
        }
    }
};
// if (typeof jQuery == "undefined") {
// //     var cjInterval = setInterval("check_jQuery()", 50);
// // } else {
// // 	var isiPad = navigator.userAgent.match(/iPad|iPhone|Android|Linux|iPod/i) != null;
// // 	if(!isiPad){
// // 		CKobject.getObjectById(ckplayer_id).weParser_scriptLoaded();
// // 	}else{
// // 		eval('weParser.'+weParserParams['site']+'_mobile.parse(weParserParams);')
// // 	}
// // }



function gettime() {
	return parseInt(new Date().getTime() / 1000)
}













// md5.min.js

!function(n){"use strict";function t(n,t){var r=(65535&n)+(65535&t);return(n>>16)+(t>>16)+(r>>16)<<16|65535&r}function r(n,t){return n<<t|n>>>32-t}function e(n,e,o,u,c,f){return t(r(t(t(e,n),t(u,f)),c),o)}function o(n,t,r,o,u,c,f){return e(t&r|~t&o,n,t,u,c,f)}function u(n,t,r,o,u,c,f){return e(t&o|r&~o,n,t,u,c,f)}function c(n,t,r,o,u,c,f){return e(t^r^o,n,t,u,c,f)}function f(n,t,r,o,u,c,f){return e(r^(t|~o),n,t,u,c,f)}function i(n,r){n[r>>5]|=128<<r%32,n[14+(r+64>>>9<<4)]=r;var e,i,a,d,h,l=1732584193,g=-271733879,v=-1732584194,m=271733878;for(e=0;e<n.length;e+=16)i=l,a=g,d=v,h=m,g=f(g=f(g=f(g=f(g=c(g=c(g=c(g=c(g=u(g=u(g=u(g=u(g=o(g=o(g=o(g=o(g,v=o(v,m=o(m,l=o(l,g,v,m,n[e],7,-680876936),g,v,n[e+1],12,-389564586),l,g,n[e+2],17,606105819),m,l,n[e+3],22,-1044525330),v=o(v,m=o(m,l=o(l,g,v,m,n[e+4],7,-176418897),g,v,n[e+5],12,1200080426),l,g,n[e+6],17,-1473231341),m,l,n[e+7],22,-45705983),v=o(v,m=o(m,l=o(l,g,v,m,n[e+8],7,1770035416),g,v,n[e+9],12,-1958414417),l,g,n[e+10],17,-42063),m,l,n[e+11],22,-1990404162),v=o(v,m=o(m,l=o(l,g,v,m,n[e+12],7,1804603682),g,v,n[e+13],12,-40341101),l,g,n[e+14],17,-1502002290),m,l,n[e+15],22,1236535329),v=u(v,m=u(m,l=u(l,g,v,m,n[e+1],5,-165796510),g,v,n[e+6],9,-1069501632),l,g,n[e+11],14,643717713),m,l,n[e],20,-373897302),v=u(v,m=u(m,l=u(l,g,v,m,n[e+5],5,-701558691),g,v,n[e+10],9,38016083),l,g,n[e+15],14,-660478335),m,l,n[e+4],20,-405537848),v=u(v,m=u(m,l=u(l,g,v,m,n[e+9],5,568446438),g,v,n[e+14],9,-1019803690),l,g,n[e+3],14,-187363961),m,l,n[e+8],20,1163531501),v=u(v,m=u(m,l=u(l,g,v,m,n[e+13],5,-1444681467),g,v,n[e+2],9,-51403784),l,g,n[e+7],14,1735328473),m,l,n[e+12],20,-1926607734),v=c(v,m=c(m,l=c(l,g,v,m,n[e+5],4,-378558),g,v,n[e+8],11,-2022574463),l,g,n[e+11],16,1839030562),m,l,n[e+14],23,-35309556),v=c(v,m=c(m,l=c(l,g,v,m,n[e+1],4,-1530992060),g,v,n[e+4],11,1272893353),l,g,n[e+7],16,-155497632),m,l,n[e+10],23,-1094730640),v=c(v,m=c(m,l=c(l,g,v,m,n[e+13],4,681279174),g,v,n[e],11,-358537222),l,g,n[e+3],16,-722521979),m,l,n[e+6],23,76029189),v=c(v,m=c(m,l=c(l,g,v,m,n[e+9],4,-640364487),g,v,n[e+12],11,-421815835),l,g,n[e+15],16,530742520),m,l,n[e+2],23,-995338651),v=f(v,m=f(m,l=f(l,g,v,m,n[e],6,-198630844),g,v,n[e+7],10,1126891415),l,g,n[e+14],15,-1416354905),m,l,n[e+5],21,-57434055),v=f(v,m=f(m,l=f(l,g,v,m,n[e+12],6,1700485571),g,v,n[e+3],10,-1894986606),l,g,n[e+10],15,-1051523),m,l,n[e+1],21,-2054922799),v=f(v,m=f(m,l=f(l,g,v,m,n[e+8],6,1873313359),g,v,n[e+15],10,-30611744),l,g,n[e+6],15,-1560198380),m,l,n[e+13],21,1309151649),v=f(v,m=f(m,l=f(l,g,v,m,n[e+4],6,-145523070),g,v,n[e+11],10,-1120210379),l,g,n[e+2],15,718787259),m,l,n[e+9],21,-343485551),l=t(l,i),g=t(g,a),v=t(v,d),m=t(m,h);return[l,g,v,m]}function a(n){var t,r="",e=32*n.length;for(t=0;t<e;t+=8)r+=String.fromCharCode(n[t>>5]>>>t%32&255);return r}function d(n){var t,r=[];for(r[(n.length>>2)-1]=void 0,t=0;t<r.length;t+=1)r[t]=0;var e=8*n.length;for(t=0;t<e;t+=8)r[t>>5]|=(255&n.charCodeAt(t/8))<<t%32;return r}function h(n){return a(i(d(n),8*n.length))}function l(n,t){var r,e,o=d(n),u=[],c=[];for(u[15]=c[15]=void 0,o.length>16&&(o=i(o,8*n.length)),r=0;r<16;r+=1)u[r]=909522486^o[r],c[r]=1549556828^o[r];return e=i(u.concat(d(t)),512+8*t.length),a(i(c.concat(e),640))}function g(n){var t,r,e="";for(r=0;r<n.length;r+=1)t=n.charCodeAt(r),e+="0123456789abcdef".charAt(t>>>4&15)+"0123456789abcdef".charAt(15&t);return e}function v(n){return unescape(encodeURIComponent(n))}function m(n){return h(v(n))}function p(n){return g(m(n))}function s(n,t){return l(v(n),v(t))}function C(n,t){return g(s(n,t))}function A(n,t,r){return t?r?s(t,n):C(t,n):r?m(n):p(n)}"function"==typeof define&&define.amd?define(function(){return A}):"object"==typeof module&&module.exports?module.exports=A:n.md5=A}(this);
//# sourceMappingURL=md5.min.js.map




