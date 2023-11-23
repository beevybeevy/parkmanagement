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

// 查看角色关联用户的列表
export function getRoleUserAPI(id, page, pageSize) {
  return request.get(`/park/sys/roleUser/${id}`, { params: { page, pageSize }})
}

// 添加角色
export function addRoleAPI(data) {
  return request.post('park/sys/role', data)
}

// 编辑当前角色
export function updateRoleAPI(data) {
  return request.put('park/sys/role', data)
}
// 获取当前的信息
export function getRoleDetailAPI(roleId) {
  return request.get(`park/sys/role/${roleId}`)
}

// 删除角色
export function deleteRoleAPI(id) {
  return request.delete(`park/sys/role/${id}`)
}
