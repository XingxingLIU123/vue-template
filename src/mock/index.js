import Mock from 'mockjs'
import loginAPI from './login'
import articleAPI from './article'
import remoteSearchAPI from './remoteSearch'
import transactionAPI from './transaction'
import mechanismAPI from './mechanism'
import menuAPI from './menu'
import logAPI from './log'
import attachmentAPI from './attachment'
import userAPI from './user'
import rolesAPI from './roles'
import paramAPI from './param'
import dicAPI from './dic'

// 项目API
import regulationsAPI from './regulations'

// 修复在使用 MockJS 情况下，设置 withCredentials = true，且未被拦截的跨域请求丢失 Cookies 的问题
// https://github.com/nuysoft/Mock/issues/300
Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
Mock.XHR.prototype.send = function() {
  if (this.custom.xhr) {
    this.custom.xhr.withCredentials = this.withCredentials || false
  }
  this.proxy_send(...arguments)
}

// Mock.setup({
//   timeout: '350-600'
// })
// 法律法规相关
Mock.mock(/\/regulations\/regulationsList/, 'get', regulationsAPI.getRegulations)
Mock.mock(/\/regulations\/regulationsList/, 'delete', regulationsAPI.deleteRegulations)
Mock.mock(/\/regulations\/regulationsList/, 'put', regulationsAPI.modifyRegulations)
Mock.mock(/\/regulations\/regulationsList/, 'post', regulationsAPI.addRegulations)
// 登录相关
Mock.mock(/\/login\/login/, 'post', loginAPI.loginByUsername)
Mock.mock(/\/login\/logout/, 'post', loginAPI.logout)
Mock.mock(/\/user\/info\.*/, 'get', loginAPI.getUserInfo)
Mock.mock(/\/user\/info\.*/, 'post', loginAPI.setUserInfo)

// 文章相关
Mock.mock(/\/article\/list/, 'get', articleAPI.getList)
Mock.mock(/\/article\/detail/, 'get', articleAPI.getArticle)
Mock.mock(/\/article\/pv/, 'get', articleAPI.getPv)
Mock.mock(/\/article\/create/, 'post', articleAPI.createArticle)
Mock.mock(/\/article\/update/, 'post', articleAPI.updateArticle)

// 搜索相关
Mock.mock(/\/search\/user/, 'get', remoteSearchAPI.searchUser)

// 账单相关
Mock.mock(/\/transaction\/list/, 'get', transactionAPI.getList)
// 机构相关
Mock.mock(/\/mechanism\/list/, 'get', mechanismAPI.getList)
// 用户相关
Mock.mock(/\/user\/userList/, 'get', userAPI.tableList)
Mock.mock(/\/user\/userList/, 'delete', userAPI.deletUser)
Mock.mock(/\/user\/userList/, 'put', userAPI.modifyUser)
Mock.mock(/\/user\/userList/, 'post', userAPI.addUser)

// 角色相关
Mock.mock(/\/roles\/rolesList/, 'get', rolesAPI.tableList)
Mock.mock(/\/roles\/rolesList/, 'delete', rolesAPI.deletRoles)
Mock.mock(/\/roles\/rolesList/, 'put', rolesAPI.modifyRoles)
Mock.mock(/\/roles\/rolesList/, 'post', rolesAPI.addRoles)
// 菜单权限
Mock.mock(/\/menu\/list/, 'get', menuAPI.getList)
Mock.mock(/\/menu\/list/, 'put', menuAPI.modifyTree)
Mock.mock(/\/menu\/tableList/, 'get', menuAPI.tableList)
Mock.mock(/\/menu\/serverRouterMap/, 'get', menuAPI.serverRouterMap)
Mock.mock(/\/menu\/roleList/, 'get', loginAPI.getRoleList)
Mock.mock(/\/menu\/roleList/, 'post', loginAPI.modifyRoleList)

// 日志相关
Mock.mock(/\/log\/list/, 'get', logAPI.getList)
// 附件相关
Mock.mock(/\/attachment\/list/, 'get', attachmentAPI.getList)
// 参数相关
Mock.mock(/\/param\/list/, 'get', paramAPI.getList)
// 字典相关
Mock.mock(/\/dic\/list/, 'get', dicAPI.getList)
export default Mock
