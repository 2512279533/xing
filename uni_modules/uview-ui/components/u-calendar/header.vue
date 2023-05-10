<template>
	<view class="u-calendar-header u-border-bottom">
		<text
			class="u-calendar-header__title"
			v-if="showTitle"
		>{{ title }}</text>
		<text
			class="u-calendar-header__subtitle"
			v-if="showSubtitle"
		>{{ subtitle }}</text>
		<view class="u-calendar-header__weekdays">
			<text class="u-calendar-header__weekdays__weekday">一</text>
			<text class="u-calendar-header__weekdays__weekday">二</text>
			<text class="u-calendar-header__weekdays__weekday">三</text>
			<text class="u-calendar-header__weekdays__weekday">四</text>
			<text class="u-calendar-header__weekdays__weekday">五</text>
			<text class="u-calendar-header__weekdays__weekday">六</text>
			<text class="u-calendar-header__weekdays__weekday">日</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'u-calendar-header',
		mixins: [uni.$u.mpMixin, uni.$u.mixin],
		props: {
			// 标题
			title: {
				type: String,
				default: ''
			},
			// 副标题
			subtitle: {
				type: String,
				default: ''
			},
			// 是否显示标题
			showTitle: {
				type: Boolean,
				default: true
			},
			// 是否显示副标题
			showSubtitle: {
				type: Boolean,
				default: true
			},
		},
		data() {
			return {

			}
		},
		methods: {
			name() {

			}
		},
	}
</script>

<style lang="scss" scoped>
	@import "../../libs/css/components.scss";

	.u-calendar-header {
		padding-bottom: 8rpx;

		&__title {
			font-size: 32rpx;
			color: $u-main-color;
			text-align: center;
			padding-top: 12rpx;
			height: 84rpx;
			line-height: 84rpx;
			font-weight: bold;
		}

		&__subtitle {
			font-size: 28rpx;
			color: $u-main-color;
			height: 80rpx;
			text-align: center;
			line-height: 80rpx;
			font-weight: bold;
		}

		&__weekdays {
			@include flex;
			justify-content: space-between;

			&__weekday {
				font-size: 26rpx;
				color: $u-main-color;
				line-height: 60rpx;
				flex: 1;
				text-align: center;
			}
		}
	}
</style>
