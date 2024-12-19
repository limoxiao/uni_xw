<template>
	<view class="content">

		<button class="button_style" type="primary" @click="jump">进入闲玩</button>

		<button class="button_style2" type="primary" @click="jumpGame">进入xwgame</button>

	<button class="button_style2" type="primary" @click="getMsa">重新获取</button>
	
		<view class="devices">
			设备信息相关信息：
		</view>
		<view class="devices">
			appid:{{appid}}
		</view>
		<view class="devices">
			userId:{{userId}}
		</view>
		<view class="devices">
			sdk_int:{{sdk_int}}
		</view>
		<view class="devices">
			deviceid:{{deviceid}}
		</view>
		<view class="devices">
			msa_oaid:{{msa_oaid}}
		</view>
		<view class="devices">
			url:{{url}}
		</view>


	</view>
</template>

<script>
	import md5 from '@/common/md5.js';
	const mittModule = uni.requireNativePlugin('MiitModule');
	// let andoridModule = uni.requireNativePlugin('oaid-device');
	
	export default {
		data() {
			return {
				navigateFlag: false,
				appid: '1010', //需要改为自己参数
				appsecret: 's1j0u1ozmravou3p', //需要改为自己参数
				xw_interface: 'http://h5.17xianwan.com/try/try_list_plus.aspx',
				ios_appid: '1011', //需要改为自己参数
				ios_appsecret: 'nw2olixipulielgp', //需要改为自己参数
				xw_ios_interface: 'https://h5.17xianwan.com/try/iOS/try_list_ios.aspx',
				userId: '123', //需要改为自己用户id
				phonetype: 2,
				sdk_int: 0,
				deviceid: '',
				msa_oaid: '',
				url: '',
				target_page: '/pages/index/xwgame'
			}
		},
		onLoad() {
			// #ifdef APP-PLUS
			var Build = plus.android.importClass("android.os.Build");
			this.sdk_int = Build.VERSION.SDK_INT;
			console.log('当前系统版本：' + this.sdk_int);

			switch (uni.getSystemInfoSync().platform) {
				case 'android':
					this.phonetype = 2;
					break;
				case 'ios':
					this.phonetype = 1;
					break;
			}

			if (this.phonetype == 2) {
				if(this.sdk_int>=29){
					this.deviceid ="0"
				}else{
					this.deviceid = plus.device.imei;
					console.log("imei->" + plus.device.imei);
					var index = this.deviceid.indexOf(',');
					if (index > 0) {
						this.deviceid = this.deviceid.substring(0, index);
					}
					
					console.log("imei->" + this.deviceid);
				}			
				
				this.getMsa();
			} else {
				var NSUUID = plus.ios.importClass('NSUUID');
				var UIDevice = plus.ios.importClass("UIDevice");
				var currentDevice = UIDevice.currentDevice();
				var identifierForVendor = currentDevice.identifierForVendor().UUIDString();
				var ASIdentifierManager = plus.ios.importClass('ASIdentifierManager');
				var sharedManager = ASIdentifierManager.sharedManager();
				this.deviceid = sharedManager.advertisingIdentifier().UUIDString();
				that.getXWUrl();
			}
			console.log('123')
			this.getXWUrl();
			console.log('1234')
			// #endif
		},
		methods: {
			jump() {
				if (this.navigateFlag) {
					return;
				}
				this.navigateFlag = true;
				console.log(encodeURIComponent(this.url));

				this.target_page = '/pages/index/xianwan?url=' + encodeURIComponent(this.url);
				console.log('Target Page:' + this.target_page);
				uni.navigateTo({
					url: this.target_page
				})

				setTimeout(() => {
					this.navigateFlag = false;
				}, 200)
			},
			getMsa2() {
				// this.msa_oaid =andoridModule.getOAID()
			},
			getMsa() {
				console.log('getMsa start');
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
				console.log('phonetype>' + this.phonetype + " deviceid>" + this.deviceid);
				if (this.phonetype == 2) {
					var key = this.appid + this.deviceid + this.msa_oaid + this.sdk_int + this.phonetype + this.userId +
						this.appsecret;
					console.log('key>' + key);
					var keycode = md5(key);
					console.log('keycode->' + keycode);

					this.url = this.xw_interface + '?ptype=' + this.phonetype + '&androidosv=' + this.sdk_int +
						'&msaoaid=' + this.msa_oaid +
						'&deviceid=' + this.deviceid + '&appid=' + this.appid + '&appsign=' + this.userId + '&keycode=' +
						keycode.toLowerCase();
					console.log(this.url);
				
				} else if (this.phonetype == 1) {
					var key = this.ios_appid + this.deviceid + this.phonetype + this.userId + this.ios_appid;
					console.log('key>' + key);
					var keycode = md5(key);
					console.log('keycode->' + keycode);

					this.url = this.xw_ios_interface + '?ptype=' + this.phonetype + '&deviceid=' + this.deviceid +
						'&appid=' + this.ios_appid + '&appsign=' + this.userId + '&keycode=' + keycode.toLowerCase();
					console.log(this.url);
				}
			},
			jumpGame() {
				if (this.navigateFlag) {
					return;
				}
				this.navigateFlag = true;
				console.log(encodeURIComponent(this.url));

				this.userId = '123';
				this.target_page = '/pages/index/xwgame?userid=' + this.userId;
				console.log('Target Page:' + this.target_page);
				uni.navigateTo({
					url: this.target_page
				})

				setTimeout(() => {
					this.navigateFlag = false;
				}, 200)
			}

		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.button_style {
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
	}

	.button_style2 {
		margin-top: 20rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 10rpx;
	}

	.text-area {
		display: flex;
		justify-content: flex-start;
		margin-top: 10rpx;
	}

	.description {
		font-size: 36rpx;
		color: #8f8f94;
		margin: 15rpx;
		justify-content: center;
	}
</style>