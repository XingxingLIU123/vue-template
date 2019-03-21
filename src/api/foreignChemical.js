import request from '@/utils/request'

export function getForeignChemical(listQuery) {
  return request({
    url: '/foreignChemical/foreignChemicalList',
    method: 'get',
    params: listQuery
  })
}

export function deleteForeignChemical(id) {
  return request({
    url: '/foreignChemical/foreignChemicalList',
    method: 'delete',
    params: id
  })
}

export function modifyForeignChemical(data) {
  return request({
    url: '/foreignChemical/foreignChemicalList',
    method: 'put',
    data
  })
}

export function addForeignChemical(data) {
  return request({
    url: '/foreignChemical/foreignChemicalList',
    method: 'post',
    data
  })
}
