<template>
	<view class="main-wrap">
		<text class="text-table">请输入交接信息</text>
		<view class="tablee">
		
		   
			<my-form-input label="机台号:" v-model="ro" border-bottom @input="inputBlur"/>
			<z-form-input label="区 域:" v-model="area" placeholder="根据输入的机台带出" border-bottom readonly />
			<my-form-radio label="附件拍照上传" border-bottom placeholder="-" />
		</view>
	
			<image class="image" src="../../static/images/pz.png"></image>
			<image class="image2" src="../../static/images/sc.png" @click="sc"></image>
			
			<view  class="zp">
					<view v-for="(item,index) in ids">
						<view class="aaa">
							<image src="../../static/images/white.png" class="delete"></image>
				
				<image src="../../static/images/back.png"
					style="width: 100rpx;height: 150rpx;  border-radius: 10rpx;transform: rotate(0deg);"></image>
					</view>
			</view>
			</view>
			<view  class="zp">
					<view v-for="(item,index) in list">
				<image src="../../static/images/yc.png" class="delete" @click="deleteFun(item)"></image>
				<image :src="item"  @click="look(item)"
					style="width: 100rpx;height: 150rpx;    border-radius: 10rpx;transform: rotate(0deg);"></image>
			</view>
		
			</view>
		
		<view class="bottom-block">
					<u-button text="提交 >" @click="submit" />
		</view>
	</view>

</template>

