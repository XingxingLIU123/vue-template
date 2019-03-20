import Mock from 'mockjs'

const List = []
const count = 20

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@guid()',
    makeTime: '@date("yyyy-MM-dd HH:mm:ss")',
    updateTime: '@date("yyyy-MM-dd HH:mm:ss")',
    jgm: '@name()',
    jgfzr: '@name()',
    jgdz: '@name()',
    jgdm: '@float(1000, 15000, 0, 2)',
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
