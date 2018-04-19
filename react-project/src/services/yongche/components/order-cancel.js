import React from 'react'

import '../styles/order-cancel.scss'

const OrderCancel = ({ handlePlaceCancel, handelReasonClick, currentReason }) => {
  const reasons = ['我的行程改变了，暂时不需要用车', '我需要等待的时间太长了', '司机要求我取消', '无法与司机取得联系']
  return (
    <ul className='order-cancel'>
      {
        reasons.map(item => <li onClick={ () => { handelReasonClick(item) } } key={ item } className={ currentReason === item ? 'active' : '' }>{ item }</li>)
      }
      <div className='s-button'>
        <p className={ currentReason ? 'active' : '' } onClick={ () => currentReason && handlePlaceCancel(currentReason) }>提交</p>
      </div>
    </ul>
  )
}
export default OrderCancel
