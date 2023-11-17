import request from '@/utils/request'

export function getEnterpriseListAPI(query) {
  return request.get('park/enterprise', { params: query })
}

// 查询所属行业的列表

export function getIndustryListAPI() {
  return request.get('park/industry')
}

// 添加企业中的上传文件功能
export function uploadFileAPI(data) {
  return request.post('upload', data)
}

// 添加企业

export function addEnterpriseAPI(data) {
  return request.post('park/enterprise', data)
}

// 编辑企业
export function editEnterpriseAPI(data) {
  return request.put('park/enterprise',
    data
  )
}

// 获取企业详情
export function getEnterpriseDetailAPI(id) {
  return request.get(`park/enterprise/${id}`)
}

// 删除企业
export function deleteEnterpriseAPI(id) {
  return request.delete(`park/enterprise/${id}`)
}
