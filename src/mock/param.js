import Mock from 'mockjs'

const List = []
const count = 20

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@guid()',
    paramName: '@first',
    paramKey: '@last()',
    paramVal: '@name()',
    des: '@ctitle(5, 10)',
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
