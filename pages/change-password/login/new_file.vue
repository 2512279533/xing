<template>
  <view class="main-wrap">
    <view class="title-box">
      <image class="title-logo" src="/static/images//sy.png"/>
      <text class="title-cn">Medtronic</text>
      <view class="title-en">
        <text class="en-text m-r">Engineering</text> 
        <text class="en-text m-r">the</text>
        <text class="en-text m-r">extraordinary</text>
        <text class="en-text c-3"></text>
        <text class="en-text"></text>
      </view>
    </view>
    <!-- 表单模块 -->
    <view class="form-wrap">
      <view class="form-item">
        <input class="form-input" v-model="loginInfo.userName" placeholder="请输入用户名" maxlength="30" confirm-type="next" @input="loginInfo.passWord = ''">
      </view>
      <view class="form-item">
        <input class="form-input" v-model="loginInfo.passWord" :type="showPwd ? 'text' : 'password'" placeholder="请输入密码"
               maxlength="18" confirm-type="done" @confirm="handleLogin">
        <view class="eye-icon" @click="handleShowPwd">
			<u-icon :name="showPwd ? 'eye' : 'eye-off'" size="40" />
        </view>
      </view>
    </view>
	<view class="remember-wrap">
		
			<text class="remember-text">忘记密码</text>
		  
	</view>
	<image class="app" src="../../static/images/app.png"></image>
	<view class="bottom-block">
    <u-button :loading="isLoading" size="large" text="登录" @click="handleLogin"/>
	</view>
  </view>
</template>

<script>
// 密码的正则验证
let passwordReg = /^.{6,18}$/;
export default {
  data() {
    return {
      showPwd: false, //是否展示密码
      isLoading: false, //是否正在加载
	  loginInfo: {
		  userName: '123', //用户名
		  passWord: '123123123', //密码
		  remeberPwd: false
	  },
	  userInfo:{
		  type: 2,
		  NickName: '张三',
		  phone: "15555555"
	  }
    }
  },
  onReady() {
  	const loginInfo = uni.getStorageSync('loginInfo');
  	if (loginInfo) {
  	  this.loginInfo = loginInfo
  	  if (this.loginInfo.remeberPwd) {
  		  const pwd = this.loginInfo.passWord
  		  setTimeout(() => {
  			  this.loginInfo.passWord = pwd
  		  }, 400)
  	  }
  	}
  },
  methods: {
    /**
     * 处理登录
     */
    handleLogin() {
      if (!this.loginInfo.userName) {
        uni.$u.toast('请输入用户名');
        return
      }
      if (!passwordReg.test(this.loginInfo.passWord)) {
        // 对于密码的公共判断方法
        uni.$u.toast('请输入6-18位的密码');
        return;
      }
      this.login()
    },
    /**
     * 控制密码显示
     */
    handleShowPwd() {
      this.showPwd = !this.showPwd
    },
    /**
     * 调用登录信息
     */
    login() {
      if (this.isLoading) {
        return
      }
      this.isLoading = true
	  uni.setStorageSync("token", '')
      uni.$u.api.user.login({
      	userName: this.loginInfo.userName,
      	passWord: this.loginInfo.passWord
      }).then(res => {
      	uni.setStorageSync("token", res.token)
      	// uni.setStorageSync("userInfo", res.data)
		uni.setStorageSync("userInfo", this.userInfo.type)
		
		if (this.loginInfo.remeberPwd) {
			uni.setStorageSync("loginInfo", this.loginInfo)
		} else {
			uni.setStorageSync("loginInfo", {
				userName: '',
				passWord: '',
				remeberPwd: false
			})
		}
        uni.reLaunch({
          url: '/pages/home/check/check'
        })
      }).catch(err => {
      	this.isLoading = false
      })
	  

	  uni.setStorageSync("userInfo", this.userInfo)
	uni.reLaunch({
	  url: '/pages/home/check/check'
	})
	  
    }
  }
}
</script>

<style scoped lang="scss">
.main-wrap {
  padding: 0 70rpx;
  
}
.form-wrap{
	/* #ifndef APP-NVUE */
	position: absolute;
				right: 40px;
				top: 110px;
				
				/* #endif */
}
.title-box {
  padding: 20rpx 0 90rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;

}

.title-logo {
  width: 100rpx;
  height: 115rpx;
  	/* #ifndef APP-NVUE */
  position: relative;
  			top: 0;
  			right: 250px;
  			/* #endif */
}

.title-cn {
  font-size: 70rpx;
  font-weight: bold;
  color: #140f4b;
  margin-bottom: 20rpx;
  /* #ifndef APP-NVUE */
  
  position: absolute;
  			right: 30px;
  			top: 0px;
  		/* #endif */
  		
}

.title-en {
  display: flex;
  flex-direction: row;
  margin-bottom: 10rpx;
}

.en-text {
  font-size: 32rpx;
  font-weight: bold;
  
}

.en-text.m-r {
  margin-right: 14rpx;
  
}

.en-text.c-1 {
  color: #086ead;
}

.en-text.c-2 {
  color: #ec5930;
}

.en-text.c-3 {
  color: #52a6a6;
}
.app{
	width: 400rpx;
	height: 150rpx;
	/* #ifndef APP-NVUE */
	position: absolute;
				right: 80px;
				top: 80px;
				/* #endif */
				
}
.title-en {
  font-size: 32rpx;
  font-weight: bold;
  color: #534f7b;
  /* #ifndef APP-NVUE */
  
  position: absolute;
  			right: -25px;
  			top: 40px;
			/* #endif */
  		
}

.form-item {
  height: 120rpx;	
  border-bottom: 1px solid #736f93;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.form-input {
  height: 110rpx;
  font-size: 40rpx;
  color: #222222;
  flex: 1;
  border: 0;
}

.form-input-placeholder {
  color: #bbbbbb;
  border: 0;
}

.eye-icon {
  height: 100rpx;
  padding: 0 28rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.eye-img {
  width: 26rpx;
  height: 18rpx;
}

.navigator-box {
  display: flex;
  align-items: center;
}

.navigator-hover {
  opacity: 0.7;
}

	.bottom-block {
		width: 500rpx;
		/* #ifndef APP-NVUE */
		position: absolute;
		right: 53px;
		bottom: -700rpx;
		padding: 10rpx 88rpx;
		/* #endif */
		
	}
.remember-wrap {
	display: flex;
	flex-direction: row;
	align-items: center;
	height: 150rpx;
}
.remember-box {
	height: 90rpx;
	display: flex;
	flex-direction: row;
	align-items: center;
}
.check-icon {
	width: 30rpx;
	height: 30rpx;
	border-radius: 50%;
	border: 1px solid #606266;
	margin-right: 12rpx;
}
.check-icon.hide {
	border: 0px;
}
.remember-text {
	font-size: 28rpx;
	font-weight: 500;
	color: #222222;
	/* #ifndef APP-NVUE */
	position: inherit;
				right: -477rpx;
				top: 500rpx;
	/* #endif */
}
</style>
