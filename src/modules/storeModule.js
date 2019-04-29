export default {
  // 声明
  state: {
    user: {},
    expressItem: 0
  },
//  取数据
  getters: {
    getUser (state) {
      return state.user
    },
    getExpressItem (state) {
      return state.expressItem
    }
  },
//  操作数据
  mutations: {
    updateUser (state, payload) {
      state.user = payload.user
    },
    updateExpressItem (state, payload) {
      state.expressItem = payload.expressItem
    }
  },
// 行为，在行为中，可以存在异步操作，但是最终还是通知mutations
  actions: {
    updateUserAsync (store, payload) {
      setTimeout(() => {
        store.commit('updateUser', {
          user: payload.user
        })
      }, 1000)
    }
  }
}
