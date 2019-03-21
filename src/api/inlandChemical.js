import request from '@/utils/request'

export function getInlandChemical(listQuery) {
  return request({
    url: '/inlandChemical/inlandChemicalList',
    method: 'get',
    params: listQuery
  })
}

export function deleteInlandChemical(id) {
  return request({
    url: '/inlandChemical/inlandChemicalList',
    method: 'delete',
    params: id
  })
}

export function modifyInlandChemical(data) {
  return request({
    url: '/inlandChemical/inlandChemicalList',
    method: 'put',
    data
  })
}

export function addInlandChemical(data) {
  return request({
    url: '/inlandChemical/inlandChemicalList',
    method: 'post',
    data
  })
}
