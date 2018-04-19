import React from 'react'
import { Empty } from '@boluome/oto_saas_web_app_component'

const NoOneComponent = () => {
  return (
    <Empty selfClass='no-one-component' message='暂无数据～' imgUrl={ require('../../img/no_data.png') } style={{ background: '#f5f5f6' }} />
  )
}

export default NoOneComponent
