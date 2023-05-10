<script>
	// #ifdef APP-PLUS
	const uhfSFHelper = uni.requireNativePlugin("sz360c_honewell");
	// #endif
	
	let triggerTime = null
	export default {
		globalData:{
			
			RFID:null
		},
		
		onLaunch() {
			
			// #ifdef APP-PLUS
			// 锁定方向
			plus.screen.lockOrientation('portrait')
			// APP不适配iOS&Android的暗黑模式，所以在应用启动时，强制设置为亮色（正常）模式
			plus.nativeUI.setUIStyle('light');
			// 初始化rfid，监听rfid读取
			
			// 监听扳机按下
			plus.key.addEventListener('keydown', (e) => {
				if (e.keyCode === 295) {
					
					uni.$emit('onTriggerLong')
					uhfSFHelper.ReadRFID(result => {
						console.log('RFID',result)
						console.log("HHHHHHHH")
						
						uni.$emit('rfid',result)
						
					})
					
					
					// clearTimeout(triggerTime)
					// triggerTime = null
					// uni.$emit('onTrigger')
					// // 超出时间后没有松开，则发送长按扳机指令
					// triggerTime = setTimeout(() => {
						
					// 	clearTimeout(triggerTime)
					// 	triggerTime = null
					// }, 250)
				}
			})
			// 监听扳机松开
			plus.key.addEventListener('keyup', (e) => {
				if (e.keyCode === 295) {
				// 	uni.$emit('offTrigger')
				// 	// 如果在指定时间内松开了扳机，则触发单次扳机指令
				// 	if (triggerTime !== null) {
				// 		uni.$emit('onTriggerOnce')
				// 		clearTimeout(triggerTime)
				// 		triggerTime = null
				// 	} else {
					uhfSFHelper.stopRead()
					uni.$emit('endTriggerLong')
					
						
				// 	}
				}
			})
			// 监听页面发出的单次扫描指令
			
		
		},
		onShow(options) {
			getApp().globalData.test_module= uni.requireNativePlugin("sz360c_honewell");
			getApp().globalData.test_module.InitRFID()
		},
		onHide(e) {
		},

	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "@/uni_modules/uview-ui/index.scss";

	/* #ifndef APP-NVUE */
	view,
	text {
		line-height: 1;
		box-sizing: border-box;
	}

	/* #endif */
</style>
