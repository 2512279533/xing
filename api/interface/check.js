/**
 * 资产模块API
 * Xavier
 */
import {BASE_URL} from '../../api/interface/check.js'

// 接口地址
const api = {
    // formData: '', // 
	// getFlow: '/', // 
	// save: '', // 
	list: '/api/ESC/App_InventoryTask_Eam', // 
	// changeSubmit: '', // 
	// changeAssetsDetail: '', // 
}

export default {
    // find: data => uni.$u.http.post(api.find, data),
    // getFlow: data => uni.$u.http.post(api.getFlow, data),
    list: data => uni.$u.http.post(api.list, data)
    // changeSubmit: data => uni.$u.http.post(api.changeSubmit, data),
    // changeAssetsDetail: data => uni.$u.http.post(api.changeAssetsDetail, data),
	alert(BASE_URL)
}
