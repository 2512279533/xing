/**
 * 盘点模块API
 * Xavier
 */

// 接口地址
const api = {
    taskList: '/api/ESC/App_InventoryTask_Eam', // 任务列表
	taskDetail: '/api/ESC/App_InventoryPageAssetsList_Eam', // 获取任务详情
	confirmSurplus: '/api/ESC/App_InventoryProfit_Eam', // 确认是否为盘多
	save: '/api/ESC/App_InventorySave_Eam', // 保存
	detail: '/api/ESC/App_AssetsQuery_Eam', // 详情
	submit: '/api/ESC/App_InventorySubmit_Eam', // 提交
}

export default {
    taskList: data => uni.$u.http.post(api.taskList, data),
    taskDetail: data => uni.$u.http.post(api.taskDetail, data),
    confirmSurplus: data => uni.$u.http.post(api.confirmSurplus, data),
    save: data => uni.$u.http.post(api.save, data),
	detail: epc => uni.$u.http.post(api.detail, {epc}),
	submit: data => uni.$u.http.post(api.submit, data),
}
