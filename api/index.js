import user from './interface/user.js';
import inventory from './interface/inventory.js';
import assets from './interface/assets.js';
import entryAssets from './interface/entry-assets.js';
import pickerOptions from './interface/picker-options.js'

// 此处第二个参数vm，就是我们在页面使用的this，你可以通过vm获取vuex等操作
const install = (Vue, vm) => {
    // 将各个定义的接口名称，统一放进对象挂载到vm.$u.api(因为vm就是this，也即this.$u.api)下
    vm.$u.api = {
        user,
        assets,
        inventory,
		entryAssets,
        pickerOptions
    }
}
export default {
    install
}
