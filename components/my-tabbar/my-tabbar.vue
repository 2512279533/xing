<template>
	<view class="form-item-block">
		<view class="form-normal-wrap" :class="{'form-border-bottom': borderBottom}">
			<view class="form-label-box">
				<text class="form-label-text">{{ label }}</text>
				<text class="form-label-required" v-if="required">*</text>
			</view>
			<view class="form-select-box" :class="{'change-bg': needChangeColor && originalValue !== value}" @click="handleSelect">
				<text class="form-select-input"
					:class="{'placeholder-style': !value}">{{ value ? value : placeholder }}</text>
				<image v-if="!readonly" class="form-select-icon" src="/static/images/arrow-right-black.png"
					mode="widthFix" />
			</view>
		</view>
		<u-picker :show="show" :columns="options ? options : columns" :key-name="keyName" @confirm="confirm" @cancel="cancel" />
	</view>
</template>

<script>
	/**
	 * z-form-select form表单内选择组件
	 * @property {String}			label				选择器的标签文本
	 * @property {Boolean}			required			是否为必选，默认为false（只控制样式）
	 * @property {Boolean}			borderBottom		是否需要下划线，默认为false
	 * @property {String}			placeholder			占位符内容，（默认 请选择）
	 * @property {String}			type				选择器类型，booth 摊位选择 market 市场选择
	 */
	export default {
		props: {
			label: {
				type: String,
				default: ''
			},
			required: {
				type: Boolean,
				default: false
			},
			borderBottom: {
				type: Boolean,
				default: false
			},
			placeholder: {
				type: String,
				default: '请选择'
			},
			type: {
				type: String,
				default: ''
			},
			keyName: {
				type: String,
				default: ''
			},
			needAfter: {
				type: Boolean,
				default: false
			},
			afterValue: {
				type: [String, Number],
				default: ''
			},
			readonly: {
				type: Boolean,
				default: false
			},
			value: {
				type: [String, Number],
				default: ''
			},
			originalValue: {
				type: [String, Number],
				default: ''
			},
			needChangeColor: {
				type: Boolean,
				default: false
			},
			options: {
				type: Array,
				default: () => {
					return null
				}
			}
		},
		data() {
			return {
				show: false,
				columns: []
			}
		},
		watch: {
			afterValue(val) {
				if (val && this.needAfter && !this.options) this.getOptions(val)
			}
		},
		created() {
			// 不需要前置
			if (!this.needAfter && !this.options) {
				this.getOptions()
			}
		},
		methods: {
			/**
			 * 获取picker选项
			 */
			getOptions(val) {
				uni.$u.api.pickerOptions[this.type](val).then(res => {
					this.columns = [
						[...res.data]
					]
				})
			},
			/**
			 * 确认
			 */
			confirm(item) {
				const cur = item.value[0]
				this.$emit('input', cur[this.keyName])
				this.$emit('confirm', cur)
				this.show = false
			},
			/**
			 * 取消
			 */
			cancel() {
				this.show = false
			},
			/**
			 * 处理筛选
			 */
			handleSelect() {
				if (!this.readonly) {
					this.show = true
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.form-item-block {
		padding: 0 24rpx;
		background-color: #ffffff;
	}

	.form-item-block:active {
		opacity: 0.7;
	}

	.form-normal-wrap {
		height: 100rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding-right: 15rpx;
	}

	.form-label-box {
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 200rpx;
	}

	.form-label-text {
		font-size: 32rpx;
		color: #101010;
		font-weight: bold;
	}

	.form-label-required {
		font-size: 32rpx;
		font-weight: bold;
		color: #ff0000;
	}

	.form-select-box {
		height: 80rpx;
		flex: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 0 16rpx;
	}
	
	.change-bg {
		background-color: #ffdf7f;
		border-radius: 10rpx;
	}

	.form-select-input {
		flex: 1;
		font-size: 32rpx;
		color: #ff0808;
	}

	.placeholder-style {
		color: #c8c9cc;
	}

	.form-select-icon {
		width: 16rpx;
		height: 28rpx;
	}	

	.form-border-bottom {
		border-bottom: 1px solid #ededed;
	}
</style>
