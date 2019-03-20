import Mock from 'mockjs'
import { param2Obj } from '@/utils'
const List = []
const count = 50

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@guid()',
    makeTime: '@date("yyyy-MM-dd HH:mm:ss")',
    updateTime: '@date("yyyy-MM-dd HH:mm:ss")',
    key: '@first()',
    group: '@last()',
    parentName: '@name()',
    value: '@float(1000, 15000, 0, 2)',
    desc: '@ctitle()',
    optional1: '@name()',
    optional2: '@name()',
    optional3: '@name()',
    optional4: '@name()',
    optional5: '@name()',
    'status|1': ['success', 'pending']
  }))
}

export default {
  getList: config => {
    const { keyWord, page, limit } = param2Obj(config.url)
    const mockList = List.filter(item => {
      if (keyWord && item.desc.indexOf(keyWord) < 0) return false
      return true
    })
    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
    return {
      total: List.length,
      items: pageList
    }
  }
}
