import request from '@/utils/request'

export function getEnterpriseListAPI(query) {
  return request.get('park/enterprise', { params: query })
}
