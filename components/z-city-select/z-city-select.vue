<template>
	<u-popup
		:show="show"
		@close="closeHandler"
	>
		<view class="u-picker">
			<u-toolbar @cancel="cancel" @confirm="confirm" />
			<u-line margin="0 24rpx" />
			<picker-view
				class="u-picker__view"
				indicatorStyle="height: 96rpx"
				:value="multiIndex"
				@change="changeHandler"
			>
				<picker-view-column
					v-for="(item, index) in multiArray"
					:key="index"
					class="u-picker__view__column"
				>
					<text
						class="u-picker__view__column__item u-line-1"
						v-for="(item1, index1) in item"
						:key="index1"
						
					>{{ item1.label }}</text>
				</picker-view-column>
			</picker-view>
			<view
				v-if="loading"
				class="u-picker--loading"
			>
				<u-loading-icon mode="circle"></u-loading-icon>
			</view>
		</view>
	</u-popup>
</template>

<script>
/**
 * u-picker
 * @description 选择器
 * @property {Boolean}			show				是否显示picker弹窗（默认 false ）
 * @property {Boolean}			showToolbar			是否显示顶部的操作栏（默认 true ）
 * @property {String}			title				顶部标题
 * @property {Array}			columns				对象数组，设置每一列的数据
 * @property {String}			keyName				选项对象中，需要展示的属性键名（默认 'text' ）
 * @property {Array}			defaultIndex		各列的默认索引
 * @property {Boolean}			immediateChange		是否在手指松开时立即触发change事件（默认 false ）
 * @event {Function} close		关闭选择器时触发
 * @event {Function} cancel		点击取消按钮触发
 * @event {Function} change		当选择值变化时触发
 * @event {Function} confirm	点击确定按钮，返回当前选择的值
 */
import region from "./city-data.js";

