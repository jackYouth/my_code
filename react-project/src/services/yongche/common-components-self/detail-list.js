import React from 'react'

import '../styles/detail-list.scss'

const DetailList = ({ title, price = '', textStyle = {}, detailText, containerStyle = {}, titleBg = '#fff' }) => {
  return (
    <div className='detail-list-item' style={ containerStyle }>
      <div className='detail-list-title'>
        <p />
        <h5 style={{ background: titleBg }}>{ title }</h5>
      </div>
      {
        price !== '' &&
        <div className='total-price'>
          ¥ <span>{ price }</span>
        </div>
      }
      <ul className='detail'>
        {
          detailText.map(item => {
            return (
              <li key={ item.left }>
                <p style={ textStyle } className='left'>{ item.left }</p>
                <p className='right' style={ String(item.right).indexOf('-') >= 0 ? { color: '#ff4848' } : {} }>{ String(item.right).indexOf('-') >= 0 ? `${ item.right }` : `¥${ item.right }` }</p>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}

export default DetailList
