import request from '@/utils/request'

export function getCarCardListAPI(query) {
  return request.get('parking/card/list', {
    params: query
  })
}
