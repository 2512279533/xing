<template>
	<view class="main-wrap">
		<u-status-bar />
		<image class="mine-bg" :style="{height: bgHeight}" src="/static/images/mine-bg.png" mode="aspectFill" />
		<view class="user-info-block">
			<u-avatar size="120" :text="userInfo.NickName[0]" font-size="60" randomBgColor />
			<view class="user-info-wrap">
				<text class="user-name">{{userInfo.NickName}}</text>
				<text class="user-phone">{{userInfo.DeptName}}</text>
			</view>
		</view>
		<view class="function-block">
			<template v-for="(item, index) in functionList">
				<view class="function-wrap" :key="index">
					<view class="function-title">
						<text class="function-title-text">常用功能</text>
					</view>
					<template v-for="(fuc, fucIndex) in item.list">
						<view class="function-box" :key="fucIndex" @click="tapFuc(fuc)">
							<view class="function-left">
								<image class="function-icon" :src="fuc.icon" mode="widthFix" />
								<text class="function-label">{{ fuc.label }}</text>
							</view>
							<image class="function-arrow-right" src="/static/images/arrow-right-grey.png"
								mode="widthFix" />
						</view>
					</template>
				</view>
			</template>
		</view>
		<view class="bottom-block">
			<u-button text="退出登录" @click="signOut" />
<!-- 			<view class="version-code">
				<text class="version-code-text">版本号 {{ currentVersion }}</text>
			</view> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {},
				bgHeight: uni.$u.addUnit(uni.$u.sys().statusBarHeight * 2 + 262, 'rpx'),
				currentVersion: '',
				userInfo: {
					avatar: ''
				},
				functionList: [{
					title: '常用功能',
					list: [{
						label: '个人信息',
						icon: '/static/images/mine-fuc-1.png',
						url: '/pages/user-info/user-info'
					},{
						label: '修改密码',
						icon: '/static/images/mine-fuc-2.png',
						url: '/pages/change-password/change-password'
					},{
						label: '修改密码',
						icon: '/static/images/mine-fuc-2.png',
						url: '/pages/change-password/change-password'
					},{
						label: '修改密码',
						icon: '/static/images/mine-fuc-2.png',
						url: '/pages/change-password/change-password'
					},{
						label: '修改密码',
						icon: '/static/images/mine-fuc-2.png',
						url: '/pages/change-password/change-password'
					}]
				}],
				phone: '', //手机号
				nickName: '', //姓名
			};
		},
		onLoad() {
			this.userInfo = uni.getStorageSync("userInfo")
			console.log(this.userInfo)
			// #ifdef APP-PLUS
			this.getVersionCode()
			// #endif
		},
		methods: {
			/**
			 * 点击功能
			 */
			tapFuc(fuc) {
				uni.$u.throttle(() => {
					uni.navigateTo({
						url: fuc.url
					})
				}, 500)
			},
			/**
			 * 获取版本号
			 */
			getVersionCode() {
				plus.runtime.getProperty(plus.runtime.appid, info => {
					this.currentVersion = info.version
				})
			},
			/**
			 * 登出
			 */
			signOut() {
				uni.showModal({
					title: '登出确认',
					content: '是否确认退出登录',
					confirmColor: '#11479b',
					success: res => {
						if (res.confirm) {
							uni.reLaunch({
								url: '/pages/login/login'
							})
						}
					}
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.main-wrap {
		position: relative;
	}

	.mine-bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 750rpx;
		z-index: 1;
	}

	.user-info-block {
		position: relative;
		z-index: 2;
		height: 262rpx;
		padding: 0 40rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.user-info-wrap {
		padding-left: 16rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.user-name {
		font-size: 46rpx;
		font-weight: bold;
		color: #ffffff;
		margin-bottom: 10rpx;
	}

	.user-phone {
		font-size: 32rpx;
		font-weight: 500;
		color: #ffffff;
	}

	.user-role {
		font-size: 28rpx;
		color: #ffffff;
		line-height: 28rpx;
	}

	.function-block {
		display: flex;
		flex-direction: column;
	}

	.function-title {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 0 32rpx;
		height: 96rpx;
	}

	.function-title-text {
		font-size: 36rpx;
		font-weight: bold;
		color: #222222;
	}

	.function-box {
		height: 100rpx;
		background-color: #ffffff;
		padding: 0 30rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		transition-property: background-color;
		transition-duration: 0.2s;
	}

	.function-box:active {
		background-color: #f8f8f8;
	}

	.function-left {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.function-icon {
		width: 33rpx;
	}

	.function-label {
		font-size: 32rpx;
		color: #222222;
		padding-left: 24rpx;
	}

	.function-arrow-right {
		width: 14rpx;
	}

	.bottom-block {
		width: 750rpx;
		position: fixed;
		bottom: 40rpx;
		padding: 0 55rpx;
	}

	.version-code {
		margin-top: 38rpx;
	}

	.version-code-text {
		font-size: 28rpx;
		font-weight: 500;
		color: #969799;
		text-align: center;
	}
</style>

<style>
	/* #ifndef APP-NVUE */
	page {
		background-color: #f2f3f5;
	}

	/* #endif */
</style>
