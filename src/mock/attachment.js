import Mock from 'mockjs'

const List = []
const count = 20

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@guid()',
    fjm: '@last',
    wjdx: '10M',
    wjwz: 'c:/user/img',
    wjgs: 'png',
    scyh: '@first',
    sfyy: '是',
    upTime: '@date("yyyy-MM-dd HH:mm:ss")',
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
