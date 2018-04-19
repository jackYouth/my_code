// 加载父路由组件

import React      from 'react'
import customize from 'customize'
import { Empty } from '@boluome/oto_saas_web_app_component'

const root = ({ children, useMaintain = true }) => (
  <div style={{ height: '100%', overflow: 'auto' }}>
    {
      useMaintain ?
        <Maintain /> :
        children
    }
  </div>
)
export default customize(root)

const Maintain = () => <Empty imgUrl={ require('../img/maintain.png') } title='服务正在维护' message='给您带来不便，深表歉意。' style={{ zIndex: 10 }} />
