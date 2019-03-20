import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/attachment/list',
    method: 'get',
    params: query
  })
}
