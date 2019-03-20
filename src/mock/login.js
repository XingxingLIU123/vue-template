import { param2Obj } from '@/utils'

const userMap = {
  admin: {
    roles: ['admin'],
    controlRoles: ['editor', 'visitor'],
    permission: [
      {
        id: 1,
        label: '首页',
        icon: 'index'
      }, {
        id: 2,
        label: '机构管理',
        icon: 'module',
        children: [{
          id: 7,
          label: '增加',
          icon: 'function'
        }, {
          id: 8,
          label: '删除',
          icon: 'function'
        }, {
          id: 9,
          label: '查询',
          icon: 'function'
        }]
      }, {
        id: 3,
        label: '用户管理',
        icon: 'module',
        children: [{
          id: 10,
          label: '增加',
          icon: 'function'
        }, {
          id: 11,
          label: '删除',
          icon: 'function'
        }, {
          id: 12,
          label: '查询',
          icon: 'function'
        }]
      }, {
        id: 5,
        label: '菜单管理',
        icon: 'module',
        children: [{
          id: 13,
          label: '增加',
          icon: 'function'
        }, {
          id: 14,
          label: '删除',
          icon: 'function'
        }, {
          id: 15,
          label: '查询',
          icon: 'function'
        }]
      }
    ],
    password: '0192023a7bbd73250516f069df18b500',
    token: 'admin',
    introduction: '我是超级管理员',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  editor: {
    roles: ['editor'],
    controlRoles: ['visitor'],
    permission: [
      {
        id: 1,
        label: '首页',
        icon: 'index'
      }, {
        id: 2,
        label: '机构管理',
        icon: 'module',
        children: [{
          id: 7,
          label: '增加',
          icon: 'function'
        }, {
          id: 8,
          label: '删除',
          icon: 'function'
        }, {
          id: 9,
          label: '查询',
          icon: 'function'
        }]
      }, {
        id: 3,
        label: '用户管理',
        icon: 'module',
        children: [{
          id: 10,
          label: '增加',
          icon: 'function'
        }, {
          id: 11,
          label: '删除',
          icon: 'function'
        }, {
          id: 12,
          label: '查询',
          icon: 'function'
        }]
      }, {
        id: 5,
        label: '菜单管理',
        icon: 'module',
        children: [{
          id: 13,
          label: '增加',
          icon: 'function'
        }, {
          id: 14,
          label: '删除',
          icon: 'function'
        }, {
          id: 15,
          label: '查询',
          icon: 'function'
        }]
      }
    ],
    token: 'editor',
    password: '5aee9dbd2a188839105073571bee1b1f',
    introduction: '我是编辑',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  },
  visitor: {
    roles: ['visitor'],
    controlRoles: [],
    permission: [
      {
        id: 1,
        label: '首页',
        icon: 'index'
      }, {
        id: 2,
        label: '机构管理',
        icon: 'module',
        children: [{
          id: 7,
          label: '增加',
          icon: 'function'
        }, {
          id: 8,
          label: '删除',
          icon: 'function'
        }, {
          id: 9,
          label: '查询',
          icon: 'function'
        }]
      }, {
        id: 3,
        label: '用户管理',
        icon: 'module',
        children: [{
          id: 10,
          label: '增加',
          icon: 'function'
        }, {
          id: 11,
          label: '删除',
          icon: 'function'
        }, {
          id: 12,
          label: '查询',
          icon: 'function'
        }]
      }
    ],
    token: 'visitor',
    password: '5aee9dbd2a188839105073571bee1b1f',
    introduction: '我是访客',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

export default {
  loginByUsername: config => {
    // 判断用户密码是否正确
    const { username, pass } = JSON.parse(config.body)
    // console.log(pass)
    if (username in userMap && userMap[username].password === pass) {
      return userMap[username]
    } else {
      return false
    }
  },
  getUserInfo: config => {
    const { token } = param2Obj(config.url)
    if (userMap[token]) {
      return userMap[token]
    } else {
      return false
    }
  },
  logout: () => 'success',

  setUserInfo: config => {
    // console.log(config)
    return 'ok'
  },
  getRoleList: config => {
    const { role } = param2Obj(config.url)
    // 然后跟进role 返回判断
    if (role === 'admin') {
      return [{
        name: 'editor',
        status: '1'
      }, {
        name: 'visitor',
        status: '0'
      }]
    } else if (role === 'editor') {
      return [{ name: 'visitor', status: '1' }]
    } else {
      return []
    }
  },
  modifyRoleList: config => {
    console.log(config)
    return '修改成功'
  }
}
