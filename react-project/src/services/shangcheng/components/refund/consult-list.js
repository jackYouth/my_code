import React from 'react'

import '../../styles/refund/consult-list.scss'

const ConsultList = ({ consultList, shopName, shopLogo }) => {
  return (
    <ul className='consult-list'>
      {
        consultList.map(o => (
          <li className='consult-item' key={ o.time }>
            <div className='consult-item-header'>
              <p className='consult-item-header-left'><img src={ shopLogo } alt='商家图片' /></p>
              <p className='consult-item-header-right'>
                <span>{ shopName }</span>
                <span>{ o.time }</span>
              </p>
            </div>
            <div className='consult-item-bottom'>{ o.context }</div>
          </li>
        ))
      }
    </ul>
  )
}

export default ConsultList
