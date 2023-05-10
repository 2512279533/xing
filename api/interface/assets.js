/**
 * 资产模块API
 * Xavier
 */

// 接口地址
const api = {
    find: '/api/ESC/App_AssetsQuery_Eam', // 根据EPC查找资产
	getFlow: '/api/ESC/App_AssetsTransformAuditFlow_Eam', // 获取审批流程
	save: '/api/ESC/App_AssetsEdit_Eam', // 资产变更
	list: '/api/ESC/App_AssetsList_Eam', // 资产列表
	changeSubmit: '/api/ESC/App_AssetsChangeConfirm_Eam', // 资产变更提交
	changeAssetsDetail: '/api/ESC/App_TransfromAssetsList_Eam', // 消息列表资产变更获取详情
}

export default {
    find: data => uni.$u.http.post(api.find, data),
    getFlow: data => uni.$u.http.post(api.getFlow, data),
    list: data => uni.$u.http.post(api.list, data),
    changeSubmit: data => uni.$u.http.post(api.changeSubmit, data),
    changeAssetsDetail: data => uni.$u.http.post(api.changeAssetsDetail, data),
}
