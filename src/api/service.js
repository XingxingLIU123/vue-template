import axios from 'axios'
/* 字典管理 */
// 获取字典管理数据
export function getDict() {
  return axios.get('http://localhost:9528/static/json/dictionary.json')
}
/* 机构管理 */
// 获取机构管理数据
export function getMec() {
  return axios.get('http://localhost:9528/static/json/mechanism.json')
}
