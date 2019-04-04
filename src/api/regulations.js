import request from '@/utils/request'

export function getRegulations(listQuery) {
  return request({
    url: '/regulations/regulationsList',
    method: 'get',
    params: listQuery
  })
}

export function deleteRegulations(id) {
  return request({
    url: '/regulations/regulationsList',
    method: 'delete',
    params: id
  })
}

export function modifyRegulations(data) {
  return request({
    url: '/regulations/regulationsList',
    method: 'put',
    data
  })
}

export function addRegulations(data) {
  return request({
    url: '/regulations/regulationsList',
    method: 'post',
    data
  })
}