<script>
	import ZFormSelect from '@/components/z-form-select/z-form-select.nvue'
	import ZFormRadio from '@/components/z-form-radio/z-form-radio.nvue'
	import ZFormDate from '@/components/z-form-date/z-form-date.nvue'
	import ZFormInput from '@/components/z-form-input/z-form-input.nvue'
    import ZFormUpload from '@/components/z-form-upload/z-form-upload.nvue'
    import url from "../../common/config.js"
	
	
	
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
				len:0,
				list: [],
				ids:[1,2,3],
				ima:[],
				userInfo:{},
				ReceList:[],
				noReceList:[],
				imgUrl:[],
				ro:null,
				area:null,
				roAll:[],
				areaId:null,
				deptId:null,
				deptName:null
			}
		},
		onLoad() {
			
			uni.setNavigationBarTitle({
				title: '运输领用'
			})
			
						uni.setNavigationBarColor({
						    frontColor: '#ffffff',
						    backgroundColor: '#11479b',
						    animation: {
						        duration: 400,
						        timingFunc: 'easeIn'
						    }
						})
			uni.setNavigationBarColor({
			    frontColor: '#ffffff',
			    backgroundColor: '#11479b',
			    animation: {
			        duration: 400,
			        timingFunc: 'easeIn'
			    }
			})
			uni.request({
				url:url.BASE_URL+"/api/ESC/App_StationInfo_Eam",
				method:"POST",
				success: (res) => {
							this.roAll=res.data.data
							
			 		}
			})
			
			
		 this.ReceList=uni.getStorageSync("List")
		 this.noReceList=uni.getStorageSync("noList")
		 uni.setStorageSync("noList","")
		 uni.setStorageSync("List","")
		},
		methods: {
		inputBlur(){
			this.area=null
			this.roAll.forEach(item =>{
				if(item.deptCode==this.ro){
					this.area=item.areaName
					this.areaId=item.areaId
					this.deptId=item.deptId
					this.deptName=item.deptName
				}
			})
			
		},
			look(item){
	         const url=[];
			 url.push(item)
				uni.previewImage({
					urls: url
				
				})
					
				
			}
			,
			submit() {
			
			
			    if(this.area==null){
					uni.showModal({
						title: '提示',
						content: '请输入正确的机台号',
						
					});
						
					return
				}
					
					
					
					
					
					this.userInfo=uni.getStorageSync('userInfo');
				
					let aaaa=JSON.stringify(this.imgUrl)
					
					
					
					this.ReceList.forEach(item=>{
						console.log(item)
					})
					
					let str = this.imgUrl.slice(1);
					uni.request({
						url:url.BASE_URL+"/api/ESC/App_RecipientsSubmit_Eam",
						method:"POST",
						data: {
							"assetsList":this.ReceList,
						    "userId":this.userInfo.UserID,
							// "RoleID":this.userInfo.RoleID,
							"imgUrl":str,
							"deptId":this.deptId,
							"deptName":this.deptName
						},
						 success: (res) => {
						        console.log(res.data);
						        this.text = 'request success';
								
								if(res.data.code=="200"){
									
								uni.setStorageSync("noReceList2",this.noReceList)
								
								this.ReceList.forEach(item =>{
									uni.request({
										url:url.BASE_URL+"/api/ESC/App_AssetsStatusSave_Eam",
										data:{
											"assetsCode": item.assetsCode,
											"status": 2
										},
										method:"POST"
									}).then(res =>{
										
										
									})	
									
								})
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
						    }
					})
				
				
				// uni.redirectTo({
				// 	url: 'rece'
				// });
			},
			sc() {
				this.userInfo=uni.getStorageSync("userInfo")
				
				
				uni.chooseImage({
					count: 9,
					sizeType: ['original', 'compressed'],
					sourceType: ["camera", "album"], //camera掉拍照，album是打开手机相册
					success: (res) => {
                                
								uni.uploadFile({
									url: 'http://124.222.61.241:6868/api/ESC/App_UploadImg_Eam',
									filePath: res.tempFilePaths[0],
									name: 'file',
									formData: {
										'UserID': this.userInfo.UserID,
										'RoleID': this.userInfo.RoleID
									},
									success: (res) => {
										
										console.log(JSON.parse(res.data))
										let aaa=JSON.parse(res.data)
										
										this.imgUrl=this.imgUrl+","+aaa.url
									}
								});

						this.list.push(res.tempFilePaths[0])

					}
				});

			},
			deleteFun(item) {
				uni.showModal({
					title: '删除',
					content: `确认删除？`,
					success: (res) => {
						if (res.confirm) {
							var index = this.list.findIndex(items => {
								if (items == item) {
									return true
								}
							})
							this.list.splice(index, 1);
							this.imgUrl.splice(index, 1)
						}
					}
				})
			},

			//上传图片
			uploadTheImg(imgFiles) {
				uni.uploadFile({
					url: `/api/ESC/App_UploadImg_Eam`, //后端用于处理图片并返回图片地址的接口
					header: {
						"Content-Type": "multipart/form-data", // formdata提交格式
					},
					filePath: imgFiles[0],
					name: 'uploadfile', // 默认
					formData: { // 其他的formdata参数
						fileType: '2',
						uid: '10001',
						fileContainerName: 'default'
					},
					success: res => {
						let data = JSON.parse(res.data) //返回的是字符串，需要转成对象格式，打印data如下图
						if (data.code == 200) {
							console.log(data.msg) //图片地址
						}
					},
					// fail: () => {}
				})
			},



		}
	}
</script>

<style>
.text-table {
		padding-left: 200rpx;
		padding-top: -30rpx;
		font-weight: bold;
	}

	.main-wrap {
		padding-left: 50rpx;
		
	}

	.bottom-block {
		width: 500rpx;
		position: absolute;
		right: 53px;
		bottom: 0%;
		padding: 10rpx 55rpx;

	}

	.image {
		width: 5%;
		height: 4%;
		position: absolute;
		right: 57%;
		top: 110px;
	}

	.image2 {
		width: 32%;
		height: 20%;
		position: absolute;
		right: 34%;
		top: 35%;
	}
	.tablee {
		top: 30px;
	}

	.zp {
		position: absolute;
		left: 40px;
		top: 270px;
		display: flex;
	}
	.zp-com {
		position: absolute;
		left: 50px;
		top: 200px;
	}
	.delete{
		width: 30rpx;
		height: 30rpx;
		padding: 10%;
		
	}
	.bottom-block {
		width: 500rpx;
		height: 7%;
		position: absolute;
		right: 50px;
		bottom: 80rpx;
		padding: 50rpx 55rpx;
		
	
	}
</style>
