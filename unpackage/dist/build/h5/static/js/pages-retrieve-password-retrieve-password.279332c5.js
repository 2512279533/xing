(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-retrieve-password-retrieve-password"],{"0003":function(t,e,n){var a=n("37f6");a.__esModule&&(a=a.default),"string"===typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);var i=n("4f06").default;i("1be1996d",a,!0,{sourceMap:!1,shadowMode:!1})},"1fa6":function(t,e,n){var a=n("5f3a");a.__esModule&&(a=a.default),"string"===typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);var i=n("4f06").default;i("dfabfd6e",a,!0,{sourceMap:!1,shadowMode:!1})},"304a":function(t,e,n){"use strict";n.d(e,"b",(function(){return i})),n.d(e,"c",(function(){return s})),n.d(e,"a",(function(){return a}));var a={uCode:n("9aca").default,uButton:n("e1f0").default},i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-uni-view",{staticClass:"main-wrap"},[n("v-uni-view",{staticClass:"form-wrap"},[n("v-uni-view",{staticClass:"form-item"},[n("v-uni-input",{staticClass:"form-input",attrs:{"placeholder-class":"form-input-placeholder",type:"number",placeholder:"请输入注册手机号",maxlength:"11"},model:{value:t.phone,callback:function(e){t.phone=e},expression:"phone"}})],1),n("v-uni-view",{staticClass:"form-item"},[n("v-uni-input",{staticClass:"form-input",attrs:{type:"number","placeholder-class":"form-input-placeholder",placeholder:"请输入手机验证码",maxlength:"6"},model:{value:t.msg,callback:function(e){t.msg=e},expression:"msg"}}),n("v-uni-view",{staticClass:"verify-code-block",on:{touchend:function(e){arguments[0]=e=t.$handleEvent(e),t.getVerifyCode.apply(void 0,arguments)}}},[n("v-uni-text",{staticClass:"verify-code-text"},[t._v(t._s(t.codeText))])],1)],1),n("v-uni-view",{staticClass:"form-item"},[n("v-uni-input",{staticClass:"form-input",attrs:{"placeholder-class":"form-input-placeholder",type:"password",placeholder:"请输入新密码",maxlength:"16"},model:{value:t.password,callback:function(e){t.password=e},expression:"password"}})],1),n("v-uni-view",{staticClass:"form-item"},[n("v-uni-input",{staticClass:"form-input",attrs:{"placeholder-class":"form-input-placeholder",type:"password",placeholder:"请重复您的新密码",maxlength:"16"},model:{value:t.repeatPassword,callback:function(e){t.repeatPassword=e},expression:"repeatPassword"}})],1)],1),n("u-code",{ref:"uCode",attrs:{"change-text":"Xs"},on:{change:function(e){arguments[0]=e=t.$handleEvent(e),t.verifyCodeChange.apply(void 0,arguments)}}}),n("u-button",{attrs:{disabled:t.loading,loading:t.loading,"loading-text":"重置中",size:"large",text:"确定"},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.handleStep.apply(void 0,arguments)}}})],1)},s=[]},3564:function(t,e,n){"use strict";(function(t){n("7a82"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0,n("ac1f"),n("00b4"),n("498a");var a=/^.{6,18}$/,i={data:function(){return{codeText:"",loading:!1,canBack:!0,phone:"",msg:"",password:"",repeatPassword:""}},onBackPress:function(t){if(!this.canBack)return this.step>0&&!this.loading&&(this.step-=1),0===this.step&&(this.canBack=!0),!0},methods:{verifyCodeChange:function(t){this.codeText=t},getVerifyCode:function(){var e=this;t("log",111," at pages/retrieve-password/retrieve-password.nvue:75"),uni.$u.test.mobile(this.phone)?this.$refs.uCode.canGetCode?(uni.showLoading({title:"正在获取验证码"}),uni.$u.api.user.loginSendMsg({phone:this.phone}).then((function(t){uni.hideLoading(),uni.$u.toast("验证码已发送"),e.$refs.uCode.start()}))):uni.$u.toast("倒计时结束后再发送"):uni.$u.toast("请输入正确的手机号码")},handleStep:function(){uni.$u.test.mobile(this.phone)?""!=uni.$u.trim(this.msg)?uni.$u.test.code(this.msg)?a.test(this.password)&&a.test(this.repeatPassword)?this.password==this.repeatPassword?this.resetPwd():uni.$u.toast("两次输入的密码不一致"):uni.$u.toast("请输入6-18位的密码"):uni.$u.toast("请输入正确的验证码"):uni.$u.toast("手机验证码不能为空"):uni.$u.toast("请输入正确的手机号码")},resetPwd:function(){var t=this;this.loading=!0,uni.$u.api.user.loginUpdatePassword({phone:this.phone,msg:this.msg,password:uni.$u.md5.md5(this.password)}).then((function(t){uni.$u.toast("重置密码成功"),setTimeout((function(){uni.reLaunch({url:"/pages/login/login"})}),2e3)})).catch((function(e){t.loading=!1}))}}};e.default=i}).call(this,n("0de9")["log"])},"37f6":function(t,e,n){var a=n("24fb");e=a(!1),e.push([t.i,'@charset "UTF-8";\r\n/**\r\n * 下方引入的为uView UI的集成样式文件，为scss预处理器，其中包含了一些"u-"开头的自定义变量\r\n * 使用的时候，请将下面的一行复制到您的uniapp项目根目录的uni.scss中即可\r\n * uView自定义的css类名和scss变量，均以"u-"开头，不会造成冲突，请放心使用 \r\n */.text-10[data-v-e8586886]{font-size:%?10?%}.text-12[data-v-e8586886]{font-size:%?12?%}.text-14[data-v-e8586886]{font-size:%?14?%}.text-16[data-v-e8586886]{font-size:%?16?%}.text-18[data-v-e8586886]{font-size:%?18?%}.text-20[data-v-e8586886]{font-size:%?20?%}.text-22[data-v-e8586886]{font-size:%?22?%}.text-24[data-v-e8586886]{font-size:%?24?%}.text-26[data-v-e8586886]{font-size:%?26?%}.text-28[data-v-e8586886]{font-size:%?28?%}.text-30[data-v-e8586886]{font-size:%?30?%}.text-32[data-v-e8586886]{font-size:%?32?%}.text-34[data-v-e8586886]{font-size:%?34?%}.text-36[data-v-e8586886]{font-size:%?36?%}.text-38[data-v-e8586886]{font-size:%?38?%}.text-40[data-v-e8586886]{font-size:%?40?%}.text-42[data-v-e8586886]{font-size:%?42?%}.text-44[data-v-e8586886]{font-size:%?44?%}.text-46[data-v-e8586886]{font-size:%?46?%}.text-48[data-v-e8586886]{font-size:%?48?%}.text-50[data-v-e8586886]{font-size:%?50?%}.main-wrap[data-v-e8586886]{padding:0 %?70?%}.form-wrap[data-v-e8586886]{padding-top:%?100?%;margin-bottom:%?80?%}.form-item[data-v-e8586886]{height:%?120?%;border-bottom:1px solid #e6e6e6;display:flex;flex-direction:row;align-items:center}.form-input[data-v-e8586886]{font-size:%?40?%;color:#222;flex:1}.form-input-placeholder[data-v-e8586886]{color:#bbb}.verify-code-block[data-v-e8586886]{width:%?200?%;height:%?120?%;display:flex;flex-direction:row;align-items:center;justify-content:center}.verify-code-text[data-v-e8586886]{font-size:%?32?%;font-weight:500;color:#222}.verify-code-text[data-v-e8586886]:active{opacity:.7}',""]),t.exports=e},"39a7":function(t,e,n){"use strict";n("7a82"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0,n("a9e3");var a={props:{seconds:{type:[String,Number],default:uni.$u.props.code.seconds},startText:{type:String,default:uni.$u.props.code.startText},changeText:{type:String,default:uni.$u.props.code.changeText},endText:{type:String,default:uni.$u.props.code.endText},keepRunning:{type:Boolean,default:uni.$u.props.code.keepRunning},uniqueKey:{type:String,default:uni.$u.props.code.uniqueKey}}};e.default=a},4198:function(t,e,n){"use strict";n.r(e);var a=n("8ec0"),i=n.n(a);for(var s in a)["default"].indexOf(s)<0&&function(t){n.d(e,t,(function(){return a[t]}))}(s);e["default"]=i.a},"5e36":function(t,e,n){"use strict";var a=n("0003"),i=n.n(a);i.a},"5f3a":function(t,e,n){var a=n("24fb");e=a(!1),e.push([t.i,'@charset "UTF-8";\r\n/**\r\n * 下方引入的为uView UI的集成样式文件，为scss预处理器，其中包含了一些"u-"开头的自定义变量\r\n * 使用的时候，请将下面的一行复制到您的uniapp项目根目录的uni.scss中即可\r\n * uView自定义的css类名和scss变量，均以"u-"开头，不会造成冲突，请放心使用 \r\n */.text-10[data-v-4d11c728]{font-size:%?10?%}.text-12[data-v-4d11c728]{font-size:%?12?%}.text-14[data-v-4d11c728]{font-size:%?14?%}.text-16[data-v-4d11c728]{font-size:%?16?%}.text-18[data-v-4d11c728]{font-size:%?18?%}.text-20[data-v-4d11c728]{font-size:%?20?%}.text-22[data-v-4d11c728]{font-size:%?22?%}.text-24[data-v-4d11c728]{font-size:%?24?%}.text-26[data-v-4d11c728]{font-size:%?26?%}.text-28[data-v-4d11c728]{font-size:%?28?%}.text-30[data-v-4d11c728]{font-size:%?30?%}.text-32[data-v-4d11c728]{font-size:%?32?%}.text-34[data-v-4d11c728]{font-size:%?34?%}.text-36[data-v-4d11c728]{font-size:%?36?%}.text-38[data-v-4d11c728]{font-size:%?38?%}.text-40[data-v-4d11c728]{font-size:%?40?%}.text-42[data-v-4d11c728]{font-size:%?42?%}.text-44[data-v-4d11c728]{font-size:%?44?%}.text-46[data-v-4d11c728]{font-size:%?46?%}.text-48[data-v-4d11c728]{font-size:%?48?%}.text-50[data-v-4d11c728]{font-size:%?50?%}uni-view[data-v-4d11c728], uni-scroll-view[data-v-4d11c728], uni-swiper-item[data-v-4d11c728]{display:flex;flex-direction:column;flex-shrink:0;flex-grow:0;flex-basis:auto;align-items:stretch;align-content:flex-start}',""]),t.exports=e},"767a":function(t,e,n){"use strict";n.r(e);var a=n("3564"),i=n.n(a);for(var s in a)["default"].indexOf(s)<0&&function(t){n.d(e,t,(function(){return a[t]}))}(s);e["default"]=i.a},"8ec0":function(t,e,n){"use strict";n("7a82");var a=n("4ea4").default;Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0,n("a9e3"),n("ac1f"),n("5319");var i=a(n("39a7")),s={name:"u-code",mixins:[uni.$u.mpMixin,uni.$u.mixin,i.default],data:function(){return{secNum:this.seconds,timer:null,canGetCode:!0}},mounted:function(){this.checkKeepRunning()},watch:{seconds:{immediate:!0,handler:function(t){this.secNum=t}}},methods:{checkKeepRunning:function(){var t=Number(uni.getStorageSync(this.uniqueKey+"_$uCountDownTimestamp"));if(!t)return this.changeEvent(this.startText);var e=Math.floor(+new Date/1e3);this.keepRunning&&t&&t>e?(this.secNum=t-e,uni.removeStorageSync(this.uniqueKey+"_$uCountDownTimestamp"),this.start()):this.changeEvent(this.startText)},start:function(){var t=this;this.timer&&(clearInterval(this.timer),this.timer=null),this.$emit("start"),this.canGetCode=!1,this.changeEvent(this.changeText.replace(/x|X/,this.secNum)),this.setTimeToStorage(),this.timer=setInterval((function(){--t.secNum?t.changeEvent(t.changeText.replace(/x|X/,t.secNum)):(clearInterval(t.timer),t.timer=null,t.changeEvent(t.endText),t.secNum=t.seconds,t.$emit("end"),t.canGetCode=!0)}),1e3)},reset:function(){this.canGetCode=!0,clearInterval(this.timer),this.secNum=this.seconds,this.changeEvent(this.endText)},changeEvent:function(t){this.$emit("change",t)},setTimeToStorage:function(){if(this.keepRunning&&this.timer&&this.secNum>0&&this.secNum<=this.seconds){var t=Math.floor(+new Date/1e3);uni.setStorage({key:this.uniqueKey+"_$uCountDownTimestamp",data:t+Number(this.secNum)})}}},beforeDestroy:function(){this.setTimeToStorage(),clearTimeout(this.timer),this.timer=null}};e.default=s},"9aca":function(t,e,n){"use strict";n.r(e);var a=n("e78a"),i=n("4198");for(var s in i)["default"].indexOf(s)<0&&function(t){n.d(e,t,(function(){return i[t]}))}(s);n("ce35");var o=n("f0c5"),u=Object(o["a"])(i["default"],a["b"],a["c"],!1,null,"4d11c728",null,!1,a["a"],void 0);e["default"]=u.exports},b884:function(t,e,n){"use strict";n.r(e);var a=n("304a"),i=n("767a");for(var s in i)["default"].indexOf(s)<0&&function(t){n.d(e,t,(function(){return i[t]}))}(s);n("5e36");var o=n("f0c5"),u=Object(o["a"])(i["default"],a["b"],a["c"],!1,null,"e8586886",null,!1,a["a"],void 0);e["default"]=u.exports},ce35:function(t,e,n){"use strict";var a=n("1fa6"),i=n.n(a);i.a},e78a:function(t,e,n){"use strict";n.d(e,"b",(function(){return a})),n.d(e,"c",(function(){return i})),n.d(e,"a",(function(){}));var a=function(){var t=this.$createElement,e=this._self._c||t;return e("v-uni-view",{staticClass:"u-code"})},i=[]}}]);