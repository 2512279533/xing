<template>
	<view class="main-wrap">
		
		

		
				<text class="form-title">基本信息</text>
				
				
	
				
				<z-form-select
					v-model="formData.assetsCode" 
					label="器具编号" 
					placeholder="-" 
					type="dept"
					key-name="deptName" 
					border-bottom
					:required="canEdit" 
					:readonly="!canEdit"
					@confirm="confirmDept" />
				<z-form-select
					v-model="formData.assetsName" 
					label="资产名称" 
					placeholder="-" 
					type="dept"
					border-bottom
					key-name="deptName" 
					:required="canEdit" 
					:readonly="!canEdit"
					@confirm="confirmDept" />
				<z-form-select 
					v-model="formData.assetsType" 
					label="物资类别" 
					placeholder="-" 
					type="userByDept"
					key-name="nickName" 
					need-after
					:after-value="deptId"
					border-bottom 
					:required="canEdit" 
					:readonly="!canEdit || !deptId" />
				<z-form-date 
					v-model="formData.assetsDueDate" 
					label="到期日期" 
					mode="date" 
					placeholder="-" 
					border-bottom
					:required="canEdit" 
					:readonly="!canEdit" />
					<z-form-select
						label="RFID标签" 
						v-model="formData.assetsEpc" 
						placeholder="-" 
						type="number" border-bottom
						:required="canEdit" 
						:readonly="!canEdit" />
					
				<text class="form-title">使用信息</text>
				<z-form-select
					label="机台设备号" 
					v-model="formData.actualDeptCode" 
					placeholder="-" 
					border-bottom
					:required="canEdit" 
					:readonly="!canEdit" />
				<z-form-select 
					v-model="formData.actualUser" 
					label="使用人工号" 
					placeholder="-" 
					type="assetsType" 
					border-bottom
					key-name="name" 
					:required="canEdit" 
					:readonly="!canEdit" />
					
				
				
				
			      <view v-if="temp=='2' || RoleID==10">
							<z-form-select
							v-model="type"
								label="检 具 状 态" 
								placeholder="-"
								type="assetsType" 
								border-bottom
								key-name="name" 
								:required="canEdit" 
								:readonly="!canEdit" />
							</view>
							<view  v-if="temp=='1'||temp=='0' && RoleID!=10">
									<my-tabbar
									 v-model="type"
									  label="检 具 状 态" 
									  placeholder="-" 
									  :options="state"
									key-name="key"
									border-bottom
									@confirm="confirmMode"/>
									
							</view>
						
							
						
				
			
				    
				
					
		
						
					
				<u-gap height="120" />
				
			
	
			</list>
	
			<view class="bottom-block" v-if="temp!=2 && this.RoleID!=10" >
						<u-button text="提交 >" @click="submit"/>
					</view>
	</view> 
</template>

<script>
	import url from "../../common/config.js"
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
			ZFormDate,
			url
		},
		data() {
			return {
				temp:'',
				disabled: true,
				canEdit: false,
				deptId: '',
				type:'',
				RoleID:'',
				options:null,
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
				state:
				[
					[{
							key: '在库'
						},
						{
							key: '使用中'
						},
						{
							key: '在途'
						},
						]
					]
				,
			
				formData: []
			};
		},
		onShow() {
			this.RoleID=uni.getStorageSync("userInfo").RoleID
		}
		,
		onLoad(options) {
			this.RoleID=uni.getStorageSync("userInfo").RoleID
			
			uni.request({
				url:url.BASE_URL+"/api/ESC/App_AssetsQuery_Eam",
				data:{
					"epc": options.options
				},
				method:"POST"
			}).then(res =>{
				
				// this.list.push(res[1].data.data)
				console.log(res[1].data.data.assetsCode)
				this.formData=res[1].data.data
				console.log("=======")
				 console.log(this.formData)
				 console.log("=======")
				 this.temp=this.formData.status;
				 
				 if(this.formData.status==0||this.formData.status=='0'){
				 	console.log("11")
				 	this.type="在库"
				 }if(this.formData.status==1||this.formData.status=='1'){
				 	console.log("22")
				 	this.type="在途"
				 }if(this.formData.status==2||this.formData.status=='2'){
				 	console.log("33")
				 	this.type="使用中"
				 }
				 
				 this.deptId = this.formData.ID
				 
				 
				 
			})
			
			
			uni.setNavigationBarTitle({
				
				title: '检具详情',
				
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
			confirmMode(e){
				if(e.key==="在库"){
					this.formData.status=0
				}
				if(e.key==="在途"){
					this.formData.status=1
				}
				if(e.key==="使用中"){
					this.formData.status=2
				}
				
			},
			submit(){
				console.log(this.formData)
				
				
				
				
				let user=uni.getStorageSync("userInfo")
				
				uni.request({
					url:url.BASE_URL+"/api/ESC/App_AssetsStatusSave_Eam",
					data:{
						"assetsCode": this.formData.assetsCode,
						"status": this.formData.status
					},
					method:"POST"
				}).then(res =>{
					
					if(res[1].data.code=="200"){
					   
						// uni.redirectTo({
						// 	url: '/pages/rece/rece?epc='+this.formData.assetsEpc+'&status='+this.formData.status
						// });
						
						uni.setStorageSync("editEpc",this.formData.assetsEpc)
						
						uni.showModal({
							title: '提示',
							content: '提交成功',
							showCancel: false,
							success: function (res) {
								if (res.confirm) {
									uni.navigateBack({
										delta: 1
									});
								} 
							}
						});
						
						
						
						
					}else{
						uni.showModal({
							title: '提示',
							content: '提交失败',
						});
					}
					
					
				})	
				
			},
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
		padding: 0 24rpx;
		font-size: 32rpx;
		font-weight: bold;
		line-height: 90rpx;
		color: #bcaaa8;
	}

	.form-block {
		background-color: #ffffff;
	}

	.bottom-btn-block {
		padding: 20rpx 30rpx;
		background-color: #ffffff;
		border-top: 1px solid #e6e6e6;
	}
	.form-left{
		padding: 0 24rpx;
		font-size: 32rpx;
		font-weight: bold;
		line-height: 90rpx;
		color: #bcaaa8;
	}
	.bottom-block {
		width: 500rpx;
		position: absolute;
		right: 53px;
		bottom: 20rpx;
		padding: 10rpx 55rpx;
		
	}
</style>
