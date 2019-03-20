import request from '@/utils/request'

export function tableList(listQuery) {
  return request({
    url: '/user/userList',
    method: 'get',
    params: listQuery
  })
}

export function deleteUser(id) {
  return request({
    url: '/user/userList',
    method: 'delete',
    params: id
  })
}

export function modifyUser(data) {
  return request({
    url: '/user/userList',
    method: 'put',
    data
  })
}

export function addUser(data) {
  return request({
    url: '/user/userList',
    method: 'post',
    data
  })
}
