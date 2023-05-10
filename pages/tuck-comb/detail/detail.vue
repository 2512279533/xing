<template>
	<view class="main-wrap">

		<view class="top-info-block">
			<view class="info-block">
				<text class="label" style="margin: right: 10px;">依次输入基本信息</text>
			</view>
		</view>
		<!-- #ifdef APP-PLUS -->
		<list class="form-list-block">
			<cell>
				<!-- #endif -->
				<!-- #ifndef APP-PLUS -->
				<scroll-view class="form-scroll-block" scroll-y>
					<!-- #endif -->
					<text ref="topDom" class="form-title">基本信息</text>
					<z-form-input class="z-form-input" v-model="this.assetsCode" :focus="true" label="器具编号" placeholder="请输入或按侧键扫描条码"
						border-bottom key-name="name" @input="handleInput" />
					<z-form-input class="z-form-input" label="资产名称" v-model="formData.assetsName" placeholder="自动带出"
						border-bottom />
					<!-- <z-form-input class="z-form-input" v-model="formData.assetsType" label="物资类别" placeholder="自动带出"
						border-bottom key-name="name" /> -->
					<z-form-select label="物资类别" placeholder="自动带出" :options="state" class="bk"
						v-model="formData.assetsType" key-name="key">

					</z-form-select>



					<z-form-date class="z-form-input" v-model="formData.assetsDueDate" label="到期日期" mode="date"
						placeholder="自动带出" border-bottom />

					<z-form-input class="z-form-input" v-model="assetsEpc" label="RFID标签" placeholder="请扣动扳机扫描标签"
						border-bottom key-name="name" />
					<view class="bottom-btn-block">
						<!-- 	<view class="btn-row-wrap">
							<template>
								<view class="loader" v-if="rfidOpen">
									<view class="loader-item item-1"></view>
									<view class="loader-item item-2"></view>
								</view>
								<image v-if="!rfidOpen" class="rfid-switch" src="/static/images/rfid-off.png"
									@click="handleRfid(true)" />
								<image v-else class="rfid-switch" src="/static/images/rfid-on.png"
									@click="handleRfid(false)" />

							</template>
						</view> -->




					</view>
					<!-- #ifdef APP-PLUS -->
			</cell>

			<cell>
				<!-- #endif -->

				<!-- 底部按钮模块 -->
				<view class="bottom-btn-block">
					<view class="btn-row-wrap">
						<view class="btn centre">
							<button @click="handleSave" class="btnSave">保存</button>
							<!-- <u-button text="保存" :plain="true" /> -->
						</view>
					</view>
				</view>
				<!-- #ifdef APP-PLUS -->
			</cell>
		</list>
		<!-- #endif -->
		<!-- #ifndef APP-PLUS -->
		</scroll-view>
		<!-- #endif -->
	</view>
</template>

