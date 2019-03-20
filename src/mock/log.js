import Mock from 'mockjs'

const List = []
const count = 20

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@guid()',
    czsj: '@date("yyyy-MM-dd HH:mm:ss")',
    czr: '@name()',
    ip: '@name()',
    czmk: '@name()',
    czgn: '@name()',
    makeTime: '@date("yyyy-MM-dd HH:mm:ss")',
    updateTime: '@date("yyyy-MM-dd HH:mm:ss")',
    'status|1': ['success', 'pending']
  }))
}

export default {
  getList: () => {
    return {
      total: List.length,
      items: List
    }
  }
}
