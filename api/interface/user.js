/**
 * 用户模块API
 * Xavier
 */

// 接口地址
const api = {
	login: '/api/ESC/App_Login_Eam', // 登录
	changePwd: '/api/ESC/App_ModifyPassword_Eam', // 更改密码
	homeData: '/api/ESC/App_AssetsSummary_Eam', // 首页数据
	approveNews: '/api/ESC/App_AuditTask_Eam', // 消息列表
}

export default {
	login: params => uni.$u.http.get(api.login, {params}),
	changePwd: data => uni.$u.http.post(api.changePwd, data),
	homeData: data => uni.$u.http.post(api.homeData, data),
	approveNews: data => uni.$u.http.post(api.approveNews, data),
}
