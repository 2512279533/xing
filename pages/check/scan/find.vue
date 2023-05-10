<template>
	<view>
		<!-- 		<button type="default" @click="btn_RfidInit()">初始化reader</button>
		<button type="default" @click="btn_RfidStart()">开启reader</button>
		<button type="default" @click="btn_RfidStop()">关闭reader</button> -->
		<view class="fff">
			<text ref="topDom" class="form-left">检具编号: {{this.formdata.assetsCode}}</text>
			<text ref="topDom" class="form-rigth">检具名称: {{this.formdata.assetsName}}</text>
		</view>
		<view class="form-item-block" v-if="settingData.type">
			<view class="form-normal-wrap">
				<view class="form-label-box">
					<text class="form-label-text">查找功率设置</text>
				</view>
				<view class="form-select-box">
					<!-- <u-slider v-model="settingData.power" @change="sliderChange" :min="5" :max="30" show-value /> -->
					<slider value="15" max="30" min="5" @change="sliderChange" activeColor="#5555ff"
						backgroundColor="#9ae5e5" block-color="#5555ff" block-size="20" show-value />

				</view>
			</view>
		</view>
		<view>
			<text class="parameter">Rssi:{{parameter}}</text>
			<view>
				<view class="rectangle-t1">
				</view>
				<view class="rectangle-t2" :style="{height:num+'px'}">
				</view>
			</view>
			<!-- 底部按钮模块 -->
			<view class="bottom-btn-block">
				<view class="btn-row-wrap">
					<template>
						<view class="loader" v-if="rfidOpen">
							<view class="loader-item item-1"></view>
							<view class="loader-item item-2"></view>
						</view>
						<image v-if="!rfidOpen" class="rfid-switch" src="/static/images/rfid-off.png"
							@click="handleRfid(true)" />
						<image v-else class="rfid-switch" src="/static/images/rfid-on.png" @click="handleRfid(false)" />
					</template>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const test_module = uni.requireNativePlugin("sz360c_honewell")
	export default {
		data() {
			return {
				height: 0,
				rfidOpen: false, // rfid打开状态
				alreadySet: new Set(), // 已扫描集合
				settingData: {
					type: '盘点',
					power: 0
				},
				power: 0,
				parameter: 0,
				formdata: {},
			}
		},
		computed: {
			/**
			 * 水柱的变化值
			 */
			num() {
				let len = 230 / 100 * (-this.height)
				console.log("=============", len)
				if (len >= 230) {
					return 230
				} else {
					return len
				}
			}
		},
		onShow(){
			this.initScan()
		}
		,
		onLoad(options) {
			getApp().globalData.test_module.InitRFID()
			this.formdata = options
			// this.confirmMode()
			

		},

		methods: {
			sliderChange(e) {

				// 设置保存的功率，默认30
				console.log(e.detail.value)
				this.power = e.detail.value
				// #ifdef APP-PLUS
				const power = e.detail.value
				this.$emit('setPower', power)
				// #endif



			},
                        initScan() {
						// 获取功率设置
						
						// 设置保存的功率，默认30
					
						
						uni.$on('rfid', epc => {
							
							console.log('获取到rfid', epc)
							this.height=epc.rssi
							this.parameter=epc.rssi
							
							
						})
						
						uni.$on('onTriggerLong', () => {
							console.log('扳机长按开始')
							
						})
						uni.$on('endTriggerLong', () => {
							console.log('扳机长按结束')
							
						})
						
					},
			/**
			 * 控制rfid
			 * @param {Object} flag
			 */
			handleRfid(flag) {

				if (flag) {

					this.rfidOpen = true;
					let that = this
					

								getApp().globalData.test_module.ReadRFID(res => {
									
					
									
									this.height =res.rssi
									this.parameter = res.rssi
									
								})
							
				
						// 监听扳机松开
						
						
				} else {
					this.rfidOpen = false;
					
					
					getApp().globalData.test_module.stopRead()
				}
			},
			/**
			 * 设置模式
			 */
			// confirmMode() {

			// 	// const power = uni.getStorageSync(this.settingData.type)
			// 	this.settingData.power = 24
			// 	alert(this.settingData.power)
			// },
		},
		
		
		onUnload() {
			// #ifdef APP-PLUS
			uni.$off('rfid')
			uni.$off('onScan')
			uni.$off('onTriggerLong')
			uni.$off('endTriggerLong')
			uni.$off('onTriggerOnce')
			// #endif
		}
	}
</script>

<style scoped lang="scss">
	.form-title {
		padding: 0 24rpx;
		font-size: 32rpx;
		font-weight: bold;
		line-height: 90rpx;
		color: #222222;
	}

	.fff {
		background-color: #ffffff;
	}

	.form-item-block {
		padding: 0 24rpx;
		background-color: #ffffff;
	}

	.form-normal-wrap {
		height: 100rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding-right: 15rpx;
	}

	.form-label-box {
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 200rpx;
	}

	.form-label-text {
		font-weight: bold;
		font-size: 32rpx;
		color: #646566;
	}

	.form-select-box {
		height: 80rpx;
		flex: 1;
	}

	.bottom-btn-block {
		height: 130rpx;
		padding: 20rpx 30rpx;

		border-top: 1px solid #e6e6e6;

		.btn-row-wrap {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			position: relative;

			.btn {
				width: 200rpx;
			}

			.loader {
				position: absolute;
				left: 50%;
				transform: translateX(-50%) scale(3);
				bottom: -730rpx;
				display: flex;
				align-items: center;
				justify-content: center;

				.loader-item {
					position: absolute;
					width: 50rpx;
					height: 50rpx;
					border-radius: 150rpx;
					border: 6rpx solid transparent;
					border-top: 6rpx solid #05bdff;
					animation: load 1s linear infinite;

					&.item-1 {
						animation-delay: 0.4s;
					}

					&.item-2 {
						width: 32rpx;
						height: 32rpx;
						animation-delay: 0.2s;
					}
				}

			}

			.rfid-switch {
				width: 40rpx;
				height: 40rpx;
			}
		}
	}




	.form-rigth {
		font-weight: bold;
		line-height: 90rpx;
		padding: 0 90rpx;
		font-size: 32rpx;
		color: #646566;
	}

	.form-left {
		font-weight: bold;
		line-height: 90rpx;
		padding: 0 24rpx;
		font-size: 32rpx;
		color: #646566;

	}

	.rfid-switch {
		position: absolute;
		left: 50%;
		transform: translateX(-50%) scale(3);
		bottom: -800rpx;
	}

	.form-bottom {}

	.rectangle-t1 {

		position: absolute;
		left: 135px;
		bottom: 100px;
		background-color: #999999;
		border-radius: 20rpx;
		width: 56px;
		height: 230px;
	}

	.rectangle-t2 {

		position: absolute;
		left: 135px;
		bottom: 100px;
		background-color: #2d862d;
		border-radius: 0rpx 0rpx 20rpx 20rpx;
		width: 56px;

	}

	.parameter {
		position: absolute;
		left: 136px;
		top: 115px;
		color: #4747d1;
	}

	@keyframes load {

		70%,
		100% {
			border-top-color: #049dff;
		}

		0%,
		40% {
			border-top-color: transparent;
		}
	}
</style>
<style>
	page {
		background-color: #f2f3f5;
	}
</style>