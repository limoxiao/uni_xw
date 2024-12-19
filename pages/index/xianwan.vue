<template>
	<view>

	</view>
</template>

<script>
	import md5 from '@/common/md5.js';
	var wv = null;
	var currentWebview = null;

	export default {
		data() {
			return {
				delta: 2,
				url: 'https://h5.51xianwan.com/try/try_list_plus.aspx?ptype=2&appsign=1000&deviceid=864032031507923&appid=1010&keycode=ecad9bcdf0a97a5ae96f251b6d6d97a9',
			}
		},
		onLoad(options) {
			uni.setNavigationBarColor({
			    frontColor: '#ffffff',
			    backgroundColor: '#0000ff',
			    animation: {
			        duration: 400,
			        timingFunc: 'easeIn'
			    }
			})
			if (options && options.url) {
				console.log('options：'+JSON.stringify(options));
				this.url = options.url;
			}
			// #ifdef APP-PLUS

			console.log('12321：'+this.url);
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

			currentWebview = this.$mp.page.$getAppWebview(); //获取当前页面的webview对象
			currentWebview.append(wv); //一定要append到当前的页面里！！！才能跟随当前页面一起做动画，一起关闭
			console.log("加载完成");

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
			}
		},
	}
</script>

<style>

</style>
