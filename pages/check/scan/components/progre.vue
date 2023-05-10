<template>
	<view class="progress-wrap" @click="handleClick">
		<view class="rotate-box" :style="{transform: `rotate(${1.8 * (( 5/ 6) * 100)}deg)`}">
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
		 position:fixed;
		    top:50px;
		    left: 100px;
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
		margin-bottom: 12rpx;
		color: #222222;
	}

	.num-box .label {
		font-size: 36rpx;
		font-weight: bold;
		color: #222222;
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
		background-color: #73e600;
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
		background-color: #e60000;
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
