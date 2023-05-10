<template>
	<view class="progress-wrap" @click="handleClick">
		<view class="rotate-box" :style="{transform: `rotate(${1.8 * ((count / total) * 100)}deg)`}">
			<view class="top-round-block">
				<view class="top-round">
					<view class="round-bg"></view>
				</view>
			</view>
			<view class="bottom-round-block">
				<view class="bottom-round">
					<view class="round-bg"></view>
				</view>
			</view>
		</view>
		
		<view class="num-wrap">
			<view class="num-box">
				<text class="value green">{{count}}</text>
				<text class="value">/{{total}}</text>
			</view>
			<view class="num-box">
				<text class="label green">已盘</text>
				<text class="label">/应盘</text>
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		props: {
			count: {
				type: Number,
				default: 0
			},
			total: {
				type: Number,
				default: 0
			}
		},
		methods: {
			/**
			 * 控制点击
			 */
			handleClick() {
				this.$emit('click')
			}
		}
	}
</script>

<style scoped lang="scss">
	.progress-wrap {
		width: 300rpx;
		height: 150rpx;
		overflow: hidden;
		position: relative;
	}

	.num-wrap {
		position: absolute;
		top: 65rpx;
		left: 0;
		width: 300rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.num-box {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.num-box .value {
		font-size: 32rpx;
		// margin-bottom: 12rpx;
		color: #222222;
	}

	.num-box .label {
		font-size: 36rpx;
		font-weight: bold;
		color: #222222;
	}

	.num-box .value.green {
		color: #339f44;
	}

	.num-box .label.green {
		color: #339f44;
	}

	.rotate-box {
		transform-origin: 50%;
		transition: transform 0.1s;
	}

	.top-round-block {
		width: 300rpx;
		height: 150rpx;
		overflow: hidden;
	}

	.top-round {
		width: 300rpx;
		height: 300rpx;
		background-color: #a2a2a2;
		border-radius: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.top-round .round-bg {
		width: 260rpx;
		height: 260rpx;
		border-radius: 100%;
		background-color: #ffffff;
	}

	.bottom-round-block {
		width: 300rpx;
		height: 150rpx;
		overflow: hidden;
		transform: rotate(180deg);
	}

	.bottom-round {
		width: 300rpx;
		height: 300rpx;
		background-color: #339f44;
		border-radius: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.bottom-round .round-bg {
		width: 260rpx;
		height: 260rpx;
		border-radius: 100%;
		background-color: #ffffff;
	}
</style>