export default {
	name: 'u-picker',
	props: {
	    // 是否展示picker弹窗
	    show: {
	        type: Boolean,
	        default: false
	    },
		// 1 省 2 省市 3 省市区
		column: {
			type: Number,
			default: 3
		},
	    // 各列的默认索引
	    defaultIndex: {
	        type: Array,
	        default: () => {
				return []
			}
	    }
	},
	data() {
		return {
			loading: false,
			lastIndex: [],
			multiArray: [],
			multiIndex: [0, 0],
			region: null
		}
	},
	watch: {
		defaultIndex(nVal, oVal) {
			if (this.region) {
				this.init()
			}
		}
	},
	created() {
		this.getCityList()
	},
	methods: {
		/**
		 * 获取城市列表
		 */
		async getCityList() {
			this.loading = true;
            const { data } = await uni.$u.api.supervise.querycitypage()
            this.region = this.setDefaultFirstOption(data)
            this.init()
            this.loading = false;
		},
		/**
		 * 初始化
		 */
		init() {
			if (!this.defaultIndex.length) {
				const column1 = this.objToArr(this.region);
				const column2 = this.objToArr(column1[0].children);
				// const column3 = this.objToArr(column2[0].children) ?? null;
				this.multiArray = [column1, column2];
				return;
			}
			const index0 = this.defaultIndex[0];
			const index1 = this.defaultIndex[1];
			const index2 = this.defaultIndex[2];
					
			const tempMultiArray = [];
			const column0 = this.objToArr(this.region);
					
			const column1 = this.objToArr(column0[index0].children);
					
			tempMultiArray.push(column0);
			this.multiIndex[0] = index0;
					
			tempMultiArray.push(column1);
			this.multiIndex[1] = index1;
			
			if (index2 !== undefined) {
				const column2 = this.objToArr(tempMultiArray[1][index1].children);
						
				tempMultiArray.push(column2);
				this.multiIndex[2] = index2;
			}
			
			this.multiArray = tempMultiArray;
		},
		/**
		 * 更改
		 * @param {Object} e
		 */
		changeHandler(e) {
			const { value } = e.detail
			let index = 0,
				columnIndex = 0
			// 通过对比前后两次的列索引，得出当前变化的是哪一列
			for (let i = 0; i < value.length; i++) {
				let item = value[i]
				if (item !== (this.lastIndex[i] || 0)) { // 把undefined转为合法假值0
					// 设置columnIndex为当前变化列的索引
					columnIndex = i
					// index则为变化列中的变化项的索引
					index = item
					break // 终止循环，即使少一次循环，也是性能的提升
				}
			}
			// 将当前的各项变化索引，设置为"上一次"的索引变化值
			this.setLastIndex(value)
			let data = {
				multiArray: this.multiArray,
				multiIndex: this.multiIndex,
			};
			data.multiIndex[columnIndex] = index;
		
			if (columnIndex === 0) {
				//移动第一列
				const row = data.multiIndex[0] ?? 0; //移动第一列的某一行
				if (data.multiArray[0][row].children) {
					data.multiArray[1] = this.objToArr(data.multiArray[0][row].children);
					data.multiIndex[1] = 0;
				} else {
					data.multiArray.splice(1, 2)
					data.multiIndex.splice(1, 2)
				}
				if (data.multiArray[1] && data.multiArray[1][0].children) {
					data.multiArray[2] = this.objToArr(data.multiArray[1][0].children);
					data.multiIndex[2] = 0;
				} else {
					data.multiArray.splice(2, 1)
					data.multiIndex.splice(2, 1)
				}
			} else if (columnIndex === 1) {
				//移动第二列
				const row = data.multiIndex[1] ?? 0; //移动第一列的某一行
				if (data.multiArray[1][row].children) {
					data.multiArray[2] = this.objToArr(data.multiArray[1][row].children);
					data.multiIndex[2] = 0;
				} else {
					data.multiArray.splice(2, 1)
					data.multiIndex.splice(2, 1)
				}
			}
		
			this.multiArray = [...data.multiArray];
			this.multiIndex = [...data.multiIndex];
		},
		/**
		 * 确认
		 */
		confirm() {
			const arr = [];
			for (let i = 0; i < this.multiArray.length; i++) {
				arr.push(
					this.multiArray[i][this.multiIndex[i]]
				);
			}
            const data = {
				values: arr,
				indexs: this.multiIndex
			}
			this.$emit('confirm', data)
		},
		/**
		 * 关闭选择器
		 */
		closeHandler() {
			this.$emit('close')
		},
		/**
		 * 点击工具栏的取消按钮
		 */
		cancel() {
			this.$emit('cancel')
		},
		/**
		 * 记录上一次的各列索引位置
		 * @param {Object} index
		 */
		setLastIndex(index) {
			// 当能进入此方法，意味着当前设置的各列默认索引，即为“上一次”的选中值，需要记录，是因为changeHandler中
			// 需要拿前后的变化值进行对比，得出当前发生改变的是哪一列
			this.lastIndex = uni.$u.deepClone(index)
		},
		/**
		 * 对象转数组
		 * @param {Object} obj
		 */
		objToArr(obj) {
			const arr = Object.values(obj);
			let defaultIndex;
			let list = arr.map((item, index) => {
			  if (item.value.includes('all')) {
			    defaultIndex = index;
				return {
				  value: item.value,
				  label: item.label
				}
			  }
			  return {
			    value: item.value,
			    label: item.label,
			    children: item.children,
			  };
			});
			if (defaultIndex !== undefined) {
			  const temp = list[defaultIndex];
			  list.splice(defaultIndex, 1);
			  list.unshift(temp);
			}
			return list;
		},
		setDefaultFirstOption(region) {
		  for (const provinceK in region) {
		    if (region.hasOwnProperty(provinceK)) {
		      const province = region[provinceK];
		      if (province.children) {
		        province.children["all"] = {
		          value: "allCity",
		          label: '全部'
		        };
		      }
		
		      for (const cityK in province.children) {
		        if (province.children.hasOwnProperty(cityK)) {
		          const city = province.children[cityK];
		          if (city.children) {
		            city.children["all"] = {
		              value: "allArea",
		              label: '全部'
		            };
		          }
		        }
		      }
		    }
		  }
		  return region;
		}
	},
}
</script>

<style lang="scss" scoped>
	// 通过scss的mixin功能，把原来需要写4行的css，变成一行
	// 目的是保持代码干净整洁，不至于在nvue下，到处都要写display:flex的条件编译
	@mixin flex($direction: row) {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: $direction;
	}

	.u-picker {
		position: relative;

		&__view {
			height: 480rpx;

			&__column {
				@include flex;
				flex: 1;
				justify-content: center;

				&__item {
					height: 96rpx;
					line-height: 96rpx;
					@include flex;
					justify-content: center;
					align-items: center;
					font-size: 16px;
					text-align: center;
					/* #ifndef APP-NVUE */
					display: block;
					/* #endif */
					color: $u-main-color;

					&--disabled {
						/* #ifndef APP-NVUE */
						cursor: not-allowed;
						/* #endif */
						opacity: 0.35;
					}
				}
			}
		}

		&--loading {
			position: absolute;
			top: 0;
			right: 0;
			left: 0;
			bottom: 0;
			@include flex;
			justify-content: center;
			align-items: center;
			background-color: rgba(255, 255, 255, 0.87);
			z-index: 1000;
		}
	}
</style>
