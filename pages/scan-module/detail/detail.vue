<template>
	<view class="main-wrap">

		<view class="list-info-wrap list-box">
		<!-- 分页模块 -->
		<text ref="topDom" class="form-title">基本信息</text>
		<cell>
		<view class=" list-head-block">
			<view class="info-row">
				<text class="info-label ">器具编号</text>
				<text class="shop-name" >{{formData.assetsCode}}</text>
			</view>
		</view>
		<view class="list-head-block">
			<view class="info-row">
				<text class="info-label ">资产名称</text>
				<text class="shop-name" >{{formData.assetsName}}</text>
			</view>
		</view>
		<view class="list-head-block">
			<view class="info-row">
				<text class="info-label ">物资类别</text>
				<text class="shop-name" >{{formData.assetsType}}</text>
			</view>
		</view>
		<view class="list-head-block">
			<view class="info-row">
				<text class="info-label ">到期日期</text>
				<text class="shop-name" >{{formData.ssetsDueDate}}</text>
			</view>
		</view>
		<view class="list-head-block">
			<view class="info-row">
				<text class="info-label ">RFID标签</text>
				<text class="shop-name" >{{formData.assetsEpc}}</text>
			</view>
		</view>
		</cell>
		<cell style="padding-top: 30px;">
			<text ref="topDom" class="form-title">使用信息</text>
			<view class="list-head-block">
				<view class="info-row">
					<text class="info-label ">机台设备号</text>
					
					<text class="shop-name" v-if="formData.actualDeptCode">{{formData.actualDeptCode}}</text>
					<text class="shop-name" v-else>-</text>
				</view>
			</view> 
			
			<view class="list-head-block">
				<view class="info-row">
					<text class="info-label ">使用人工号</text>
					<text class="shop-name" v-if="formData.actualUser">{{formData.actualUser}}</text>
					<text class="shop-name" v-else>-</text>
				</view>
			</view> 
			<view class="list-head-block">
				<view class="info-row">
					<text class="info-label " >检 具 状 态</text>
					
					<text class="shop-name" v-if="formData.status==0">在库</text>
					<text class="shop-name" v-if="formData.status==2">使用中</text>
					<text class="shop-name" v-if="formData.status==1">在途</text>
					
				</view>
			</view> 
				 
				 
		</cell>
	</view>

	
	</view>
</template>

<script>
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
			ZFormDate
		},
		data() {
			return {
			
				
				canEdit: false,
				deptId: '',
				lendOutOptions: [
					{
						label: '否',
						value: '0'
					},
					{
						label: '是',
						value: '1'
					}
				],
				statusOptions: [
					{
						label: '结果',
						value: '0'
					},
					{
						label: '正常',
						value: '1'
					},
					{
						label: '外借',
						value: '2'
					},
					{
						label: '盘盈',
						value: '3'
					}
				],
				formData: {
					Gauge_Code: 'dddd', // 资产分类
					Assets_User: '', // 使用人
					Assets_Name: '', // 资产名称
					Assets_UseDate: '', // 领用日期
					Assets_Original: '', // 资产原值
					Assets_Residual: '', // 资产残值
					Actual_Local: '', // 存放位置
					Assets_OutFlag: '', // 是否外借
					Assets_UseDEP: '', // 使用部门
					Actual_Type: '', // 资产状态
				}
			};
		},
		onLoad(options) {
			this.formData = options

			this.deptId = options.Assets_UseDeptId
		},
		methods: {
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
				this.canEdit = false
				const eventChannel = this.getOpenerEventChannel();
				eventChannel.emit('setChange', this.formData);
				uni.navigateBack({
				    delta: 1
				});
			},
			/**
			 * 确认部门
			 * @param {Object} item
			 */
			confirmDept(item) {
				this.deptId = item.deptId
				this.formData.Assets_User = ''
			}
		}
	}
</script>

<style scoped lang="scss">
	.main-wrap {
		display: flex;
		flex-direction: column;
		background-color: #f2f2f2;
		flex: 1;
		/* #ifndef APP-PLUS */
		height: calc(100vh - var(--window-top));
		/* #endif */
	}

	.top-info-block {
		height: 140rpx;
		padding: 0 31rpx 0 24rpx;
		background-color: #ffffff;
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
		padding: 0 24rpx ;
		
		font-weight: bold;
		line-height: 90rpx;
		width: 190rpx;
		font-size: 30rpx;
		color: #969799;
	}
	.form-block {
		background-color: #ffffff;
	}

	.bottom-btn-block {
		padding: 20rpx 30rpx;
		background-color: #ffffff;
		border-top: 1px solid #e6e6e6;
	}
		label {
			font-size: 34rpx;
			font-weight: bold;
			color: #222222;
		}
		
		
		
		.main-wrap {
			flex: 1;
		}
		
		.search-block {
			height: 130rpx;
			background-color: #11479b;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			position: relative;
		}
		
		.page-info-block {
			padding: 0 36rpx;
			height: 74rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
		}
		
		.page-info-text {
			font-size: 28rpx;
			color: #222222;
		}
		
		.list-block {
			flex: 1;
		}
		
		.list-box {
		
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
			height: 100rpx;
			border-bottom: 1px solid #ffffff;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
		}
		
		.shop-name {
			
			font-weight: bold;
			font-size: 32rpx;
			color: #969799;
			
		}
		
		.info-label {
			// padding: 10px 0px;
			width: 190rpx;
			font-size: 34rpx;
			font-weight: bold;
			color: #222222;
		}
		
		
		.list-info-block {
			display: flex;
			flex-direction: row;
			align-items: center;
			padding: 24rpx 10rpx 0 0;
		}
		
		.list-info-wrap {
			padding-top: 20px ;
			flex: 1;
		}
		
		.right-icon {
			width: 16rpx;
			height: 28rpx;
		}
		
		.info-row {
			padding: 0 24rpx ;
			
			display: flex;
			flex-direction: row;
			align-items: center;
		}
		
	
		
		.info-value {
			font-size: 30rpx;
			color: #323233;
		}
		
		.bottom-btn-block {
			padding: 20rpx 30rpx;
			background-color: #ffffff;
			border-top: 1px solid #e6e6e6;
		}
</style>
