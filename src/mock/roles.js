// import { param2Obj } from '@/utils'
import Mock from 'mockjs'
import { param2Obj, getNowFormatDate } from '@/utils'

const index = []
for (let i = 0; i < 40; i++) {
  index.push(Mock.mock({
    id: '@increment(0)',
    name: '@cname',
    describe: '@csentence()',
    createdTime: '@date("yyyy-MM-dd")',
    modifyTime: '@date("yyyy-MM-dd")',
    permission: ['8', '9', '10', '11', '12']
  }))
}

export default {
  tableList: config => {
    // XXX: 此处应该根据token值返回符合权限的用户
    // 例如当前用户是admin, 则应该只能返回permission是editor或者vistor的用户
    const { name, page, limit } = param2Obj(config.url)
    const mockList = index.filter(item => {
      if (name && item.name.indexOf(name) < 0) return false
      // if (permission && item.permission.indexOf(permission) < 0) return false
      // if (permission && item.permission !== permission) return false
      // if (permission && item.permission !== +permission) return false
      return true
    })
    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

    return {
      total: mockList.length,
      items: pageList
    }
  },
  deletRoles: config => {
    // console.log(config)
    const { ids } = param2Obj(config.url)
    console.log(ids)
    const idsList = JSON.parse(ids)
    console.log('要删除的id数组' + idsList)
    idsList.forEach(id => {
      const deleteId = index.findIndex(item => {
        return id === item.id
      })
      index.splice(deleteId, 1)
    })

    return { data: 'success' }
  },
  modifyRoles: config => {
    const data = JSON.parse(config.body)
    const id = index.findIndex(item => {
      return data.id === item.id
    })
    data.modifyTime = getNowFormatDate()
    index[id] = data
    return { data: 'success' }
  },
  addRoles: config => {
    const data = JSON.parse(config.body)
    data.modifyTime = getNowFormatDate()
    data.createdTime = getNowFormatDate()
    index.push(data)
    return { data: 'success' }
  }
}
