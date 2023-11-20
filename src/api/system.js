import request from '@/utils/request'

export function getAllRoleListAPI() {
  return request.get('/park/sys/role')
}

// 查询所有功能权限
export function getAllPermissionListAPI() {
  return request.get('park/sys/permision/all/tree')
}

// 查看角色分配权限和人数的详情
export function checkRolePermissionAPI(id) {
  return request.get(`park/sys/role/${id}`)
}
