(function(w) {

	function plusReady() {
		console.log("plusReady");
	};

	if (w.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	};




	//IOS跳转
	function openSafari(url) {
		plus.runtime.openURL(url);
		console.log(url)
	}
	var packName = null;
	var dtask = null;


	var android = {
		CheckInstall: function(pg) {
			console.log("CheckInstall" + pg);
			this.packName = pg;
			var b = plus.runtime.isApplicationExist({
				pname: pg
			}) ? 1 : 0;
			console.log("CheckInstall_Return  是否已安装 " + this.packName + b);

			CheckInstall_Return(b)
		},
		OpenAPP: function(pg) {
			console.log('OpenAPP' + pg);
			if (plus.os.name == "Android") {
				plus.runtime.launchApplication({
					pname: pg
				}, function(e) {
					alert("Open system default browser failed: " + e.message);
				});
			}
		},
		Browser: function(pg) { //IOS下载
			plus.runtime.openURL(pg);
			console.log(pg)

		},
		InstallAPP: function(down_url) {

			console.log('InstallAPP' + this.packName + " " + down_url);
			var index = down_url.lastIndexOf('/') > down_url.lastIndexOf('?') ? down_url.lastIndexOf('/') : down_url.lastIndexOf(
				'?');
			var apk_name = "_downloads/" + down_url.substring(index + 1, down_url.length);

			if (apk_name.indexOf(".apk") == -1) {
				apk_name = apk_name + '.apk';
			}

			console.log("下载文件 " + apk_name);

			if (dtask != null && dtask.url === down_url) {
				console.log("任务正在下载中！")
				return;
			}
			var options = {
				method: "GET",
				filename: apk_name
			};

			console.log("开始创建下载任务 ");
			var precent = 0;
			var pkName = this.packName;

			dtask = plus.downloader.createDownload(down_url, options, null);
			dtask.addEventListener("statechanged", function(task, status) {
				if (!dtask) {
					return;
				}
				switch (task.state) {
					case 1: // 开始
						console.log("开始下载 ...");
						console.log("开始下载 ..." + pkName + "->" + precent);

						precent = 0;
						break;
					case 2: // 已连接到服务器
						console.log("链接到服务器... ");
						console.log("链接到服务器 ..." + pkName + "->" + precent);

						precent = 0;
						break;
					case 3: // 已接收到数据
						var cur_precent = parseInt(100 * task.downloadedSize / task.totalSize) //Math.round(task.downloadedSize * 100 / task.totalSize)
						if (precent != cur_precent) {
							precent = cur_precent;
							console.log("正在下载…… packageName->" + pkName + "  progress->" + precent + "%");
							setProgress(pkName, precent);
						}
						break;
					case 4: // 下载完成
						var filepath = task.filename;
						console.log("下载完成 " + filepath);
						setProgress(pkName, 0);

						var install_options = {
							force: false
						};

						plus.runtime.install(filepath, install_options, function(widgetInfo) {
							console.log("安装成功");
							dtask = null;
							console.log(dtask == null);
						}, function(e) {
							console.log("安装失败" + e.message);
							dtask = null;
							console.log(dtask == null);
						});
						break;
				}
			});
			dtask.start();
			console.log("下载任务创建成功 ");
		}
	};
	w.android = android;

})(window);
