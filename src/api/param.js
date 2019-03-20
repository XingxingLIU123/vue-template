import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/param/list',
    method: 'get',
    params: query
  })
}
