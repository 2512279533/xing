<template>
	<view class="form-item-block">
		<view 
			class="form-normal-wrap" 
			:class="{
				'form-border-bottom': borderBottom,
				'form-image-wrap': type === 'image'
			}"
		>
			<text class="form-label-text">{{ label }}</text>
			<template v-if="type === 'text'">
				<text class="form-readonly-text" :class="'content-color-'+contentType">{{ content }}</text>
			</template>
			<template v-if="type === 'image'">
				<view class="form-image-box">
					<view class="form-image">
						<template v-if="typeof images === 'string'">
							<image
								v-if="images && !images.includes(',')"
								class="image"
								:src="getImg(images)" 
								@tap="onPreviewImage(images,[images])"
							/>
							<image
								v-else
                                v-for="it in images.split(',')"
								:key="it"
								class="image"
								:src="getImg(it)" 
								@tap="onPreviewImage(it,images)"
							/>
						</template>
						<template v-else>
							<template v-for="(img, index) in images">
								<image
									v-if="img"
									:key="index"
									class="image"
									:src="getImg(img)" 
									@tap="onPreviewImage(img,images)"
								/>
							</template>
						</template>
					</view>
				</view>	
			</template>
		</view>
	</view>
</template>

<script>
	/**
	 * z-form-select form表单内选择组件
	 * @property {String}			label				选择器的标签文本
	 * @property {Boolean}			required			是否为必选，默认为false（只控制样式）
	 * @property {Boolean}			borderBottom		是否需要下划线，默认为false
	 * @property {String}			content				展示内容
	 * @property {String}			contentType			展示内容类型
	 * @property {String}			type				展示类型
	 */
	export default {
		props: {
			label: {
				type: String,
				default: ''
			},
			borderBottom: {
				type: Boolean,
				default: false
			},
			content: {
				type: String,
				default: ''
			},
			contentType: {
				type: String,
				default: ''
			},
			images: {
				type: [Array, String],
				default: () => {
					return []
				}
			},
			type: {
				type: String,
				default: 'text'
			}
		},
        computed: {
            show() {
                return this.type === 'text'&& this.content
            }
        },
		methods: {
			/**
			 * 获取图片
			 * @param {Object} url
			 */
			getImg(url) {
				return uni.$u.addImgPrefix(url)
			},
			/**
			 * 预览图片
			 * @param {Object} img
			 */
			onPreviewImage(img, list = []) {
				uni.previewImage({
					urls: uni.$u.addImgPrefix(list),
					current: img,
					fail() {
						uni.$u.toast('预览图片失败')
					},
				});
			},
		}
	}
</script>

<style scoped lang="scss">
	.form-item-block {
		flex: 1;
		padding: 0 24rpx;
		background-color: #ffffff;
	}
	.form-normal-wrap {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		flex: 1;
	}
	.form-image-wrap {
		padding-bottom: 20rpx;
	}
	.form-image-wrap>.form-label-text {
		width: 206rpx;
	}
	.form-label-text {
		font-size: 32rpx;
		color: #000000;
		line-height: 90rpx;
		width: 216rpx;
		font-weight: bold;
	}
	.form-readonly-text {
		flex: 1;
		padding: 27rpx 0;
		font-size: 32rpx;
		line-height: 36rpx;
		color: #323233;
	}

	.content-color-success {
		color: #00a34f;
	}
	.content-color-error {
		color: #ee0a24;
	}
	.content-color-never {
		color: #faab0c;
	}
	.content-color-overdue {
		color: #323233;
	}
	.form-image-box {
		display: flex;
		flex: 1;
		padding-top: 30rpx;
	}
	.form-image {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		flex: 1;
		align-items: stretch;
	}
	.image {
		width: 154rpx;
		height: 154rpx;
		margin: 0 0 10rpx 10rpx;
	}
	.form-border-bottom {
		border-bottom: 1px solid #ededed;
	}
</style>