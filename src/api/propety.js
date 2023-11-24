import request from '@/utils/request'

// 获取物业费所有企业的列表
export function getAllPropetyListAPI(query) {
  return request.get('park/propertyfee', { params: query })
}

// 查询所有企业
export function checkAllEnterpriseAPI() {
  return request.get('park/all/enterprise')
}
// 查询所有楼宇
export function checkAllBuildingAPI() {
  return request.get('park/all/building')
}
// 查询物业费
export function calculateFeeAPI(id, start, end) {
  return request.post('park/propertyfee/pre/payment', {
    buildingId: id,
    startTime: start,
    endTime: end })
}

// 添加账单
export function addBillAPI(data) {
  return request.post('park/propertyfee', data)
}

// 查询单个账单详情
export function checkBillAIP(id) {
  return request.get(`park/propertyfee/${id}`)
}

// 删除账单信息
export function deleteBillAPI(id) {
  return request.delete(`park/propertyfee/${id}`)
}
