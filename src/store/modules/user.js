import { loginAPI } from '@/api/user'
import { removeToken, setToken, getToken } from '@/utils/auth'

export default {
  namespaced: true,
  state: {
    token: getToken() || ''
  },
  mutations: {
    // 修改Token的方法
    setToken(state, payload) {
      state.token = payload
      if (payload) {
        setToken(payload)
      } else {
        removeToken()
      }
    }
  },
  actions: {
    async userLoginAction(context, { username, password }) {
      const res = await loginAPI({ username, password })
      // console.log(res)
      context.commit('setToken', res.data.token)
    }
  }
}
