import React, { Component } from 'react'
// import { browserHistory } from 'react-router'
import { OrderDetail } from '@boluome/oto_saas_web_app_component'
import { moment } from '@boluome/common-lib'
import { WhiteSpace, List } from 'antd-mobile'
import { equals } from 'ramda'
import QRcode from 'qrcode.react'
import '../style/orderDetails.scss'
import bg from '../img/bg.png'

const Item = List.Item
// id='bl001773304153338'
const OrderDetails = orderDetails => {
  const { orderNo, goPay, login } = orderDetails
  return (
    <div className='orderDetails'>
      { orderNo && <OrderDetail
        content={ <Content orderDetails={ orderDetails } /> }
        login={ login }
        id={ orderNo }
        orderType='dianying'
        goPay={ () => { goPay(orderNo) } }
      /> }
    </div>
  )
}

class Content extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillReceiveProps(nextProps) {
    const a = this.props.orderDetailInfo
    const b = nextProps.orderDetailInfo
    if (!equals(a, b)) {
      console.log(b)
    }
  }
  render() {
    const { orderDetailInfo, orderDetails } = this.props
    const { channel, qrCode, ticketCode, ticketMsg, id, createdAt, coupon = '', platformActivity = '', price = 0, orderPrice = 0 } = orderDetailInfo
    const { orderNo } = orderDetails
    console.log(orderNo)
    if (id) {
      return (
        <div className='odlcenter'>
          <Oderdt order={ orderDetailInfo } />
          <div className='borderimg' style={{ backgroundImage: `url(${ bg })` }} />
          {
            (ticketCode && channel === 'maoyan') ?  <div className='qrcode'>
              <div>
                <p>取票码</p>
                <p>{ ticketCode }</p>
              </div>
              { qrCode && <QRcode value={ qrCode } size={ 280 } /> }
            </div> : ''
          }

          { (ticketMsg && channel === 'kou') ? <p className='nav'>{ ticketMsg }</p> : '' }

          <WhiteSpace size='lg' />

          <List>
            <Item extra={ <span>¥{ orderPrice.toFixed(2) }</span> }>总价</Item>
            { platformActivity && <Item extra={ <span className='numpri'>－ ¥{ platformActivity.price }</span> }><span className='jianhui' style={{ background: '#ff6e19' }}>减</span>{ platformActivity.title }</Item> }
            <Item extra={ <span className='numpri'>- ¥{ coupon ? coupon.price : 0.0 }</span> }><span className='jianhui'>红</span>红包抵扣／兑换红包</Item>
            <Item extra={ <span className='realsubpri'>{ `实付 ¥${ price.toFixed(2) }` }</span> }><span /></Item>
          </List>

          <WhiteSpace size='lg' />

          <List>
            <Item extra={ <span>{ id }</span> }>订单编号</Item>
            <Item extra={ <span>{ moment('YYYY-MM-DD HH:mm:ss')(createdAt) }</span> }>下单时间</Item>
          </List>

          <div className='orderTip'>
            <p>观影须知</p>
            <div>
              1. 请提前到达影院现场，找到自助取票机，打印纸质电影票，完成取票。<br />
              2. 如现场自助取票机无法打印电影票，请联系影院工作人员处理。<br />
              3. 凭打印好的纸质电影票，检票入场观影。<br />
            </div>
          </div>

        </div>
      )
    }
    return (
      <div />
    )
  }
}

