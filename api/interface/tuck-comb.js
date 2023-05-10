/**
 * 发卡模块API
 * Xavier
 */

// 接口地址
const api = {
    list: '/api/ESC/App_AssetsList_Eam' // 获取入库任务列表
	
}

export default {
    list: data => uni.$u.http.post(api.list, data)
}
