<template>
	<view class="main-wrap">
		<view class="scan-top-info">
			<text class="top-info-text">领用人：{{formData.RecManName}}</text>
			<text class="top-info-text">机台号：{{formData.DeptId}}</text>
			<text class="top-info-number">已读到：
				<text class="value green">{{readNumber}}</text>
				<text class="value">/{{list.length}}</text>
			</text>

		</view>

		<z-list ref="list" class="list-block" :list="list" :init="false" is-scan @refresh="getList">
			<!-- 分页列表模块 -->
			<template v-if="list && list.length > 0 ">

				<cell v-for="(item, index) in list" :key="index">
					<!-- 盘点任务item -->
					<view v-if="item.status==1" class="list-box" @click="viewDetail(item)">
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

					<view v-if="item.states==2" class="list-box1" @click="viewDetail(item)">
						<view class="list-info-block">
							<view class="list-info-wrap">
								<view class="list-head-block">
									<text class="shop-name">检具编号：{{item.Assets_UseDEP}}</text>

								</view>
								<view class="list-info-block">
									<view class="list-info-wrap">
										<view class="info-row">
											<text class="info-label ">检具名称</text>
											<text class="shop-name ">{{item.Gauge_Number}}</text>
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
				<u-icon v-if="isSave" name="warning-fill" :color="alreadyCount < totalCount ? '#f56c6c' : '#7e7e7e'"
					size="80" @click="showTips" />
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

					<z-form-input class="info-line " v-model="formData.DeptId" label="机台设备号" placeholder=""
						type="assetsLocal"  :required="canEdit" :readonly="!canEdit" />
					<!-- <text class="info-label ">检具名称</text>
			<text class="shop-name ">dd</text> -->
					<z-form-input class="info-line " v-model="formData.RecManName" label="使用人工号" placeholder=" 请输入员工号"
						type="assetsLocal"  :required="canEdit" :readonly="canEdit" />
					<z-form-input class="info-line " v-model="formData.PassWord" label="确 认 密 码" placeholder=" 请输入密码"
						type="password"  :required="canEdit" :readonly="canEdit" />



				</view>
				<view v-if="isSave">
					<text class="tille-name">你好， {{formData.assetsUser}}，</text>
					<text class="tille-lable">请确认无误后点击提交</text>
				</view>
				<view v-if="this.password">
					<text class="tille-name">密码错误</text>
					<text class="tille-lable">请重新输入</text>
				</view>

				<view class="bottom-btn-block" v-if="!readOnly">
					<view class="btn-row-wrap">
						<view class="btn1">
							<u-button type="warning" text="取消" @click="cancel" />
						</view>
						<view class="btn2">
							<u-button v-if="!isSave" type="success" text="确认" @click="SaveInfo" />
							<u-button v-else type="primary" text="提交"  @click="SubmitInfo"/>
						</view>
					</view>
					<u-safe-bottom />
				</view>
			</view>
		</u-overlay>
		<view class="approval-block">
			<u-popup :show="showApprovalPopup" mode="bottom">
				<view class="approval-popup-box">
					<view class="approval-popup-title">{{ approvalFlowList }}</view>
					<view class="btn-row-wrap">
						<view class="btn">
							<u-button type="warning" text="取消" @click="cancelApproval" />
						</view>
						<view class="btn">
							<u-button type="success" text="确认" @click="confirmApproval" />
						</view>
					</view>
				</view>
			</u-popup>
		</view>

	</view>

</template>

