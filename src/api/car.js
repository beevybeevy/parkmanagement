import request from '@/utils/request'

export function getCarCardListAPI(query) {
  return request.get('parking/card/list', {
    params: query
  })
}

export function addCarCardAPI(data) {
  return request.post('parking/card', data)
}
