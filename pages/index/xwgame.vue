<template>
	<view>

	</view>
</template>

<script>
	import md5 from '@/common/md5.js';
	var wv = null;
	var currentWebview = null;
	const mittModule = uni.requireNativePlugin('MiitModule');

	export default {
		data() {
			return {
				xw_interface: 'http://h5.17xianwan.com/try/try_list_plus.aspx',
				appid: '1010', 						//需要改为自己的参数
				appsecret: 's1j0u1ozmravou3p', 		//需要改为自己的参数
				ios_appid: '1011', 					//需要改为自己的参数
				ios_appsecret: 'nw2olixipulielgp',  //需要改为自己的参数
				xw_ios_interface: 'https://h5.17xianwan.com/try/iOS/try_list_ios.aspx',
				userId: '123',  					//需要改为自己用户id
				phonetype: 2,
				sdk_int: '1',
				deviceid: '',
				msa_oaid: '',
				url: '',
				delta: 2,
			}
		},
		onReady() {
			uni.setNavigationBarColor({
			    frontColor: '#ffffff',
			    backgroundColor: '#ff0000',
			    animation: {
			        duration: 400,
			        timingFunc: 'easeIn'
			    }
			})
		},
		onLoad(options) {
			uni.setNavigationBarColor({
			    frontColor: '#ffffff',
			    backgroundColor: '#ff0000',
			    animation: {
			        duration: 400,
			        timingFunc: 'easeIn'
			    }
			});
			
			if (options && options.userid) {
				this.userId = options.userid;
			}


			// #ifdef APP-PLUS
			this.mobileStatus();
			this.getMsa();

			currentWebview = this.$mp.page.$getAppWebview(); //获取当前页面的webview对象
		
			// #endif


		},
		onBackPress(options) {
			// const currentWebview = this.$mp.page.$getAppWebview();
			if (wv) {
				this.goback(this.delta);
				return true;
			}
			return false
		},
		methods: {
			goback(delta) {
				if (wv) {
					wv.canBack(function(events) {
						if (events.canBack) {
							wv.back();
						} else {
							wv.close();
							currentWebview.remove(wv);
							wv = null;
							uni.navigateBack({
								delta: delta
							})
						}
					})
				}
			},
			mobileStatus() {
				this.phonetype = 2; //默认是android设备
				switch (uni.getSystemInfoSync().platform) {
					case 'android':
						this.phonetype = 2;
						break;
					case 'ios':
						this.phonetype = 1;
						break;
				}

				if (this.phonetype == 2) {
					var Build = plus.android.importClass("android.os.Build");
					this.sdk_int = Build.VERSION.SDK_INT;
					console.log('当前系统版本：' + this.sdk_int);
					
					this.deviceid = plus.device.imei;
					console.log("imei->" + this.deviceid);
					var index = this.deviceid.indexOf(',');
					if (index > 0) {
						this.deviceid = this.deviceid.substring(0, index);
					}
					console.log("imei->" + this.deviceid);
					
				} else {
					var NSUUID = plus.ios.importClass('NSUUID');
					var UIDevice = plus.ios.importClass("UIDevice");
					var currentDevice = UIDevice.currentDevice();
					var identifierForVendor = currentDevice.identifierForVendor().UUIDString();
					var ASIdentifierManager = plus.ios.importClass('ASIdentifierManager');
					var sharedManager = ASIdentifierManager.sharedManager();
					this.deviceid = sharedManager.advertisingIdentifier().UUIDString();
					this.getXWUrl();
				}
				console.log('123')

			},
			getMsa() {
				const that = this;
				mittModule.getAsyncFunc((ret) => {
					var retInfo = "support:" + ret.support +
						"  \nisLimited:" + ret.isLimited +
						"\noaid:" + ret.oaid;
					console.log('getMsa start ret：'+retInfo);	
					that.msa_oaid = ret.oaid;
					that.getXWUrl();
				});
			},
			getXWUrl() {
				console.log('phonetype>' + this.phonetype + " deviceid->" + this.deviceid);

				if (this.phonetype == 2) {
					var key = this.appid + this.deviceid + this.msa_oaid + this.sdk_int + this.phonetype + this.userId + this.appsecret;

					console.log('key>' + key);

					var keycode = md5(key);
					console.log('keycode->' + keycode);

					this.url = this.xw_interface + '?ptype=' + this.phonetype + '&androidosv=' + this.sdk_int + '&msaoaid=' + this.msa_oaid +
						'&deviceid=' + this.deviceid + '&appid=' + this.appid + '&appsign=' + this.userId + '&keycode=' + keycode.toLowerCase();
					
				}else{					
					var key = this.ios_appid + this.deviceid + this.phonetype + this.userId + this.ios_appsecret;
					
					console.log('key>' + key);
					
					var keycode = md5(key);
					console.log('keycode->' + keycode);
					
					this.url = this.xw_ios_interface + '?ptype=' + this.phonetype +'&deviceid=' + this.deviceid + '&appid=' + this.ios_appid + '&appsign=' + this.userId + '&keycode=' + keycode.toLowerCase();
					console.log(this.url);
				}
				console.log(this.url);
				
				wv = plus.webview.create(this.url, "xw", {
					titleNView: {
						backgroundColor: "#0066CC",
						titleColor: '#000000',
						titleText: '闲玩',
						autoBackButton: true,
					}
				});
				// wv.appendJsFile('_www/hybrid/html/xianwan.js');
				
				wv.addEventListener("loaded", (function() { //android 可写外面   ios的js注入必须在页面加载完成后
					console.log("开始注入js");
					wv.appendJsFile('_www/hybrid/html/xianwan.js')
					console.log("注入js完成");
				}));
				
				wv.show();
				currentWebview.append(wv); //一定要append到当前的页面里！！！才能跟随当前页面一起做动画，一起关闭
				console.log("加载完成");
			}

		},
	}
</script>

<style>

</style>
