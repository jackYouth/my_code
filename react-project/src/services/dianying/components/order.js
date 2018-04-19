import React from 'react'
import { NewPromotion } from '@boluome/oto_saas_web_app_component'
import { List, WhiteSpace, InputItem } from 'antd-mobile'
import '../style/order.scss'
import bg from '../img/bg.png'

// const Item = List.Item

const Order = order => {
  console.log(order)
  const { plan, channel, phone, filmInfo, seatNo, handleChangephone, cinemaId, handleOrder, handleCur, curDiscountData } = order
  if (plan) {
    const pri = (seatNo.length * plan.price) - (curDiscountData ? curDiscountData.discount : 0)
    const payPri = pri * 1 > 0 ? pri : 0.01
    return (
      <div className='orderWrap'>
        <div className='order'>

          <Oderdetail order={ order } />
          <div className='borderimg' style={{ backgroundImage: `url(${ bg })` }} />
          <WhiteSpace size='lg' />
          <List>
            <InputItem style={{ paddingTop: '0.14rem', paddingBottom: '0.14rem' }} maxLength={ 11 } placeholder='请输入手机号' value={ phone } onChange={ e => handleChangephone(e) }>手机号</InputItem>
          </List>
          <WhiteSpace size='lg' />
          <NewPromotion handleChange={ res => { handleCur(res) } } orderType='dianying' channel={ channel } amount={ plan.price * seatNo.length } count={ seatNo.length } />
          <div className='orderTip'>
            <p>观影须知</p>
            <div>
              1. 请提前到达影院现场，找到自助取票机，打印纸质电影票，完成取票。<br />
              2. 如现场自助取票机无法打印电影票，请联系影院工作人员处理。<br />
              3. 凭打印好的纸质电影票，检票入场观影。<br />
            </div>
          </div>
        </div>
        <div className='bottomDiv'>
          <div className='bottomInfo'>
            <div className='info'>
              <p><span><i>实付：￥</i>{ payPri.toFixed(2) }</span><i>优惠￥{ curDiscountData ? (curDiscountData.discount).toFixed(2) : '0.00' }</i></p>
            </div>
            <div className='btn' onClick={ () => { handleOrder(filmInfo, phone, plan, cinemaId, seatNo, curDiscountData) } }>立即下单</div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div />
  )
}

// 订单详情组件
const Oderdetail = ({ order }) => {
  const { plan, seatNo, filmDate, filmInfo, cinemaInfo } = order
  const { canChange = '', canRefund = '' } = cinemaInfo
  const seatAry = seatNo.length ? seatNo.map((o, i) => <span key={ `seat${ Math.random() + i }` }>{ o.seatRow }排{ o.seatCol }座</span>) : <i />
  return (
    <div className='Oderdetailnew'>
      <h3>{ filmInfo.name }</h3>
      <p>场次：<span style={{ color: '#ffab00' }}>{ filmDate }</span><span style={{ color: '#ffab00' }}>{ `${ plan.startTime }${ plan.endTime ? '-' : '' }${ plan.endTime ? plan.endTime : '' }` }</span>{ `(${ plan.language }${ plan.screenType })` }</p>
      <p>影院：<span>{ cinemaInfo.name }</span>{ plan.hallName }</p>
      <p>座位：{ seatAry }</p>
      <p>{ canRefund ? '' : <span className='rcTip'>不可退</span> }{ canChange ? '' : <span className='rcTip'>不可改</span> }</p>
    </div>
  )
}
// <Item><span className='spanWid'>数量</span>{ seatNo.length }<i>(￥{ plan.price }/张)</i></Item>
// const Oderdetail = ({ order }) => {
//   const { tip, plan, seatNo, filmDate, filmInfo, cinemaInfo, handleTip } = order
//   const seatAry = seatNo.length ? seatNo.map((o, i) => <span key={ `seat${ Math.random() + i }` }>{ o.seatRow }排{ o.seatCol }座</span>) : <i />
//   return (
//     <div className='Oderdetail'>
//       <h3><Icon className='dianying' type={ require('svg/dianying/dianying.svg') } /><i>{ filmInfo.name }</i><span onClick={ () => { handleTip(tip) } }>取票须知</span></h3>
//       <div>
//         <img alt='电影' src={ filmInfo.pic } />
//         <div className='orderInfo'>
//           <p>{ cinemaInfo.name }</p>
//           <p>{ `${ filmDate }  ${ plan.startTime }-${ plan.endTime }（${ plan.language }${ plan.screenType }）` }</p>
//           <p><span>{ `${ plan.hallName }： ` }</span><span>{ seatAry }</span></p>
//           <p>不可退票、不可改签</p>
//         </div>
//       </div>
//     </div>
//   )
// }


export default Order
