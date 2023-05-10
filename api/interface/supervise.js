/**
 * 监管模块API
 * 
 */
// 接口地址
const api = {
	queryBoothInspectPageInfo: '/zl.bs.mts.app.queryBoothInspectPageInfo.v5/1.0.0/action',//市场巡查-分页查看
	insertBoothMarketInspect:'/zl.bs.mts.app.insertBoothMarketInspect.v5/1.0.0/action',//市场巡查-新增
	queryBoothMarketDetail:'/zl.bs.mts.app.queryBoothMarketDetail.v5/1.0.0/action',//市场巡查-详情
	updateBoothMarketInspect:'/zl.bs.mts.app.updateBoothMarketInspect.v5/1.0.0/action',//市场巡查-修改
	updateBoothMarketInspectToConfirm:'/zl.bs.mts.app.updateBoothMarketInspectToConfirm.v5/1.0.0/action',//市场管理-修改提交整改
	queryMarketInspectPageInfo:'/zl.bs.mts.app.queryMarketInspectPageInfo.v5/1.0.0/action',//市场管理-分页查看
	queryCompanycodeByMarketcode:'/zl.bs.mts.app.queryCompanycodeByMarketcode.v5/1.0.0/action',//市场巡查-根据市场编号查询公司编号
	pageScales:'/zl.bs.app.gov.scales.pageScales.v5/1.0.0/action',//秤分页
	queryScales:'/zl.bs.app.gov.scales.queryScales.v5/1.0.0/action',//秤详情
	inspectScales:'/zl.bs.app.gov.scales.inspectScales.v5/1.0.0/action',//秤检测
	querycitypage: '/zl.bs.gov.app.querycitypage.v5/1.0.0/action',//省市区下拉列表
	querymarketpage: '/zl.bs.gov.app.querymarketpage.v5/1.0.0/action',//根据省市区查询市场
	queryBoothList: '/zl.bs.mts.v2.app.queryBoothList.v5/1.0.0/action',//摊位下拉列表
	getProblemReason: '/zl.bs.mts.app.listGovInspectProblemReason.v5/1.0.0/action',//问题数据字典
    

}

export default {
	queryBoothInspect: data => uni.$u.http.post(api.queryBoothInspectPageInfo, data),
	insertBoothMarketInspect: data => uni.$u.http.post(api.insertBoothMarketInspect, data),
	queryBoothMarketDetail: data => uni.$u.http.post(api.queryBoothMarketDetail, data),
	updateBoothMarketInspect: data => uni.$u.http.post(api.updateBoothMarketInspect, data),
	updateInspectToConfirm: data => uni.$u.http.post(api.updateBoothMarketInspectToConfirm, data),
	queryMarketInspectPageInfo: data => uni.$u.http.post(api.queryMarketInspectPageInfo, data),
	queryCompanycodeByMarketcode: data => uni.$u.http.post(api.queryCompanycodeByMarketcode, data),
	pageScales: data => uni.$u.http.post(api.pageScales, data),
	queryScales: data => uni.$u.http.post(api.queryScales, data),
	inspectScales: data => uni.$u.http.post(api.inspectScales, data),
	querycitypage: data => uni.$u.http.post(api.querycitypage, data),
	querymarketpage: data => uni.$u.http.post(api.querymarketpage, data),
	queryBoothList: data => uni.$u.http.post(api.queryBoothList, data),
	getProblemReason: data => uni.$u.http.post(api.getProblemReason, data),
}