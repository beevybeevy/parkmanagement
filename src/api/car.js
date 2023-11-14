import request from '@/utils/request'

export function getCarCardListAPI(query) {
  return request.get('parking/card/list', {
    params: query
  })
}
/**
 *
 * @param {object} data  传入表单信息
 * @returns
 */
export function addCarCardAPI(data) {
  return request.post('parking/card', data)
}
