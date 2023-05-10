<template>
	<view class="main-wrap">
		
		<!-- 小计信息展示 -->
		<view class="scan-top-info"  >
			<text v-if="list.length>0" class="page-info-text" >选中：{{sum}}</text>
			<text v-else class="page-info-text" >小计: 0</text>
			<image src="../../static/images/flush.png" class="flush" @click="flush" v-if="list.length>0"></image>
			
			<view  v-if="list.length>0">
				<checkbox-group class="qx" @change="changeBook">全选 &emsp13;{{temp}}
					<checkbox :checked="allchecked" />
			</checkbox-group>
			</view>
			
			
						
		</view>
		<!-- 分页模块 -->
		<z-list ref="list" @refresh="refresh" class="list-block" :list="list"  :init="false"  is-scan>
			<!-- 分页列表模块 -->
			<template v-if="list && list.length > 0">
			<checkbox-group @change="checkboxChange">
				<view v-for="(item, index) in list" :key="index">
					<!-- v-if="(filterName ? item.Assets_Name.includes(filterName)  : true) && (filterStatus ? item.Actual_Type === filterStatus : true)" -->
					
					<view :class="['list-box',{'list-box2' :item.status!=2}]"
						>
						<view class="list-head-block">
							<text class="shop-name">检具编号： &emsp13;{{item.assetsCode}}</text>
						
								<checkbox  v-if="item.status==2" style="transform: scale(0.9)" :value="item.ID" :checked="item.checked" />
								
						</view>
					
						<view class="list-info-block" @click="viewDetail(item.assetsEpc)">
							<view class="list-info-wrap">
								<view class="info-row">
									<text class="info-label">检具名称</text>
									<text class="info-value">{{item.assetsName}}</text>
								</view>
								<view class="info-row">
									<text class="info-label">检具状态</text>
									<text class="info-value" v-if="item.status==0">在库</text>
									<text class="info-value" v-if="item.status==1">在途</text>
									<text class="info-value" v-if="item.status==2">使用中</text>
								</view>
							</view>
							<image class="right-icon" src="/static/images/arrow-right-black.png" mode="widthFix" />
						</view>
					  </view>
				</view>
				</checkbox-group>
			</template>
		</z-list>
		<view class="bottom-block">
					<u-button text="下一步 >" :disabled="disabled" @click="next" />
				</view>
	</view>
	
</template>

<script>
	import url from "../../common/config.js"
