import request from '@/utils/request'

export function getEnterpriseListAPI(query) {
  return request.get('park/enterprise', { params: query })
}

// 查询所属行业的列表

export function getIndustryListAPI() {
  return request.get('park/industry')
}