// {
//     "code": 0,
//     "message": "处理成功",
//     "data": {
//         "_id": "59f6e7d5c8e7de7ca92ffb8e",
//         "updatedAt": 1509353432173,
//         "couponId": "32974127",
//         "displayStatus": "待支付",
//         "appCode": "blm",
//         "id": "bl002408766375202",
//         "orderPrice": 141,
//         "showTime": "22:30",
//         "canCancel": 1,
//         "status": 2,
//         "partnerStatusCode": 0,
//         "screenType": "3D",
//         "orderType": "dianying",
//         "cinema": {
//             "lat": "31.233493299463685",
//             "cityId": "53",
//             "addr": "嘉定区嘉松北路春归路口嘉实生活广场3楼",
//             "name": "横店电影城-上海嘉定店",
//             "id": 5442,
//             "lng": "121.48657712176804"
//         },
//         "customerId": "209",
//         "moviePhoto": "https://audio.komovie.cn/sns/2017/09/27/95941148567933988653.jpg",
//         "activityId": "1301",
//         "channel": "kou",
//         "movieName": "全球风暴 ",
//         "realPrice": 141,
//         "price": 72.11,
//         "phone": "13693949382",
//         "timeline": [
//             "10-30 16:50 已下单",
//             "10-30 16:50 待支付"
//         ],
//         "timeline_new": [
//             {
//                 "time": "2017-10-30 16:50",
//                 "status": "已下单"
//             },
//             {
//                 "time": "2017-10-30 16:50",
//                 "status": "待支付"
//             }
//         ],
//         "createdAt": 1509353429117,
//         "userPhone": "136****9382",
//         "partnerId": "a1509353429217704868",
//         "hallName": "2号厅",
//         "language": "英文版",
//         "count": 3,
//         "name": "全球风暴 ",
//         "showDate": "2017-10-30",
//         "coupon": {
//             "price": 6.85,
//             "title": "红包测试满0元减6.85元"
//         },
//         "platformActivity": {
//             "price": 62.04,
//             "title": "平台测试"
//         },
//         "paymentSerial": "bl012408766375203",
//         "seatName": "9排13座 9排12座 9排11座",
//         "services": [
//             {
//                 "name": "抠电影",
//                 "phone": "4000009666"
//             }
//         ],
//         "statusIcon": "https://f1.otosaas.com/img/order/status/icon/2.png",
//         "saasUrl": "http://blm-test.otosaas.com/dianying/orderDetails/bl002408766375202"
//     }
// }

// 订单详情组件
const Oderdt = ({ order }) => {
  console.log(order)
  const { showDate, showTime, endTime = '', language, screenType, name, hallName, seatName, cinema, canChange = '', canRefund = '' } = order
  const seatNo = seatName.split(' ')
  const seatAry = seatNo.length ? seatNo.map((o, i) => <span key={ `seat${ Math.random() + i }` }>{ o }</span>) : <i />
  const nowdate = new Date()
  const dates = new Date(showDate.replace(/-/g, '/'))
  const nowdatestr = nowdate.toLocaleDateString()
  const nowdatestrsplit = nowdatestr.split('/')
  const nextdate = new Date(`${ nowdatestrsplit[0] }/${ nowdatestrsplit[1] }/${ (nowdatestrsplit[2] * 1) + 1 }`)
  const nextdates = new Date(`${ nowdatestrsplit[0] }/${ nowdatestrsplit[1] }/${ (nowdatestrsplit[2] * 1) + 2 }`)
  let dateShow = ''
  if (dates.toLocaleDateString() === nowdate.toLocaleDateString()) {
    dateShow = '今天'
  } else if (dates.toLocaleDateString() === nextdate.toLocaleDateString()) {
    dateShow = '明天'
  } else if (dates.toLocaleDateString() === nextdates.toLocaleDateString()) {
    dateShow = '后天'
  }
  const ds = showDate.split('-')
  return (
    <div className='Oderdetailnew'>
      <h3>{ name }</h3>
      <p>场次：<span style={{ color: '#ffab00' }}>{ `${ dateShow } ${ ds[1] }-${ ds[2] }` }</span><span style={{ color: '#ffab00' }}>{ `${ showTime }${ endTime ? '-' : '' }${ endTime }` }</span>({ language }{ screenType })</p>
      <p>影院：<span>{ cinema.name }</span>{ hallName }</p>
      <p>座位：{ seatAry }</p>
      <p>{ canRefund ? '' : <span className='rcTip'>不可退</span> }{ canChange ? '' : <span className='rcTip'>不可改</span> }</p>
    </div>
  )
}

// <div className='Oderdetail'>
//   <h3><Icon className='dianying' type={ require('svg/dianying/dianying.svg') } /><i>{ name }</i></h3>
//   <div>
//     <img alt='电影' src={ moviePhoto } />
//     <div className='orderInfo'>
//       <p>{ cinema.name }</p>
//       <p>{ `${ dateShow } ${ ds[1] }-${ ds[2] }  ${ showTime }${ endTime ? '-' : '' }${ endTime }（${ language }${ screenType }）` }</p>
//       <p><span>{ `${ hallName }： ` }</span><span>{ seatAry }</span></p>
//       <p>不可退票、不可改签</p>
//     </div>
//   </div>
// </div>

export default OrderDetails