const test_module = uni.requireNativePlugin("sz360c_honewell")
	export default {
		components: {
			url
		},
		data() {
			return {
				temp:'',
				sum:0,
				ids:[],
				backList:[],
				alreadySet: new Set(), // 已扫描集合
				list: [				
						// {
						// 				 ID: 457,
						// assetsCode: "850768-G0440",
						// assetsName: "针规",
						// assetsType: "检具",
						// assetsUseDate: null,
						// assetsUseMonth: null,
						// assetsUseDeptId: 0,
						// assetsUseDEP: null,
						// assetsUserId: 0,
						// assetsUser: null,
						// assetsLocal: null,
						// assetsOutFlag: null,
						// assetsCheckDeptID: 0,
						// assetsCheckDEP: null,
						// actualCheckUserID: 0,
						// actualCheckUser: null,
						// actualCheckDate: null,
						// actualCheckFlag: 0,
						// actualType: null,
						// actualDep: "加工中心",
						// actualUserId: 22,
						// actualUser: "0002",
						// actualLocal: null,
						// actualState: 0,
						// assetsFlag: 0,
						// assetsEpc: 'F000000007301301',
						// assetsImg: "",
						// assetsCategory: null,
						// assetsTagType: null,
						// bindCardStatus: 0,
						// transformCount: 0,
						// status: 2,
						// assetsDueDate: "2023-03-30",
						// actualDeptId: 117
						// 			    }		
				]
				,
				isScan:false,
				disabled:true,
				ids: 0,
				showFilter: false,
				keyword: '',
				filterName: 's',
				filterStatus: '',
				allchecked: false,
				
			};
		},
		
		onNavigationBarButtonTap() {
			console.log('fanhuishangyiye')
			uni.reLaunch({
			    url: "/pages/home/home"
			   })
		},
		onShow() {
			this.initScan()
			
			this.list.forEach(item =>{
			       this.$set(item, "checked", false);
			      })
			      this.disabled=true
			      this.allchecked=false
				  this.sum=0
			getApp().globalData.strCode=2
			this.isHaveNetwork()
			
			// uni.setStorageSync("repe",'')
			
			// this.flush()
			
			console.log("epcccc=="+uni.getStorageSync("editEpc"))
			let epc=uni.getStorageSync("editEpc")
						if(epc.length!=0){
							let epc=uni.getStorageSync("editEpc")
							console.log("epc==="+epc)
							let index=0
							//删除原先
							this.list.forEach(item =>{
								
								if(item.assetsEpc==epc){
									this.list.splice(index,1)
								}
								index++;
							})
							console.log(this.list)
							//添加新数据
						uni.request({
							url:url.BASE_URL+"/api/ESC/App_AssetsQuery_Eam",
							data:{
								"epc": uni.getStorageSync("editEpc")
							},
							method:"POST"
						}).then(res =>{
							
							this.list.push(res[1].data.data)
							
						})
						}
						uni.setStorageSync("editEpc",'')
						
						
						
						console.log("noback2===="+uni.getStorageSync("noBackList2"))
						if(uni.getStorageSync("noBackList2").length>0){
							
							if(uni.getStorageSync("noBackList2")=='empty'){
								this.list=[]
							}else{
							this.list=uni.getStorageSync("noBackList2")
						       }
						}
						
						uni.setStorageSync("noBackList2",'')

		}
		,
		onPullDownRefresh() {
			this.alreadySet.clear()
			this.list=[]
			uni.stopPullDownRefresh()
			uni.$u.toast('刷新成功');
		}
		,
		onLoad() {
			this.alreadySet.clear()
			// this.flush()
getApp().globalData.test_module.InitRFID()
			console.log("aaa=="+this.alreadySet.toString())
			// if(epc!=null){
			// 	this.list.forEach(item =>{
			// 		if(item.assetsEpc==epc.epc){
			// 			item.status=epc.status
			// 		}
			// 	})
			// }
			
			
			// 初始化扫描
			// getApp().globalData.test_module.InitRFID()
			
			
		  	
			
			
			this.bacList=uni.getStorageSync("BackList")
			
			
			uni.setNavigationBarTitle({
				title: '归还'
			})

					uni.setNavigationBarColor({
					    frontColor: '#ffffff',
					    backgroundColor: '#11479b',
					    animation: {
					        duration: 400,
					        timingFunc: 'easeIn'
					    }
					})
			
		},
		
		
		
	
		methods: {
			isHaveNetwork() {
				uni.getNetworkType({
					success: (res) => {
						if (res.networkType == 'none') {
							uni.showToast({
								title: '网络异常',
								icon: "error"
							});
							this.net = "none"
						} else {
							this.net = "b"
							console.log("有网") //有网
						}
					}
				});
			},
			
			initScan() {
				// 获取功率设置
				
				// 设置保存的功率，默认30
			
				
				uni.$on('rfid', epc => {
					
					console.log('获取到rfid', epc)
					this.findEpc(epc.epcHexStr, 'epc')
				})
				
				uni.$on('onTriggerLong', () => {
					console.log('扳机长按开始')
					
					
				})
				uni.$on('endTriggerLong', () => {
					console.log('扳机长按结束')
					
				})
				
			},
			/**
			 * 初始化扫描
			 */
			
			flush(){
				getApp().globalData.dataInfo=[]
				getApp().globalData.list=[]
				this.list=[]
				this.disabled=true
				this.alreadySet.clear()
				uni.showModal({
					title: '提示',
					content: '刷新成功',
				});
			},
			refresh(){
				this.list=[]
				this.disabled=true
			}
			/* 全选反选 */
			,
			changeBook(e) {
				console.log(e)
				this.ids=[];
				if (e.detail.value.length == 0) {
					this.sum=0;
					
					this.list.forEach((item) => {
						// console.log(item, '取消')
						this.$set(item, "checked", false);
					});
					this.allchecked = false;
					this.disabled=true
				} else {
					this.sum=0
					
					this.list.map(item =>{if(item.status==2){
						this.ids.push(item)
						this.sum=this.sum+1
						 }
					})
					
					
					this.list.forEach((item) => {
						
						console.log(55);
						// console.log(item, '勾选')
						this.$set(item, "checked", true);
					});
					this.allchecked = true;
					
					if(this.sum>0){
						this.disabled=false
					}
					
				}
			},
			checkboxChange(e) {
				if (e.detail.value.length == this.list.length) {
			 
			       this.allchecked = true;
				} else {

					this.allchecked = false;
				}
				this.sum=0
				this.ids=[];
				this.disabled=true
				this.list.filter(item =>item.status==2).forEach((item) => {
					if (e.detail.value.indexOf(item.ID) != -1) {
						this.sum=this.sum+1
						this.$set(item, "checked", true);
						this.ids.push(item);
						this.disabled=false
					} else {
						
						this.$set(item, "checked", false);
						
					}
				})
				
			 
			 
			}
			
			
			,
			next(){
							

			var noList=[];
			this.list.forEach(item =>{
				
				var count=0;
			  this.ids.forEach(item2 =>{
				  
				  if(item.ID==item2.ID){
					  
					  count++;
				  }
			  })
			  if(count==0){
				  noList.push(item)
			  }
				
			})
			
			if(noList[0]==null){
				uni.setStorageSync("noBackList", "empty")
				
			}else{
			uni.setStorageSync("noBackList", noList)
             }			
			
			uni.setStorageSync("BackList", this.ids)
			
			
			uni.$u.route('/pages/back/next')
			}
				
			,
			
			/**
			 * 查找EPC
			 */
			findEpc(str, type) {
				var that = this 
				
					// 如果这个epc没有扫到过
				if (!this.alreadySet.has(str)) {
					// 在已扫描数据内添加该epc
					this.alreadySet.add(str)	
			
			uni.request({
				url:url.BASE_URL+"/api/ESC/App_AssetsQuery_Eam",
				data:{
					"epc":  str
				},
				method:"POST"
			}).then(res =>{
				console.log("fanhuizhi",res,str)
				if(res[1].data.data!=null || res[1].data.data.length!=0){
					
					console.log("77777777")
					
					this.list.push(res[1].data.data)
					
					
				}
			                	
						}).catch(e => {
							console.log("888888")
							this.alreadySet.delete(str)
						})
					}
				},
			/**
			 * 查看详情
			 */
			viewDetail(item) {
			
				uni.navigateTo({
					url: '/pages/back/back-detail?options='+item
				})
			},
			/**
			 * 关闭筛选
			 */
			determineFilter(data) {
				this.filterStatus = data.status
				this.showFilter = false
				this.$nextTick(() => {
					this.$refs.list.initPages()
				})
			},
			/**
			 * 关闭筛选
			 */
			closeFilter(data) {
				this.showFilter = false
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
	
		.qx{
			position: absolute;
						right: 20px;
						top: 20rpx;
							font-size: 28rpx;
							color: #222222;	
		}
		 
		.logo {
			height: 200rpx;
			width: 200rpx;
			margin-top: 200rpx;
			margin-left: auto;
			margin-right: auto;
			margin-bottom: 50rpx;
		}
		 
		.main-wrap {
			
			height: calc(100vh - var(--window-top));
		    
			
			.scan-top-info {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				padding: 24rpx 24rpx 30rpx;
			}
		
			.top-info-text {
				font-size: 26rpx;
				color: #969799;
			}
		
			.top-info-number {
				font-size: 26rpx;
				color: #969799;
				background-color: #ffffff;
			}
		
		
		
			.list-box {
				background-color: #ffffff;
				border-radius: 8rpx;
				display: flex;
				flex-direction: column;
				padding: 0 20rpx;
				margin: 0 30rpx 20rpx;
			}
			.list-box2 {
				background-color: #db999a;
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
				height: 78rpx;
				border-bottom: 1px solid #ebedf0;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
			}
		
			.shop-name {
				font-size: 34rpx;
				font-weight: bold;
				color: #222222;
			}
		
			.list-status {
				font-size: 30rpx;
				color: #00a34f;
			}
		
			.status-0 {
				color: #faab0c;
			}
		
			.status-1 {
				color: #11479b;
			}
		
			.status-2 {
				color: #00a34f;
			}
		
			.list-info-block {
				display: flex;
				flex-direction: row;
				align-items: center;
				padding: 24rpx 10rpx 0 0;
			}
		
			.list-info-wrap {
				flex: 1;
			}
		
			.right-icon {
				width: 16rpx;
				height: 28rpx;
			}
		
			.info-row {
				margin-bottom: 24rpx;
				display: flex;
				flex-direction: row;
				align-items: center;
			}
		
			.info-line {
				height: 78rpx;
				width: 250px;
		
				border-bottom: 2px dotted #ebedf0;
				margin-bottom: 24rpx;
				display: flex;
				flex-direction: row;
				align-items: center;
			}
		
			.info-label {
				width: 190rpx;
				font-size: 30rpx;
				color: #969799;
			}
		
			.info-value {
				font-size: 30rpx;
				color: #323233;
			}
		
		
		
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
		
		
				}
		
				.top-info-text {
					font-size: 26rpx;
					color: #969799;
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
				height: calc(120% - 516rpx);
		
				&.read-only {
					height: calc(120% - 386rpx);
				}
			}
		
			.tips-block {
				position: fixed;
				top: 15%;
				left: 50%;
				transform: translateX(-50%);
				padding: 60rpx 40rpx;
				background-color: #ffffff;
				color: #222222;
				display: flex;
				flex-direction: column;
				align-items: center;
				border-radius: 30rpx;
		
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
		.text-area {
			display: flex;
			justify-content: center;
		}
		 
		.title {
			font-size: 36rpx;
			color: #8f8f94;
		}
		.bottom-block {
			width: 500rpx;
			height: 7%;
			position: absolute;
			right: 50px;
			bottom: 80rpx;
			// padding: 50rpx 55rpx;
			// 
	
		}
		.flush{
			width: 40rpx;
			height: 40rpx;
			position: fixed;
			right: 220rpx;
			top: 28rpx;
		}
	</style>
	
	<style>
		/* #ifndef APP-NVUE */
		page {
			background-color: #f2f3f5;
		}
	
		/* #endif */
	</style>
	