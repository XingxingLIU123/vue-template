import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/dic/list',
    method: 'get',
    params: query
  })
}