<script>
	import url from "../../../common/config.js"
	// const test_module = uni.requireNativePlugin("sz360c_honewell")
	// #ifdef APP-NVUE
	const dom = uni.requireNativePlugin('dom')
	// #endif
	import ZFormSelect from '@/components/z-form-select/z-form-select.nvue'
	import ZFormRadio from '@/components/z-form-radio/z-form-radio.nvue'
	import ZFormDate from '@/components/z-form-date/z-form-date.nvue'
	import ZFormInput from '@/components/z-form-input/z-form-input.nvue'

	export default {
		components: {
			ZFormSelect,
			ZFormRadio,
			ZFormInput,
			ZFormDate,
			url
		},
		data() {
			return {
				canEdit: false,
				deptId: '',
				assetsEpc:'',
				rfidOpen: false, // rfid打开状态
				resetList: [], // 
				alreadySet: new Set(), // 已扫描集合
				assetsCode: "",
				net: "",
				formData: [{

					},

				],
				state: [
					[{
							key: '检具'
						},

					]
				],

				assetsList: [

				],


			};
		},
		onNavigationBarButtonTap() {
			uni.$u.throttle(() => {
				this.showFilter = !this.showFilter
			}, 200)

		},
		onShow() {
			
			
this.initScan()

			
			
			
			this.isHaveNetwork()

		},
		// onPullDownRefresh() {
		// 	this.formData = []
		// 	this.alreadySet.clear()
		// 	this.assetsEpc = "",
		// 	//调用接口完成后添加下方函数,停止当前页面下拉刷新。
		// 	uni.stopPullDownRefresh()
		// 	uni.$u.toast('刷新成功');
		// },
		

		methods: {
			findEpc(str, type) {
				this.assetsEpc = str
			},

			isHaveNetwork() {
				uni.getNetworkType({
					success: (res) => {
						if (res.networkType == 'none') {
							uni.showToast({
								title: '没有网络',
								icon: "error"
							});
							this.net = "none"
						} else {
							this.net = "b"
							console.log("有网") //有网
						}
					}
				});
			},
initScan() {
				// 获取功率设置
				
				// 设置保存的功率，默认30
			
				
				uni.$on('rfid', epc => {
					
					console.log('获取到rfid', epc)
					this.findEpc(epc.epcHexStr, 'epc')
				})
				
				uni.$on('onTriggerLong', () => {
					console.log('扳机长按开始')
					
					
				})
				uni.$on('endTriggerLong', () => {
					console.log('扳机长按结束')
					
				})
				
			},

			handleInput(e) {
				this.isHaveNetwork()
				let sum = 0;
				if (this.net != "none") {
					uni.request({
						url: url.BASE_URL+"/api/ESC/App_AssetsQuery_Eam",
						method: "POST",
						data: {
							assetsCode: e,
						},
						success: (res) => {
							this.assetsCode = e
							this.formData = []
							// alert(this.assetsCode!="")
							if (this.assetsCode != "") {
								this.sum++
								this.formData = res.data.data
								this.assetsEpc = this.formData.assetsEpc
								if (this.assetsEpc != null && this.assetsEpc != "") {
									uni.showModal({
										cancelText: "否",
										confirmText: "是",
										content: '是否重置本FRID标签',
										success: (res) => {
											if (res.confirm) {
												this.assetsEpc = ""
											} else {
												this.formData = []
												this.assetsEpc = ""
												this.assetsCode = ""
											}

										}
									})
								}


								// res.data.data.forEach(item => {
								// 	if (item.assetsCode == this.assetsCode && this.assetsCode != "") {
								// 		this.assetsCode = item.assetsCode
								// 		this.formData.assetsName = item.assetsName
								// 		this.formData.assetsType = item.assetsType
								// 		this.formData.assetsDueDate = item.assetsDueDate
								// 		this.assetsEpc = item.assetsEpc
								// 		this.sum++
								// 	}
								// })

							}
							// if (this.sum == 0) {
							// 	uni.showToast({
							// 		title: '该编号不在库中',
							// 		icon: 'error'
							// 	});
							// }
						}
					})
				} else {
					uni.showToast({
						title: '网络不稳定',
						icon: 'error'
					});
				}
				test_module.stopRead()

			},




			/**
			 * 控制rfid
			 * @param {Object} flag
			 */
			// handleRfid(flag) {
			// 	if (flag) {
			// 		this.rfidOpen = true;
			// 		uni.$emit('repeatScan')
			// 	} else {
			// 		this.rfidOpen = false;
			// 		uni.$emit('stopScan')
			// 	}
			// },

			/**
			 * 处理编辑
			 */
			handleEdit() {
				this.canEdit = true
			},

			/**
			 * 处理保存
			 */
			handleSave() {
				this.isHaveNetwork()
				if (this.net == "none") {
					uni.showToast({
						title: '网络不稳定',
						icon: 'error'
					});
					return
				}
				let that = this
				if (this.assetsEpc != null && this.assetsEpc != "") {
					uni.request({
						url: url.BASE_URL+"/api/ESC/App_BindCardSubmit_Eam",
						method: 'POST',
						data: {
							"assetsList": [{
								"ID": 0,
								"assetsCode": this.assetsCode,
								"assetsName": this.formData.assetsName,
								"assetsType": this.formData.assetsType,
								"assetsEpc": this.assetsEpc,
								"assetsTagType": this.formData.assetsTagType,
								"assetsDueDate": this.formData.assetsDueDate,
							}]
						},
						success: (res) => {
							if (res.data.code == "200") {
								that.formData = []
								that.assetsCode = ""
								that.assetsEpc = ""
							}
							uni.showToast({
								title: res.data.message,
								//显示持续时间为 2秒
								icon:"none"



							})
						}

					});



				} else {
					uni.showToast({
						title: '请扫描标签',
						icon: 'none',
						duration: 2000
					})
				}
			},

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
	.main-wrap {

		display: flex;
		flex-direction: column;
		flex: 1;
		/* #ifndef APP-PLUS */
		height: calc(100vh - var(--window-top));
		/* #endif */
	}

	.top-info-block {
		height: 140rpx;
		padding: 0 31rpx 0 200rpx;


		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.info-block {
		flex: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.info-block .label {
		font-size: 40rpx;
		font-weight: bold;
		color: #222222;
	}

	.info-block .value {
		font-size: 40rpx;
		font-weight: bold;
		color: #11479b;
	}

	.edit-btn {
		flex-shrink: 0;
		width: 140rpx;
	}

	.form-list-block {
		flex: 1;
	}

	.form-scroll-block {
		flex: 1;
		height: 0;
	}

	.form-title {
		padding: 0 24rpx;
		font-size: 32rpx;
		font-weight: bold;
		line-height: 90rpx;
		color: #a6a6a6;
	}

	.form-block {}

	.function-arrow-right {
		width: 84rpx;
	}

	.bottom-btn-block {}

	.fuc-icon {

		height: 100rpx;
		padding: 0 28rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.bottom-btn-block {

		.btn-row-wrap {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			position: relative;

			.btn {
				width: 200rpx;

			}

			.centre {
				position: relative;
				top: 20px;
				left: 40%;
				border: none;
			}

			.loader {
				position: absolute;
				left: 88%;
				transform: translateX(-50%) scale(3);
				bottom: 80rpx;
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
				position: absolute;
				left: 88%;
				transform: translateX(-50%) scale(3);
				bottom: 35rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 25rpx;
				height: 25rpx;
			}
		}
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

	.z-form-input {
		background-color: #f2f3f5;
	}

	.bk {
		background-color: #f2f3f5;
	}

	.btnSave {
		border: none;
		color: #a6a6a6;
	}
</style>
<style>
	page {
		background-color: #f2f3f5;
	}
</style>