/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'
const tableRouter = {
  path: '/table',
  component: Layout,
  redirect: '/table/complex-table',
  name: 'Table',
  meta: {
    title: 'Table',
    icon: 'table'
  },
  children: [
    {
      path: 'complex-table',
      component: () => import('@/views/table/complexTable'),
      name: 'ComplexTable',
      meta: { title: 'complexTable' }
    }
  ]
}
export default tableRouter
