import { asyncRouterMap, constantRouterMap } from '@/router'
// import { serverRouterMap } from '@/api/menu.js'
/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRouter(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { roles } = data
        let accessedRouters
        if (roles.includes('admin')) {
          accessedRouters = asyncRouterMap
        } else {
          accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        }
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

// function generateAsyncRouter(routerMap, serverRouterMap) {
//   serverRouterMap.forEach(function(item, index) {
//     item.component = routerMap[item.pName].component
//     if (item.children && item.children.length > 0) {
//       generateAsyncRouter(routerMap[item.pName].children, item.children)
//     }
//   })
//   return serverRouterMap
// }

// const permission = {
//   state: {
//     routers: constantRouterMap,
//     addRouters: []
//   },
//   mutations: {
//     SET_ROUTERS: (state, routers) => {
//       state.addRouters = routers
//       console.log(state.addRouters)
//       state.routers = constantRouterMap.concat(routers)
//       // console.log(state.routers)
//     }
//   },
//   actions: {
//     GenerateRoutes({ commit }, data) {
//       serverRouterMap().then(response => {
//         // console.log(response)
//         const { roles } = data
//         let accessedRouters
//         var asyncRouterMap = generateAsyncRouter(routerMap, response.data)
//         // console.log(asyncRouterMap)
//         if (roles.indexOf('admin') >= 0) {
//           accessedRouters = asyncRouterMap
//         } else {
//           accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
//         }
//         commit('SET_ROUTERS', accessedRouters)
//         console.log(accessedRouters)
//       })
//     }
//   }
// }

export default permission
