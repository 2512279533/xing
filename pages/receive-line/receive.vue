<template>
	<view class="main-wrap">
		<view class="scan-top-info">
			<text class="top-info-text">领用人：{{this.userInfo.NickName}}</text>
			<text class="top-info-text">机台号：{{this.formData.DeptCode}}</text>
			<text class="top-info-number">已读到：
				<text class="value green">{{readNumber}}</text>
				<text class="value">/{{this.len}}</text>
			</text>

		</view>

		<z-list ref="list" class="list-block" :list="list" :init="false" is-scan @refresh="getList">
			<!-- 分页列表模块 -->
			<template v-if="list && list.length > 0 ">

				<cell v-for="(item, index) in list" :key="index">

					<!-- 盘点任务item -->
					<view v-if="item.status==0" class="list-box" @click="viewDetail(item)">
						<view class="list-info-block">
							<view class="list-info-wrap">
								<view class="list-head-block">
									<text class="shop-name">检具编号：{{item.assetsCode}}</text>

								</view>
								<view class="list-info-block">
									<view class="list-info-wrap">
										<view class="info-row">
											<text class="info-label ">检具名称</text>
											<text class="shop-name ">{{item.assetsName}}</text>
										</view>
									</view>
									<image class="right-icon" src="/static/images/arrow-right-black.png"
										mode="widthFix" />
								</view>
							</view>
						</view>
					</view>

					<view v-if="item.status==1" class="list-box1" @click="viewDetail(item)">
						<view class="list-info-block">
							<view class="list-info-wrap">
								<view class="list-head-block">
									<text class="shop-name">检具编号：{{item.assetsCode}}</text>

								</view>
								<view class="list-info-block">
									<view class="list-info-wrap">
										<view class="info-row">
											<text class="info-label ">检具名称</text>
											<text class="shop-name ">{{item.assetsName}}</text>
										</view>
									</view>
									<image class="right-icon" src="/static/images/arrow-right-black.png"
										mode="widthFix" />
								</view>
							</view>
						</view>
					</view>
				</cell>
			</template>
		</z-list>

		<!-- 底部按钮模块 -->
		<view class="bottom-btn-block" v-if="!readOnly">

			<view class="btn-row-wrap">
				<view class="btn">
					<u-button type="warning" text="重置" @click="reset" />
				</view>
				<u-icon v-if="isSave" :color="alreadyCount < totalCount ? '#f56c6c' : '#7e7e7e'" size="80"
					@click="showTips" />
				<template v-if="!isSave">
					<view class="loader" v-if="rfidOpen">
						<view class="loader-item item-1"></view>
						<view class="loader-item item-2"></view>
					</view>
					<image v-if="!rfidOpen" class="rfid-switch" src="/static/images/rfid-off.png"
						@click="handleRfid(true)" />
					<image v-else class="rfid-switch" src="/static/images/rfid-on.png" @click="handleRfid(false)" />
				</template>
				<view class="btn">
					<u-button v-if="!sign" text="签收" type="info" />
					<u-button v-else text="签收" @click="handleSave" />
				</view>
			</view>
			<u-safe-bottom />
		</view>
		<!-- 警告提示模块 -->
		<u-overlay :show="isShowTips">
			<view class="tips-block">
				<text class="tille-text">签收信息确认</text>
				<view class="">
					<z-form-input class="info-line " v-model="formData.DeptCode" label="机台设备号" placeholder=""
						type="assetsLocal" :required="canEdit" :readonly="!canEdit" />
					<z-form-input class="info-line " v-model="formData.signUserName" label="使用人工号" placeholder=" 请输入员工号"
						type="assetsLocal" :required="canEdit" :readonly="canEdit" />
					<z-form-input class="info-line " v-model="formData.signPassword" label="确 认 密 码"
						placeholder=" 请输入密码" type="password" :required="canEdit" :readonly="canEdit" />
				</view>

				<text class="tille-name">{{this.assetsUser}}</text>
				<!-- <text class="tille-name">建行工行工行纠结很久很久就黑胡椒</text> -->
				<view class="bottom-btn-block">
					<view class="btn-row-wrap">

						<view class="btn1">
							<u-button type="warning" text="取消" @click="cancel" />
						</view>
						<view class="btn2">
							<u-button v-if="!isSave" type="success" text="确认" @click="SaveInfo" />
							<u-button v-else type="primary" text="提交" @click="SubmitInfo" />
						</view>
					</view>
					<u-safe-bottom />
				</view>

			</view>
		</u-overlay>

	</view>
