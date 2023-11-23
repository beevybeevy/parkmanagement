import request from '@/utils/request'

// 获取物业费所有企业的列表
export function getAllPropetyListAPI(query) {
  return request.get('park/propertyfee', { params: query })
}
