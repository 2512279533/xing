<template>
	<view>
		
		<view class="function-list-wrap">
			<template v-for="(item, index) in functionList">
				<view class="function-box" @click="tapFun(item)">
					<image class="function-icon" :src="item.icon" />
					<text class="function-label">{{ item.label }}</text>
				</view>
			</template>
		</view>
	</view>
</template>

<script>
	import permission from '@/util/wa-permission/permission.js'
	export default {
		data() {
			return {
				userInfo: {},
				homeData: {
					busy: '10',
					free: '11',
					month: '0',
					total: '2'
				},
				functionList: [{
						label: '客户检具管理',
						icon: '/static/images/oem.png',
						url: '/pages/home/home'
					},
					{
						label: '刀具管理',
						icon: '/static/images/daoj.png',
						url: ''
					},
					{
						label: '固定资产管理',
						icon: '/static/images/homezc.png',
						url: ''
					},
					{
						label: 'OEM检具管理',
						icon: '/static/images/oem.png',
						url: ''
					}
				]
			};
		},
		onShow() {
			this.getData()

		},
		onLoad() {
		
			
			this.userInfo = uni.getStorageSync("userInfo")
			uni.setNavigationBarTitle({
				title: 'RFID APP'
			})
		},
		methods: {
			/**
			 * 点击功能
			 * @param {Object} item
			 */
			tapFun(item) {
				// uni.$u.route(item.url)
				   
				   //跳转tab
				  
		       if(item.url=='/pages/home/home'){
				  
				 uni.switchTab({
				 	url:"/pages/home/home"
				 })
			   }
			
				
				uni.navigateTo({
					url: item.url
				});
			},
			/**
			 * 获取数据
			 */
			getData() {
				uni.$u.api.user.homeData().then(res => {
					this.homeData = res.data
				}).catch(e => {
					console.log(e)
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.home-num-wrap {
		background-color: #ffffff;
		margin-bottom: 30rpx;
		padding: 40rpx 0;
	}

	.top-num {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-bottom: 20rpx;
	}

	.top-num .label {
		margin-bottom: 16rpx;
	}

	.top-num .label .label-text {
		font-size: 42rpx;
		font-weight: bold;
		color: #000000;
	}

	.top-num .value {
		margin-bottom: 12rpx;
	}

	.top-num .value .value-text {
		font-size: 42rpx;
		font-weight: bold;
		color: #11479b;
	}

	.other-num {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
	}

	.other-num-box {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.other-num-box .label {
		margin-bottom: 12rpx;
	}

	.other-num-box .label .label-text {
		font-size: 38rpx;
		font-weight: 500;
		color: #000000;
	}

	.other-num-box .value-text {
		font-size: 34rpx;
		color: #555555;
	}

	.other-num-box .value-text.green {
		color: #008000 !important;
	}

	.other-num-box .value-text.orange {
		color: #FFA500;
	}

	.function-list-wrap {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		padding: 120rpx 70rpx 0;
	}

	.function-box {
		width: 305rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-bottom: 70rpx;
	}

	.function-box:active {
		opacity: 0.7;
	}

	.function-icon {
		width: 220rpx;
		height: 220rpx;
		margin-bottom: 20rpx;
	}

	.function-label {
		font-size: 28rpx;
		color: #11479b;
		font-weight : bold;
		
	}
</style>

<style>
	/* #ifndef APP-NVUE */
	page {
		background-color: #f2f3f5;
	}

	/* #endif */
	
</style>
