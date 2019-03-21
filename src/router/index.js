import Vue from 'vue'
import Router from 'vue-router'

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

export const asyncRouterMap = [
  {
    path: '/regulations/',
    component: Layout,
    children: [{
      path: 'userManagement',
      name: '法制法规',
      component: () => import('@/views/pages/Regulations/index'),
      meta: {
        title: '法制法规',
        icon: 'iconfont iconfaguichaxun' }
    }]
  },
  {
    path: '/chemical',
    component: Layout,
    // redirect: '/chemical/inland',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: '核生化威胁环境',
      icon: 'iconfont iconshenghua',
      roles: ['admin'] // you can set roles in root nav
    },
    children: [
      {
        path: 'inland',
        component: () => import('@/views/pages/InlandChemical/index'),
        name: 'InlandChemical',
        meta: {
          title: '国内',
          icon: 'iconfont iconguonei'
        }
      },
      {
        path: 'foregin',
        component: () => import('@/views/pages/ForeginChemical/index'),
        name: 'ForeginChemical',
        meta: {
          title: '国外',
          icon: 'iconfont iconguowaiyou'
        }
      }
    ]
  },
  {
    path: '/mechanism/',
    redirect: 'noredirect',
    component: Layout,
    children: [{
      path: 'mechanism',
      name: '机构管理',
      component: () => import('@/views/pages/mechanism/index'),
      meta: {
        title: '机构管理',
        icon: 'iconfont iconjigou',
        noCache: true
      }
    }
    ]
  },
  {
    path: '/menu/',
    component: Layout,
    children: [{
      path: 'permissions',
      name: '菜单管理',
      component: () => import('@/views/pages/Menu/index'),
      meta: {
        title: '菜单管理',
        icon: 'iconfont iconGroup-' }
    }]
  },
  {
    path: '/attachment/',
    redirect: 'noredirect',
    component: Layout,
    children: [{
      path: 'attachment',
      name: '附件管理',
      component: () => import('@/views/pages/Attachment/index'),
      meta: {
        title: '附件管理',
        icon: 'iconfont iconfujianguanli',
        noCache: true
      }
    }]
  },
  {
    path: '/dictionary/',
    redirect: 'noredirect',
    component: Layout,
    children: [{
      path: 'dictionary',
      name: '字典管理',
      component: () => import('@/views/pages/Dictionary/index'),
      meta: {
        title: '字典管理',
        icon: 'iconfont iconzidian',
        noCache: true
      }
    }
    ]
  },
  {
    path: '/param/',
    redirect: 'noredirect',
    component: Layout,
    children: [{
      path: 'param',
      name: '参数管理',
      component: () => import('@/views/pages/Param/index'),
      meta: {
        title: '参数管理',
        icon: 'iconfont iconcanshupeizhi',
        noCache: true
      }
    }
    ]
  },
  {
    path: '/projectManagement',
    component: Layout,
    redirect: '/projectManagement/budgetManagement',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: '项目管理',
      icon: 'iconfont iconicon-project',
      roles: ['admin'] // you can set roles in root nav
    },
    children: [
      {
        path: 'budgetManagement',
        component: () => import('@/views/pages/ProjectManagement/BudgetManagement/index'),
        name: 'budgetManagement',
        meta: {
          title: '预算管理',
          icon: 'iconfont iconyusuanyuchengbenguanli'
        }
      },
      {
        path: 'executionManagement',
        component: () => import('@/views/pages/ProjectManagement/ExecutionManagement/index'),
        name: 'executionManagement',
        meta: {
          icon: 'iconfont iconzhixing',
          title: '执行管理'
        }
      },
      {
        path: 'scientificProject',
        component: () => import('@/views/pages/ProjectManagement/ScientificProject/index'),
        name: 'scientificProject',
        meta: {
          icon: 'iconfont iconkeyanqianxian',
          title: '科研项目'
        }
      },
      {
        path: 'dataCollection',
        component: () => import('@/views/pages/ProjectManagement/DataCollection/index'),
        name: 'dataCollection',
        meta: {
          icon: 'iconfont iconwulumuqishigongandashujuguanlipingtai-ico-',
          title: '数据采集'
        }
      }
    ]
  },
  {
    path: '/graduateMaterial',
    component: Layout,
    redirect: '/graduateMaterial/theoreticalStudy',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: '研究资料',
      icon: 'iconfont iconziliao',
      roles: ['admin'] // you can set roles in root nav
    },
    children: [
      {
        path: 'theoreticalStudy',
        component: () => import('@/views/pages/GraduateMaterial/TheoreticalStudy/index'),
        name: 'theoreticalStudy',
        meta: {
          title: '理论研究',
          icon: 'iconfont iconziyuan'
        }
      },
      {
        path: 'foreignArmy',
        component: () => import('@/views/pages/GraduateMaterial/ForeignArmy/index'),
        name: 'foreignArmy',
        meta: {
          icon: 'iconfont iconziliao1',
          title: '外军资料'
        }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/userManagement',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: '系统管理',
      icon: 'iconfont iconnavicon-xtgl',
      roles: ['admin'] // you can set roles in root nav
    },
    children: [
      {
        path: 'userManagement',
        name: '用户管理',
        component: () => import('@/views/pages/System/User/index'),
        meta: {
          title: '用户管理',
          icon: 'iconfont iconyonghu'
        }
      },
      {
        path: 'rolesManagement',
        name: '角色管理',
        component: () => import('@/views/pages/System/Roles/index'),
        meta: {
          title: '角色管理',
          icon: 'iconfont iconjiaose'
        }
      },
      {
        path: 'log',
        name: '日志管理',
        component: () => import('@/views/pages/System/Logs/index'),
        meta: {
          title: '日志管理',
          icon: 'iconfont iconrizhi',
          noCache: true
        }
      },
      {
        path: 'dataBackup',
        component: () => import('@/views/pages/System/DataBackup/index'),
        name: 'dataBackup',
        meta: {
          icon: 'iconfont iconshujubeifen',
          title: '数据备份'
        }
      }
    ]
  },
  {
    path: '/chart',
    component: Layout,
    redirect: '/chart/flow',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: '图表',
      icon: 'lock',
      roles: ['admin'] // you can set roles in root nav
    },
    children: [
      {
        path: 'flow',
        component: () => import('@/pages/FlowChart/index'),
        name: 'flow',
        meta: {
          title: '流程图'
        }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

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
