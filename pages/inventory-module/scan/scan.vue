<template>
	<view class="main-wrap">
		<view class="scan-info-wrap">
			<!-- 顶部盘点基础信息 -->
			<view class="scan-top-info">
				<text class="top-info-text">盘点人员：{{inventoryMan}}</text>
				<text class="top-info-text">盘点时间：{{now}}</text>
			</view>
			<!-- 主要数据统计展示信息 -->
			<view class="main-info-wrap">
				<view class="info-box" @click="handleShowListMore">
					<text class="value blue">{{surplusCount}}</text>
					<text class="label blue">盘多</text>
				</view>
				<!-- 半圆进度条 -->
				<x-progress :count="alreadyCount" :total="totalCount" @click="handleShowNormal" />
				<view class="info-box">
					<text class="value red">{{changeCount}}</text>
					<text class="label red">变更</text>
				</view>
			</view>
		</view>
		<u-gap />
		<!-- 表格头 -->
		<view class="table-header" v-if="list && list.length > 0">
			<view class="table-box" @click="handleSort('code')">
				<text class="table-text">资产编号</text>
				<template v-if="currentSort.includes('code')">
					<image v-if="currentSort.includes('asc')" src="/static/images/sort-asc.png" mode="widthFix" />
					<image v-if="currentSort.includes('desc')" src="/static/images/sort-desc.png" mode="widthFix" />
				</template>
			</view>
			<view class="table-box middle">
				<text class="table-text">资产名称</text>
			</view>
			<view class="table-box" @click="handleSort('status')">
				<text class="table-text">盘点状态</text>
				<template v-if="currentSort.includes('status')">
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
				<view class="table-row" :key="index" @click="viewDetail(item, index)" v-if="showListMore ? item.Inventory_Status === 2 : item.Inventory_Status !== 2">
					<view class="table-box">{{item.Assets_Code}}</view>
					<view class="table-box middle">{{item.Assets_Name}}</view>
					<view 
						class="table-box status" 
						:class="{'green': item.Inventory_Status === 1, 'red': item.Inventory_Status === 3}">
							{{statusEnum[item.Inventory_Status]}}
							<view v-if="item.Inventory_Status === 2 && !readOnly" class="del-btn" @click.stop="delListMore(index)">
								<u-icon name="close-circle-fill" color="#ee0a24" size="38" />
							</view>
					</view>
				</view>
			</template>
		</scroll-view>
		<!-- 底部按钮模块 -->
		<view class="bottom-btn-block" v-if="!readOnly">
			<view class="btn-row-wrap">
				<view class="btn">
					<u-button v-if="!isSave" type="warning" text="重置" @click="reset" />
					<u-button v-else text="继续盘点" @click="handleContinue" />
				</view>
				<u-icon v-if="isSave" name="warning-fill" :color="alreadyCount < totalCount ? '#f56c6c' : '#7e7e7e'" size="80" @click="showTips" />
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
					<u-button v-if="!isSave" text="保存" @click="handleSave" />
					<u-button v-else type="success" text="提交审批" @click="handleApproval" />
				</view>
			</view>
			<u-safe-bottom />
		</view>
		<!-- 警告提示模块 -->
		<u-overlay :show="isShowTips" @click="isShowTips = false">
			<view class="tips-block">
				<view class="tips-title">未盘剩余 {{ totalCount - alreadyCount }} 请检查!</view>
				<view class="tips-sub-title">可能由以下原因导致：</view>
				<view class="tips-text">1.资产标签掉落</view>
				<view class="tips-text">2.资产标签被金属遮挡</view>
				<view class="tips-text">3.资产标签状态错误</view>
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
	import dayjs from '@/uni_modules/uview-ui/libs/util/dayjs.js';
	import XProgress from './components/progress.vue'
	export default {
		components: {
			XProgress
		},
		data() {
			return {
				readOnly: false,
				inventoryMan: '', // 盘点人员
				now: dayjs().format("YYYY-MM-DD hh:MM:ss"), // 当前时间
				showListMore: false, // 是否显示盘多
				ibId: null, // 盘点id
				list: [], // 盘点列表
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
				statusEnum: {
					0: '未盘',
					1: '已盘',
					2: '盘多',
					3: '变更',
					4: '未知'
				}
			}
		},
		onLoad(options) {
			const { IbID, BillNo, inventoryMan, status } = options
			this.readOnly = status === '2'
			this.ibId = IbID
			this.inventoryMan = inventoryMan
			// 设置顶部标题
			uni.setNavigationBarTitle({
				title: BillNo
			})
			// 获取盘点任务列表
			this.getList(IbID)
			// #ifdef APP-PLUS
			// 初始化rfid
			if (!this.readOnly) {
				this.initScan()
			}
			// #endif
		},
		methods: {
			/**
			 * 处理排序
			 * @param {Object} key
			 */
			handleSort(key) {
				let sort = 'asc'
				// 相同key，进行正序倒序颠倒
				if (this.currentSort.includes(key)) {
					sort = this.currentSort.includes('asc') ? 'desc' : 'asc'
				}
				this.currentSort = key + '-' + sort
				if (key === 'code') {
					this.list.sort((a, b) => {
						if (sort === 'asc') {
							return a.Assets_Code.replace(/[^0-9]/ig, '') - b.Assets_Code.replace(/[^0-9]/ig, '')
						} else {
							return b.Assets_Code.replace(/[^0-9]/ig, '') - a.Assets_Code.replace(/[^0-9]/ig, '')
						}
					})
				}
				if (key === 'status') {
					this.list.sort((a, b) => {
						if (sort === 'asc') {
							return a.Inventory_Status - b.Inventory_Status
						} else {
							return b.Inventory_Status - a.Inventory_Status
						}
					})
				}
			},
			/**
			 * 初始化扫描
			 */
			initScan() {
				// 获取功率设置
				const power = uni.getStorageSync('资产变更')
				// 设置保存的功率，默认30
				this.$emit('setPower', power ? Number(power) : 30)
				
				uni.$on('rfid', epc => {
					console.log('获取到rfid', epc)
					this.findEpc(epc, 'epc')
				})
				uni.$on('onScan', assetsCode => {
					console.log('获取到scan', assetsCode)
					this.findEpc(assetsCode, 'assetsCode')
				})
				uni.$on('onTriggerLong', () => {
					console.log('扳机长按开始')
					// 如果不在保存状态并且未打开rfid页面按钮
					if (!this.isSave && !this.rfidOpen) {
						this.rfidOpen = true;
						uni.$emit('repeatScan')
					}
				})
				uni.$on('endTriggerLong', () => {
					console.log('扳机长按结束')
					this.rfidOpen = false;
					uni.$emit('stopScan')
				})
				uni.$on('onTriggerOnce', () => {
					console.log('扳机单次按下')
					if (!this.isSave) {
						if (this.rfidOpen) {
							this.rfidOpen = false
							uni.$emit('stopScan')
						} else {
							uni.$emit('sigleScan')
						}
					}
				})
			},
			/**
			 * 查找EPC
			 */
			findEpc(str, type) {
				// 如果这个epc没有扫到过
				if (!this.alreadySet.has(str)) {
					// 在已扫描数据内添加该epc
					this.alreadySet.add(str)
					// 查看匹配epc的，并且状态为未盘的
					const findKey = type === 'epc' ? 'Assets_Epc' : 'Assets_Code'
					const index =  this.list.findIndex(item => item[findKey] === str && item.Inventory_Status === 0)
					// 如果找到了，则更改状态为已盘点，并且已盘数量+1
					if (index !== -1) {
						this.alreadySet.add(type === 'epc' ? this.list[index].Assets_Code : this.list[index].Assets_Epc)
						this.list[index].Inventory_Status = 1
						this.alreadyCount += 1
					} else if (!this.ignoreSet.has(str)) {
						// 如果没找到，并且不再屏蔽列表，则去和服务器确认是否为盘多
						this.confirmSurplus(str, type)
					}
				} else {
					if (type === 'assetsCode') {
						uni.showToast({
							title: `已扫描过该${str}条码`,
							icon: 'none'
						})
					}
				}
			},
			/**
			 * 确认是否为盘多
			 */
			confirmSurplus(str, type) {
				uni.$u.api.inventory.confirmSurplus({[type]: str}).then(res => {
					// 如果有数据，则为盘多
					if (res.data && res.data.length > 0) {
						let item = res.data[0]
						item.Inventory_Status = 2
						this.surplusCount += 1
						this.list.push(item)
					}
				}).catch(err => {
					console.log(err, '确认盘多失败')
				})
			},
			/**
			 * 处理审批
			 */
			handleApproval() {
				this.showApprovalPopup = true
			},
			/**
			 * 显示提示
			 */
			showTips() {
				if (this.alreadyCount < this.totalCount) {
					this.isShowTips = !this.isShowTips
				}
			},
			/**
			 * 保存
			 */
			handleSave() {
				// 关闭rfid扫描
				this.handleRfid(false);
				uni.showLoading({
					title: '保存中'
				})
				uni.$u.api.inventory.save({
					ibId: this.ibId,
					assetsList: this.list
				}).then(res => {
					uni.showToast({
						title: '保存成功'
					})
					this.approvalFlowList = res.auditFlow
					this.isSave = true
				}).catch(err => {
					console.log(err, '保存失败')
					uni.hideLoading()
				})
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
							this.list = uni.$u.deepClone(this.resetList)
						}
					}
				})
			},
			/**
			 * 继续盘点
			 */
			handleContinue() {
				this.isSave = false
			},
			/**
			 * 查看详情
			 */
			viewDetail(item, index) {
				// 如果为已盘、盘多、变更，则跳转详情界面
				if ([1,2,3].includes(item.Inventory_Status) && !this.readOnly) {
					// 关闭rfid
					this.handleRfid(false)
					uni.navigateTo({
						url: '/pages/inventory-module/detail/detail?item=' + JSON.stringify(item),
						events: {
							setChange: item => {
								this.list[index] = {
									...item,
									Inventory_Status: 3
								}
								this.calcChangeCount()
								this.$forceUpdate()
							}
						},
					});
				}
			},
			/**
			 * 获取盘点列表
			 */
			getList(IbID) {
				uni.$u.api.inventory.taskDetail({ibId: IbID}).then(res => {
					this.resetList = uni.$u.deepClone(res.data || [])
					this.list = res.data || []
					// 进行盘点数据计数
					this.list.forEach(item => {
						// 总计计数（因为list存在盘多的数据，所以不能使用list.length）
						if ([0, 1, 3].includes(item.Inventory_Status)) {
							this.totalCount += 1
						}
						// 维护已盘集合
						if ([1, 2, 3].includes(item.Inventory_Status)) {
							this.alreadySet.add(item.Assets_Epc)
						}
						// 已盘点计数，包含已盘和变更
						if (item.Inventory_Status === 1 || item.Inventory_Status === 3) {
							this.alreadyCount += 1
							// 变更计数
							if (item.Inventory_Status === 3) {
								this.changeCount += (item.Transform_Count || 1)
							}
						}
						// 盘多计数
						if (item.Inventory_Status === 2) {
							this.surplusCount += 1
						}
					})
				}).catch(err => {
					this.list = []
				})
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
				uni.$u.api.inventory.submit({ibId: this.ibId}).then(res => {
					uni.showToast({
						title: '提交成功',
						success() {
							uni.navigateBack({
								delta: 1
							})
						}
					})
				}).catch(err => {
				})
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

				.top-info-text {
					font-size: 26rpx;
					color: #969799;
				}
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
