

// 接口地址
const api = {
	sub: '/api/ESC/sub', // 登录
}

export default {
	sub: params => uni.$u.http.get(api.sub, {params}),
	
}
