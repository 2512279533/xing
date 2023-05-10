/**
 * 入库模块API
 * Xavier
 */

// 接口地址
const api = {
    list: '/api/ESC/App_InventoryTask_Eam', // 获取入库任务列表
	assetsList: '/api/ESC/App_WarehouseAssetsList_Eam', // 获取入库单物料列表
	detail: '/api/ESC/App_AssetsQueryByCode_Eam', // 获取物料详情
	validEpc: '/api/ESC/App_EpcValidate_Eam', // 校验epc
	save: '/api/ESC/App_WarehouseEdit_Eam', // 保存
	submit: '/api/ESC/App_WarehouseSubmit_Eam' // 提交
}

export default {
    list: data => uni.$u.http.post(api.list, data),
    assetsList: data => uni.$u.http.post(api.assetsList, data),
    detail: data => uni.$u.http.post(api.detail, data),
    validEpc: data => uni.$u.http.post(api.validEpc, data),
    save: data => uni.$u.http.post(api.save, data),
    submit: data => uni.$u.http.post(api.submit, data),
}
