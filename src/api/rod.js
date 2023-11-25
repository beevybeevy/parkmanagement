import request from '@/utils/request'

// 获取一体杆列表
export function getRodListAPI(data) {
  return request.get('pole/info/list', { params: data })
}
// 获取关联区域的下拉列表
export function getReferredAreaListAPI() {
  return request.get('parking/area/dropList')
}

// 添加一体杆
export function addRodAPI(data) {
  return request.post('pole/info', data)
}

// 编辑一体杆
export function editRodAPI(data) {
  return request.put('pole/info', data)
}

// 删除一体杆
export function deleteRoeAPI(ids) {
  return request.delete(`pole/info/${ids}`)
}

