import Vue from 'vue'
import App from './App'

// vuex
import store from './store'

// 引入全局uView
import uView from '@/uni_modules/uview-ui'
import mixin from '@/common/mixin/mixin.js'
Vue.prototype.$store = store

Vue.config.productionTip = false

App.mpType = 'app'
Vue.use(uView)
Vue.mixin(mixin)

const app = new Vue({
    store,
    ...App
})

// 引入请求封装
require('./util/request/index')(app)

// http接口API抽离，免于写url或者一些固定的参数
import httpApi from '@/api'
Vue.use(httpApi, app)

// uview组件库默认值
import props from '@/common/props.js'

app.$mount()
