/**
 * 响应拦截
 * @param {Object} http 
 */
module.exports = (vm) => {
	uni.$u.http.interceptors.response.use((response) => { // 对响应成功做点什么
		// 自定义参数
		const {
			code,
			message
		} = response.data;
		// TODO根据实际业务
		if (code !== '200') {
			uni.$u.toast(message ?? '系统异常');
			return Promise.reject(response.data);
		} else {
			return response.data;
		}
	}, (response) => { // 对响应错误做点什么
		uni.$u.toast(response.data.message ?? '系统异常');
		return Promise.reject(response.data);
	});
}