</template>
<script>
	import url from "../../common/config.js"
	const test_module = uni.requireNativePlugin("sz360c_honewell")
	import dayjs from '@/uni_modules/uview-ui/libs/util/dayjs.js';
	import ZFormInput from '@/components/z-form-input/z-form-input.nvue'
	export default {
		components: {
			
			url
		},
		data() {
			return {
				readOnly: false,
				password: false,
				inventoryMan: '', // 盘点人员
				now: dayjs().format("YYYY-MM-DD hh:MM:ss"), // 当前时间
				showListMore: false, // 是否显示盘多
				ibId: null, // 盘点id
				list: [
					// 	{
					// 	assetsEpc: "F000000007301301",
					// 	assetsCode: "kkjjh",
					// 	status: 1
					// },
				],

				list2: [
					// 	{
					// 	assetsCode: "850768-G0440",
					// 		status: 1
					// },
				],
				lens: 0,
				resets: true,
				canEdit: false,
				rfidOpen: false, // rfid打开状态
				totalCount: 8, // 总需盘数量
				surplusCount: 0, // 盘多数量
				alreadyCount: 4, // 已盘数量
				changeCount: 0, // 变更数量
				isSave: false, // 是否为保存状态
				sign: false,
				isShowTips: false, // 是否显示提示
				showApprovalPopup: false, // 是否显示审批流程
				ignoreSet: new Set(), // 屏蔽集合
				len: 0,
				scans: true,
				readNumber: 0,
				alreadySet: new Set(), // 已扫描集合
				approvalFlowList: '', // 审核流程列表
				currentSort: 'code-asc', // 当前排序
				assetsUser: " ",
				statusEnum: {
					0: '未盘',
					1: '已盘',
					5: '盘多',
					3: '变更',
					4: '未知'
				},
				formData: {

				},
				temp:''
			}
		},
		// watch:{
		          
							
		//           temp:{
		// 			  handler (newName, oldName) {
		// 			              console.log('555555',newName,oldName)
		// 						  if (!getApp().globalData.dataInfo.includes(newName)) {
								  
		// 						  	this.list.forEach(res => {
		// 						  		console.log("=>>>>" + res.assetsEpc)
		// 						  		if (newName == res.assetsEpc) {
		// 						  			console.log("yes")
								  			
		// 						  			res.status = 0
								  
		// 						  			// return
		// 						  		}
		// 						  	})
								  
		// 						  }
		// 			          },
		// 		  }
		//        },
		onShow() {
			this.initScan()
		}
,
onHide: function() {
			plus.globalEvent.removeEventListener('keydown');
		},
		onLoad(options) {
			getApp().globalData.test_module.InitRFID()
			this.formData = options
			this.userInfo = uni.getStorageSync("userInfo")
			this.getList()
			// this.getListData()

			// 获取盘点任务列表
			
			// #ifdef APP-PLUS
			// 初始化rfid
		
				
				
			
			// #endif

		},
		
		 
	
		
		
		methods: {
			onPullDownRefresh() {
				uni.stopPullDownRefresh()


				uni.$u.toast('刷新成功');
			},


			/**
			 * 查找EPC
			 */
			findEpc(str, type) {
				var that = this

					if (!this.alreadySet.has(str)) {
									// 在已扫描数据内添加该epc
									this.alreadySet.add(str)	
					this.list.forEach(res => {
						console.log("=>>>>" + res.assetsEpc)
						if (str == res.assetsEpc) {
							console.log("yes")
							res.status = 0
						
							// return
						}
					})
					
					// 在已扫描数据内添加该epc
	           let sum = 0
						
						this.list.forEach(item => {
							if (item.status == 0) {
								sum++
							}
						})

						this.readNumber = sum
						if (this.readNumber === this.len) {
							this.sign = true
						}

				}
			},
			/**
			 * 保存
			 */
			handleSave() {
				this.isShowTips = true
			},

			//领用提交
			SubmitInfo() {
				uni.request({
					url: url.BASE_URL+'/api/ESC/App_RecipientsSign_Eam',
					method: 'POST',
					data: {
						recId: this.formData.RecID,
						status: 0,
						roleId: this.userInfo.RoleId,
						userId: this.userInfo.UserID,
						deptId: this.formData.DeptId,
						signUserName: this.formData.signUserName,
						signPassword: this.formData.signPassword,
					},
					success: (res) => {
						uni.showToast({
							title: res.data.message,
							//显示持续时间为 2秒
							duration: 2000
						})

						if (res.data.code == "200") {
							this.isShowTips = false
							this.isSave = false
							uni.navigateBack({
								delta: 1
							})
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
			//领用确认
			SaveInfo() {
				uni.request({
					url: url.BASE_URL+'/api/ESC/App_RecipientsConfirm_Eam',
					method: 'POST',
					data: {
						"status": this.formData.Status,
						"userId": this.userInfo.UserID,
						"roleId": this.userInfo.RoleId,
						"signUserName": this.formData.signUserName,
						"signPassword": this.formData.signPassword,
					},
					success: (res) => {
						this.password = true
						this.assetsUser = res.data.message
						if (res.data.code == "200") {
							this.isSave = true
						}
					}
				});

			},
			cancel() {
				this.isSave = false
				this.isShowTips = false
			},
			reset() {
				getApp().globalData.list=[]
				this.alreadySet.clear()
				getApp().globalData.dataInfo=[]
				this.list = []
				
				this.len = 0
				this.readNumber = 0
				uni.showModal({
					title: '确定',
					content: '是否确认重置本次盘点',
					success: (res) => {
						if (res.confirm) {
							uni.request({
								url: url.BASE_URL+'/api/ESC/App_RecipientsDetails_Eam',
								method: 'POST',
								data: {
									recId: this.formData.RecID,
									roleId: this.userInfo.RoleID,
									userId: this.userInfo.UserID,
								},
								success: (res) => {
									if (res.data.code == "200") {
										uni.showToast({
											title: res.data.message,
											//显示持续时间为 2秒
											duration: 2000
										})
										this.list = res.data.data
										this.len = this.list.length

										this.list.forEach((item) => {
											if (item.status == 0) {
												this.readNumber++
											}
										});
										if (this.readNumber === this.len) {
											this.sign = true
										}
									} else {
										uni.showToast({
											title: res.data.message,
											//显示持续时间为 2秒
											duration: 2000
										})
									}
								}
							});

							// this.readNumber = 0
							// console.log(this.list)
							// this.sign = false
						}
					},

				})

			},

			viewDetail(item, index) {
				uni.$u.throttle(() => {
					uni.$u.route({
						url: '/pages/rece/rece-detail',
						params: item
					})

				}, 500)
			},

			/**
			 * 获取盘点列表
			 */
			getList() {
				this.list=[]
				uni.request({
					url: url.BASE_URL+'/api/ESC/App_RecipientsDetails_Eam',
					method: 'POST',
					data: {
						recId: this.formData.RecID,
						roleId: this.userInfo.RoleID,
						userId: this.userInfo.UserID,
					},
					success: (res) => {
					

						this.list = res.data.data
						console.log(this.list[0])
						this.len = this.list.length
						this.list.forEach((item) => {
							if (item.status == 0) {
								this.readNumber++
							}
						});
						if (this.readNumber === this.len) {
							this.sign = true
						}

					}
				});

			},

			/**
			 * 控制rfid
			 * @param {Object} flag
			 */
			handleRfid(flag) {
				
				if (flag) {
					this.rfidOpen = true;
				getApp().globalData.list = this.list
				
				getApp().globalData.test_module.ReadRFID(res => {
				
					console.log("read ", res)
					let str = res.epcHexStr
					if (!getApp().globalData.dataInfo.includes(str)) {
				
						this.list.forEach(res => {
							console.log("=>>>>" + res.assetsEpc)
							if (str == res.assetsEpc) {
								console.log("yes")
								
								res.status = 0
				
								// return
							}
						})
						console.log(this.readNumber,this.len,"-----------------------")
						if (this.readNumber == this.len) {
							this.sign = true
						}
					}
				
				})
				} else {
					this.rfidOpen = false;
					console.log(getApp().globalData.list)
					this.list = getApp().globalData.list
					let sum = 0
					this.list.forEach(item => {
						if (item.status == 0) {
							sum++
						}
					})
					
					this.readNumber = sum
					if (this.readNumber === this.len) {
						this.sign = true
					}
					getApp().globalData.test_module.stopRead()
				}
			},
			/**
			 * 控制显示盘多列表
			 */
			handleShowListMore() {
				if (this.surplusCount > 0) {
					this.showListMore = true
				} else {
					uni.showToast({
						icon: 'none',
						title: '暂无盘多列表'
					})
				}
			},
			/**
			 * 删除盘多
			 * @param {Object} index
			 */
			delListMore(index) {
				uni.showModal({
					title: '确定',
					content: '是否确认删除该盘多的资产',
					success: (res) => {
						if (res.confirm) {
							let item = this.list.splice(index, 1)
							this.ignoreSet.add(item[0].Assets_Epc)
							this.ignoreSet.add(item[0].Assets_Code)
							this.surplusCount -= 1
						}
					}
				})
			},
			/**
			 * 控制显示正常列表
			 */
			handleShowNormal() {
				this.showListMore = false
			},
			/**
			 * 取消审批
			 */
			cancelApproval() {
				this.showApprovalPopup = false
			},
			/**
			 * 确认审批
			 */
			confirmApproval() {

				uni.$u.api.inventory.submit({
					ibId: this.ibId
				}).then(res => {
					uni.showToast({
						title: '提交成功',
						success() {
							uni.navigateBack({
								delta: 1
							})
						}
					})
				}).catch(err => {})
			}
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
		flex: 1;
		height: calc(100vh - var(--window-top));

		.scan-top-info {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			padding: 24rpx 24rpx 30rpx;
		}

		.top-info-text {
			font-size: 26rpx;
			color: #969799;

		}

		.top-info-number {
			font-size: 26rpx;
			color: #969799;
			background-color: #ffffff;
		}

		.list-block {
			flex: 1;
		}

		.list-box {
			background-color: #40bf80;
			border-radius: 8rpx;
			display: flex;
			flex-direction: column;
			padding: 0 20rpx;
			margin: 0 30rpx 20rpx;
		}

		.list-box1 {
			background-color: #bfbfbf;
			border-radius: 8rpx;
			display: flex;
			flex-direction: column;
			padding: 0 20rpx;
			margin: 0 30rpx 20rpx;
		}

		.list-box:active {
			opacity: 0.7;
		}

		.list-head-block {
			height: 78rpx;
			border-bottom: 1px solid #ebedf0;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
		}

		.shop-name {
			font-size: 34rpx;
			font-weight: bold;
			color: #222222;
		}

		.list-status {
			font-size: 30rpx;
			color: #00a34f;
		}

		.status-0 {
			color: #faab0c;
		}

		.status-1 {
			color: #11479b;
		}

		.status-2 {
			color: #00a34f;
		}

		.list-info-block {
			display: flex;
			flex-direction: row;
			align-items: center;
			padding: 24rpx 10rpx 0 0;
		}

		.list-info-wrap {
			flex: 1;
		}

		.right-icon {
			width: 16rpx;
			height: 28rpx;
		}

		.info-row {
			margin-bottom: 24rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
		}

		.info-line {
			height: 78rpx;
			width: 250px;

			border-bottom: 2px dotted #ebedf0;
			margin-bottom: 24rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
		}

		.info-label {
			width: 190rpx;
			font-size: 30rpx;
			color: #969799;
		}

		.info-value {
			font-size: 30rpx;
			color: #323233;
		}



		.scan-info-wrap {
			height: 276rpx;
			background-color: #ffffff;
			padding-bottom: 32rpx;

			.scan-top-info {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				padding: 24rpx 24rpx 30rpx;


			}

			.top-info-text {
				font-size: 26rpx;
				color: #969799;
			}

			.main-info-wrap {
				display: flex;
				flex-direction: row;
				align-items: flex-end;
				justify-content: space-between;

				.info-box {
					flex: 1;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;

					.value {
						font-size: 28rpx;
						margin-bottom: 12rpx;

						&.blue {
							color: #11479b;
						}

						&.red {
							color: #ee0a24;
						}
					}

					.label {
						font-size: 32rpx;
						font-weight: bold;

						&.blue {
							color: #11479b;
						}

						&.red {
							color: #ee0a24;
						}
					}
				}
			}
		}

		.table-header {
			display: flex;
			flex-direction: row;
			align-items: center;
			background-color: #ffffff;

			.table-box {
				.table-text {
					font-weight: bold;
					color: #11479b !important;
				}

				image {
					width: 36rpx;
					height: auto;
				}
			}
		}

		.table-row {
			display: flex;
			flex-direction: row;
			align-items: center;
			background-color: #ffffff;
			border-bottom: 1px solid #f2f3f5;
		}

		.table-box {
			flex: 0.3;
			background-color: #ffffff;
			height: 80rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			font-size: 32rpx;
			color: #222222;

			&.status {
				color: #7b7e7e;
			}

			&.middle {
				flex: 0.4;
			}

			&.green {
				color: #339f44;
			}

			&.red {
				color: #ee0a24
			}
		}

		.list-block {
			height: calc(130% - 516rpx);

			&.read-only {
				height: calc(120% - 386rpx);
			}
		}

		.bottom-btn-block {
			position: relative;
			height: 130rpx;
			padding: 20rpx 30rpx;
			// background-color: #ffffff;
			// border-top: 1px solid #e6e6e6;

			.btn-row-wrap {

				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;


				.btn {
					width: 200rpx;
				}

				.loader {
					position: absolute;
					left: 50%;
					transform: translateX(-50%) scale(3);
					bottom: 100rpx;
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
					width: 70rpx;
					height: 70rpx;
				}
			}

		}

		.tips-block {
			position: fixed;
			top: 15%;
			left: 50%;
			transform: translateX(-50%);
			padding: 60rpx 40rpx;
			background-color: #ffffff;
			color: #222222;
			display: flex;
			flex-direction: column;
			align-items: center;
			border-radius: 30rpx;

			view {
				color: #FFFFFF;
				font-weight: bold;
				line-height: 70rpx;
			}

			.tips-title {
				font-size: 60rpx;
				white-space: nowrap;
				margin-bottom: 20rpx;
			}

			.tips-sub-title {
				font-size: 48rpx;
				margin-bottom: 20rpx;
			}

			.tips-text {
				font-size: 42rpx;
				width: 100%;
				margin-bottom: 10rpx;
			}
		}

		.approval-block {
			position: absolute;

			.approval-popup-box {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				padding: 40rpx 0;

				.approval-popup-title {
					font-size: 52rpx;
					font-weight: bold;
					color: #222222;
					margin-bottom: 80rpx;

				}

				.approval-select-box {
					display: flex;
					flex-direction: row;
					align-items: center;
					margin-bottom: 36rpx;

					.label {
						width: 220rpx;
						font-size: 36rpx;
						font-weight: bold;
						color: #222222;
					}

					.value {
						border-radius: 8rpx;
						height: 60rpx;
						width: 300rpx;
						background-color: #eff0f1;
						display: flex;
						align-items: center;
						justify-content: space-between;
						padding: 0 24rpx 0 38rpx;
					}
				}

				.btn-row-wrap {
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: space-between;
					position: relative;
					width: 100%;
					padding: 40rpx 114rpx 10rpx;

					.btn {
						width: 200rpx;
					}
				}
			}

		}

	}

	.del-btn {
		padding-left: 10rpx;
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

	.dialog-clum {

		// width: 90%;
		// position: fixed;
		// top: 30%;
		// left: 50%;
		// transform: translateX(-50%);
		// padding: 60rpx 40rpx;
		// background-color: #ffffff;


		// flex-direction: column;
		// align-items: center;
		// border-radius: 10rpx;

	}

	.tille-text {
		text-align: center;
		font-weight: bold;
		height: 30px;

	}

	.tille-name {
		text-align: center;
		font-weight: bold;
		font-size: 40srpx;
		color: #0066cc;
		height: 30px;
	}

	.tille-lable {
		text-align: center;
		font-weight: bold;
		font-size: 36rpx;
		color: #0066cc;
		height: 60px;
	}

	.btn1 {
		height: 0px;
		position: fixed;

		left: 20px;
		width: 70px;
	}

	.btn2 {
		position: fixed;
		height: 0px;
		right: 20px;
		width: 70px;
	}

	.tips-block {
		position: fixed;
		top: 30%;
		left: 50%;
		transform: translateX(-50%);
		padding: 60rpx 40rpx;
		background-color: #f56c6c;
		display: flex;
		flex-direction: column;
		align-items: center;
		border-radius: 8rpx;

		view {
			color: #FFFFFF;
			font-weight: bold;
			line-height: 70rpx;
		}

		.tips-title {
			font-size: 60rpx;
			white-space: nowrap;
			margin-bottom: 20rpx;
		}

		.tips-sub-title {
			font-size: 48rpx;
			margin-bottom: 20rpx;
		}

		.tips-text {
			font-size: 42rpx;
			width: 100%;
			margin-bottom: 10rpx;
		}
	}
</style>

<style>
	page {
		background-color: #f2f3f5;
	}
</style>