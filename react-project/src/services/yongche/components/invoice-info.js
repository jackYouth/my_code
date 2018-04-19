import React from 'react'
import { Icon } from 'antd-mobile'

import OrderItem from '../common-components-self/order-item'
import '../styles/invoice-info.scss'

const InvoiceInfo = ({ handleinvoiceInfoClick, invoiceInfoArr = [1, 0, 0], handleAllSelect, isAllSelect = false }) => {
  return (
    <div className='invoiceInfo'>
      <div className='invoiceInfo-header'>
        {
          [0, 1, 2].map((item, index) => (
            <div key={ item } className='invoiceInfo-item'>
              <OrderItem key={ item } { ...{ index, invoiceInfoArr, handleinvoiceInfoClick, hasLeft: true } } />
              <div className='footer'>付款金额：<span>￥245.00</span></div>
            </div>
          ))
        }
      </div>
      <div className='invoiceInfo-footer'>
        <Icon onClick={ () => { handleAllSelect(isAllSelect, invoiceInfoArr) } } type={ isAllSelect ? require('svg/yongche/circle.svg') : require('svg/yongche/no-select.svg') } size='md' />
        <h1>全选</h1>
        <span>（金额少于￥200不能开票）</span>
        <p>下一步</p>
      </div>
    </div>)
}

export default InvoiceInfo


// const InvoiceInfoItem = ({ index, invoiceInfoArr, handleinvoiceInfoClick }) => {
//   const FlexItem = Flex.Item
//   return (
//     <div className='invoiceInfo-item'>
//       <Flex className='header'>
//         <h1 className='left'>
//           <Icon onClick={ () => handleinvoiceInfoClick(index, invoiceInfoArr) } type={ invoiceInfoArr[index] ? require('svg/yongche/circle.svg') : require('svg/yongche/no-select.svg') } size='md' />
//         </h1>
//         <FlexItem className='right'>
//           <div className='top'>
//             <Icon type={ require('svg/yongche/time.svg') } size='xxs' />
//             <span>2017.05.06  15:37</span>
//           </div>
//           <div className='middle'>
//             <p />
//             <span>花园路运动花园路/镜像路（路口）阿娇华盛顿附近哈数据库的复活节阿斯顿会返回</span>
//           </div>
//           <div className='bottom'>
//             <p />
//             <span>出发时间</span>
//           </div>
//         </FlexItem>
//       </Flex>
//       <div className='footer'>付款金额：￥245.00</div>
//     </div>
//   )
// }
