import React from 'react'
import { Picker, List, WhiteSpace, ActivityIndicator, Button } from 'antd-mobile'
import { getStore } from '@boluome/common-lib'
import { Mask, SlidePage, Contact, NewPromotion, ContactShow } from '@boluome/oto_saas_web_app_component'

import '../style/order.scss'

const ListItem = List.Item

const order = props => {
  const { contact = '', handleChangeServiceDate,
    orderSubmit, serviceDate, ishas, disabled, handlePromotionChange,
    showToastNoMask, handleChangeContactFnList, point,
  } = props
  let { detailsData = {} } = props
  const { timeData = [], sum = 1,
    supplier = 'zmn', curDiscountData = { coupon: {}, activity: {}, discount: '0' },
  } = props
  detailsData = getStore('detailsData1', 'session')
  let introductions = detailsData.introduction
  let notes = detailsData.note
  const sumPrice = detailsData.price * sum
  if (!introductions) {
    introductions = []
  }
  if (!notes) {
    notes = []
  }
  const seasons = timeData.map(({ time, date }) => ({ label: date, value: date, children: time.map(key => ({ label: key, value: key })) }))
  const handleSuccess = () => {
    Mask(
      <SlidePage target='right' type='root' >
        <Contact handleChange={ contacts => handleChangeContactFnList(contacts, sum) } />
      </SlidePage>
      , { mask: false, style: { position: 'absolute' } }
    )
  }
  return (
    <div className='orderWrap'>
      {
        ishas === '1' ? (<ActivityIndicator toast text='该城市尚未服务' size='large' />) : ('')
      }
      <List>
        <div className='addrWrap'>
          <ContactShow { ...{ contact, handleSuccess } } />
        </div>
      </List>
      <WhiteSpace size='lg' />
      <List>
        <div className='showData'>
          <div className='showMain'>
            <div className='showPic'><img alt='' src={ detailsData.banner } /></div>
            <div className='showPrice'>
              <div className='show_title'>
                { detailsData.categoryName }
              </div>
              <div className='show_sum'>x { sum }</div>
              <div className='show_price'>￥{ detailsData.price }</div>
            </div>
            <div className='clear' />
          </div>
        </div>
      </List>
      <WhiteSpace size='lg' />
      <List className='ItemTime'>
        <PickerWrap { ...{ seasons, serviceDate, handleChangeServiceDate, showToastNoMask } } />
      </List>
      <WhiteSpace size='lg' />
      <List>
        <NewPromotion orderType='jiadianweixiu' channel={ supplier } amount={ sumPrice } count={ sum } handleChange={ reply => handlePromotionChange(reply) } />
      </List>
      <div className='supplier'>此次服务由菠萝觅合作伙伴[啄木鸟]提供服务</div>
      <div className='orderBtnWrap'>
        <div className='orderSumPrice'>￥ { sumPrice - curDiscountData.discount }</div>
        {
          disabled ? (<button className='orderBtn orderBg' onClick={ () => {
            orderSubmit(detailsData, sum, contact, serviceDate, curDiscountData, point)
          }
         }>立即下单</button>) : (<button disabled='disabled' className='orderBtn'>立即下单</button>)
        }
      </div>
    </div>
  )
}
const PickerWrap = ({ seasons, serviceDate, handleChangeServiceDate, showToastNoMask }) => {
  console.log('111----', serviceDate)
  if (serviceDate) {
    return (
      <Picker data={ seasons }
        title='选择日期'
        extra={ serviceDate ? (`${ serviceDate[0] } ${ serviceDate[1] }`) : '请选择上门服务时间' }
        cols={ 2 }
        onChange={ v => handleChangeServiceDate(v) }
      >
        <ListItem arrow='horizontal' >预约时间</ListItem>
      </Picker>
    )
  }
  return (
    <ListItem extra={
      <div>
        <span><Button style={{ color: '#888', border: '0', fontSize: '0.28rem' }} onClick={ showToastNoMask }>请选择服务时间</Button></span>
      </div>
    } arrow='horizontal'
    >
      预约时间
    </ListItem>
  )
}
export default order

// const Contactcom = ({ contact }) => {
//   if (contact) {
//     return (
//       <div className='addr_one'>
//         <div className='addr_main'>
//           <div className='addr_l'><img alt='' src={ require('../img/ding.png') } /></div>
//           <div className='addr_c'>
//             <div className='addr_name kong'>
//               <span>{ contact.name }</span><span>{ contact.gender === '1' ? '女' : '男' }</span><span>{ contact.phone }</span>
//               {
//                 contact.tag ? (<span className='tag'>{ contact.tag }</span>) : ''
//               }
//             </div>
//             <div className='addr_city kong'>
//               <span>{ contact.city }</span><span>{ contact.county }</span>
//             </div>
//             <div className='addr_detail'>
//               <span>{ contact.detail }</span>
//             </div>
//           </div>
//           <div className='addr_r'><img alt='' src={ require('../img/gojiao.png') } /></div>
//           <div className='clear' />
//         </div>
//       </div>
//     )
//   }
//   return (
//     <div className='addr_no'>
//       <img alt='' src={ require('../img/ic_add.png') } />
//       <span>添加收货地址</span>
//       <img alt='' src={ require('../img/gojiao.png') } className='goChoose' />
//     </div>
//   )
// }
