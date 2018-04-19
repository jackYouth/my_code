import React from 'react'
import { browserHistory } from 'react-router'
import { getStore } from '@boluome/common-lib'
import { Empty } from '@boluome/oto_saas_web_app_component'
import noneSrc from '../images/none.jpg'

export default (
  () => {
    const { descriptionImage } = getStore('currentService', 'session')
    const { shopName = '', distance = 0, shopId } = getStore('currentShop', 'session')
    return (
      <div style={{ backgroundColor: '#000', height: '100%', overflow: 'hidden', overflowY: 'scroll', WebkitOverflowScrolling: 'touch' }}>
        { descriptionImage
          ? <img alt='' src={ descriptionImage } width='100%' />
          : <Empty imgUrl={ noneSrc } message='暂无介绍' /> }
        <div style={{ position: 'fixed', height: '1.2rem', padding: '.28rem .3rem', boxSizing: 'border-box', bottom: '0', width: '100%', backgroundColor: 'rgba(0, 0, 0, .8)' }}>
          <div
            onClick={ () => browserHistory.push(`/baoyang/${ shopId }/service/confirm`) }
            style={{ float: 'right', fontSize: '.28rem', color: '#ffab00', border: '1px solid #ffab00', padding: '.1rem .18rem' }}
          >
            立即购买
          </div>
          <div style={{ color: '#fff' }}>
            <div style={{ fontSize: '.28rem', marginBottom: '.05rem' }}>{ shopName }</div>
            <div style={{ fontSize: '.20rem' }}>{ `${ distance }km` }</div>
          </div>
        </div>
      </div>
    )
  }
)
