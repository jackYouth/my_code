import React from 'react'
import { Icon } from 'antd-mobile'

const Page2 = () => (
  <div>
    <div>
      <dl>
        <dt>图标示例</dt>
        <dd>
          <span><Icon type={ require('svg/dian.svg') } /></span>
          <span><Icon type={ require('svg/dian.svg') } style={{ width: '80px', height: '80px' }} /></span>
          <span><Icon type={ require('svg/dian.svg') } className='dian' /></span>
        </dd>
      </dl>
    </div>
  </div>
)

export default Page2
