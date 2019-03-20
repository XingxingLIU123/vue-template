import request from '@/utils/request'

export function tableList(listQuery) {
  return request({
    url: '/roles/rolesList',
    method: 'get',
    params: listQuery
  })
}

export function deleteRoles(id) {
  return request({
    url: '/roles/rolesList',
    method: 'delete',
    params: id
  })
}

export function modifyRoles(data) {
  return request({
    url: '/roles/rolesList',
    method: 'put',
    data
  })
}

export function addRoles(data) {
  return request({
    url: '/roles/rolesList',
    method: 'post',
    data
  })
}
