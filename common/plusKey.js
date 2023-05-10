export  key (){
	plus.key.addEventListener('keydown', (e) => {
			
			
			if (e.keyCode === 295) {
				
				console.log('按下111', e.keyCode)
				console.log(getApp().globalData.strCode)
				
				getApp().globalData.test_module.ReadRFID(res => {
					
					console.log("read back", res)
				if(getApp().globalData.strCode==1){
					getApp().globalData.EPC=res.epcHexStr
				}
				
				if(getApp().globalData.strCode==2){
					console.log("222222222")
					this.findEpc2(res.epcHexStr,"epc")
					
				}if(getApp().globalData.strCode==3){
					console.log("33333")
					this.findEpc3(res.epcHexStr,"epc")
				}
				if(getApp().globalData.strCode==4){		
					
					
				getApp().globalData.RFID=res.epcHexStr
				
				
				}
				
				
				if(getApp().globalData.strCode==5){
					console.log("33333")
					getApp().globalData.RFID=res.epcHexStr
				}
				
				
				if(getApp().globalData.strCode==6){
					getApp().globalData.num=res.rssi
					
				}
				})
	
			}
	
		})
	,
		// 监听扳机松开
		plus.key.addEventListener('keyup', (e) => {
			console.log('松开111', e.keyCode)
			if (e.keyCode === 295) {
				
				getApp().globalData.test_module.stopRead()
				 
			}
		})
}