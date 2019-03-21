import Vue from 'vue'
import Router from 'vue-router'
const context = require.context('../views/pages', true, /\.vue/)
Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import tableRouter from './modules/table'

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export let asyncRouterMap = (()=>{
  let router = []
  context.keys().forEach(key => {
    const component = context(key).default
    router.push(
      {
        path: `/${component.name}/`,
        component: Layout,
        children: [{
          path: component.name,
          name: component.title || '',
          component: resolve => require([`@/views/pages/${component.name}/index`], resolve),
          meta: {
            title: component.title || '',
            icon: component.icon || '' }
        }]
      }
    )
  })
  return router
})()
// export const asyncRouterMap = [
//   {
//     path: '/regulations/',
//     component: Layout,
//     children: [{
//       path: 'userManagement',
//       name: '法制法规',
//       component: () => import('@/views/pages/Regulations/index'),
//       meta: {
//         title: '法制法规',
//         icon: 'iconfont iconfaguichaxun' }
//     }]
//   },
//   {
//     path: '/mechanism/',
//     redirect: 'noredirect',
//     component: Layout,
//     children: [{
//       path: 'mechanism',
//       name: '机构管理',
//       component: () => import('@/views/pages/mechanism/index'),
//       meta: {
//         title: '机构管理',
//         icon: 'iconfont iconjigou',
//         noCache: true
//       }
//     }
//     ]
//   },
//   {
//     path: '/user/',
//     component: Layout,
//     children: [{
//       path: 'userManagement',
//       name: '用户管理',
//       component: () => import('@/views/pages/User/index'),
//       meta: {
//         title: '用户管理',
//         icon: 'iconfont iconyonghu' }
//     }]
//   },
//   {
//     path: '/roles/',
//     component: Layout,
//     children: [{
//       path: 'rolesManagement',
//       name: '角色管理',
//       component: () => import('@/views/pages/Roles/index'),
//       meta: {
//         title: '角色管理',
//         icon: 'iconfont iconjiaose' }
//     }]
//   },
//   {
//     path: '/menu/',
//     component: Layout,
//     children: [{
//       path: 'permissions',
//       name: '菜单管理',
//       component: () => import('@/views/pages/Menu/index'),
//       meta: {
//         title: '菜单管理',
//         icon: 'iconfont iconGroup-' }
//     }]
//   },
//   {
//     path: '/log/',
//     redirect: 'noredirect',
//     component: Layout,
//     children: [{
//       path: 'log',
//       name: '日志管理',
//       component: () => import('@/views/pages/Logs/index'),
//       meta: {
//         title: '日志管理',
//         icon: 'iconfont iconrizhi',
//         noCache: true
//       }
//     }]
//   },
//   {
//     path: '/attachment/',
//     redirect: 'noredirect',
//     component: Layout,
//     children: [{
//       path: 'attachment',
//       name: '附件管理',
//       component: () => import('@/views/pages/Attachment/index'),
//       meta: {
//         title: '附件管理',
//         icon: 'iconfont iconfujianguanli',
//         noCache: true
//       }
//     }]
//   },
//   {
//     path: '/dictionary/',
//     redirect: 'noredirect',
//     component: Layout,
//     children: [{
//       path: 'dictionary',
//       name: '字典管理',
//       component: () => import('@/views/pages/Dictionary/index'),
//       meta: {
//         title: '字典管理',
//         icon: 'iconfont iconzidian',
//         noCache: true
//       }
//     }
//     ]
//   },
//   {
//     path: '/param/',
//     redirect: 'noredirect',
//     component: Layout,
//     children: [{
//       path: 'param',
//       name: '参数管理',
//       component: () => import('@/views/pages/Param/index'),
//       meta: {
//         title: '参数管理',
//         icon: 'iconfont iconcanshupeizhi',
//         noCache: true
//       }
//     }
//     ]
//   },
//   {
//     path: '/chart',
//     component: Layout,
//     redirect: '/chart/flow',
//     alwaysShow: true, // will always show the root menu
//     meta: {
//       title: '图表',
//       icon: 'lock',
//       roles: ['admin'] // you can set roles in root nav
//     },
//     children: [
//       {
//         path: 'flow',
//         component: () => import('@/pages/FlowChart/index'),
//         name: 'flow',
//         meta: {
//           title: '流程图'
//         }
//       }
//     ]
//   },

//   { path: '*', redirect: '/404', hidden: true }
// ]

// export const routerMap = {
//   menu: {
//     component: Layout,
//     children: {
//       permissions: {
//         component: () => import('@/views/pages/menu/index')
//       }
//     }
//   },
//   log: {
//     component: Layout,
//     children: {
//       log: {
//         component: () => import('@/views/pages/logs/index')
//       }
//     }
//   }
// }
