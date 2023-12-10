import { loginAPI, getProfileAPI } from '@/api/user'
import { removeToken, setToken, getToken } from '@/utils/auth'
import { routes, resetRouter } from '@/router'

export default {
  namespaced: true,
  state: {
    token: getToken() ?? '',
    profile: {},
    menuList: [...routes]
  },
  mutations: {
    // 修改Token的方法
    setToken(state, payload = '') { // 如果不传入payload，payload就是空字符串
      state.token = payload
      if (payload) {
        setToken(payload)
      } else {
        removeToken()
      }
    },
    setProfile(state, profile) {
      state.profile = profile
    },
    setMenuList(state, filterRoutes) {
      state.menuList = [...state.menuList, ...filterRoutes]
    },
    clearLogin(state) {
      state.token = ''
      state.profile = {}
      state.menuList = [...routes]
      removeToken()
      resetRouter()
    }
  },
  actions: {
    async userLoginAction(context, { username, password }) {
      const res = await loginAPI({ username, password })
      // console.log(res)
      context.commit('setToken', res.data.token)
    },
    async getProfile(context) {
      const res = await getProfileAPI()
      context.commit('setProfile', res.data)
      return res.data.permissions
    }
  }
}
