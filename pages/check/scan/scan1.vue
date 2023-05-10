<template>
	<view class="main-wrap">
		<view class="scan-info-wrap">
			<!-- 顶部盘点基础信息 -->
			<view class="scan-top-info">
				<text class="top-info-text">机台号：{{data.DeptID}}</text>
				<text class="top-info-text">盘点时间：{{now}}</text>
			</view>
			<!-- 主要数据统计展示信息 -->
			<view class="main-info-wrap">
				<view class="info-box" @click="handleShowListMore">
					<text class="value yellow">{{surplusCount}}</text>
					<text class="label yellow">盘多</text>
				</view>
				<!-- 半圆进度条 -->
				<x-progress :count="alreadyCount" :total="totalCount" @click="handleShowNormal" />

				<view class="info-box">
					<text class="value red">{{changeCount}}</text>
					<text class="label ">未盘</text>
				</view>
			</view>

		</view>
		<u-gap />
		<!-- 表格头 -->
		<!-- <view class="table-header" v-if="list && list.length > 0"> -->
		<view class="table-header">

			<view class="table-box" @click="handleSort('code')">
				<text class="table-text">检具编号</text>
				<template v-if="currentSort.includes('code')">
					<image v-if="currentSort.includes('asc')" src="/static/images/sort-asc.png" mode="widthFix" />
					<image v-if="currentSort.includes('desc')" src="/static/images/sort-desc.png" mode="widthFix" />
				</template>

			</view>
			<view class="table-box middle">
				<text class="table-text">检具名称</text>
			</view>
			<view class="table-box" @click="handleSort('actualState')">
				<text class="table-text">盘点状态</text>
				<template v-if="currentSort.includes('actualState')">
					<image v-if="currentSort.includes('asc')" src="/static/images/sort-asc.png" mode="widthFix" />
					<image v-if="currentSort.includes('desc')" src="/static/images/sort-desc.png" mode="widthFix" />
				</template>
			</view>
		</view>
		<u-gap height="10" />
		<!-- 滚动表格模块 -->
		<scroll-view class="list-block" :class="{'read-only': readOnly}" scroll-y>
			<u-empty v-if="list && list.length === 0" mode="list" text="暂无盘点资产" marginTop="160" />
			<template v-for="(item, index) in list">
				<view class="table-row" :key="index" @click="viewDetail(item)">
					<view class="table-box">{{item.assetsCode}}</view>
					<view class="table-box middle">{{item.assetsName}}</view>
					<view class="table-box actualState"
						:class="{'green': item.actualState === 1,'red': item.actualState === 2, 'black': item.actualState === 3,'black': item.actualState === 0}">
						{{actualStateEnum[item.actualState]}}
						
					</view>
				</view>
			</template>
		</scroll-view>

	</view>
</template>
<script>
		import url from "../../../common/config.js"
	import dayjs from '@/uni_modules/uview-ui/libs/util/dayjs.js';
	import XProgress from './components/progress.vue'
	export default {
		components: {
			XProgress,
			url
		},
		data() {
			return {
				readOnly: false,
				// inventoryMan: '', // 盘点人员
				now: dayjs().format("YYYY-MM-DD hh:MM:ss"), // 当前时间
				showListMore: false, // 是否显示盘多
				ibId: null, // 盘点id
				list: [
					// 	{
					// 	assetsEpc: "F000000007301301",
					// 	actualState: 0
					// },
				], // 盘点列表
				scan: [],
				lens: 0,
				scans: false,
				resetList: [], // 还原列表
				rfidOpen: false, // rfid打开状态
				totalCount: 0, // 总需盘数量
				surplusCount: 0, // 盘多数量
				alreadyCount: 0, // 已盘数量
				changeCount: 0, // 变更数量
				isSave: false, // 是否为保存状态
				isShowTips: false, // 是否显示提示
				showApprovalPopup: false, // 是否显示审批流程
				ignoreSet: new Set(), // 屏蔽集合
				alreadySet: new Set(), // 已扫描集合
				approvalFlowList: '', // 审核流程列表
				currentSort: 'code-asc', // 当前排序
				actualStateEnum: {
				0: '未盘',
				1: '已盘',
				2: '盘多',
				3: '盘亏',
				4: '异常'
				}
			}
		},
		onLoad(options) {
			this.data = options
			this.ibId = this.data.IbID
			this.DeptID = this.data.DeptID
			this.userInfo = uni.getStorageSync("userInfo")
			this.cases = this.userInfo.RoleID
		
		
		},
		mounted() {
			this.getList()
		},
		methods: {
	
			/**
			 * 确认是否为盘多
			//  */
			// confirmSurplus(str, type) {
			// 	uni.$u.api.inventory.confirmSurplus({
			// 		[type]: str
			// 	}).then(res => {
			// 		// 如果有数据，则为盘多
			// 		if (res.data && res.data.length > 0) {
			// 			let item = res.data[0]
			// 			item.Inventory_actualState = 2
			// 			this.surplusCount += 1
			// 			this.list.push(item)
			// 		}
			// 	}).catch(err => {
			// 		console.log(err, '确认盘多失败')
			// 	})
			// },
			
			/**
			 * 查看详情
			 */
			viewDetail(item) {
				uni.$u.throttle(() => {
					uni.$u.route({
						url: '/pages/check/scan/find',
						params: item
					})

				}, 500)

			},
			/**
			 * 获取盘点列表
			 */
			getList() {
				this.list = []

				uni.request({
					url: url.BASE_URL+'/api/ESC/App_InventoryPageAssetsList_Eam',
					method: 'POST',
					data: {
						roleId: this.userInfo.RoleID,
						userId: this.userInfo.UserID,
						IbID: this.data.IbID,
					},
					success: (res) => {
						console.log(res.data.data)

						// 进行盘点数据计数
						if (res.data.code != 0) {
							this.list = res.data.data
							this.list.forEach(item => {
								// 总计计数（因为list存在盘多的数据，所以不能使用list.length）
								if ([0, 1,3].includes(item.actualState)) {
									this.totalCount += 1
								}
								// 维护已盘集合
								// if ([1, 2,0].includes(item.actualState)) {
								// 	// this.alreadySet.add(item.Assets_Epc)
								// }
								// 已盘点计数，包含已盘和变更
								if (item.actualState === 1 ) {
									this.alreadyCount += 1

								}
								// 盘多计数
								if (item.actualState === 2) {
									this.surplusCount += 1
								}
								//未盘
								if (item.actualState === 0||item.actualState === 3) {
									this.changeCount += 1
								}
							})

						
						}
					}
				});
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
		flex: 1;
		height: calc(100vh - var(--window-top));

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

						&.yellow {
							color: #e6b800;
						}

						&.red {
							color: #ee0a24;
						}
					}

					.label {
						font-size: 32rpx;
						font-weight: bold;

						&.yellow {
							color: #e6b800;
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

			&.actualState {
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
			height: calc(100% - 516rpx);

			&.read-only {
				height: calc(100% - 386rpx);
			}
		}

		.bottom-btn-block {
			height: 130rpx;
			padding: 20rpx 30rpx;
			background-color: #ffffff;
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
</style>

<style>
	page {
		background-color: #f2f3f5;
	}
</style>