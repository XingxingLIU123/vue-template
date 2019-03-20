// import { param2Obj } from '@/utils'
import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const list = [
  {
    id: 1,
    label: '首页'
  },
  {
    id: 2,
    label: '图表',
    children: [{
      id: 7,
      label: '流程图'
    }]
  },
  {
    id: 3,
    label: '字典管理'
  },
  {
    id: 4,
    label: '机构管理'
  },
  {
    id: 5,
    label: '菜单/权限管理'
  },
  {
    id: 6,
    label: '日志管理'
  }
]
const dictionary = []
for (let i = 0; i < 30; i++) {
  dictionary.push(Mock.mock({
    permission: '@last',
    permissionId: '@increment',
    createdTime: '@date("yyyy-MM-dd")',
    modifyTime: '@date("yyyy-MM-dd")',
    details: '@cparagraph(1, 3)'
  }))
}

const index = []
for (let i = 0; i < 40; i++) {
  index.push(Mock.mock({
    permission: '@last',
    permissionId: '@increment',
    createdTime: '@date("yyyy-MM-dd")',
    modifyTime: '@date("yyyy-MM-dd")',
    details: '@cparagraph(1, 3)'
  }))
}

const mechanism = []
for (let i = 0; i < 60; i++) {
  mechanism.push(Mock.mock({
    permission: '@last',
    permissionId: '@increment',
    createdTime: '@date("yyyy-MM-dd")',
    modifyTime: '@date("yyyy-MM-dd")',
    details: '@cparagraph(1, 3)'
  }))
}

const index2 = []
const index5 = []
const index6 = []
const index7 = []

export default {
  getList: config => {
    // console.log(config)
    return list
  },
  // serverRouterMap: config => {
  //   // console.log(config)
  //   return [
  //     {
  //       path: '/menu/',
  //       component: 'menu',
  //       pName: 'menu',
  //       children: [{
  //         path: 'permissions',
  //         name: '菜单/权限管理',
  //         pName: 'permissions',
  //         component: 'permissions',
  //         meta: {
  //           title: '菜单/权限管理',
  //           icon: 'iconfont iconuser' }
  //       }]
  //     },
  //     {
  //       path: '/log/',
  //       redirect: 'noredirect',
  //       component: 'log',
  //       name: '日志管理',
  //       pName: 'log',
  //       meta: {
  //         title: '日志管理',
  //         icon: 'documentation'
  //         // noCache: true
  //       },
  //       children: [{
  //         path: 'log',
  //         name: '日志管理',
  //         component: 'log',
  //         pName: 'log',
  //         meta: {
  //           title: '日志管理',
  //           icon: 'guide'
  //           // noCache: true
  //         }
  //       }]
  //     }
  //   ]
  // }
  tableList: config => {
    var req = param2Obj(config.url)
    const { title, page, limit } = JSON.parse(req.listQuery)
    let data

    switch (req.types) {
      case '1':
        data = index
        break
      case '2':
        data = index2
        break
      case '3':
        data = dictionary
        break
      case '4':
        data = mechanism
        break
      case '5':
        data = index5
        break
      case '6':
        data = index6
        break
      case '7':
        data = index7
        break
    }
    const mockList = data.filter(item => {
      if (title && item.permission.indexOf(title) < 0) return false
      return true
    })
    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

    return {
      total: mockList.length,
      items: pageList
    }
  },
  modifyTree: config => {
    return 'success'
  }
}
