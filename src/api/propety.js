import request from '@/utils/request'

// 获取物业费所有企业的列表
export function getAllPropetyListAPI() {
  return request.get('park/propertyfee')
}
