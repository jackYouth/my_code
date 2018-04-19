import React from 'react'
import { Icon } from 'antd-mobile'
import '../styles/serverHeader.scss'

const ServerHeader = ({ currentServer }) => {
  let currentIcon = ''
  switch (currentServer.icon.split('#')[1]) {
    case 'sf':
      currentIcon = require('svg/shenghuojiaofei/sf.svg')
      break
    case 'df':
      currentIcon = require('svg/shenghuojiaofei/df.svg')
      break
    case 'rqf':
      currentIcon = require('svg/shenghuojiaofei/rqf.svg')
      break
    case 'yxds':
      currentIcon = require('svg/shenghuojiaofei/yxds.svg')
      break
    case 'ghkd':
      currentIcon = require('svg/shenghuojiaofei/ghkd.svg')
      break
    case 'wyf':
      currentIcon = require('svg/shenghuojiaofei/wyf.svg')
      break
    default:
      break
  }
  return (
    <div className='server-box'>
      <div className='server'>
        <Icon className='icon' type={ currentIcon } />
        <p>{ currentServer.name }</p>
      </div>
    </div>
  )
}

export default ServerHeader
