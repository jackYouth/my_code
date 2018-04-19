import React from 'react'
import { Mask, SlidePage, Empty } from '@boluome/oto_saas_web_app_component'
import { List } from 'antd-mobile'

import '../../styles/user-center/index.scss'


const UserCenter = ({ features, handleFeatureClick, handleOwnClick, handleToAddress }) => {
  if (!features) return <div />
  const noDo = true
  return (
    <div className='my-center'>
      <img src={ require('../../img/user-center-banner.png') } alt='user-center-bg' className='new-user-center-header' />
      <List.Item extra='全部订单' arrow='horizontal' onClick={ () => handleFeatureClick('') }>我的订单</List.Item>
      <ul className='features'>
        {
          features.map((o, i) => (
            <li key={ o.title } onClick={ () => handleFeatureClick(i) }>
              <p>
                <img src={ o.icon } alt={ o.title } />
                {
                  !noDo &&
                  <span className='sc-badge-icon'>无</span>
                }
              </p>
              <p>{ o.title }</p>
            </li>
          ))
        }
      </ul>
      <List.Item arrow='horizontal' onClick={ () =>
        Mask(
          <SlidePage target='right' type='root' >
            <Empty imgUrl={ require('../../img/no-coupon.png') } message='暂无红包～' />
          </SlidePage>
          , { mask: false, style: { position: 'absolute' } }
        )
      }
      >我的红包</List.Item>
      <List.Item arrow='horizontal' onClick={ handleToAddress }>收货地址</List.Item>
      <List.Item arrow='horizontal' onClick={ () => handleOwnClick('collectList') }>我的收藏</List.Item>
      <List.Item arrow='horizontal' onClick={ () => handleOwnClick('attentionList') }>我的关注</List.Item>
    </div>
  )
}

export default UserCenter

  // <div className='user-center-header'>
  //   <p><img src='' alt='用户图片' /></p>
  //   <span>{ userId }</span>
  // </div>
