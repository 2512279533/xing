const state = {
	marketName: '',
}

const mutations = {
    SET_MARKET_NAME(state, marketName) {
		state.marketName = marketName;
    }
}

const actions = {
    async getMarketName({commit}) {
		const result = await uni.$u.api.Common.getMarketInfo();
        const { success, data = {} } = result;
        if (success === '1') {
            const { marketname } = data;
            console.log(marketname);
			commit('SET_MARKET_NAME', marketname);
            console.log(state.marketName);
        }
    }
}

const getters = {
    getMarketName() {
		return state.marketName;
    }
}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters
}

