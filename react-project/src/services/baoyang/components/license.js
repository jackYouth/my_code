import React from 'react'
import { getStore } from '@boluome/common-lib'
import { Empty } from '@boluome/oto_saas_web_app_component'
import noneSrc from '../images/none.jpg'

const License = () => {
  const { businessLicenseUrl } = getStore('currentShop', 'session')
  return (
    <div style={{ backgroundColor: '#000', height: '100%' }}>
      { businessLicenseUrl
        ? <img alt='' src={ businessLicenseUrl } width='100%' style={{ top: '50%', position: 'relative' }}
          onLoad={ e => {
            const node = e.target
            if (node) {
              node.style.marginTop -= node.offsetHeight / 2
            }
          } }
        />
        : <Empty imgUrl={ noneSrc } message='暂无营业执照' /> }
    </div>
  )
}

export default License
