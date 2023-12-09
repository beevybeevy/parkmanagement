import request from '@/utils/request'

// 登录函数
/**
 * @description: 登录函数
 * @param {*} data { mobile,password}
 * @return {*} promise
 */
export function loginAPI(data) {
  return request({
    url: '/park/login',
    method: 'POST',
    data
  })
}

/**
 * 系统管理-登录成功-查询登录人用户、角色和权限信息
 * @returns
 */
export function getProfileAPI() {
  return request.get('/park/user/profile')
}