<script>
	import url from "../../common/config.js"
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
					// {
					// 	Number:"HY777765",
					// 	Assets_UseDEP: "IT-A01-1254412",
					// 	Gauge_Number: "Yju",
					// 	Gauge_Platform: 147,
					// 	Gauge_Area: "CZM仓储中心",
					// 	state: 1,
					// 	Actual_Type:"在库" ,
					// 	},
					// {
					// 	Number:"HY777765",
					// 	Assets_UseDEP: "IT-A01-1254412",
					// 	Gauge_Number: "Ugg",
					// 	Gauge_Platform: 147,
					// 	Gauge_Area: "CZM仓储中心",
					// 	state: 1,
					// 	Actual_Type:"使用中" 


					// },
					// {
					// 	Number:"HY777765",
					// 	Assets_UseDEP: "IT-A01-1254412",
					// 	Gauge_Number: "kjj",
					// 	Gauge_Platform: 147,
					// 	Gauge_Area: "CZM仓储中心",
					// 	state: 1
					// },
					// {
					// 	Assets_UseDEP: "IT-A01-1254412",
					// 	Gauge_Number: 5,
					// 	Gauge_Platform: 147,
					// 	Gauge_Area: "CZM仓储中心",
					// 	state: 2
					// },
					// {
					// 	Assets_UseDEP: "IT-A01-1254412",
					// 	Gauge_Number: 5,
					// 	Gauge_Platform: 147,
					// 	Gauge_Area: "CZM仓储中心",
					// 	state: 2
					// }

				],

				resetList: [
					// {
					// 	Assets_UseDEP: "IT-A01-1254412",
					// 	Gauge_Number: 5,
					// 	Gauge_Platform: 147,
					// 	Gauge_Area: "CZM仓储中心",
					// 	state: 1
					// },
					// {
					// 	Assets_UseDEP: "IT-A01-1254412",
					// 	Gauge_Number: 5,
					// 	Gauge_Platform: 147,
					// 	Gauge_Area: "CZM仓储中心",
					// 	state: 1
					// },
					// {
					// 	Assets_UseDEP: "IT-A01-1254412",
					// 	Gauge_Number: 5,
					// 	Gauge_Platform: 147,
					// 	Gauge_Area: "CZM仓储中心",
					// 	state: 1
					// }
				],
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
				alreadySet: new Set(), // 已扫描集合
				approvalFlowList: '', // 审核流程列表
				currentSort: 'code-asc', // 当前排序
				statusEnum: {
					0: '未盘',
					1: '已盘',
					5: '盘多',
					3: '变更',
					4: '未知'
				},
				formData: {
				
					DeptId: 111,
				}
			}
		},

		computed: {


			readNumber() {
				this.number = 0
				this.list.forEach((item) => {
					if (item.status == 1) {
						this.number++
					}
				});
				return this.number
			}


		},

		onLoad(options) {
			this.formData = options
			// this.list=options

			this.getSign()
			// 设置顶部标题
			// uni.setNavigationBarTitle({
			// 	title: BillNo
			// })
			// 获取盘点任务列表

			
			// #ifdef APP-PLUS
			// 初始化rfid
			// if (!this.readOnly) {
			// 	this.initScan()
			// }
			// #endif
		},
		mounted() {
			this.getList()
		},
		methods: {
			onPullDownRefresh() {
			    
			    uni.stopPullDownRefresh()
			     
			     this.list=[]
			     uni.$u.toast('刷新成功');
			    },
			getSign() {
				if (this.readNumber == this.list.length) {
					this.sign = true
				}
			},
			/**
			 * 处理编辑
			 */
			handleEdit() {
				this.canEdit = true
			},
			/**
			 * 处理排序
			 * @param {Object} key
			 */
			// handleSort(key) {
			// 	let sort = 'asc'
			// 	// 相同key，进行正序倒序颠倒
			// 	if (this.currentSort.includes(key)) {
			// 		sort = this.currentSort.includes('asc') ? 'desc' : 'asc'
			// 	}
			// 	this.currentSort = key + '-' + sort
			// 	if (key === 'code') {
			// 		this.list.sort((a, b) => {
			// 			if (sort === 'asc') {
			// 				return a.Assets_Code.replace(/[^0-9]/ig, '') - b.Assets_Code.replace(/[^0-9]/ig, '')
			// 			} else {
			// 				return b.Assets_Code.replace(/[^0-9]/ig, '') - a.Assets_Code.replace(/[^0-9]/ig, '')
			// 			}
			// 		})
			// 	}
			// 	if (key === 'status') {
			// 		this.list.sort((a, b) => {
			// 			if (sort === 'asc') {
			// 				return a.Inventory_Status - b.Inventory_Status
			// 			} else {
			// 				return b.Inventory_Status - a.Inventory_Status
			// 			}
			// 		})
			// 	}
			// },

			/**
			 * 初始化扫描
			 */
			// initScan() {
			// 	// 获取功率设置
			// 	const power = uni.getStorageSync('资产变更')
			// 	// 设置保存的功率，默认30
			// 	this.$emit('setPower', power ? Number(power) : 30)

			// 	uni.$on('rfid', epc => {
			// 		console.log('获取到rfid', epc)
			// 		this.findEpc(epc, 'epc')
			// 	})
			// 	uni.$on('onScan', assetsCode => {
			// 		console.log('获取到scan', assetsCode)
			// 		this.findEpc(assetsCode, 'assetsCode')
			// 	})
			// 	uni.$on('onTriggerLong', () => {
			// 		console.log('扳机长按开始')
			// 		// 如果不在保存状态并且未打开rfid页面按钮
			// 		if (!this.isSave && !this.rfidOpen) {
			// 			this.rfidOpen = true;
			// 			uni.$emit('repeatScan')
			// 		}
			// 	})
			// 	uni.$on('endTriggerLong', () => {
			// 		console.log('扳机长按结束')
			// 		this.rfidOpen = false;
			// 		uni.$emit('stopScan')
			// 	})
			// 	uni.$on('onTriggerOnce', () => {
			// 		console.log('扳机单次按下')
			// 		if (!this.isSave) {
			// 			if (this.rfidOpen) {
			// 				this.rfidOpen = false
			// 				uni.$emit('stopScan')
			// 			} else {
			// 				uni.$emit('sigleScan')
			// 			}
			// 		}
			// 	})
			// },

			/**
			 * 保存
			 */
			handleSave() {
				this.isShowTips = true
			},
			
			//归还提交
			SubmitInfo(){
				uni.request({
					url: url.BASE_URL+'/api/ESC/App_ReturnSign_Eam',
					method: 'POST',
					data: {
						 "userId": 0,
						  "recManId": 0,
						  "recManName": "string",
						  "deptId": 0,
						  "deptName": "string",
						  "imgUrl": "string",
						  "assetsList": [
						    {
						      "ID": 0,
						      "assetsCode": "string",
						      "assetsName": "string",
						      "assetsType": "string",
						      "assetsUseDate": "string",
						      "assetsUseMonth": "string",
						      "assetsUseDeptId": 0,
						      "assetsUseDEP": "string",
						      "assetsUserId": 0,
						      "assetsUser": "string",
						      "assetsLocal": "string",
						      "assetsOutFlag": "string",
						      "assetsCheckDeptID": 0,
						      "assetsCheckDEP": "string",
						      "actualCheckUserID": 0,
						      "actualCheckUser": "string",
						      "actualCheckDate": "string",
						      "actualCheckFlag": 0,
						      "actualType": "string",
						      "actualDep": "string",
						      "actualUserId": 0,
						      "actualUser": "string",
						      "actualLocal": "string",
						      "actualState": 0,
						      "assetsFlag": 0,
						      "assetsEpc": "string",
						      "assetsImg": "string",
						      "assetsCategory": "string",
						      "assetsTagType": "string",
						      "bindCardStatus": 0,
						      "transformCount": 0,
						      "status": 0,
						      "assetsDueDate": "string",
						      "actualDeptId": 0
						    }
						  ]
					},
					success: (res) => {
					uni.showToast({
						title: res.data.message,
						//将值设置为 success 或者直接不用写icon这个参数
						icon: 'error',
						//显示持续时间为 2秒
						duration: 2000
					})
					if(res.data.message=="提交成功"){
						this.isShowTips = false
						this.isSave = false
					}
					
					
					
					}
				});
				
			},
			//归还确认按钮
			SaveInfo() {
				uni.request({
					url: url.BASE_URL+'/api/ESC/App_ReturnConfirm_Eam',
					method: 'POST',
					data: {
						"epc": "string",
						  "queryContent": "string",
						  "queryType": "string",
						  "billNo": "string",
						  "assetsCode": "string",
						  "assetsName": "string",
						  "ibId": 0,
						  "wbId": 0,
						  "tbId": 0,
						  "recId": 0,
						  "outId": 0,
						  "inId": 0,
						  "retId": 0,
						  "status": 0,
						  "roleId": 10,
						  "userId": 22,
						  "deptId": 0,
						  "signDeptId": 0,
						  "signUserName": "0002",
						  "signPassword": "123456",
						  "pageSize": 0,
						  "pageIndex": 0
					},
					success: (res) => {
					// if (this.formData.RecManName == "") {
					// 	this.password = false
					// 	uni.showToast({
					// 		title: '请输入人工号',
					// 		//将值设置为 success 或者直接不用写icon这个参数
					// 		icon: 'error',
					// 		//显示持续时间为 2秒
					// 		duration: 2000
					// 	})
					// }
					// alert(this.formData.PassWord == "")
					
						this.password = false
						uni.showToast({
							title: res.data.message,
							//将值设置为 success 或者直接不用写icon这个参数
							icon: 'error',
							//显示持续时间为 2秒
							duration: 2000
						})
					
					
					// alert(res.data.message)
					// if(){
					// 	// alert()
					// 	this.isSave = true
					// }
					
					}
				});
				
				
				
				
				
			
				


			},
			cancel() {
				this.isSave = false
				this.isShowTips = false

			},
			/**
			 * 重置本次盘点
			 */
			reset() {
				uni.showModal({
					title: '确定',
					content: '是否确认重置本次盘点',
					success: (res) => {
						if (res.confirm) {

							this.list.forEach(item => {
								item.state = 1
							})
							this.sign = true
						}
					},

				})
			},


			/**
			 * 查看详情
			 */
			// viewDetail(item, index) {
			// 	if ([1, 2, 3].includes(item.Inventory_Status) && !this.readOnly) {
			// 		// 关闭rfid
			// 		this.handleRfid(false)
			// 		uni.navigateTo({
			// 			url: '/pages/inventory-module/detail/detail?item=' + JSON.stringify(item),
			// 			events: {
			// 				setChange: item => {
			// 					this.list[index] = {
			// 						...item,
			// 						Inventory_Status: 3
			// 					}
			// 					this.calcChangeCount()
			// 					this.$forceUpdate()
			// 				}
			// 			},
			// 		});
			// 	}
			// },

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
				uni.request({
					url: url.BASE_URL+'/api/ESC/App_RecipientsDetails_Eam',
					method: 'POST',
					data: {
						recId: 149,
						roleId: 10,
						userId: 22,
					},
					success: (res) => {

						this.list = res.data.data
						this.list.deptId = 1
						console.log(this.list)
					}
				});
			},
			/**
			 * 计算变更数量
			 */
			calcChangeCount() {
				this.changeCount = 0
				this.list.forEach(item => {
					// 变更计数
					if (item.Inventory_Status === 3) {
						this.changeCount += (item.Transform_Count || 1)
					}
				})
			},
			/**
			 * 控制rfid
			 * @param {Object} flag
			 */
			handleRfid(flag) {
				if (flag) {
					this.rfidOpen = true;
					uni.$emit('repeatScan')
				} else {
					this.rfidOpen = false;
					uni.$emit('stopScan')
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
			background-color: #ffffff;
			border-top: 1px solid #e6e6e6;

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
					bottom: 60rpx;
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
