import request from '@/utils/request'

// 获取一体杆列表
export function getRodListAPI(data) {
  return request.get('pole/info/list', { params: data })
}
