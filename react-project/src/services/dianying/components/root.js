// 加载父路由组件

import React      from 'react'
import customize from 'customize'

const root = ({ children }) => (
  <div>
    { children }
  </div>
)
export default customize(root)
