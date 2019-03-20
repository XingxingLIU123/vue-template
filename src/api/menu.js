import request from '@/utils/request'

export function list() {
  return request({
    url: '/menu/list',
    method: 'get',
    params: {}
  })
}
export function modifyTree(data) {
  return request({
    url: '/menu/list',
    method: 'post',
    data
  })
}
export function tableList(types, listQuery) {
  return request({
    url: '/menu/tableList',
    method: 'get',
    params: { types, listQuery }
  })
}
export function roleList(role) {
  return request({
    url: '/menu/roleList',
    method: 'get',
    params: { role }
  })
}
export function modifyRoleList(form) {
  const data = form
  return request({
    url: '/menu/roleList',
    method: 'post',
    data
  })
}
