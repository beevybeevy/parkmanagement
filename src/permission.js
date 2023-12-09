import { getToken } from '@/utils/auth'
import router, { asyncRoutes } from './router'
import store from './store'

const WHITE_LIST = ['/login', '404']

// eslint-disable-next-line space-before-function-paren
router.beforeEach(async (to, form, next) => {
  const token = getToken()

  if (WHITE_LIST.includes(to.path)) {
    next()
    return
  }

  if (token) {
    // 获取用户信息
    if (!store.state.user.profile.id) {
      // 获取原始权限列表
      const permissions = await store.dispatch('user/getProfile')
      let filterRoutes = asyncRoutes
      if (permissions[0] !== '*:*:*') {
        filterRoutes = filterRoutes.filter(item => {
          const res = permissions.find(path => path.startsWith(item.permission + ':'))
          if (res && item.children) {
            const children = item.children.filter(citem => {
              return permissions.find(cpath => cpath.startsWith(citem.permission + ':'))
            })
            item.children = children
          }
          return res
        })
      }

      // router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }])
      // 完成动态路由注册
      filterRoutes.forEach(item => router.addRoute(item))
      router.addRoute({
        path: '*',
        redirect: '/404',
        hidden: true
      })
      store.commit('user/setMenuList', [...filterRoutes])

      // next(to.path)
      next()
      return
    }
    next()
    return
  }

  next('/login')
})
