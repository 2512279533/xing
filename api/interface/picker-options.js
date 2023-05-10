/**
 * 用户模块API
 * Xavier
 */

// 接口地址
const api = {
	dept: '/api/ESC/App_DeptInfo_Eam', // 部门列表
	 // 根据部门获取用户列表
	assetsType: '/api/ESC/App_AssetsCategory_Eam', // 获取资产分类列表
	assetsLocal: '/api/ESC/App_AssetsLocal_Eam', // 获取存放位置列表
}

export default {
	dept: data => uni.$u.http.post(api.dept, data),
	
	assetsType: data => uni.$u.http.post(api.assetsType, data),
	assetsLocal: data => uni.$u.http.post(api.assetsLocal, data),
}